import React from "react";
import ChatBoxClean from "../components/ChatBoxClean";
import ArtGenerator from "../components/ArtGenerator";

const Home = () => (
  <div className="max-w-6xl mx-auto">
    {/* Hero Section */}
    <div className="text-center mb-12 animate-fade-in">
      <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
        Welcome to MindSpace AI
      </h1>
      <p className="text-xl text-gray-300 mb-8">
        Your personal AI companion for creativity and productivity
      </p>
    </div>

    {/* Content Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      {/* Chat Section */}
      <div className="card">
        <div className="mb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            💬 AI Chat
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Talk to your AI companion
          </p>
        </div>
        <ChatBoxClean />
      </div>

      {/* Art Generator Section */}
      <div className="card">
        <div className="mb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
            🎨 Art Generator
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Create amazing visuals with AI
          </p>
        </div>
        <ArtGenerator />
      </div>
    </div>

    {/* Features Section */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
      <div className="card text-center">
        <div className="text-4xl mb-3">⚡</div>
        <h3 className="font-semibold text-lg mb-2">Fast & Responsive</h3>
        <p className="text-gray-400 text-sm">Real-time AI responses</p>
      </div>
      <div className="card text-center">
        <div className="text-4xl mb-3">🎯</div>
        <h3 className="font-semibold text-lg mb-2">Smart Tasks</h3>
        <p className="text-gray-400 text-sm">Manage productivity</p>
      </div>
      <div className="card text-center">
        <div className="text-4xl mb-3">🚀</div>
        <h3 className="font-semibold text-lg mb-2">Creative Power</h3>
        <p className="text-gray-400 text-sm">Unlimited possibilities</p>
      </div>
    </div>
  </div>
);

export default Home;
