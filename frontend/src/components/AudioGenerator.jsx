import React, { useEffect, useState } from "react";
import { generateAudio } from "../api/api";
import { Icon } from "./Icon";

const AudioGenerator = ({ initialPrompt = "", onGenerated }) => {
  const [text, setText] = useState(initialPrompt);
  const [audio, setAudio] = useState(null);
  const [generatedText, setGeneratedText] = useState(null);
  const [originalPrompt, setOriginalPrompt] = useState(null);
  const [generateContent, setGenerateContent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => { if (initialPrompt) setText(initialPrompt); }, [initialPrompt]);

  const handleGenerate = async () => {
    if (!text.trim()) { setError("Enter a topic or text to continue."); return; }
    setLoading(true); setError(null); setAudio(null); setGeneratedText(null); setOriginalPrompt(null);
    try {
      const res = await generateAudio(text, { generateContent });
      setAudio(res.data.audio); setGeneratedText(res.data.text); setOriginalPrompt(res.data.prompt);
      await onGenerated?.({ audio: res.data.audio, transcript: res.data.text, prompt: res.data.prompt });
    } catch (e) { setError(e.response?.data?.detail || e.message || "Audio generation failed"); }
    finally { setLoading(false); }
  };

  return <div className="audio-generator">
    <label className="field-label" htmlFor="audio-prompt">{generateContent ? "TOPIC OR CREATIVE PROMPT" : "TEXT TO SPEAK"}</label>
    <textarea id="audio-prompt" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleGenerate(); }} className="studio-prompt" rows={4} placeholder={generateContent ? "A hopeful short poem about starting over…" : "Paste the text you would like spoken…"} disabled={loading}/>
    <div className="audio-controls"><label className="toggle-control"><input type="checkbox" checked={generateContent} onChange={(e) => setGenerateContent(e.target.checked)} disabled={loading}/><span className="toggle-track"/><span>Write a short script with AI first</span></label><button className="button button-primary generate-button" onClick={handleGenerate} disabled={loading || !text.trim()}>{loading ? <><span className="spinner"/> Creating audio…</> : <><Icon name="audio" size={17}/> Generate speech audio</>}</button></div>
    <div className="generation-note">Current backend creates spoken narration with gTTS. It does not compose songs or instrumental music.</div>
    {error && <div className="error-box"><Icon name="help" size={17}/><span>{error}</span></div>}
    {audio && <div className="audio-output">{generatedText && generatedText !== originalPrompt && <div className="generated-script"><div className="eyebrow">GENERATED SCRIPT</div><p>{generatedText}</p></div>}<div className="audio-player-card"><div className="audio-player-symbol"><Icon name="audio" size={21}/></div><div className="audio-player-main"><div><strong>Spoken audio</strong><span>{generateContent ? "AI-written script" : "Your text"}</span></div><audio controls src={audio}/></div><a className="download-icon" href={audio} download="mindpace-audio.mp3" aria-label="Download audio"><Icon name="download" size={17}/></a></div></div>}
  </div>;
};
export default AudioGenerator;
