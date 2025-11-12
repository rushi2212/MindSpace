import axios from "axios";

// Gemini text chat helper (unchanged behavior, with version fallback)
export const geminiChat = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured on the server");
  }
  const configuredModel = process.env.GEMINI_MODEL || "gemini-2.5-pro"; // default per request

  const callModelVersioned = async (version, modelName) => {
    const url = `https://generativelanguage.googleapis.com/${version}/models/${modelName}:generateContent?key=${apiKey}`;
    const res = await axios.post(url, {
      contents: [{ parts: [{ text: prompt }] }],
    });
    return (
      res.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response."
    );
  };

  // Try configured model on v1beta first, then v1
  const attempts = [
    { version: "v1beta", model: configuredModel },
    { version: "v1", model: configuredModel },
  ];

  for (const a of attempts) {
    try {
      return await callModelVersioned(a.version, a.model);
    } catch (err) {
      const msg =
        err?.response?.data?.error?.message || err.message || "Unknown error";
      const isModelNotFound = /not found|not supported/i.test(msg);
      if (!isModelNotFound) {
        // Propagate non-compatibility errors immediately (e.g., auth/quota)
        throw new Error(`Gemini API error: ${msg}`);
      }
      // Otherwise, continue to next attempt
    }
  }

  // Fallback to gemini-pro on v1beta
  try {
    return await callModelVersioned("v1beta", "gemini-pro");
  } catch (fallbackErr) {
    const detail =
      fallbackErr?.response?.data?.error?.message || fallbackErr.message;
    throw new Error(`Gemini API error (fallback failed): ${detail}`);
  }
};

// Generate an image using Hugging Face Inference API and return a base64 data URL.
// Includes multi-model fallback to improve chances of success.
export const hfGenerateImage = async (prompt) => {
  const hfApiKey = process.env.HF_API_KEY;
  if (!hfApiKey) {
    throw new Error("HF_API_KEY is not configured on the server");
  }

  const configuredModel = (
    process.env.HF_MODEL || "stabilityai/stable-diffusion-2"
  ).trim();
  const allowFallback = process.env.HF_ALLOW_FALLBACK !== "false"; // default true
  const fallbackModels = [
    "runwayml/stable-diffusion-v1-5",
    "stabilityai/stable-diffusion-2-1",
    "stabilityai/sd-turbo",
  ];
  const candidates = [
    configuredModel,
    ...(allowFallback ? fallbackModels : []),
  ].filter((v, i, a) => a.indexOf(v) === i);

  const attemptGenerate = async (model) => {
    const url = `https://api-inference.huggingface.co/models/${model}`;
    const doCall = async () =>
      axios.post(
        url,
        { inputs: prompt },
        {
          headers: {
            Authorization: `Bearer ${hfApiKey}`,
            "Content-Type": "application/json",
            Accept: "image/png",
          },
          responseType: "arraybuffer",
          validateStatus: () => true,
        }
      );

    let response = await doCall();
    // If loading, wait briefly and retry once
    if (response.status === 503) {
      await new Promise((r) => setTimeout(r, 1500));
      response = await doCall();
    }

    const ct = response.headers["content-type"] || "";
    if (response.status === 401) {
      throw new Error(
        "Unauthorized with Hugging Face. Set a valid HF_API_KEY in backend/.env and restart the server."
      );
    }
    if (response.status === 403) {
      return {
        ok: false,
        reason: `Restricted access: accept terms for ${model}`,
      };
    }
    if (response.status === 404) {
      return { ok: false, reason: `Model not found: ${model}` };
    }
    if (
      response.status >= 200 &&
      response.status < 300 &&
      ct.includes("image")
    ) {
      const base64 = Buffer.from(response.data).toString("base64");
      return { ok: true, dataUrl: `data:image/png;base64,${base64}`, model };
    }

    // Try to decode JSON error for more detail
    try {
      const jsonText = Buffer.from(response.data).toString("utf-8");
      const err = JSON.parse(jsonText);
      return {
        ok: false,
        reason: err.error || err.message || `HTTP ${response.status}`,
      };
    } catch (e) {
      return { ok: false, reason: `HTTP ${response.status}` };
    }
  };

  const reasons = [];
  for (const model of candidates) {
    const res = await attemptGenerate(model);
    if (res.ok) return res.dataUrl; // return the image data URL for compatibility with controller/UI
    reasons.push(`${model}: ${res.reason}`);
  }

  throw new Error(
    `Hugging Face inference failed for all candidates. Reasons: ${reasons.join(
      "; "
    )}`
  );
};
