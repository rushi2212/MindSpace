import React, { useState } from "react";
import { generateAudio } from "../api/api";

const AudioGenerator = () => {
  const [text, setText] = useState("");
  const [audio, setAudio] = useState(null);
  const [generatedText, setGeneratedText] = useState(null);
  const [originalPrompt, setOriginalPrompt] = useState(null);
  const [generateContent, setGenerateContent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError("Please enter text for audio generation");
      return;
    }
    setLoading(true);
    setError(null);
    setAudio(null);
    setGeneratedText(null);
    setOriginalPrompt(null);

    try {
      const res = await generateAudio(text, {
        generateContent,
      });
      setAudio(res.data.audio);
      setGeneratedText(res.data.text);
      setOriginalPrompt(res.data.prompt);
    } catch (e) {
      setError(
        e.response?.data?.detail || e.message || "Audio generation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleGenerate();
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-100 mb-2">
          🎵 Audio Generator
        </h3>
        <p className="text-gray-400 text-sm">
          {generateContent
            ? "Generate creative content with AI and convert to speech (like Suno)"
            : "Convert text to natural-sounding speech"}
        </p>
      </div>

      <div className="mb-4">
        <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={generateContent}
            onChange={(e) => setGenerateContent(e.target.checked)}
            className="w-4 h-4 rounded border-gray-500 bg-slate-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900"
          />
          <span>
            Generate content with AI (e.g., "write a poem about the ocean")
          </span>
        </label>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          className="input-field flex-1"
          placeholder={
            generateContent
              ? "Enter a topic or creative prompt..."
              : "Enter text to convert to speech..."
          }
          disabled={loading}
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !text.trim()}
          className="btn-success disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded text-rose-300 text-sm">
          ❌ {error}
        </div>
      )}

      {audio && (
        <div className="space-y-4">
          {/* Show generated content if AI was used */}
          {generatedText && generatedText !== originalPrompt && (
            <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4">
              <p className="text-emerald-400 font-semibold text-sm mb-2">
                ✨ Generated Content:
              </p>
              <p className="text-gray-300 text-sm mb-2 whitespace-pre-wrap leading-relaxed">
                {generatedText}
              </p>
              {originalPrompt && (
                <p className="text-gray-500 text-xs mt-3 pt-3 border-t border-slate-600/50">
                  Prompt: "{originalPrompt}"
                </p>
              )}
            </div>
          )}

          {/* Audio player */}
          <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4">
            <p className="text-gray-300 text-sm mb-3">🎧 Audio:</p>
            <audio
              controls
              src={audio}
              className="w-full rounded"
              style={{ height: "40px" }}
            />
            <a
              href={audio}
              download="generated-audio.mp3"
              className="mt-2 inline-block text-emerald-400 hover:text-emerald-300 text-sm"
            >
              📥 Download Audio
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioGenerator;
