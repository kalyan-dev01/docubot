import React, { useEffect, useRef, useState } from "react";
import { chatApi } from "../../../services/chatApi";
import { Loader2, RotateCcw, Send } from "lucide-react";

const TestChatTab = ({ chatbot }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: chatbot.customization?.welcome_message || "Hi! How can I help you?",
    },
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
      const res = await chatApi.ask(chatbot._id, question);
      setMessages((prev) => [...prev, { role: "assistant", content: res.response }]);
    } catch (err) {
      setError(err.message || "Failed to get a response");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const reset = () => {
    setMessages([
      {
        role: "assistant",
        content: chatbot.customization?.welcome_message || "Hi! How can I help you?",
      },
    ]);
    setError(null);
  };

  const primary = chatbot.customization?.primary_color || "#2454ff";

  return (
    <div className="max-w-2xl">
      <div className="border border-gray-200 rounded-xl shadow-sm overflow-hidden bg-white">
        <div
          className="flex items-center gap-3 px-4 py-4"
          style={{ backgroundColor: primary }}
        >
          <span className="bg-white/20 w-9 h-9 flex items-center justify-center text-white font-bold rounded-full">
            {chatbot.name?.charAt(0)?.toUpperCase() || "B"}
          </span>
          <div>
            <p className="font-semibold text-sm text-white">
              {chatbot.customization?.chatbot_title || chatbot.name}
            </p>
            <p className="text-xs text-white/80">Test chat - only you can see this</p>
          </div>
          <button
            onClick={reset}
            className="ml-auto text-white/80 hover:text-white p-1.5"
            title="Reset conversation"
          >
            <RotateCcw size={16} />
          </button>
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
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl px-4 py-3 max-w-[85%] text-sm text-gray-800 whitespace-pre-wrap"
              >
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
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex items-center justify-between gap-3">
              <span>{error}</span>
              <button onClick={send} className="font-medium underline shrink-0">
                Retry
              </button>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <form onSubmit={send} className="border-t border-gray-200 p-3 flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder="Ask a question about the uploaded documents..."
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

      <p className="text-xs text-[#98a2b3] mt-3">
        This calls the authenticated chat endpoint and requires at least one
        document with status "ready". It won't fabricate an answer - if no
        ready document exists, the backend returns an error asking you to
        upload one first.
      </p>
    </div>
  );
};

export default TestChatTab;
