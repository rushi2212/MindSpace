import React, { useState } from "react";
import { generateVideo } from "../api/api";

const VideoGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt for video generation");
      return;
    }
    setLoading(true);
    setError(null);
    setVideo(null);

    try {
      const res = await generateVideo(prompt);
      setVideo(res.data.video);
    } catch (e) {
      setError(e.response?.data?.detail || e.message || "Video generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-100 mb-2">🎬 Video Generator</h3>
        <p className="text-gray-400 text-sm">Generate videos from text descriptions (takes 30-60 seconds)</p>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="input-field flex-1"
          placeholder="Describe the video you want to generate (e.g., 'A cat playing with a ball, sunny day')"
          disabled={loading}
          rows="3"
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="btn-success disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Generating Video..." : "Generate Video"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded text-rose-300 text-sm">
          ❌ {error}
        </div>
      )}

      {loading && (
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded text-blue-300 text-sm">
          ⏳ Video generation in progress... This may take a moment.
        </div>
      )}

      {video && (
        <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4">
          <p className="text-gray-300 text-sm mb-3">Generated Video:</p>
          <video
            controls
            src={video}
            className="w-full rounded max-h-96 bg-black"
          />
          <a
            href={video}
            download="generated-video.mp4"
            className="mt-2 inline-block text-emerald-400 hover:text-emerald-300 text-sm"
          >
            📥 Download Video
          </a>
        </div>
      )}
    </div>
  );
};

export default VideoGenerator;
