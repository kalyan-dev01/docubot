import React from "react";
import Modal from "./Modal";
import { AlertTriangle } from "lucide-react";

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description,
  confirmLabel = "Delete",
  loading = false,
  danger = true,
}) => {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="flex gap-3">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
            danger ? "bg-red-50 text-red-600" : "bg-[#eef1ff] text-[#2454ff]"
          }`}
        >
          <AlertTriangle size={18} />
        </div>
        <p className="text-sm text-[#4b5468] mt-1">{description}</p>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 rounded-lg text-sm font-medium border border-[#d7dbe1] hover:bg-gray-50 transition disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition disabled:opacity-50 ${
            danger ? "bg-red-600 hover:bg-red-700" : "bg-[#2454ff] hover:bg-[#1b3fd1]"
          }`}
        >
          {loading ? "Please wait…" : confirmLabel}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
