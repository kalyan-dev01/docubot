import React, { useState } from "react";
import { chatbotApi } from "../../../services/chatbotApi";
import { API_URL } from "../../../services/api";
import { useToast } from "../../../components/ui/Toast";
import { Check, Copy, ExternalLink, Loader2 } from "lucide-react";

const EmbedTab = ({ chatbot, onUpdated }) => {
  const toast = useToast();
  const [publishing, setPublishing] = useState(false);
  const [copied, setCopied] = useState(false);

  const isActive = chatbot.status === "active";

  const togglePublish = async () => {
    setPublishing(true);
    try {
      const res = await chatbotApi.update(chatbot._id, {
        status: isActive ? "draft" : "active",
      });
      if (res?.data) onUpdated(res.data);
      toast.success(isActive ? "Chatbot unpublished" : "Chatbot published");
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setPublishing(false);
    }
  };

  const snippet = `// DocuBot public chat endpoint - no auth required.
// Requires the chatbot to be "active" and have at least one "ready" document.
fetch("${API_URL}/api/public/chatbots/${chatbot._id}/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ question: "Your question here" })
})
  .then((res) => res.json())
  .then((data) => console.log(data.response));`;

  const widgetUrl = `${window.location.origin}/widget/${chatbot._id}`;

  const copy = async () => {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="border border-[#e6e8ec] rounded-xl bg-white p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-[#07142f]">Publish status</h3>
            <p className="text-sm text-[#667085] mt-1">
              The public chat API only answers requests when this chatbot's
              status is <span className="font-medium">active</span>.
            </p>
          </div>
          <button
            onClick={togglePublish}
            disabled={publishing}
            className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition disabled:opacity-60 flex items-center gap-2 shrink-0 ${
              isActive
                ? "border border-[#d7dbe1] hover:bg-gray-50"
                : "bg-[#2454ff] text-white hover:bg-[#1b3fd1]"
            }`}
          >
            {publishing && <Loader2 size={15} className="animate-spin" />}
            {isActive ? "Unpublish" : "Publish"}
          </button>
        </div>
      </div>

      <div className="border border-[#e6e8ec] rounded-xl bg-white p-5">
        <h3 className="font-semibold text-[#07142f]">Hosted demo page</h3>
        <p className="text-sm text-[#667085] mt-1">
          A link you can share directly - it calls the public chat API from
          this DocuBot app.
        </p>
        <div className="mt-3 flex items-center gap-2">
          <input
            readOnly
            value={widgetUrl}
            className="flex-1 border border-[#d7dbe1] rounded-lg px-3.5 py-2.5 text-sm bg-[#f8f9fb] text-[#344054]"
          />
          <a
            href={widgetUrl}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 border border-[#d7dbe1] rounded-lg px-3.5 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-1.5"
          >
            <ExternalLink size={14} /> Open
          </a>
        </div>
        {!isActive && (
          <p className="text-xs text-[#b54708] mt-2">
            This link won't return answers until the chatbot is published above.
          </p>
        )}
      </div>

      <div className="border border-[#e6e8ec] rounded-xl bg-white p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-[#07142f]">API snippet</h3>
          <button
            onClick={copy}
            className="text-sm font-medium text-[#2454ff] hover:underline flex items-center gap-1.5"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <p className="text-sm text-[#667085] mt-1">
          Call this directly from your own site or app to build a fully custom
          widget.
        </p>
        <pre className="mt-3 bg-[#0b1220] text-[#d1e2ff] text-xs rounded-lg p-4 overflow-x-auto">
          {snippet}
        </pre>
        <p className="text-xs text-[#98a2b3] mt-3">
          There's no drop-in <code>&lt;script&gt;</code> widget file in the
          backend yet - only this JSON API - so integrating today means
          calling it from your own front-end code, or linking to the hosted
          demo page above.
        </p>
      </div>
    </div>
  );
};

export default EmbedTab;
