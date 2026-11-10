import React, { useEffect, useState } from "react";
import { generateArt } from "../api/api";
import { Icon } from "./Icon";

const styles = [
  ["Natural", "photorealistic, natural lighting"], ["Anime", "anime illustration"],
  ["Cinematic", "cinematic composition, dramatic lighting"], ["Digital art", "high-detail digital artwork"],
  ["3D render", "polished 3D render"], ["Illustration", "editorial illustration"],
  ["Fantasy", "fantasy concept art"], ["Minimalist", "minimalist composition"],
];

const ArtGenerator = ({ initialPrompt = "", onGenerated, onRemove }) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [style, setStyle] = useState("Natural");
  const [art, setArt] = useState("");
  const [savedId, setSavedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);
  useEffect(() => { if (initialPrompt) setPrompt(initialPrompt); }, [initialPrompt]);

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    const styleSuffix = styles.find(([name]) => name === style)?.[1];
    const finalPrompt = `${prompt.trim()}, ${styleSuffix}`;
    setLoading(true); setError(""); setArt(""); setSavedId(null);
    try {
      const res = await generateArt(finalPrompt);
      const image = res.data.art;
      setArt(image);
      const saved = await onGenerated?.({ prompt: finalPrompt, image });
      setSavedId(saved?.id || null);
    } catch (e) {
      setError(e?.response?.data?.detail || e?.response?.data?.error || e.message || "Unable to generate an image. Please try again.");
    } finally { setLoading(false); }
  };

  const remove = async () => {
    if (savedId) await onRemove?.(savedId);
    setArt(""); setSavedId(null);
  };

  return <div className="image-generator">
    <label className="field-label" htmlFor="image-prompt">IMAGE PROMPT</label>
    <textarea id="image-prompt" className="studio-prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleGenerate(); }} placeholder="A moonlit greenhouse filled with wildflowers, glass reflections and soft lavender light…" rows={4} disabled={loading}/>
    <div className="image-controls"><label className="select-control"><span>Style</span><select value={style} onChange={(e) => setStyle(e.target.value)} disabled={loading}>{styles.map(([name]) => <option key={name}>{name}</option>)}</select></label><div className="model-chip"><span className="online-dot"/> FLUX.1 schnell</div><button className="button button-primary generate-button" onClick={handleGenerate} disabled={loading || !prompt.trim()}>{loading ? <><span className="spinner"/> Creating image…</> : <><Icon name="sparkle" size={17}/> Generate image</>}</button></div>
    <div className="generation-note">Style is added to your prompt. One image is generated per request; aspect ratio and model selection are not exposed by the current API.</div>
    {error && <div className="error-box"><Icon name="help" size={17}/><span>{error}</span></div>}
    {loading && <div className="image-skeleton"><div className="skeleton-shimmer"/><div className="skeleton-caption"><span className="spinner"/> Rendering your idea…</div></div>}
    {art && art.startsWith("data:image") && <div className="generated-result"><div className="result-heading"><div><span className="eyebrow">YOUR IMAGE</span><h3>{prompt.trim()}</h3></div><button className="icon-button" onClick={remove} aria-label="Delete this image" title="Delete image"><Icon name="trash"/></button></div><button className="generated-image" onClick={() => setPreview(true)} aria-label="Open full-screen image preview"><img src={art} alt={prompt || "Generated artwork"}/><span className="image-expand">Preview <Icon name="image" size={14}/></span></button><div className="result-actions"><a className="button button-secondary" href={art} download="mindpace-image.png"><Icon name="download" size={15}/> Download</a><button className="button button-secondary" onClick={() => navigator.clipboard?.writeText(prompt.trim())}><Icon name="copy" size={15}/> Copy prompt</button><button className="button button-primary" onClick={handleGenerate} disabled={loading}><Icon name="sparkle" size={15}/> Regenerate</button></div></div>}
    {preview && <div className="preview-modal" role="dialog" aria-modal="true" aria-label="Generated image preview" onClick={() => setPreview(false)}><button className="modal-close" aria-label="Close preview"><Icon name="close"/></button><img src={art} alt={prompt} onClick={(e) => e.stopPropagation()}/><div className="modal-caption">{prompt}</div></div>}
  </div>;
};
export default ArtGenerator;
