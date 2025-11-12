import base64
import os
from typing import Any, Dict
from io import BytesIO

import httpx
from fastapi import APIRouter, HTTPException

try:
    from huggingface_hub import InferenceClient  # type: ignore
except ImportError:
    InferenceClient = None  # type: ignore

router = APIRouter(prefix="/api/ai", tags=["ai"])

GEMINI_MODEL_DEFAULT = "gemini-2.5-pro"
# Prefer SDXL as default; broadly supported on Inference API
HF_DEFAULT_MODEL = "stabilityai/stable-diffusion-xl-base-1.0"


async def gemini_chat(prompt: str) -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(500, detail="GEMINI_API_KEY not configured")
    configured = os.getenv("GEMINI_MODEL", GEMINI_MODEL_DEFAULT)

    async def call(version: str, model_name: str) -> str:
        url = f"https://generativelanguage.googleapis.com/{version}/models/{model_name}:generateContent?key={api_key}"
        async with httpx.AsyncClient(timeout=60) as client:
            r = await client.post(url, json={"contents": [{"parts": [{"text": prompt}]}]})
        if r.status_code >= 400:
            raise HTTPException(502, detail=r.text)
        data = r.json()
        return (
            data.get("candidates", [{}])[0]
            .get("content", {})
            .get("parts", [{}])[0]
            .get("text", "No response.")
        )

    # Try configured model on v1beta then v1, fallback to gemini-pro on v1beta
    for ver, model in [("v1beta", configured), ("v1", configured)]:
        try:
            return await call(ver, model)
        except HTTPException as e:
            msg = e.detail if isinstance(e.detail, str) else str(e.detail)
            if "not found" not in msg.lower() and "not supported" not in msg.lower():
                raise
    try:
        return await call("v1beta", "gemini-pro")
    except HTTPException as e:
        raise HTTPException(502, detail=f"Gemini fallback failed: {e.detail}")


async def hf_generate_image(prompt: str) -> str:
    api_key = os.getenv("HF_API_KEY")
    if not api_key:
        raise HTTPException(500, detail="HF_API_KEY not configured")

    configured = (os.getenv("HF_MODEL") or HF_DEFAULT_MODEL).strip()

    # Try using huggingface_hub InferenceClient first if available
    if InferenceClient:
        try:
            client = InferenceClient(api_key=api_key)
            img = client.text_to_image(prompt=prompt, model=configured)

            # Convert PIL Image or bytes to base64 data URL
            if hasattr(img, "save"):
                buf = BytesIO()
                img.save(buf, format="PNG")
                image_bytes = buf.getvalue()
            elif isinstance(img, (bytes, bytearray)):
                image_bytes = bytes(img)
            else:
                raise RuntimeError("Unexpected image type from HF client")

            b64 = base64.b64encode(image_bytes).decode("utf-8")
            return f"data:image/png;base64,{b64}"
        except Exception as e:
            # Fall back to HTTP requests approach
            pass

    # Fallback to HTTP requests approach
    allow_fallback = os.getenv("HF_ALLOW_FALLBACK", "true").lower() != "false"
    # Updated, reliable fallbacks (as of 2025): SDXL, SDXL Turbo, FLUX schnell, SD 1.5
    fallbacks = [
        "stabilityai/sdxl-turbo",
        "black-forest-labs/FLUX.1-schnell",
        "runwayml/stable-diffusion-v1-5",
    ]
    candidates = []
    for m in [configured, *(fallbacks if allow_fallback else [])]:
        if m not in candidates:
            candidates.append(m)

    async def attempt(model: str) -> Dict[str, Any]:
        # Try the task-specific pipeline endpoint first, then fall back to the generic models endpoint
        endpoints = [
            f"https://api-inference.huggingface.co/pipeline/text-to-image/{model}",
            f"https://api-inference.huggingface.co/models/{model}",
        ]
        headers = {
            "Authorization": f"Bearer {api_key}",
            # Accept any image; we'll infer type from response
            "Accept": "image/*",
            "Content-Type": "application/json",
        }

        async with httpx.AsyncClient(timeout=120) as client:
            last_resp: httpx.Response | None = None
            for url in endpoints:
                r = await client.post(url, headers=headers, json={"inputs": prompt})
                last_resp = r
                # If warming up, retry once
                if r.status_code == 503:
                    r = await client.post(url, headers=headers, json={"inputs": prompt})
                ct = r.headers.get("content-type", "")
                if r.status_code == 401:
                    raise HTTPException(
                        502, detail="Unauthorized: set HF_API_KEY correctly")
                if r.status_code == 403:
                    return {"ok": False, "reason": f"restricted: accept terms for {model}"}
                if r.status_code == 404:
                    # Try next endpoint if available; otherwise report not found
                    continue
                if 200 <= r.status_code < 300 and "image" in ct:
                    mime = ct.split(";")[0].strip() or "image/png"
                    b64 = base64.b64encode(r.content).decode("utf-8")
                    return {"ok": True, "data_url": f"data:{mime};base64,{b64}", "model": model}
                # Non-image successful responses sometimes include JSON with errors
                try:
                    data = r.json()
                    msg = data.get("error") or data.get(
                        "message") or f"HTTP {r.status_code}"
                    return {"ok": False, "reason": msg}
                except Exception:
                    return {"ok": False, "reason": f"HTTP {r.status_code}"}

        # If both endpoints 404'd
        return {"ok": False, "reason": f"not-found or unsupported on Inference API: {model}"}

    reasons = []
    for m in candidates:
        res = await attempt(m)
        if res.get("ok"):
            return res["data_url"]
        reasons.append(f"{m}: {res.get('reason')}")

    placeholder = os.getenv("HF_PLACEHOLDER_ON_FAIL",
                            "false").lower() == "true"
    if placeholder:
        prompt_s = prompt.replace("<", "&lt;").replace(">", "&gt;")
        reasons_s = "; ".join(reasons).replace(
            "<", "&lt;").replace(">", "&gt;")
        svg = (
            f"<svg xmlns='http://www.w3.org/2000/svg' width='768' height='480'>"
            f"<rect width='100%' height='100%' fill='#111827'/>"
            f"<text x='50%' y='45%' dominant-baseline='middle' text-anchor='middle' fill='#e5e7eb' font-size='20' font-family='sans-serif'>{prompt_s}</text>"
            f"<text x='50%' y='60%' dominant-baseline='middle' text-anchor='middle' fill='#9ca3af' font-size='14' font-family='sans-serif'>{reasons_s}</text>"
            f"</svg>"
        )
        return f"data:image/svg+xml;utf8,{svg}"

    raise HTTPException(
        502, detail=f"HF failed for all candidates. Reasons: {'; '.join(reasons)}")


