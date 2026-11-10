import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "../components/Icon";
import { useCreations } from "../components/CreationsContext";

const tools = [
  { title: "AI Chat", description: "Think through a question, brainstorm, or get unstuck with Gemini.", icon: "chat", route: "/studio/chat", tone: "violet", tag: "Conversation" },
  { title: "Image Studio", description: "Turn a clear prompt into a one-of-a-kind visual with FLUX.", icon: "image", route: "/studio/image", tone: "pink", tag: "Text to image" },
  { title: "Audio Studio", description: "Shape an idea into a short script and listen with speech synthesis.", icon: "audio", route: "/studio/audio", tone: "cyan", tag: "Narration · not music" },
  { title: "Workflow Builder", description: "Sketch processes as AI-generated mind maps. Execution is not connected yet.", icon: "sparkle", route: "/workflows", tone: "orange", tag: "Mind maps only" },
  { title: "Idea Canvas", description: "Draw, add notes, and explore ideas on an open whiteboard.", icon: "canvas", route: "/studio/canvas", tone: "green", tag: "Visual whiteboard" },
];

const Home = () => {
  const navigate = useNavigate();
  const { creations } = useCreations();
  const [prompt, setPrompt] = useState("");
  const [tool, setTool] = useState("image");
  const recent = creations.slice(0, 3);
  const go = (path, text) => navigate(path, { state: { prompt: text || "" } });
  const submitPrompt = (event) => {
    event.preventDefault();
    if (!prompt.trim()) return;
    const paths = { chat: "/studio/chat", image: "/studio/image", audio: "/studio/audio", mindmap: "/studio/mindmap" };
    go(paths[tool], prompt.trim());
  };

  return <div className="home-page">
    <section className="hero-card">
      <div className="hero-glow hero-glow-one"/><div className="hero-glow hero-glow-two"/>
      <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-mark"/> YOUR IMAGINATION, ONE INTELLIGENT WORKSPACE</div>
        <h1>Create without<br/><span>limits.</span></h1>
        <p>Your ideas deserve more than one tool. Think, create, and bring your next idea together with Mindpace.</p>
        <form className="hero-composer" onSubmit={submitPrompt}>
          <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Describe what you want to create…" aria-label="Describe what you want to create" rows={2}/>
          <div className="composer-controls"><label className="tool-select-label"><Icon name={tool === "chat" ? "chat" : tool === "audio" ? "audio" : tool === "mindmap" ? "map" : "image"} size={16}/><select value={tool} onChange={(event) => setTool(event.target.value)} aria-label="Choose a tool"><option value="image">Image Studio</option><option value="chat">AI Chat</option><option value="audio">Audio Studio</option><option value="mindmap">Mind Map Studio</option></select></label>
            <button className="send-prompt" type="submit" disabled={!prompt.trim()} aria-label="Open selected creative tool"><span>Create</span><Icon name="arrow" size={16}/></button>
          </div>
        </form>
      </div>
      <div className="hero-orbit" aria-hidden="true"><div className="hero-orbit-ring ring-outer"/><div className="hero-orbit-ring ring-inner"/><div className="hero-orbit-center"><Icon name="sparkle" size={34}/></div><span className="hero-orbit-dot orbit-dot-one"/><span className="hero-orbit-dot orbit-dot-two"/><span className="orbit-label orbit-label-top">IDEAS</span><span className="orbit-label orbit-label-bottom">IN MOTION</span></div>
      <div className="hero-footer"><span><i/> A CREATIVE SPACE THAT MOVES WITH YOU</span><span>01 — 05</span></div>
    </section>

    <section className="section-block"><div className="section-heading"><div><div className="eyebrow">THE CREATIVE SUITE</div><h2>Choose your starting point</h2></div><Link to="/explore" className="text-link">Explore all tools <Icon name="arrow" size={15}/></Link></div>
      <div className="tool-card-grid">{tools.map((item, index) => <Link key={item.title} to={item.route} className={`home-tool-card tone-${item.tone}`}>
        <div className="home-tool-top"><span className="home-tool-icon"><Icon name={item.icon} size={20}/></span><span className="tool-card-index">0{index + 1}</span></div>
        <div className="home-tool-body"><div className="home-tool-tag">{item.tag}</div><h3>{item.title}</h3><p>{item.description}</p></div>
        <div className="tool-card-open"><span>Open studio</span><Icon name="arrow" size={15}/></div>
      </Link>)}</div>
    </section>

    <section className="section-block lower-grid"><div className="recent-panel"><div className="section-heading compact-heading"><div><div className="eyebrow">YOUR LIBRARY</div><h2>Recent creations</h2></div><Link to="/creations" className="text-link">View library <Icon name="arrow" size={15}/></Link></div>
      {recent.length ? <div className="recent-grid">{recent.map((item) => <Link key={item.id} className="recent-item" to="/creations"><div className={`recent-preview preview-${item.type}`}>{item.type === "image" ? <img src={item.content} alt=""/> : <Icon name={item.type === "audio" ? "audio" : "chat"} size={22}/>}</div><div className="recent-item-copy"><strong>{item.title}</strong><span>{item.type} · {new Date(item.createdAt).toLocaleDateString()}</span></div></Link>)}</div> : <div className="empty-library"><span className="empty-sparkle"><Icon name="sparkle" size={21}/></span><div><strong>Your creative trail starts here</strong><p>Images, audio, and chat replies you create will appear here on this device.</p></div><Link to="/explore" className="text-link">Find inspiration <Icon name="arrow" size={15}/></Link></div>}
    </div>
      <div className="continue-panel"><div className="eyebrow">CONTINUE CREATING</div><h2>Pick up where<br/>curiosity leads.</h2><p>Jump back into a studio or follow a new idea.</p><div className="continue-links"><Link to="/studio/chat"><Icon name="chat" size={16}/> Start a conversation <Icon name="arrow" size={14}/></Link><Link to="/studio/image"><Icon name="image" size={16}/> Create an image <Icon name="arrow" size={14}/></Link><Link to="/studio/canvas"><Icon name="canvas" size={16}/> Open the canvas <Icon name="arrow" size={14}/></Link></div></div>
    </section>
    <footer className="home-footer"><span>Mindpace</span><span>Your imagination. One intelligent workspace.</span><Link to="/settings">Workspace details</Link></footer>
  </div>;
};
export default Home;
