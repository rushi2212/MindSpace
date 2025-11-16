import base64
import os
from typing import Any, Dict
import io
import json
import re

import httpx
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/media", tags=["media"])


async def generate_content_for_audio(prompt: str) -> str:
    """Generate text content based on prompt using Gemini AI."""
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

    if not GEMINI_API_KEY:
        # Fallback: just return the prompt as-is
        return prompt

    try:
        # Try Gemini API to generate content
        async with httpx.AsyncClient(timeout=30.0) as client:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"

            # Create a better prompt for content generation
            # Extract if user wants poem, song, story etc.
            content_type = "creative content"
            if "poem" in prompt.lower():
                content_type = "poem"
            elif "song" in prompt.lower() or "lyrics" in prompt.lower():
                content_type = "song lyrics"
            elif "story" in prompt.lower():
                content_type = "short story"

            enhanced_prompt = f"""Generate ONLY the {content_type} based on this request: {prompt}

Important instructions:
- Output ONLY the {content_type} itself
- Do NOT include any introduction, explanation, title, or commentary
- Do NOT say things like "Here is a poem" or "This is about"
- Start directly with the {content_type} content
- Keep it concise and suitable for audio narration (2-3 verses/paragraphs max)
- Make it engaging and creative"""

            payload = {
                "contents": [{
                    "parts": [{"text": enhanced_prompt}]
                }]
            }

            response = await client.post(url, json=payload)

            if response.status_code == 200:
                data = response.json()
                if "candidates" in data and len(data["candidates"]) > 0:
                    content = data["candidates"][0]["content"]["parts"][0]["text"]
                    return content.strip()

        # If Gemini fails, return the original prompt
        return prompt

    except Exception as e:
        print(f"Content generation failed: {e}")
        return prompt


async def local_generate_audio(prompt: str, generate_content: bool = True) -> tuple:
    """Generate audio from prompt. If generate_content=True, first generates content using AI."""

    if not prompt or not str(prompt).strip():
        raise HTTPException(400, detail="Prompt is required")

    try:
        # Step 1: Generate content if requested (like Suno)
        if generate_content:
            text_content = await generate_content_for_audio(prompt)
        else:
            text_content = prompt

        # Step 2: Convert generated content to speech using gTTS
        try:
            from gtts import gTTS
            gtts = gTTS(text=text_content, lang='en', slow=False)
            speech_buffer = io.BytesIO()
            gtts.write_to_fp(speech_buffer)
            speech_buffer.seek(0)

            b64 = base64.b64encode(speech_buffer.read()).decode("utf-8")
            return f"data:audio/mpeg;base64,{b64}", text_content
        except ImportError:
            raise HTTPException(
                500, detail="TTS not available. Install: pip install gtts")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(502, detail=f"Audio generation failed: {str(e)}")


@router.post("/audio")
async def generate_audio(payload: Dict[str, Any]):
    """Generate audio/speech from text prompt. Can generate content first (like Suno)."""
    prompt = payload.get("text") or payload.get("prompt")
    generate_content = payload.get(
        "generate_content", True)  # Default: generate content

    if not isinstance(prompt, str) or not prompt.strip():
        raise HTTPException(
            400, detail="Invalid or missing 'text' or 'prompt'")

    audio_url, generated_text = await local_generate_audio(
        prompt,
        generate_content=generate_content
    )

    return {
        "audio": audio_url,
        "text": generated_text,
        "prompt": prompt
    }


