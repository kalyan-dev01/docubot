import React, { useState } from "react";
import { chatbotApi } from "../../../services/chatbotApi";
import { useToast } from "../../../components/ui/Toast";
import { Loader2 } from "lucide-react";

const INDUSTRIES = [
  "Software / SaaS",
  "E-commerce",
  "Healthcare",
  "Finance",
  "Education",
  "Real Estate",
  "Other",
];

const CustomizeTab = ({ chatbot, onUpdated }) => {
  const toast = useToast();
  const [form, setForm] = useState({
    name: chatbot.name || "",
    description: chatbot.description || "",
    industry: chatbot.industry || INDUSTRIES[0],
    language: chatbot.language || "English",
    chatbot_title: chatbot.customization?.chatbot_title || "AI Assistant",
    welcome_message:
      chatbot.customization?.welcome_message || "Hi! How can I help you?",
    primary_color: chatbot.customization?.primary_color || "#2454ff",
  });
  const [saving, setSaving] = useState(false);

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await chatbotApi.update(chatbot._id, {
        name: form.name,
        description: form.description,
        industry: form.industry,
        language: form.language,
        customization: {
          chatbot_title: form.chatbot_title,
          welcome_message: form.welcome_message,
          primary_color: form.primary_color,
        },
      });
      toast.success("Chatbot updated");
      if (res?.data) onUpdated(res.data);
    } catch (err) {
      toast.error(err.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full border border-[#d7dbe1] rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#2454ff] focus:ring-1 focus:ring-[#2454ff]";
  const labelCls = "block text-sm font-medium text-[#4b5468] mb-1.5";

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-6">
      <form onSubmit={handleSave} className="border border-[#e6e8ec] rounded-xl bg-white p-5 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Chatbot name</label>
            <input value={form.name} onChange={update("name")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Widget title</label>
            <input
              value={form.chatbot_title}
              onChange={update("chatbot_title")}
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Description</label>
          <textarea
            value={form.description}
            onChange={update("description")}
            rows={2}
            className={`${inputCls} resize-none`}
          />
        </div>

        <div>
          <label className={labelCls}>Welcome message</label>
          <textarea
            value={form.welcome_message}
            onChange={update("welcome_message")}
            rows={2}
            className={`${inputCls} resize-none`}
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Industry</label>
            <select value={form.industry} onChange={update("industry")} className={`${inputCls} bg-white`}>
              {INDUSTRIES.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Language</label>
            <input value={form.language} onChange={update("language")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Primary color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={form.primary_color}
                onChange={update("primary_color")}
                className="w-10 h-10 rounded-lg border border-[#d7dbe1] cursor-pointer shrink-0"
              />
              <input
                value={form.primary_color}
                onChange={update("primary_color")}
                className={inputCls}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#2454ff] text-white hover:bg-[#1b3fd1] transition disabled:opacity-60 flex items-center gap-2"
          >
            {saving && <Loader2 size={15} className="animate-spin" />}
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>

      {/* Live preview */}
      <div>
        <p className="text-sm font-medium text-[#4b5468] mb-2">Live preview</p>
        <div className="border border-gray-200 rounded-xl shadow-sm overflow-hidden bg-white">
          <div
            className="flex items-center gap-3 px-4 py-4"
            style={{ backgroundColor: form.primary_color }}
          >
            <span className="bg-white/20 w-9 h-9 flex items-center justify-center text-white font-bold rounded-full">
              {form.name?.charAt(0)?.toUpperCase() || "B"}
            </span>
            <div>
              <p className="font-semibold text-sm text-white">{form.chatbot_title}</p>
              <div className="flex items-center gap-1 text-xs text-white/80">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                <span>Online</span>
              </div>
            </div>
          </div>

          <div className="bg-[#f8f9fb] px-4 py-5 space-y-3 min-h-40">
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 w-fit max-w-[85%] text-sm">
              {form.welcome_message}
            </div>
          </div>

          <div className="border-t border-gray-200 p-3 flex items-center gap-2">
            <input
              disabled
              type="text"
              placeholder="Ask a question..."
              className="flex-1 min-w-0 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none bg-gray-50"
            />
            <button
              disabled
              style={{ backgroundColor: form.primary_color }}
              className="shrink-0 rounded-lg px-3 py-2 text-white text-sm"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeTab;
