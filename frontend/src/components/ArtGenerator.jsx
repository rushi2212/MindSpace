import React, { useState } from "react";
import { generateArt } from "../api/api";

const ArtGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [art, setArt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await generateArt(prompt);
      setArt(res.data.art);
    } catch (error) {
      const msg =
        error?.response?.data?.error ||
        error.message ||
        "Unable to generate art. Please try again.";
      setArt(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Input Section */}
      <div className="flex gap-2">
        <input
          className="input-field flex-1"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Describe your art idea... (e.g., 'A serene mountain landscape at sunset')"
          disabled={loading}
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating..." : "Generate"}
        </button>
      </div>

      {/* Result Section */}
      {art && (
        <div className="bg-slate-900/30 rounded-lg p-4 border border-slate-700/50">
          {art.startsWith("data:image") ? (
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm text-gray-400">Generated Image</p>
              <div className="rounded-lg overflow-hidden border border-slate-700/50 bg-slate-800/50">
                <img
                  src={art}
                  alt={prompt || "Generated artwork"}
                  className="block max-h-[480px] max-w-full object-contain"
                />
              </div>
            </div>
          ) : (
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/50">
              <p className="text-gray-200 leading-relaxed">{art}</p>
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="bg-slate-900/30 rounded-lg p-4 flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></div>
          <span className="text-gray-400 text-sm">Creating your art...</span>
        </div>
      )}
    </div>
  );
};

export default ArtGenerator;
