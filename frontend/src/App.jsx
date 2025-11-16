import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

const App = () => (
  <BrowserRouter>
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 right-0 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-purple-500/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="text-4xl">🧠</div>
            <div className="relative">
              <h1 className="text-3xl font-black bg-linear-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                MindSpace
              </h1>
              <p className="text-xs text-purple-400 font-semibold tracking-widest">
                NEURAL WORKSPACE
              </p>
            </div>
          </Link>
          <div className="flex gap-8 items-center">
            <Link
              to="/"
              className="relative text-gray-300 hover:text-purple-400 transition-colors font-semibold group"
            >
              <span>💬 Chat</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link
              to="/dashboard"
              className="relative text-gray-300 hover:text-cyan-400 transition-colors font-semibold group"
            >
              <span>📊 Dashboard</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 py-12 px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  </BrowserRouter>
);

export default App;
