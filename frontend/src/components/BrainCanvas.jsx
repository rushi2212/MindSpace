import React, { useState, useRef, useEffect } from "react";

const BrainCanvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState("pen"); // pen, eraser, sticky
  const [color, setColor] = useState("#ffffff");
  const [lineWidth, setLineWidth] = useState(2);
  const [stickyNotes, setStickyNotes] = useState([]);
  const [showStickyInput, setShowStickyInput] = useState(false);
  const [stickyPosition, setStickyPosition] = useState({ x: 0, y: 0 });
  const [stickyText, setStickyText] = useState("");
  const [aiExplanation, setAiExplanation] = useState("");
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 600;

    // Set default styles
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Dark background
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save initial state
    const imageData = canvas.toDataURL();
    setHistory([imageData]);
    setHistoryStep(0);
  }, []);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageData = canvas.toDataURL();
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const undo = () => {
    if (historyStep > 0) {
      const newStep = historyStep - 1;
      setHistoryStep(newStep);
      loadFromHistory(history[newStep]);
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1;
      setHistoryStep(newStep);
      loadFromHistory(history[newStep]);
    }
  };

  const loadFromHistory = (imageData) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = imageData;
  };

  const startDrawing = (e) => {
    if (tool === "sticky") {
      const rect = canvasRef.current.getBoundingClientRect();
      setStickyPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setShowStickyInput(true);
      return;
    }

    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Set initial drawing properties
    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = lineWidth * 5;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  };

  const addStickyNote = () => {
    if (!stickyText.trim()) return;

    setStickyNotes([
      ...stickyNotes,
      {
        id: Date.now(),
        text: stickyText,
        x: stickyPosition.x,
        y: stickyPosition.y,
        color: color,
      },
    ]);
    setStickyText("");
    setShowStickyInput(false);
  };

  const deleteStickyNote = (id) => {
    setStickyNotes(stickyNotes.filter((note) => note.id !== id));
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setStickyNotes([]);
    setAiExplanation("");
    saveToHistory();
  };

  return (
    <div className="w-full space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700">
        {/* Tools */}
        <div className="flex gap-1">
          <button
            onClick={() => setTool("pen")}
            className={`px-3 py-2 rounded text-sm ${
              tool === "pen"
                ? "bg-cyan-500 text-white"
                : "bg-slate-700 text-gray-300 hover:bg-slate-600"
            }`}
          >
            ✏️ Pen
          </button>
          <button
            onClick={() => setTool("eraser")}
            className={`px-3 py-2 rounded text-sm ${
              tool === "eraser"
                ? "bg-cyan-500 text-white"
                : "bg-slate-700 text-gray-300 hover:bg-slate-600"
            }`}
          >
            🧹 Eraser
          </button>
          <button
            onClick={() => setTool("sticky")}
            className={`px-3 py-2 rounded text-sm ${
              tool === "sticky"
                ? "bg-cyan-500 text-white"
                : "bg-slate-700 text-gray-300 hover:bg-slate-600"
            }`}
          >
            📝 Sticky
          </button>
        </div>

        {/* Color Picker */}
        <div className="flex items-center gap-2">
          <label className="text-gray-400 text-sm">Color:</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-10 h-10 rounded cursor-pointer"
          />
        </div>

        {/* Line Width */}
        <div className="flex items-center gap-2">
          <label className="text-gray-400 text-sm">Size:</label>
          <input
            type="range"
            min="1"
            max="10"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="w-20"
          />
          <span className="text-gray-400 text-sm">{lineWidth}px</span>
        </div>

        {/* Actions */}
        <div className="flex gap-1 ml-auto">
          <button
            onClick={undo}
            disabled={historyStep <= 0}
            className="px-3 py-2 bg-slate-700 text-gray-300 rounded text-sm hover:bg-slate-600 disabled:opacity-50"
          >
            ↶ Undo
          </button>
          <button
            onClick={redo}
            disabled={historyStep >= history.length - 1}
            className="px-3 py-2 bg-slate-700 text-gray-300 rounded text-sm hover:bg-slate-600 disabled:opacity-50"
          >
            ↷ Redo
          </button>
          <button
            onClick={clearCanvas}
            className="px-3 py-2 bg-rose-600 text-white rounded text-sm hover:bg-rose-700"
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative border-2 border-slate-700 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="cursor-crosshair w-full"
          style={{ touchAction: "none" }}
        />

        {/* Sticky Notes Overlay */}
        {stickyNotes.map((note) => (
          <div
            key={note.id}
            className="absolute p-3 rounded-lg shadow-xl border-2"
            style={{
              left: note.x + "px",
              top: note.y + "px",
              backgroundColor: "#fbbf24",
              borderColor: "#f59e0b",
              transform: "translate(-50%, -50%)",
              minWidth: "120px",
              maxWidth: "200px",
            }}
          >
            <button
              onClick={() => deleteStickyNote(note.id)}
              className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-6 h-6 text-sm hover:bg-rose-600 font-bold shadow-md"
            >
              ×
            </button>
            <p className="text-gray-900 font-semibold text-sm wrap-break-word">
              {note.text}
            </p>
          </div>
        ))}

        {/* Sticky Input Modal */}
        {showStickyInput && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 w-80">
              <h3 className="text-white font-semibold mb-2">Add Sticky Note</h3>
              <textarea
                value={stickyText}
                onChange={(e) => setStickyText(e.target.value)}
                placeholder="Enter your note..."
                className="w-full px-3 py-2 bg-slate-900 text-white rounded border border-slate-600 mb-3 resize-none"
                rows="3"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={addStickyNote}
                  className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowStickyInput(false);
                    setStickyText("");
                  }}
                  className="flex-1 px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Explanation */}
      {aiExplanation && (
        <div className="bg-linear-to-r from-purple-900/30 to-indigo-900/30 border border-purple-700/50 rounded-lg p-4">
          <h3 className="text-purple-400 font-semibold mb-2 flex items-center gap-2">
            <span>🤖</span> AI Analysis
          </h3>
          <p className="text-gray-300 text-sm whitespace-pre-wrap">
            {aiExplanation}
          </p>
        </div>
      )}
    </div>
  );
};

export default BrainCanvas;
