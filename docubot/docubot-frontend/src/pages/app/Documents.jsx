import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { documentApi } from "../../services/documentApi";
import { chatbotApi } from "../../services/chatbotApi";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Modal from "../../components/ui/Modal";
import { useToast } from "../../components/ui/Toast";
import { Skeleton, ErrorState, EmptyState, StatusBadge } from "../../components/ui/States";
import { FileText, Loader2, Trash2, UploadCloud } from "lucide-react";

const UploadModal = ({ open, onClose, chatbots, onUploaded }) => {
  const toast = useToast();
  const [chatbotId, setChatbotId] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const selectedChatbotId = chatbotId || chatbots?.[0]?._id || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedChatbotId) {
      toast.error("Choose a chatbot first");
      return;
    }
    if (!file) {
      toast.error("Choose a PDF file first");
      return;
    }
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Only PDF files are supported");
      return;
    }

    setUploading(true);
    try {
      const res = await documentApi.upload(selectedChatbotId, file);
      toast.success("Document uploaded and processed");
      onUploaded(res.document);
      setFile(null);
      onClose();
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Upload document">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#4b5468] mb-1.5">
            Chatbot
          </label>
          <select
            value={selectedChatbotId}
            onChange={(e) => setChatbotId(e.target.value)}
            className="w-full border border-[#d7dbe1] rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#2454ff] focus:ring-1 focus:ring-[#2454ff] bg-white"
          >
            {chatbots?.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#4b5468] mb-1.5">
            PDF file
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-sm border border-[#d7dbe1] rounded-lg px-3.5 py-2.5 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-[#eef1ff] file:text-[#2454ff] file:text-sm"
          />
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
            disabled={uploading}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-[#2454ff] text-white hover:bg-[#1b3fd1] transition disabled:opacity-60 flex items-center gap-2"
          >
            {uploading && <Loader2 size={15} className="animate-spin" />}
            {uploading ? "Uploading…" : "Upload"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const Documents = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [docs, setDocs] = useState(null);
  const [chatbots, setChatbots] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [docRes, cbRes] = await Promise.all([
        documentApi.list(),
        chatbotApi.list(),
      ]);
      setDocs(docRes?.data || []);
      setChatbots(cbRes?.data || []);
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

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await documentApi.remove(deleteTarget._id);
      toast.success("Document deleted");
      setDocs((prev) => prev.filter((d) => d._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete document");
    } finally {
      setDeleting(false);
    }
  };

  const hasChatbots = chatbots.length > 0;

  return (
    <DashboardLayout title="Documents">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg md:text-2xl font-extrabold text-[#07142f]">
              Documents
            </h1>
            <p className="mt-1 text-[10px] md:text-sm text-[#667085]">
              {docs ? `${docs.length} document${docs.length === 1 ? "" : "s"} across all chatbots` : "Loading…"}
            </p>
          </div>

          <button
            onClick={() => setUploadOpen(true)}
            disabled={!hasChatbots}
            title={!hasChatbots ? "Create a chatbot first" : undefined}
            className="border px-4 py-2.5 rounded-lg bg-[#2454ff] hover:bg-[#1b3fd1] cursor-pointer text-white text-sm font-semibold whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <UploadCloud size={15} /> Upload Document
          </button>
        </div>

        <div className="mt-6">
          {error && <ErrorState message={error} onRetry={load} />}

          {!error && loading && (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          )}

          {!error && !loading && docs.length === 0 && (
            <div className="border border-[#e6e8ec] rounded-xl bg-white">
              <EmptyState
                icon={FileText}
                title={hasChatbots ? "No documents yet" : "Create a chatbot first"}
                description={
                  hasChatbots
                    ? "Upload a PDF to a chatbot so it has something to answer questions from."
                    : "Documents belong to a chatbot - create one before uploading."
                }
                action={
                  hasChatbots ? (
                    <button
                      onClick={() => setUploadOpen(true)}
                      className="px-4 py-2.5 rounded-lg bg-[#2454ff] hover:bg-[#1b3fd1] text-white text-sm font-semibold"
                    >
                      Upload Document
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate("/chatbots")}
                      className="px-4 py-2.5 rounded-lg bg-[#2454ff] hover:bg-[#1b3fd1] text-white text-sm font-semibold"
                    >
                      Create Chatbot
                    </button>
                  )
                }
              />
            </div>
          )}

          {!error && !loading && docs.length > 0 && (
            <div className="border border-[#e6e8ec] rounded-xl bg-white divide-y divide-[#e6e8ec] overflow-hidden">
              {docs.map((doc) => (
                <div key={doc._id} className="flex items-center gap-3 px-4 py-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#f2f4f7] flex items-center justify-center text-[#667085] shrink-0">
                    <FileText size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#07142f] truncate">
                      {doc.filename}
                    </p>
                    <button
                      onClick={() => doc.chatbot?._id && navigate(`/chatbots/${doc.chatbot._id}/documents`)}
                      className="text-xs text-[#2454ff] hover:underline"
                    >
                      {doc.chatbot?.name || "Unknown chatbot"}
                    </button>
                  </div>
                  <p className="text-xs text-[#98a2b3] hidden sm:block">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                  <StatusBadge status={doc.status} />
                  <button
                    onClick={() => setDeleteTarget(doc)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-[#98a2b3] hover:text-red-600 transition shrink-0"
                    title="Delete document"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        chatbots={chatbots}
        onUploaded={(doc) => setDocs((prev) => [doc, ...prev])}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete document"
        description={`This removes "${deleteTarget?.filename}" and its data from the RAG index.`}
      />
    </DashboardLayout>
  );
};

export default Documents;
