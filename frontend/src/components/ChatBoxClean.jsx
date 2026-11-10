import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { sendMessage } from "../api/api";
import { Icon } from "./Icon";

const suggestions = ["Help me shape a new project idea", "Explain a complex idea in simple terms", "Give me a fresh perspective on…"];

const ChatBoxClean = ({ initialPrompt = "", onGenerated }) => {
  const [input, setInput] = useState(initialPrompt);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => { if (initialPrompt) setInput(initialPrompt); }, [initialPrompt]);

  const handleSend = async (override) => {
    const prompt = (override ?? input).trim();
    if (!prompt || loading) return;
    setMessages((prev) => [...prev, { role: "user", text: prompt }]);
    setInput(""); setLoading(true);
    try {
      const res = await sendMessage(prompt);
      const reply = res.data?.reply ?? "";
      setMessages((prev) => [...prev, { role: "ai", text: reply, prompt }]);
      await onGenerated?.({ prompt, reply });
    } catch (error) {
      const msg = error?.response?.data?.detail || error?.response?.data?.error || error.message || "Sorry, I couldn’t process that. Please try again.";
      setMessages((prev) => [...prev, { role: "error", text: msg }]);
    } finally { setLoading(false); }
  };

  return <div className="chat-workspace">
    <div className="chat-feed" aria-live="polite">
      {messages.length === 0 ? <div className="chat-empty"><div className="chat-empty-mark"><Icon name="sparkle" size={24}/></div><div className="eyebrow">A CLEARER FIRST STEP</div><h2>What would you like<br/>to explore today?</h2><p>Ask a question, workshop a thought, or start with one of these.</p><div className="suggestion-list">{suggestions.map((suggestion) => <button key={suggestion} onClick={() => { setInput(suggestion); }}>{suggestion}<Icon name="arrow" size={14}/></button>)}</div></div> : <div className="message-stack">{messages.map((msg, i) => <div className={`message-row ${msg.role === "user" ? "from-user" : "from-ai"}`} key={`${i}-${msg.role}`}><span className={`message-avatar ${msg.role === "user" ? "user-avatar" : "ai-avatar"}`}>{msg.role === "user" ? "M" : <Icon name={msg.role === "error" ? "help" : "sparkle"} size={16}/>}</span><div className="message-content"><div className="message-role">{msg.role === "user" ? "You" : msg.role === "error" ? "Connection issue" : "Mindpace AI"}</div><div className={`message-bubble ${msg.role === "error" ? "error-bubble" : ""}`}>{msg.role === "ai" ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown> : <p>{msg.text}</p>}</div>{msg.role === "ai" && <div className="message-actions"><button onClick={() => navigator.clipboard?.writeText(msg.text)}><Icon name="copy" size={13}/> Copy response</button><button onClick={() => handleSend(msg.prompt)} disabled={loading}><Icon name="sparkle" size={13}/> Regenerate</button></div>}</div></div>)}</div>}
      {loading && <div className="message-row from-ai"><span className="message-avatar ai-avatar"><Icon name="sparkle" size={16}/></span><div className="message-content"><div className="message-role">Mindpace AI</div><div className="message-bubble typing-bubble"><span/><span/><span/></div></div></div>}
    </div>
    <form className="chat-composer" onSubmit={(e) => { e.preventDefault(); handleSend(); }}><textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Message Mindpace…" rows={2} aria-label="Message Mindpace"/><div className="chat-composer-footer"><span>Gemini · Shift + Enter for a new line</span><button type="submit" className="send-prompt" disabled={loading || !input.trim()} aria-label="Send message">{loading ? <span className="spinner"/> : <Icon name="arrow" size={16}/>}</button></div></form>
  </div>;
};
export default ChatBoxClean;
