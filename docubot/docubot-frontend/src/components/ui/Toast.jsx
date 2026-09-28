import React, { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);
let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message, type = "info") => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => remove(id), 4000);
    },
    [remove]
  );

  const toast = {
    success: (msg) => push(msg, "success"),
    error: (msg) => push(msg, "error"),
    info: (msg) => push(msg, "info"),
  };

  const icons = {
    success: <CheckCircle2 size={18} className="text-[#16804a] shrink-0" />,
    error: <XCircle size={18} className="text-red-600 shrink-0" />,
    info: <Info size={18} className="text-[#2454ff] shrink-0" />,
  };

  const styles = {
    success: "border-[#b7ecd0] bg-[#e6f7ef]",
    error: "border-red-200 bg-red-50",
    info: "border-[#c7d4ff] bg-[#eef1ff]",
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start gap-2.5 border rounded-lg px-4 py-3 shadow-md text-sm text-[#121826] ${styles[t.type]}`}
          >
            {icons[t.type]}
            <p className="flex-1">{t.message}</p>
            <button
              onClick={() => remove(t.id)}
              className="text-[#8791a3] hover:text-[#121826] shrink-0"
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
