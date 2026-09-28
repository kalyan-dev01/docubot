import React from "react";
import { Loader2, Inbox, AlertCircle } from "lucide-react";

export const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-[#eef0f3] rounded-md ${className}`} />
);

export const Spinner = ({ size = 18, className = "" }) => (
  <Loader2 size={size} className={`animate-spin ${className}`} />
);

export const EmptyState = ({ icon: Icon = Inbox, title, description, action }) => (
  <div className="flex flex-col items-center justify-center text-center py-14 px-6">
    <div className="w-12 h-12 rounded-full bg-[#f2f4f7] flex items-center justify-center text-[#98a2b3] mb-4">
      <Icon size={22} />
    </div>
    <p className="font-semibold text-[#07142f]">{title}</p>
    {description && (
      <p className="text-sm text-[#8791a3] mt-1.5 max-w-sm">{description}</p>
    )}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export const ErrorState = ({ message = "Something went wrong.", onRetry }) => (
  <div className="flex flex-col items-center justify-center text-center py-14 px-6">
    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4">
      <AlertCircle size={22} />
    </div>
    <p className="font-semibold text-[#07142f]">Couldn't load this</p>
    <p className="text-sm text-[#8791a3] mt-1.5 max-w-sm">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-5 text-sm font-medium text-[#2454ff] hover:underline"
      >
        Try again
      </button>
    )}
  </div>
);

export const StatusBadge = ({ status }) => {
  const map = {
    active: { dot: "bg-[#16804a]", bg: "bg-[#e6f7ef]", text: "text-[#16804a]" },
    ready: { dot: "bg-[#16804a]", bg: "bg-[#e6f7ef]", text: "text-[#16804a]" },
    draft: { dot: "bg-[#98a2b3]", bg: "bg-[#f2f4f7]", text: "text-[#475467]" },
    uploaded: { dot: "bg-[#98a2b3]", bg: "bg-[#f2f4f7]", text: "text-[#475467]" },
    processing: { dot: "bg-[#b54708]", bg: "bg-[#fff6e0]", text: "text-[#b54708]" },
    disabled: { dot: "bg-[#98a2b3]", bg: "bg-[#f2f4f7]", text: "text-[#475467]" },
    failed: { dot: "bg-red-600", bg: "bg-red-50", text: "text-red-600" },
  };
  const s = map[status] || map.draft;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${s.bg} ${s.text} text-xs font-medium capitalize`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
};
