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
HF_DEFAULT_MODEL = "black-forest-labs/FLUX.1-schnell"


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
    api_key = os.getenv("HF_API_KEY") or os.getenv("HF_TOKEN")
    if not api_key:
        raise HTTPException(
            500, detail="HF_API_KEY is not configured on the backend (a Hugging Face token with Inference Providers permission is required)."
        )
    if InferenceClient is None:
        raise HTTPException(500, detail="huggingface_hub is not installed on the backend.")

    model = (os.getenv("HF_MODEL") or HF_DEFAULT_MODEL).strip()
    try:
        # Hugging Face routes current text-to-image models through Inference Providers.
        # Run its synchronous client off the event loop so requests don't block other API calls.
        import asyncio

        def generate():
            client = InferenceClient(provider="auto", api_key=api_key, timeout=120)
            return client.text_to_image(prompt=prompt, model=model)

        img = await asyncio.to_thread(generate)
        if hasattr(img, "save"):
            buf = BytesIO()
            img.save(buf, format="PNG")
            image_bytes = buf.getvalue()
        elif isinstance(img, (bytes, bytearray)):
            image_bytes = bytes(img)
        else:
            raise RuntimeError("Hugging Face returned an unexpected image format")

        b64 = base64.b64encode(image_bytes).decode("utf-8")
        return f"data:image/png;base64,{b64}"
    except HTTPException:
        raise
    except Exception as e:
        # Surface provider/token/model errors to the UI; legacy api-inference URLs
        # return misleading 404s for models now served through Inference Providers.
        message = str(e).strip() or e.__class__.__name__
        raise HTTPException(502, detail=f"Hugging Face image generation failed for {model}: {message}") from e


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
            "apiKeyPresent": bool(os.getenv("HF_API_KEY") or os.getenv("HF_TOKEN")),
            "model": os.getenv("HF_MODEL", HF_DEFAULT_MODEL),
            "allowFallback": os.getenv("HF_ALLOW_FALLBACK", "true").lower() != "false",
        },
    }
