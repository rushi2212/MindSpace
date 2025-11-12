import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { sendMessage } from "../api/api";

const ChatBox = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages([...messages, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendMessage(input);
      const aiMsg = { role: "ai", text: res.data.reply };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      const msg =
        error?.response?.data?.error ||
        error.message ||
        "Sorry, I couldn't process that. Please try again.";
      const errorMsg = { role: "ai", text: msg };
      import ReactMarkdown from "react-markdown";
      import remarkGfm from "remark-gfm";
      import { sendMessage } from "../api/api";

      const ChatBox = () => {
        const [input, setInput] = useState("");
        const [messages, setMessages] = useState([]);
        const [loading, setLoading] = useState(false);

        const handleSend = async () => {
          if (!input.trim()) return;
          const userMsg = { role: "user", text: input };
          setMessages((prev) => [...prev, userMsg]);
          setInput("");
          setLoading(true);

          try {
            const res = await sendMessage(input);
            const aiMsg = { role: "ai", text: res.data.reply };
            setMessages((prev) => [...prev, aiMsg]);
          } catch (error) {
            const msg =
              error?.response?.data?.error ||
              error.message ||
              "Sorry, I couldn't process that. Please try again.";
            const errorMsg = { role: "ai", text: msg };
            setMessages((prev) => [...prev, errorMsg]);
          } finally {
            setLoading(false);
          }
        };

        const handleKeyPress = (e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        };

        return (
          <div className="flex flex-col h-full">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto mb-4 p-4 bg-slate-900/30 rounded-lg space-y-4 min-h-96 max-h-96 scroll-smooth">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <p className="text-gray-400 text-sm">Start a conversation with your AI assistant</p>
                    <p className="text-gray-500 text-xs mt-2">Type a message and press Enter or click Send</p>
                  </div>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`${msg.role === "user" ? "message-user" : "message-ai"}`}>
                      {msg.role === "ai" ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: (props) => <p className="leading-relaxed" {...props} />,
                            ul: (props) => <ul className="list-disc pl-5 space-y-1" {...props} />,
                            ol: (props) => <ol className="list-decimal pl-5 space-y-1" {...props} />,
                            li: (props) => <li className="leading-relaxed" {...props} />,
                            code: ({ className, children, ...props }) => (
                              <code className={`bg-slate-800/80 rounded px-1 py-0.5 ${className || ""}`} {...props}>
                                {children}
                              </code>
                            ),
                            strong: (props) => <strong className="font-semibold" {...props} />,
                            em: (props) => <em className="opacity-90" {...props} />,
                            a: (props) => <a className="text-indigo-300 hover:text-indigo-200 underline" {...props} />,
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      ) : (
                        <p className="whitespace-pre-wrap wrap-break-word">{msg.text}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="message-ai">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="input-field flex-1 resize-none max-h-24"
                placeholder="Type your message... (Shift+Enter for new line)"
                rows="2"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed h-full"
              >
                {loading ? "..." : "Send"}
              </button>
            </div>
          </div>
        );
      };

      export default ChatBox;

      {/* Input Area */}
      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="input-field flex-1 resize-none max-h-24"
          placeholder="Type your message... (Shift+Enter for new line)"
          rows="2"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed h-full"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
