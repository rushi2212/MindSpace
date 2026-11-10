import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { useCreations } from "../components/CreationsContext";

const filters = ["All", "Images", "Audio", "Chat replies"];
const Creations = () => {
  const { creations, removeCreation, storageWarning } = useCreations();
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [layout, setLayout] = useState("grid");
  const [preview, setPreview] = useState(null);
  const visible = useMemo(() => creations.filter((item) => {
    const matchType = filter === "All" || (filter === "Images" && item.type === "image") || (filter === "Audio" && item.type === "audio") || (filter === "Chat replies" && item.type === "chat");
    const matchSearch = `${item.title} ${item.prompt || ""} ${item.transcript || ""}`.toLowerCase().includes(query.toLowerCase());
    return matchType && matchSearch;
  }).sort((a, b) => sort === "newest" ? b.createdAt.localeCompare(a.createdAt) : a.createdAt.localeCompare(b.createdAt)), [creations, filter, query, sort]);
  const deleteItem = async (item) => { if (window.confirm(`Delete “${item.title}” from this browser’s library?`)) await removeCreation(item.id); };
  return <div className="page-wrap">
    <header className="page-heading"><div><div className="eyebrow">YOUR PERSONAL LIBRARY</div><h1>My Creations</h1><p>Your generated images, spoken audio, and saved chat replies on this device.</p></div><span className="library-count">{creations.length} {creations.length === 1 ? "item" : "items"}</span></header>
    {storageWarning && <div className="inline-warning"><Icon name="help" size={16}/>{storageWarning}</div>}
    <div className="library-toolbar"><div className="library-filters">{filters.map((item) => <button key={item} className={`filter-pill${filter === item ? " selected" : ""}`} onClick={() => setFilter(item)}>{item}</button>)}</div><div className="library-controls"><label className="search-control"><Icon name="search" size={16}/><input aria-label="Search creations" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search your library"/></label><select aria-label="Sort creations" value={sort} onChange={(e) => setSort(e.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select><div className="view-switch" aria-label="View mode"><button className={layout === "grid" ? "active" : ""} onClick={() => setLayout("grid")} aria-label="Grid view">▦</button><button className={layout === "list" ? "active" : ""} onClick={() => setLayout("list")} aria-label="List view">☰</button></div></div></div>
    {visible.length ? <div className={`creation-grid ${layout === "list" ? "list-view" : ""}`}>{visible.map((item) => <article className="creation-card" key={item.id}>
      {item.type === "image" ? <button className="creation-preview" onClick={() => setPreview(item)} aria-label={`Preview ${item.title}`}><img src={item.content} alt={item.title}/></button> : item.type === "audio" ? <div className="creation-audio"><div className="audio-wave-icon"><Icon name="audio" size={23}/></div><audio controls src={item.content}/></div> : <div className="creation-chat-preview"><Icon name="chat" size={18}/><p>{item.content}</p></div>}
      <div className="creation-details"><div className="creation-meta"><span>{item.type === "image" ? "IMAGE" : item.type === "audio" ? "SPOKEN AUDIO" : "CHAT REPLY"}</span><time>{new Date(item.createdAt).toLocaleDateString()}</time></div><h3>{item.title}</h3><p className="creation-prompt">{item.prompt}</p><div className="creation-actions">{item.type === "image" && <button onClick={() => setPreview(item)}><Icon name="image" size={14}/> Preview</button>}{item.type !== "chat" && <a href={item.content} download={item.type === "audio" ? "mindpace-audio.mp3" : "mindpace-image.png"}><Icon name="download" size={14}/> Download</a>}{item.type === "chat" && <button onClick={() => navigator.clipboard?.writeText(item.content || "")}><Icon name="copy" size={14}/> Copy</button>}<button className="delete-action" onClick={() => deleteItem(item)}><Icon name="trash" size={14}/> Delete</button></div></div>
    </article>)}</div> : <div className="empty-state"><div className="empty-state-icon"><Icon name="library" size={24}/></div><h2>{query ? "No matching creations" : creations.length ? "Nothing in this filter yet" : "Your library is ready"}</h2><p>{query ? "Try another search term." : "Create something in a studio and it will be saved to this browser for next time."}</p><Link to="/explore" className="button button-primary">Explore the studios <Icon name="arrow" size={15}/></Link></div>}
    <div className="honesty-note"><Icon name="help" size={17}/><span>This library is stored locally in this browser. There is no account sync. Workflow runs and rich-text documents aren’t stored because those tools aren’t implemented yet.</span></div>
    {preview && <div className="preview-modal" role="dialog" aria-modal="true" aria-label="Image preview" onClick={() => setPreview(null)}><button className="modal-close" aria-label="Close preview" onClick={() => setPreview(null)}><Icon name="close"/></button><img src={preview.content} alt={preview.title} onClick={(e) => e.stopPropagation()}/><div className="modal-caption">{preview.title}</div></div>}
  </div>;
};
export default Creations;
