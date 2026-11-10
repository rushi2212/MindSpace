import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { useCreations } from "../components/CreationsContext";

const Activity = () => {
  const { creations } = useCreations();
  return <div className="page-wrap"><header className="page-heading"><div><div className="eyebrow">YOUR CREATIVE TRAIL</div><h1>Recent Activity</h1><p>A timeline of the things you’ve made in this browser.</p></div><span className="library-count">{creations.length} saved</span></header>
    {creations.length ? <div className="activity-list">{creations.map((item) => <article className="activity-row" key={item.id}><div className={`activity-icon activity-${item.type}`}><Icon name={item.type === "image" ? "image" : item.type === "audio" ? "audio" : "chat"}/></div><div className="activity-copy"><strong>{item.type === "image" ? "Generated an image" : item.type === "audio" ? "Created spoken audio" : "Saved an AI reply"}</strong><span>{item.title}</span></div><time>{new Date(item.createdAt).toLocaleString()}</time><Link to="/creations" className="tiny-link">Open</Link></article>)}</div> : <div className="empty-state"><div className="empty-state-icon"><Icon name="clock" size={24}/></div><h2>Nothing here yet</h2><p>After you create an image, audio clip, or chat response, it will appear in this timeline.</p><Link className="button button-primary" to="/explore">Explore the studios <Icon name="arrow" size={15}/></Link></div>}
    <div className="honesty-note"><Icon name="help" size={17}/><span>This timeline stores successful generations locally. It does not include task edits or workflows, which do not expose activity-history data.</span></div>
  </div>;
};
export default Activity;
