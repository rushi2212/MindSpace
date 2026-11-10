import React from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../components/Icon";

const promptSets = [
  { title: "Visual concepts", desc: "Images, styles, and scenes to explore.", prompts: ["A quiet greenhouse under a violet evening sky", "A sculptural chair made from translucent glass", "A tiny seaside bookshop on a rainy morning"] },
  { title: "Writing starters", desc: "Questions and ideas for a helpful first draft.", prompts: ["Help me write a warm note to a mentor", "Give me three angles for a short blog post about local gardens", "Turn these notes into a clear one-page brief"] },
  { title: "Audio prompts", desc: "Short spoken pieces and narration ideas.", prompts: ["Write a calm 30-second reflection on slowing down", "A short poem about the first rain of the season", "Narrate a gentle welcome for a mindfulness session"] },
];
const Explore = () => {
  const navigate = useNavigate();
  return <div className="page-wrap">
    <header className="page-heading"><div><div className="eyebrow">A LITTLE CREATIVE SPARK</div><h1>Explore</h1><p>Prompts and starting points to help your next idea take shape.</p></div><span className="status-pill muted-pill">Prompt ideas</span></header>
    <section className="explore-feature"><div className="explore-feature-art"><div className="feature-art-orbit"/><div className="feature-art-star"><Icon name="sparkle" size={42}/></div></div><div className="explore-feature-copy"><div className="eyebrow">START WITH A PROMPT</div><h2>Small spark.<br/><span>Big possibility.</span></h2><p>Pick a starter below. You can edit it before it reaches the connected studio.</p><button className="button button-primary" onClick={() => navigate("/studio/image", { state: { prompt: "A small glass cabin in a misty pine forest at blue hour, soft window light" } })}>Open Image Studio <Icon name="arrow" size={16}/></button></div></section>
    <section className="section-block"><div className="section-heading"><div><div className="eyebrow">PROMPT LIBRARY</div><h2>Follow a direction</h2></div></div><div className="prompt-set-grid">{promptSets.map((set, i) => <article className={`prompt-set prompt-set-${i}`} key={set.title}><div className="prompt-set-title"><span className="prompt-set-icon"><Icon name={i === 0 ? "image" : i === 1 ? "chat" : "audio"}/></span><div><h3>{set.title}</h3><p>{set.desc}</p></div></div><div className="prompt-samples">{set.prompts.map((prompt) => <button key={prompt} onClick={() => navigate(i === 0 ? "/studio/image" : i === 1 ? "/studio/chat" : "/studio/audio", { state: { prompt } })}><span>{prompt}</span><Icon name="arrow" size={14}/></button>)}</div></article>)}</div></section>
    <section className="explore-feature-row"><div><span className="eyebrow">MAP THE PROCESS</span><h2>See how the ideas connect.</h2><p>The mind map studio can turn a topic into an editable visual map. Workflow execution is not connected yet.</p><button className="text-link" onClick={() => navigate("/studio/mindmap", { state: { prompt: "A creative project from idea to launch" } })}>Open Mind Map Studio <Icon name="arrow" size={14}/></button></div><div className="mini-map" aria-hidden="true"><span className="map-node map-center">IDEA</span><i className="map-line line-1"/><i className="map-line line-2"/><i className="map-line line-3"/><span className="map-node map-a">Explore</span><span className="map-node map-b">Create</span><span className="map-node map-c">Share</span></div></section>
    <div className="honesty-note"><Icon name="help" size={17}/><span>These are Mindpace starter prompts, not community submissions. The app has no public Explore feed or trending data source.</span></div>
  </div>;
};
export default Explore;
