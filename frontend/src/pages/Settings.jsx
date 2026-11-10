import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { fetchAIHealth } from "../api/api";

const Settings = () => {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { let active = true; fetchAIHealth().then((res) => { if (active) setHealth(res.data); }).catch((e) => { if (active) setError(e.response?.data?.detail || "Could not reach the backend health endpoint."); }); return () => { active = false; }; }, []);
  const state = (ok) => <span className={`settings-state ${ok ? "state-live" : "state-off"}`}><i/>{ok ? "Configured" : "Not configured"}</span>;
  return <div className="page-wrap"><header className="page-heading"><div><div className="eyebrow">YOUR SPACE</div><h1>Settings & help</h1><p>Workspace status, privacy, and feature availability.</p></div></header>
    <div className="settings-grid"><section className="settings-panel"><div className="panel-title"><Icon name="sparkle"/><div><h2>Connected capabilities</h2><p>Key presence only. Secrets are never displayed here.</p></div></div>
      {error && <div className="inline-warning">{error}</div>}
      <div className="settings-row"><div><strong>AI chat</strong><span>Gemini text responses</span></div>{health ? state(health.gemini?.apiKeyPresent) : <span className="settings-state">Checking…</span>}</div>
      <div className="settings-row"><div><strong>Image generation</strong><span>{health?.imageProvider || "Cloudflare"} · FLUX.1 schnell</span></div>{health ? state(health.imageProvider === "cloudflare" ? health.cloudflare?.apiTokenPresent && health.cloudflare?.accountIdPresent : health.huggingface?.apiKeyPresent) : <span className="settings-state">Checking…</span>}</div>
      <div className="settings-row"><div><strong>Speech audio</strong><span>gTTS narration, optional Gemini writing</span></div><span className="settings-state state-live"><i/>Available</span></div>
      <p className="settings-footnote">For credentials or provider changes, update your backend environment in Render and redeploy. This UI intentionally does not accept or store API secrets.</p>
    </section>
    <section className="settings-panel"><div className="panel-title"><Icon name="help"/><div><h2>What’s supported today</h2><p>Mindpace keeps unavailable features explicit.</p></div></div>
      <div className="capability-list"><div><span className="capability-state state-live"/><span><strong>Visual mind maps</strong><small>AI generated, editable nodes and connectors.</small></span><Link to="/studio/mindmap">Open</Link></div><div><span className="capability-state state-live"/><span><strong>Idea whiteboard</strong><small>Drawing and sticky notes, stored for the current session.</small></span><Link to="/studio/canvas">Open</Link></div><div><span className="capability-state state-off"/><span><strong>Song composition</strong><small>Current audio feature is speech narration.</small></span></div><div><span className="capability-state state-off"/><span><strong>Workflow runs & rich-text documents</strong><small>No execution engine or document editor is connected.</small></span></div><div><span className="capability-state state-off"/><span><strong>Sign-in and cloud sync</strong><small>The app uses a local workspace; task data uses the existing demo user.</small></span></div></div>
    </section></div>
    <div className="honesty-note"><Icon name="library" size={17}/><span>Generated items are stored in this browser’s local library. Clearing site data or using another browser/device will not carry them over.</span></div>
  </div>;
};
export default Settings;
