import React, { useState, useCallback, useRef } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";
import { toPng } from "html-to-image";
import { generateMindMap } from "../api/api";

// Custom Node Components
const TopicNode = ({ data }) => (
  <div className="px-6 py-4 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 border-2 border-purple-300 shadow-lg">
    <div className="text-white font-bold text-lg">{data.label}</div>
    {data.description && (
      <div className="text-purple-100 text-xs mt-1">{data.description}</div>
    )}
  </div>
);

const IdeaNode = ({ data }) => (
  <div className="px-5 py-3 rounded-lg bg-linear-to-br from-cyan-500 to-blue-500 border-2 border-cyan-300 shadow-lg">
    <div className="text-white font-semibold">{data.label}</div>
    {data.description && (
      <div className="text-cyan-100 text-xs mt-1">{data.description}</div>
    )}
  </div>
);

const ProcessNode = ({ data }) => (
  <div className="px-5 py-3 rounded bg-linear-to-br from-emerald-500 to-teal-500 border-2 border-emerald-300 shadow-lg">
    <div className="text-white font-semibold">{data.label}</div>
    {data.description && (
      <div className="text-emerald-100 text-xs mt-1">{data.description}</div>
    )}
  </div>
);

const DecisionNode = ({ data }) => (
  <div className="px-4 py-3 bg-linear-to-br from-amber-500 to-orange-500 border-2 border-amber-300 shadow-lg transform rotate-45">
    <div className="transform -rotate-45 text-white font-semibold text-center">
      {data.label}
    </div>
    {data.description && (
      <div className="transform -rotate-45 text-amber-100 text-xs mt-1 text-center">
        {data.description}
      </div>
    )}
  </div>
);

const nodeTypes = {
  topicNode: TopicNode,
  ideaNode: IdeaNode,
  processNode: ProcessNode,
  decisionNode: DecisionNode,
};

