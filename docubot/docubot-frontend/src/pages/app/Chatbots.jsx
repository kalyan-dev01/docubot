import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { chatbotApi } from "../../services/chatbotApi";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { Skeleton, ErrorState, EmptyState, StatusBadge } from "../../components/ui/States";
import { useToast } from "../../components/ui/Toast";
import { Bot, Loader2, Search, Trash2 } from "lucide-react";

const INDUSTRIES = [
  "Software / SaaS",
  "E-commerce",
  "Healthcare",
  "Finance",
  "Education",
  "Real Estate",
  "Other",
];

const CreateChatbotForm = ({ onCreated, onClose }) => {
  const toast = useToast();
  const [form, setForm] = useState({
    name: "",
    description: "",
    industry: INDUSTRIES[0],
    language: "English",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Chatbot name is required";
    if (!form.industry) next.industry = "Industry is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await chatbotApi.create(form);
      toast.success("Chatbot created");
      onCreated(res?.data);
    } catch (err) {
      toast.error(err.message || "Failed to create chatbot");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#4b5468] mb-1.5">
          Chatbot name
        </label>
        <input
          value={form.name}
          onChange={update("name")}
          placeholder="e.g. Support Bot"
          className={`w-full border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-1 ${
            errors.name
              ? "border-red-400 focus:border-red-400 focus:ring-red-400"
              : "border-[#d7dbe1] focus:border-[#2454ff] focus:ring-[#2454ff]"
          }`}
        />
        {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-[#4b5468] mb-1.5">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={update("description")}
          rows={2}
          placeholder="What does this chatbot help with?"
          className="w-full border border-[#d7dbe1] rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#2454ff] focus:ring-1 focus:ring-[#2454ff] resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-[#4b5468] mb-1.5">
            Industry
          </label>
          <select
            value={form.industry}
            onChange={update("industry")}
            className="w-full border border-[#d7dbe1] rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#2454ff] focus:ring-1 focus:ring-[#2454ff] bg-white"
          >
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#4b5468] mb-1.5">
            Language
          </label>
          <input
            value={form.language}
            onChange={update("language")}
            className="w-full border border-[#d7dbe1] rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#2454ff] focus:ring-1 focus:ring-[#2454ff]"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg text-sm font-medium border border-[#d7dbe1] hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-[#2454ff] text-white hover:bg-[#1b3fd1] transition disabled:opacity-60 flex items-center gap-2"
        >
          {submitting && <Loader2 size={15} className="animate-spin" />}
          {submitting ? "Creating…" : "Create Chatbot"}
        </button>
      </div>
    </form>
  );
};

const Chatbots = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [chatbots, setChatbots] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await chatbotApi.list();
      setChatbots(res?.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!chatbots) return [];
    if (!query.trim()) return chatbots;
    const q = query.toLowerCase();
    return chatbots.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.industry?.toLowerCase().includes(q)
    );
  }, [chatbots, query]);

  const handleCreated = (chatbot) => {
    setCreateOpen(false);
    if (chatbot?._id) {
      // Backend now returns the created chatbot's data - go straight to it.
      navigate(`/chatbots/${chatbot._id}`);
    } else {
      load();
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await chatbotApi.remove(deleteTarget._id);
      toast.success("Chatbot deleted");
      setChatbots((prev) => prev.filter((c) => c._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete chatbot");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout title="Chatbots">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg md:text-2xl font-extrabold text-[#07142f]">
              My Chatbots
            </h1>
            <p className="mt-1 text-[10px] md:text-sm text-[#667085]">
              {chatbots ? `${chatbots.length} chatbot${chatbots.length === 1 ? "" : "s"} in your workspace` : "Loading…"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98a2b3]"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search chatbots..."
                className="h-10 pl-9 pr-3 w-52 rounded-lg border border-[#d7dbe1] text-sm outline-none focus:border-[#2454ff] focus:ring-1 focus:ring-[#2454ff]"
              />
            </div>

            <button
              onClick={() => setCreateOpen(true)}
              className="border px-4 py-2.5 rounded-lg bg-[#2454ff] hover:bg-[#1b3fd1] cursor-pointer text-white text-sm font-semibold whitespace-nowrap"
            >
              + Create Chatbot
            </button>
          </div>
        </div>

        <div className="mt-6">
          {error && <ErrorState message={error} onRetry={load} />}

          {!error && loading && (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border border-[#e6e8ec] rounded-xl p-5 bg-white">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-full mt-3" />
                  <Skeleton className="h-4 w-20 mt-4" />
                </div>
              ))}
            </div>
          )}

          {!error && !loading && filtered.length === 0 && (
            <div className="border border-[#e6e8ec] rounded-xl bg-white">
              <EmptyState
                icon={Bot}
                title={query ? "No chatbots match your search" : "No chatbots yet"}
                description={
                  query
                    ? "Try a different search term."
                    : "Create your first chatbot to start uploading documents and chatting with them."
                }
                action={
                  !query && (
                    <button
                      onClick={() => setCreateOpen(true)}
                      className="px-4 py-2.5 rounded-lg bg-[#2454ff] hover:bg-[#1b3fd1] text-white text-sm font-semibold"
                    >
                      + Create Chatbot
                    </button>
                  )
                }
              />
            </div>
          )}

          {!error && !loading && filtered.length > 0 && (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((bot) => (
                <div
                  key={bot._id}
                  className="border border-[#e6e8ec] rounded-xl p-5 bg-white hover:border-[#c7d4ff] transition flex flex-col"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold shrink-0"
                      style={{ backgroundColor: bot.customization?.primary_color || "#2454ff" }}
                    >
                      {bot.name?.charAt(0)?.toUpperCase() || "B"}
                    </div>
                    <button
                      onClick={() => setDeleteTarget(bot)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-[#98a2b3] hover:text-red-600 transition"
                      title="Delete chatbot"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <h3 className="mt-3 font-semibold text-[#07142f] truncate">
                    {bot.name}
                  </h3>
                  <p className="text-sm text-[#8791a3] mt-1 line-clamp-2 min-h-10">
                    {bot.description || bot.industry}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <StatusBadge status={bot.status} />
                    <button
                      onClick={() => navigate(`/chatbots/${bot._id}`)}
                      className="text-sm font-medium text-[#2454ff] hover:underline"
                    >
                      Open →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Chatbot">
        <CreateChatbotForm onCreated={handleCreated} onClose={() => setCreateOpen(false)} />
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete chatbot"
        description={`This permanently deletes "${deleteTarget?.name}". This does not delete its documents from the RAG index automatically - remove those first if needed.`}
      />
    </DashboardLayout>
  );
};

export default Chatbots;
