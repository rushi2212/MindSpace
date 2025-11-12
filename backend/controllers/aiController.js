import axios from "axios";
import { geminiChat, hfGenerateImage } from "../utils/aiClient.js";

const useMock = process.env.MOCK_AI === "true";

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Invalid or missing 'message'" });
    }
    if (useMock) {
      return res.json({ reply: `🤖 (mock) You said: ${message}` });
    }
    const reply = await geminiChat(message);
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: error.message || "AI service error" });
  }
};

export const generateArt = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Invalid or missing 'prompt'" });
    }
    if (useMock) {
      // Return a simple placeholder SVG data URL in mock mode
      const svg = encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='512' height='320'><rect width='100%' height='100%' fill='black'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='20' font-family='sans-serif'>Mock Art: ${prompt}</text></svg>`
      );
      return res.json({ art: `data:image/svg+xml;utf8,${svg}` });
    }
    const imageDataUrl = await hfGenerateImage(prompt);
    res.json({ art: imageDataUrl });
  } catch (error) {
    const allowPlaceholder = process.env.HF_PLACEHOLDER_ON_FAIL === "true";
    if (allowPlaceholder) {
      const msg = (error?.message || "HF generation failed")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      const svg = encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='768' height='480'>
          <defs>
            <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
              <stop offset='0%' stop-color='#111827'/>
              <stop offset='100%' stop-color='#1f2937'/>
            </linearGradient>
          </defs>
          <rect width='100%' height='100%' fill='url(#g)'/>
          <text x='50%' y='45%' dominant-baseline='middle' text-anchor='middle' fill='#e5e7eb' font-size='20' font-family='sans-serif'>${prompt
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")}</text>
          <text x='50%' y='60%' dominant-baseline='middle' text-anchor='middle' fill='#9ca3af' font-size='14' font-family='sans-serif'>${msg}</text>
        </svg>`
      );
      return res.json({ art: `data:image/svg+xml;utf8,${svg}` });
    }
    res.status(500).json({ error: error.message || "AI service error" });
  }
};

// Health/diagnostics endpoint to help debug HF access and model availability
export const aiHealth = async (req, res) => {
  try {
    const details = {
      gemini: {
        apiKeyPresent: Boolean(process.env.GEMINI_API_KEY),
        model: process.env.GEMINI_MODEL || "gemini-2.5-pro",
      },
      huggingface: {
        apiKeyPresent: Boolean(process.env.HF_API_KEY),
        model: (
          process.env.HF_MODEL || "stabilityai/stable-diffusion-2"
        ).trim(),
        allowFallback: process.env.HF_ALLOW_FALLBACK !== "false",
        checks: [],
      },
    };

    const hfApiKey = process.env.HF_API_KEY;
    if (!hfApiKey) {
      return res.json(details);
    }

    const configuredModel = details.huggingface.model;
    const fallbackModels = [
      "runwayml/stable-diffusion-v1-5",
      "stabilityai/stable-diffusion-2-1",
      "stabilityai/sd-turbo",
    ];
    const candidates = [
      configuredModel,
      ...(details.huggingface.allowFallback ? fallbackModels : []),
    ].filter((v, i, a) => a.indexOf(v) === i);

    for (const model of candidates) {
      try {
        const r = await axios.get(
          `https://huggingface.co/api/models/${model}`,
          {
            headers: { Authorization: `Bearer ${hfApiKey}` },
            validateStatus: () => true,
          }
        );
        if (r.status === 200) {
          details.huggingface.checks.push({ model, status: "ok" });
        } else if (r.status === 401) {
          details.huggingface.checks.push({ model, status: "unauthorized" });
        } else if (r.status === 403) {
          details.huggingface.checks.push({ model, status: "restricted" });
        } else if (r.status === 404) {
          details.huggingface.checks.push({ model, status: "not-found" });
        } else {
          details.huggingface.checks.push({
            model,
            status: `http-${r.status}`,
          });
        }
      } catch (e) {
        details.huggingface.checks.push({
          model,
          status: "error",
          message: e.message,
        });
      }
    }

    res.json(details);
  } catch (e) {
    res.status(500).json({ error: e.message || "Health check failed" });
  }
};
