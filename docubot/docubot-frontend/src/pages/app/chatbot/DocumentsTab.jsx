import React, { useCallback, useEffect, useRef, useState } from "react";
import { documentApi } from "../../../services/documentApi";
import { useToast } from "../../../components/ui/Toast";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import { Skeleton, ErrorState, EmptyState, StatusBadge } from "../../../components/ui/States";
import { FileText, Loader2, Trash2, UploadCloud } from "lucide-react";

const MAX_MB = 25;

const DocumentsTab = ({ chatbot }) => {
  const toast = useToast();
  const fileInputRef = useRef(null);

  const [docs, setDocs] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await documentApi.list();
      setDocs((res?.data || []).filter((d) => d.chatbot?._id === chatbot._id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [chatbot._id]);

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, [load]);

  const validateFile = (file) => {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return "Only PDF files are supported.";
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      return `File is too large (max ${MAX_MB}MB).`;
    }
    return null;
  };

  const handleFile = async (file) => {
    const validationError = validateFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setUploading(true);
    try {
      const res = await documentApi.upload(chatbot._id, file);
      toast.success("Document uploaded and processed");
      setDocs((prev) => [res.document, ...(prev || [])]);
    } catch (err) {
      toast.error(err.message || "Upload failed");
      // The document row may still have been created server-side (status "failed") -
      // refresh so it shows up rather than silently disappearing.
      load();
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

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

  return (
    <div>
      {/* Upload dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
          dragOver ? "border-[#2454ff] bg-[#eef1ff]" : "border-[#d7dbe1] bg-white"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />

        <div className="w-11 h-11 rounded-full bg-[#eef1ff] text-[#2454ff] flex items-center justify-center mx-auto mb-3">
          {uploading ? <Loader2 size={20} className="animate-spin" /> : <UploadCloud size={20} />}
        </div>

        <p className="text-sm font-medium text-[#344054]">
          {uploading
            ? "Uploading and processing your document…"
            : "Drag & drop a PDF here, or"}
        </p>

        {!uploading && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 text-sm font-medium text-[#2454ff] hover:underline"
          >
            browse files
          </button>
        )}

        <p className="text-xs text-[#98a2b3] mt-2">
          PDF only, up to {MAX_MB}MB. Processing happens as part of the upload,
          so this may take a moment for larger files.
        </p>
      </div>

      {/* Document list */}
      <div className="mt-6">
        {error && <ErrorState message={error} onRetry={load} />}

        {!error && loading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        )}

        {!error && !loading && docs.length === 0 && (
          <EmptyState
            icon={FileText}
            title="No documents yet"
            description="Upload a PDF above so this chatbot has something to answer questions from."
          />
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
                  <p className="text-xs text-[#98a2b3]">
                    {new Date(doc.createdAt).toLocaleString()}
                  </p>
                </div>
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

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete document"
        description={`This removes "${deleteTarget?.filename}" and its data from the RAG index.`}
      />
    </div>
  );
};

export default DocumentsTab;
