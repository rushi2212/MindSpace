import React, { useCallback } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Icon } from "../components/Icon";
import { useCreations } from "../components/CreationsContext";
import ArtGenerator from "../components/ArtGenerator";
import AudioGenerator from "../components/AudioGenerator";
import ChatBoxClean from "../components/ChatBoxClean";
import BrainCanvas from "../components/BrainCanvas";
import MindMapBuilder from "../components/MindMapBuilder";

const toolInfo = {
  chat: { title: "AI Chat", eyebrow: "THINK OUT LOUD", description: "A clear space to brainstorm, explore a question, and work through ideas with Gemini.", icon: "chat", status: "Gemini" },
  image: { title: "Image Studio", eyebrow: "TEXT TO IMAGE", description: "Describe the visual you imagine and generate it with the connected image model.", icon: "image", status: "FLUX · Cloudflare" },
  audio: { title: "Audio Studio", eyebrow: "SCRIPT TO SPEECH", description: "Generate a short creative script or use your own text, then listen to it as spoken audio. Song and music generation are not connected.", icon: "audio", status: "Speech audio" },
  mindmap: { title: "Mind Map Studio", eyebrow: "VISUAL THINKING", description: "Turn a topic into a connected map, then rearrange and edit the nodes on the canvas.", icon: "map", status: "AI + React Flow" },
  canvas: { title: "Idea Canvas", eyebrow: "OPEN WHITEBOARD", description: "Sketch, add sticky notes, and arrange your thoughts on a visual board. Rich-text documents are not implemented.", icon: "canvas", status: "Visual canvas" },
};

const StudioPage = () => {
  const { tool = "image" } = useParams();
  const location = useLocation();
  const { addCreation, removeCreation } = useCreations();
  const info = toolInfo[tool];
  const initialPrompt = location.state?.prompt || "";
  const onImage = useCallback((item) => addCreation({ type: "image", title: item.prompt.slice(0, 58) || "Untitled image", prompt: item.prompt, content: item.image }), [addCreation]);
  const onAudio = useCallback((item) => addCreation({ type: "audio", title: item.transcript?.slice(0, 58) || "Generated audio", prompt: item.prompt, transcript: item.transcript, content: item.audio }), [addCreation]);
  const onChat = useCallback((item) => addCreation({ type: "chat", title: item.prompt.slice(0, 58) || "Chat response", prompt: item.prompt, content: item.reply }), [addCreation]);

  if (!info) return <div className="page-wrap"><h1>Studio not found</h1><Link to="/">Return home</Link></div>;
  return <div className="page-wrap studio-page-wrap">
    <div className="studio-crumb"><Link to="/">Home</Link><span>/</span><span>{info.title}</span></div>
    <header className="studio-heading"><div className={`studio-icon studio-icon-${tool}`}><Icon name={info.icon} size={23}/></div><div className="studio-heading-copy"><div className="eyebrow">{info.eyebrow}</div><h1>{info.title}</h1><p>{info.description}</p></div><span className="status-pill"><i/>{info.status}</span></header>
    {tool === "chat" && <div className="studio-layout chat-layout"><aside className="studio-side-panel"><div className="side-panel-head"><div><span className="eyebrow">CONVERSATIONS</span><h2>Saved responses</h2></div><Link to="/creations" className="tiny-link">Library</Link></div><p className="panel-hint">Successful replies are saved on this device. The current chat session itself is not synced to an account.</p><RecentSaved type="chat"/></aside><section className="studio-surface chat-surface"><ChatBoxClean initialPrompt={initialPrompt} onGenerated={onChat}/></section></div>}
    {tool === "image" && <section className="studio-surface image-surface"><div className="tool-section-title"><div><span className="eyebrow">PROMPT</span><h2>What should we imagine?</h2></div><span className="subtle-label">One image per request</span></div><ArtGenerator initialPrompt={initialPrompt} onGenerated={onImage} onRemove={removeCreation}/></section>}
    {tool === "audio" && <section className="studio-surface audio-surface"><div className="audio-disclaimer"><Icon name="audio" size={18}/><span>This tool creates speech audio. It does not compose songs or instrumental music.</span></div><AudioGenerator initialPrompt={initialPrompt} onGenerated={onAudio}/><div className="saved-audio-section"><div className="section-heading compact-heading"><div><span className="eyebrow">LOCAL LIBRARY</span><h2>Recent audio</h2></div><Link to="/creations" className="text-link">See all <Icon name="arrow" size={15}/></Link></div><RecentSaved type="audio"/></div></section>}
    {tool === "mindmap" && <section className="studio-surface mindmap-surface"><MindMapBuilder initialTopic={initialPrompt}/></section>}
    {tool === "canvas" && <section className="studio-surface canvas-surface"><div className="canvas-note"><Icon name="help" size={17}/><span>This is a sketch-and-notes whiteboard. Rich text formatting, document saving, and AI editing aren’t currently connected.</span></div><BrainCanvas/></section>}
  </div>;
};

const RecentSaved = ({ type }) => {
  const { creations } = useCreations();
  const items = creations.filter((item) => item.type === type).slice(0, 5);
  if (!items.length) return <div className="side-empty">Your saved {type === "chat" ? "responses" : "audio"} will appear here.</div>;
  return <div className="saved-list">{items.map((item) => <Link to="/creations" className="saved-list-item" key={item.id}><span className="saved-list-icon"><Icon name={type === "chat" ? "chat" : "audio"} size={15}/></span><span><strong>{item.title}</strong><small>{new Date(item.createdAt).toLocaleDateString()}</small></span></Link>)}</div>;
};

export default StudioPage;
