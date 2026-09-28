import React from "react";
import { X } from "lucide-react";

const Modal = ({ open, onClose, title, children, maxWidth = "max-w-md" }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div
        className={`relative bg-white rounded-xl shadow-xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e6e8ec]">
          <h3 className="font-semibold text-[#07142f]">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-[#667085]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
