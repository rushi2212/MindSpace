import React from "react";
import ChatBoxClean from "../components/ChatBoxClean";
import ArtGenerator from "../components/ArtGenerator";
import AudioGenerator from "../components/AudioGenerator";
import BrainCanvas from "../components/BrainCanvas";
import MindMapBuilder from "../components/MindMapBuilder";

const Home = () => (
  <div className="w-full">
    {/* Enhanced Hero Section */}
    <div className="text-center mb-16 max-w-6xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-6xl font-black mb-3 bg-linear-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
          Welcome to MindSpace
        </h1>
        <p className="text-sm text-purple-400 font-bold tracking-widest uppercase mb-6">
          🧠 Neural Workspace for Creators
        </p>
      </div>
      <p className="text-xl text-gray-300 mb-4 max-w-2xl mx-auto leading-relaxed">
        Your AI-powered creative companion for ideas, art, audio, and visual
        thinking
      </p>
      <p className="text-sm text-gray-400 mb-8">
        ✨ Chat • Draw • Create • Visualize • Generate
      </p>
      {/* Feature Pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {[
          "AI Chat",
          "Art Generation",
          "Audio Creation",
          "Whiteboard",
          "Mind Maps",
        ].map((feature) => (
          <span
            key={feature}
            className="px-4 py-2 rounded-full bg-purple-600/20 border border-purple-500/40 text-purple-300 text-sm font-medium hover:bg-purple-600/30 transition-colors"
          >
            {feature}
          </span>
        ))}
      </div>{" "}
    </div>

    {/* Content Grid - Chat & Art */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 max-w-6xl mx-auto px-4">
      {/* Chat Section */}
      <div className="card group">
        <div className="mb-4 flex items-center gap-3">
          <div className="text-4xl">💬</div>
          <div>
            <h2 className="text-2xl font-bold bg-linear-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              AI Chat
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Talk with your intelligent AI companion
            </p>
          </div>
        </div>
        <ChatBoxClean />
      </div>

      {/* Art Generator Section */}
      <div className="card group">
        <div className="mb-4 flex items-center gap-3">
          <div className="text-4xl">🎨</div>
          <div>
            <h2 className="text-2xl font-bold bg-linear-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
              Art Generator
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Create stunning visuals with AI
            </p>
          </div>
        </div>
        <ArtGenerator />
      </div>
    </div>

    {/* Audio Generator Section */}
    <div className="card group mb-12 max-w-6xl mx-auto px-4">
      <div className="mb-4 flex items-center gap-3">
        <div className="text-4xl">🎵</div>
        <div>
          <h2 className="text-2xl font-bold bg-linear-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            Audio Generator
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Convert text to natural speech with AI-generated content
          </p>
        </div>
      </div>
      <AudioGenerator />
    </div>

    {/* BrainCanvas Section */}
    <div className="card group mb-12 max-w-6xl mx-auto px-4">
      <div className="mb-4 flex items-center gap-3">
        <div className="text-4xl">✏️</div>
        <div>
          <h2 className="text-2xl font-bold bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            BrainCanvas – AI Whiteboard
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Draw freely, add notes, and sketch your ideas on a digital canvas
          </p>
        </div>
      </div>
      <BrainCanvas />
    </div>

    {/* MindMap Builder Section - Full Width with Large Canvas */}
    <div className="mb-12">
      <div className="card group mb-6 max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">🗺️</div>
          <div>
            <h2 className="text-2xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              MindMap Builder
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Create professional diagrams and mind maps with AI-powered
              generation
            </p>
          </div>
        </div>
      </div>
      <div
        className="max-w-6xl mx-auto px-4 rounded-xl overflow-hidden border border-purple-500/20 shadow-lg bg-slate-900"
        style={{ height: "700px" }}
      >
        <MindMapBuilder />
      </div>
    </div>

    {/* Features Showcase */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pb-12 max-w-6xl mx-auto px-4">
      {[
        {
          icon: "⚡",
          title: "Fast & Responsive",
          desc: "Real-time AI responses and instant generation",
        },
        {
          icon: "🎯",
          title: "AI-Powered",
          desc: "Advanced Gemini API for intelligent features",
        },
        {
          icon: "🌟",
          title: "Creative Suite",
          desc: "All tools in one workspace",
        },
      ].map((feature) => (
        <div key={feature.title} className="feature-card">
          <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
            {feature.icon}
          </div>
          <h3 className="font-semibold text-lg mb-2 text-white">
            {feature.title}
          </h3>
          <p className="text-gray-400 text-sm">{feature.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

export default Home;