@router.post("/mindmap")
async def generate_mindmap(payload: Dict[str, Any]):
    """Generate a mind map structure from a topic using AI."""
    topic = payload.get("topic") or payload.get("prompt")

    if not isinstance(topic, str) or not topic.strip():
        raise HTTPException(
            400, detail="Invalid or missing 'topic' or 'prompt'")

    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

    if not GEMINI_API_KEY:
        raise HTTPException(500, detail="GEMINI_API_KEY not configured")

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"

            prompt = f"""Create a well-structured mind map for: "{topic}"

Generate ONLY a JSON object with this EXACT structure (no markdown, no explanation):

{{
  "nodes": [
    {{"id": "node-1", "type": "topicNode", "data": {{"label": "{topic}", "description": "Central Topic"}}, "position": {{"x": 0, "y": 0}}}},
    {{"id": "node-2", "type": "ideaNode", "data": {{"label": "Concept 1", "description": "Description"}}, "position": {{"x": 0, "y": 0}}}},
    {{"id": "node-3", "type": "ideaNode", "data": {{"label": "Concept 2", "description": "Description"}}, "position": {{"x": 0, "y": 0}}}},
    {{"id": "node-4", "type": "ideaNode", "data": {{"label": "Concept 3", "description": "Description"}}, "position": {{"x": 0, "y": 0}}}},
    {{"id": "node-5", "type": "processNode", "data": {{"label": "Process", "description": "How it works"}}, "position": {{"x": 0, "y": 0}}}},
    {{"id": "node-6", "type": "ideaNode", "data": {{"label": "Sub-concept", "description": "Detail"}}, "position": {{"x": 0, "y": 0}}}},
    {{"id": "node-7", "type": "ideaNode", "data": {{"label": "Sub-concept", "description": "Detail"}}, "position": {{"x": 0, "y": 0}}}}
  ],
  "edges": [
    {{"id": "e1-2", "source": "node-1", "target": "node-2"}},
    {{"id": "e1-3", "source": "node-1", "target": "node-3"}},
    {{"id": "e1-4", "source": "node-1", "target": "node-4"}},
    {{"id": "e1-5", "source": "node-1", "target": "node-5"}},
    {{"id": "e2-6", "source": "node-2", "target": "node-6"}},
    {{"id": "e3-7", "source": "node-3", "target": "node-7"}}
  ]
}}

RULES:
1. Create 8-12 nodes total
2. Node 1 = topicNode with main topic
3. Nodes 2-5 = main branches from center (use ideaNode or processNode)
4. Nodes 6-12 = sub-branches from main nodes
5. Create edges from center to main branches AND from main branches to sub-branches
6. Use node types: topicNode (center only), ideaNode (most nodes), processNode (methods/steps), decisionNode (choices)
7. Labels: 2-4 words max
8. Descriptions: 5-10 words
9. Position values don't matter (will be auto-arranged)
10. Return ONLY the JSON object, no markdown code blocks, no extra text"""

            payload_data = {
                "contents": [{
                    "parts": [{"text": prompt}]
                }]
            }

            response = await client.post(url, json=payload_data)

            if response.status_code == 200:
                data = response.json()
                print(f"Gemini API Response: {data}")  # Debug log

                if "candidates" in data and len(data["candidates"]) > 0:
                    content = data["candidates"][0]["content"]["parts"][0]["text"]
                    print(f"Generated content: {content}")  # Debug log

                    # Extract JSON from response (may be wrapped in markdown code blocks)
                    # Try to find JSON in code blocks first
                    json_match = re.search(
                        r'```(?:json)?\s*(\{.*?\})\s*```', content, re.DOTALL)
                    if json_match:
                        json_str = json_match.group(1)
                    else:
                        # Try to find raw JSON
                        json_match = re.search(r'\{.*\}', content, re.DOTALL)
                        if json_match:
                            json_str = json_match.group(0)
                        else:
                            print(f"No JSON found in content: {content}")
                            raise ValueError("No JSON found in response")

                    mindmap_data = json.loads(json_str)
                    print(f"Parsed mindmap data: {mindmap_data}")  # Debug log

                    # Validate structure
                    if "nodes" not in mindmap_data or "edges" not in mindmap_data:
                        raise ValueError("Invalid mind map structure")

                    return {
                        "success": True,
                        "mindmap": mindmap_data,
                        "topic": topic
                    }

            print(
                f"Failed response status: {response.status_code}, body: {response.text}")
            raise HTTPException(
                502, detail=f"Failed to generate mind map: {response.text}")

    except json.JSONDecodeError as e:
        print(f"JSON decode error: {str(e)}")
        raise HTTPException(
            500, detail=f"Invalid JSON response from AI: {str(e)}")
    except Exception as e:
        print(f"Mind map generation error: {str(e)}")
        raise HTTPException(
            500, detail=f"Mind map generation failed: {str(e)}")


@router.get("/health")
async def media_health():
    """Check media generation service health."""
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

    return {
        "audio": {
            "available": True,
            "geminiKeyPresent": bool(GEMINI_API_KEY),
            "note": "Uses gTTS (Google Text-to-Speech) for audio, Gemini for content generation"
        }
    }