@router.post("/chat")
async def chat(payload: Dict[str, str]):
    msg = payload.get("message")
    if not isinstance(msg, str) or not msg.strip():
        raise HTTPException(400, detail="Invalid or missing 'message'")
    # Optional mock
    if os.getenv("MOCK_AI", "false").lower() == "true":
        return {"reply": f"🤖 (mock) You said: {msg}"}
    reply = await gemini_chat(msg)
    return {"reply": reply}


@router.post("/art")
async def art(payload: Dict[str, str]):
    prompt = payload.get("prompt")
    if not isinstance(prompt, str) or not prompt.strip():
        raise HTTPException(400, detail="Invalid or missing 'prompt'")
    if os.getenv("MOCK_AI", "false").lower() == "true":
        svg = (
            f"<svg xmlns='http://www.w3.org/2000/svg' width='512' height='320'>"
            f"<rect width='100%' height='100%' fill='black'/>"
            f"<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='20' font-family='sans-serif'>Mock Art: {prompt}</text>"
            f"</svg>"
        )
        return {"art": f"data:image/svg+xml;utf8,{svg}"}
    data_url = await hf_generate_image(prompt)
    return {"art": data_url}


@router.get("/health")
async def health():
    # Minimal health summary; for deeper model checks we could mirror Node behavior
    return {
        "mock": os.getenv("MOCK_AI", "false").lower() == "true",
        "gemini": {
            "apiKeyPresent": bool(os.getenv("GEMINI_API_KEY")),
            "model": os.getenv("GEMINI_MODEL", GEMINI_MODEL_DEFAULT),
        },
        "huggingface": {
            "apiKeyPresent": bool(os.getenv("HF_API_KEY")),
            "model": os.getenv("HF_MODEL", HF_DEFAULT_MODEL),
            "allowFallback": os.getenv("HF_ALLOW_FALLBACK", "true").lower() != "false",
        },
    }
