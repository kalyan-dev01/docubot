import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { chatApi } from "../services/chatApi";
import { Loader2, Send } from "lucide-react";

// Public, unauthenticated chat page - the thing the Embed tab's "hosted demo
// page" link points to. Calls POST /api/public/chatbots/:chatbotId/chat.
// There is no public "get chatbot" endpoint in the backend (only the
// authenticated owner-scoped one), so this page can't fetch the chatbot's
// name/color for branding - it uses a generic shell instead of guessing.
const PublicChat = () => {
  const { chatbotId } = useParams();
  const [notFound, setNotFound] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! How can I help you?" },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const send = async (e) => {
    e?.preventDefault();
    const question = input.trim();
    if (!question || sending) return;

    setError(null);
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setSending(true);

    try {
      const res = await chatApi.askPublic(chatbotId, question);
      setMessages((prev) => [...prev, { role: "assistant", content: res.response }]);
    } catch (err) {
      if (err.status === 404 && /chatbot not found/i.test(err.message)) {
        setNotFound(true);
      }
      setError(err.message || "Something went wrong");
    } finally {
      setSending(false);
    }
  };

  const primary = "#2454ff";
  const title = "DocuBot Assistant";

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#4b5468] text-sm">
        This chatbot doesn't exist.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center p-4">
      <div className="w-full max-w-md border border-gray-200 rounded-xl shadow-lg overflow-hidden bg-white">
        <div className="flex items-center gap-3 px-4 py-4" style={{ backgroundColor: primary }}>
          <span className="bg-white/20 w-9 h-9 flex items-center justify-center text-white font-bold rounded-full">
            {title.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="font-semibold text-sm text-white">{title}</p>
            <div className="flex items-center gap-1 text-xs text-white/80">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              <span>Online</span>
            </div>
          </div>
        </div>

        <div className="bg-[#f8f9fb] px-4 py-5 space-y-3 h-96 overflow-y-auto">
          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="flex justify-end">
                <div className="bg-[#2454ff] text-white rounded-xl px-4 py-3 text-sm max-w-[85%]">
                  {m.content}
                </div>
              </div>
            ) : (
              <div key={i} className="bg-white border border-gray-200 rounded-xl px-4 py-3 max-w-[85%] text-sm whitespace-pre-wrap">
                {m.content}
              </div>
            )
          )}

          {sending && (
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 w-fit text-sm text-gray-500 flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" /> Thinking…
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <form onSubmit={send} className="border-t border-gray-200 p-3 flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Ask a question..."
            disabled={sending}
            className="flex-1 min-w-0 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2454ff] disabled:bg-gray-50"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            style={{ backgroundColor: primary }}
            className="shrink-0 rounded-lg px-3 py-2 text-white disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default PublicChat;