// Auto-layout using dagre
const getLayoutedElements = (nodes, edges, direction = "TB") => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 150, // Horizontal spacing between nodes
    ranksep: 150, // Vertical spacing between ranks
    edgesep: 100, // Spacing between edges
    marginx: 50,
    marginy: 50,
  });

  nodes.forEach((node) => {
    // Set different sizes based on node type
    let width = 180;
    let height = 80;
    if (node.type === "topicNode") {
      width = 220;
      height = 100;
    } else if (node.type === "decisionNode") {
      width = 150;
      height = 150;
    }
    dagreGraph.setNode(node.id, { width, height });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const width =
      node.type === "topicNode"
        ? 220
        : node.type === "decisionNode"
        ? 150
        : 180;
    const height =
      node.type === "topicNode" ? 100 : node.type === "decisionNode" ? 150 : 80;
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - width / 2,
        y: nodeWithPosition.y - height / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

const MindMapBuilder = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodeIdCounter, setNodeIdCounter] = useState(1);

  // Node editor state
  const [nodeLabel, setNodeLabel] = useState("");
  const [nodeDescription, setNodeDescription] = useState("");

  // AI generation state
  const [aiTopic, setAiTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "smoothstep",
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed },
          },
          eds
        )
      ),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `node-${nodeIdCounter}`,
        type,
        position,
        data: { label: `${type} ${nodeIdCounter}`, description: "" },
      };

      setNodes((nds) => nds.concat(newNode));
      setNodeIdCounter(nodeIdCounter + 1);
    },
    [reactFlowInstance, nodeIdCounter, setNodes]
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setNodeLabel(node.data.label);
    setNodeDescription(node.data.description || "");
  }, []);

  const updateNode = () => {
    if (!selectedNode) return;

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              label: nodeLabel,
              description: nodeDescription,
            },
          };
        }
        return node;
      })
    );
  };

  const deleteNode = () => {
    if (!selectedNode) return;
    setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
    setEdges((eds) =>
      eds.filter(
        (edge) =>
          edge.source !== selectedNode.id && edge.target !== selectedNode.id
      )
    );
    setSelectedNode(null);
  };

  const onLayout = useCallback(
    (direction) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodes, edges, direction);
      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges, setNodes, setEdges]
  );

  const exportToPNG = useCallback(() => {
    if (reactFlowWrapper.current === null || !reactFlowInstance) return;

    const { getNodes } = reactFlowInstance;
    const allNodes = getNodes();

    if (allNodes.length === 0) {
      alert("No nodes to export");
      return;
    }

    // Calculate bounds of all nodes with proper sizing
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    allNodes.forEach((node) => {
      // Account for different node sizes based on type
      let width, height;
      switch (node.type) {
        case "topicNode":
          width = 220;
          height = 100;
          break;
        case "decisionNode":
          width = 150;
          height = 150;
          break;
        case "ideaNode":
        case "processNode":
        default:
          width = 180;
          height = 80;
          break;
      }

      minX = Math.min(minX, node.position.x);
      minY = Math.min(minY, node.position.y);
      maxX = Math.max(maxX, node.position.x + width);
      maxY = Math.max(maxY, node.position.y + height);
    });

    // Add generous padding around the diagram
    const padding = 100;
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;

    const totalWidth = maxX - minX;
    const totalHeight = maxY - minY;

    // Create a temporary container to isolate the diagram
    const imageWidth = Math.max(totalWidth, 800);
    const imageHeight = Math.max(totalHeight, 600);

    // Use html-to-image with proper filtering and dimensions
    toPng(reactFlowWrapper.current, {
      backgroundColor: "#0f172a",
      width: imageWidth,
      height: imageHeight,
      pixelRatio: 2,
      cacheBust: true,
      filter: (node) => {
        // Exclude controls, minimap, and overlays from export
        if (
          node?.classList?.contains("react-flow__controls") ||
          node?.classList?.contains("react-flow__minimap") ||
          node?.classList?.contains("react-flow__panel") ||
          node?.classList?.contains("absolute")
        ) {
          return false;
        }
        return true;
      },
    })
      .then((dataUrl) => {
        const a = document.createElement("a");
        a.setAttribute("download", `mindmap-${Date.now()}.png`);
        a.setAttribute("href", dataUrl);
        a.click();
      })
      .catch((error) => {
        console.error("Failed to export PNG:", error);
        alert("Failed to export PNG. Please try again.");
      });
  }, [reactFlowInstance]);

  const exportToJSON = useCallback(() => {
    const data = {
      nodes: nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data,
      })),
      edges: edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type,
      })),
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
      dataStr
    )}`;

    const exportFileDefaultName = "mindmap.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  }, [nodes, edges]);

  const importFromJSON = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setNodes(data.nodes || []);
          setEdges(data.edges || []);
          setNodeIdCounter(
            Math.max(
              ...data.nodes.map((n) => parseInt(n.id.split("-")[1]) || 0)
            ) + 1
          );
        } catch {
          alert("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    },
    [setNodes, setEdges]
  );

  const generateAIMindMap = async () => {
    if (!aiTopic.trim()) {
      alert("Please enter a topic for the mind map");
      return;
    }

    setIsGenerating(true);
    console.log("Generating mind map for topic:", aiTopic);

    try {
      const response = await generateMindMap(aiTopic);
      console.log("Mind map response:", response.data);

      if (response.data.success && response.data.mindmap) {
        const { nodes: aiNodes, edges: aiEdges } = response.data.mindmap;
        console.log("Setting nodes:", aiNodes);
        console.log("Setting edges:", aiEdges);

        // Apply layout before setting state
        const { nodes: layoutedNodes, edges: layoutedEdges } =
          getLayoutedElements(aiNodes, aiEdges, "TB");

        // Ensure all edges have proper arrow markers
        const styledEdges = layoutedEdges.map((edge) => ({
          ...edge,
          type: edge.type || "smoothstep",
          animated: edge.animated !== false,
          style: { stroke: "#64748b", strokeWidth: 2, ...edge.style },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#64748b",
            width: 20,
            height: 20,
          },
        }));

        setNodes(layoutedNodes);
        setEdges(styledEdges);
        setNodeIdCounter(
          Math.max(...aiNodes.map((n) => parseInt(n.id.split("-")[1]) || 0)) + 1
        );

        console.log("Mind map generated successfully!");
      } else {
        console.error("Invalid response structure:", response.data);
        alert("Received invalid mind map data from server");
      }
    } catch (error) {
      console.error("Failed to generate mind map:", error);
      const errorMsg =
        error.response?.data?.detail || error.message || "Unknown error";
      alert(`Failed to generate mind map: ${errorMsg}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const clearCanvas = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
  };

  // Draggable node type card
  const DraggableNodeCard = ({ type, icon, label, color }) => {
    const onDragStart = (event, nodeType) => {
      event.dataTransfer.setData("application/reactflow", nodeType);
      event.dataTransfer.effectAllowed = "move";
    };

    return (
      <div
        className={`${color} p-2 md:p-3 rounded-lg cursor-move hover:scale-105 transition-transform shadow-md min-w-max`}
        onDragStart={(event) => onDragStart(event, type)}
        draggable
      >
        <div className="text-xl md:text-2xl mb-1">{icon}</div>
        <div className="text-white text-xs md:text-sm font-semibold">
          {label}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-900">
      {/* Top Toolbar - AI Generator & Controls */}
      <div className="bg-slate-800 border-b border-slate-700 p-2 md:p-4 w-full">
        <div className="flex gap-2 md:gap-4 items-start flex-wrap w-full">
          {/* AI Mind Map Generator */}
          <div className="flex gap-2 w-full md:w-auto">
            <div className="flex-1">
              <h3 className="text-white font-bold text-xs md:text-sm mb-2">
                🤖 Generate
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="Enter topic..."
                  className="px-2 md:px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-purple-500 focus:outline-none text-xs flex-1 min-w-0"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !isGenerating) {
                      generateAIMindMap();
                    }
                  }}
                />
                <button
                  onClick={generateAIMindMap}
                  disabled={isGenerating}
                  className="px-2 md:px-3 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded hover:from-purple-700 hover:to-pink-700 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isGenerating ? "🔄" : "✨"}
                  <span className="hidden sm:inline ml-1">
                    {isGenerating ? "..." : "Generate"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Layout Controls */}
          <div>
            <h3 className="text-white font-bold text-sm mb-2">📐 Layout</h3>
            <div className="flex gap-2">
              <button
                onClick={() => onLayout("TB")}
                className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-xs whitespace-nowrap"
              >
                ⬇️ Vertical
              </button>
              <button
                onClick={() => onLayout("LR")}
                className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-xs whitespace-nowrap"
              >
                ➡️ Horizontal
              </button>
            </div>
          </div>

          {/* Export Controls */}
          <div>
            <h3 className="text-white font-bold text-sm mb-2">💾 Export</h3>
            <div className="flex gap-2">
              <button
                onClick={exportToPNG}
                className="px-3 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-xs whitespace-nowrap"
              >
                📸 PNG
              </button>
              <button
                onClick={exportToJSON}
                className="px-3 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 text-xs whitespace-nowrap"
              >
                💾 JSON
              </button>
              <label className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-xs whitespace-nowrap cursor-pointer">
                📂 Import
                <input
                  type="file"
                  accept=".json"
                  onChange={importFromJSON}
                  className="hidden"
                />
              </label>
              <button
                onClick={clearCanvas}
                className="px-3 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 text-xs whitespace-nowrap"
              >
                🗑️ Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div
        className="flex-1 relative overflow-hidden w-full"
        ref={reactFlowWrapper}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={(instance) => {
            setReactFlowInstance(instance);
            // Fit view with generous padding to show whole diagram
            setTimeout(() => {
              instance.fitView({ padding: 0.2, duration: 300 });
            }, 100);
          }}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={{
            type: "smoothstep",
            animated: true,
            style: { stroke: "#64748b", strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: "#64748b" },
          }}
          fitView
          fitViewOptions={{ padding: 0.2, maxZoom: 1.5 }}
          minZoom={0.1}
          maxZoom={2}
          defaultZoom={0.8}
          className="bg-slate-900"
        >
          <Background color="#334155" gap={16} />
          <Controls className="bg-slate-800 border border-slate-700" />
          <MiniMap
            className="bg-slate-800 border border-slate-700"
            nodeColor={(node) => {
              switch (node.type) {
                case "topicNode":
                  return "#a855f7";
                case "ideaNode":
                  return "#06b6d4";
                case "processNode":
                  return "#10b981";
                case "decisionNode":
                  return "#f59e0b";
                default:
                  return "#64748b";
              }
            }}
          />
        </ReactFlow>

        {/* Bottom Toolbar - Node Types */}
        <div className="absolute bottom-2 md:bottom-4 left-0 right-0 z-20 px-2 md:px-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-2 md:p-3 overflow-x-auto">
            <div className="flex gap-2 md:gap-3 items-center min-w-max">
              <span className="text-white font-bold text-xs md:text-sm whitespace-nowrap">
                📦 Node Types:
              </span>
              <DraggableNodeCard
                type="topicNode"
                icon="🎯"
                label="Topic"
                color="bg-linear-to-br from-purple-600 to-pink-600"
              />
              <DraggableNodeCard
                type="ideaNode"
                icon="💡"
                label="Idea"
                color="bg-linear-to-br from-cyan-600 to-blue-600"
              />
              <DraggableNodeCard
                type="processNode"
                icon="⚙️"
                label="Process"
                color="bg-linear-to-br from-emerald-600 to-teal-600"
              />
              <DraggableNodeCard
                type="decisionNode"
                icon="❓"
                label="Decision"
                color="bg-linear-to-br from-amber-600 to-orange-600"
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar - Node Editor */}
        <div className="hidden lg:block absolute top-0 right-0 bottom-0 w-72 bg-slate-800 border-l border-slate-700 p-4 overflow-y-auto z-10">
          <h3 className="text-white font-bold text-sm mb-4">✏️ Node Editor</h3>

          {selectedNode ? (
            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-xs block mb-2">
                  Node Type
                </label>
                <div className="px-3 py-2 bg-slate-700 rounded text-gray-300 text-xs">
                  {selectedNode.type}
                </div>
              </div>

              <div>
                <label className="text-gray-300 text-xs block mb-2">
                  Label
                </label>
                <input
                  type="text"
                  value={nodeLabel}
                  onChange={(e) => setNodeLabel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-cyan-500 focus:outline-none text-xs"
                  placeholder="Node label..."
                />
              </div>

              <div>
                <label className="text-gray-300 text-xs block mb-2">
                  Description
                </label>
                <textarea
                  value={nodeDescription}
                  onChange={(e) => setNodeDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-cyan-500 focus:outline-none resize-none text-xs"
                  rows="2"
                  placeholder="Optional description..."
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={updateNode}
                  className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 text-xs font-semibold"
                >
                  ✓ Update
                </button>
                <button
                  onClick={deleteNode}
                  className="px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 text-xs"
                >
                  🗑️
                </button>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <div className="text-gray-400 text-xs">
                  <p>
                    <strong>ID:</strong> {selectedNode.id}
                  </p>
                  <p className="mt-1">
                    <strong>Pos:</strong> ({selectedNode.position.x.toFixed(0)},{" "}
                    {selectedNode.position.y.toFixed(0)})
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-xs text-center py-8">
              <div className="text-2xl mb-2">👆</div>
              <p>Click a node to edit</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MindMapBuilder;
