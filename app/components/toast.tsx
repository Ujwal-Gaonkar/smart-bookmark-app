"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { CheckCircle2, Trash2, AlertCircle, X } from "lucide-react";

type ToastType = "success" | "error" | "delete";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0" />,
    error: <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0" />,
    delete: <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 flex-shrink-0" />,
  };

  const borders = {
    success: "border-emerald-500/30",
    error: "border-red-500/30",
    delete: "border-orange-500/30",
  };

  const glows = {
    success: "shadow-emerald-500/10",
    error: "shadow-red-500/10",
    delete: "shadow-orange-500/10",
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 z-50 flex flex-col gap-2 sm:gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-5 py-3 sm:py-3.5 rounded-xl border ${borders[toast.type]} bg-gray-900/95 backdrop-blur-xl shadow-2xl ${glows[toast.type]} animate-slide-up w-full sm:min-w-[280px] sm:max-w-[400px] sm:w-auto`}
          >
            {icons[toast.type]}
            <p className="text-xs sm:text-sm font-medium text-gray-100 flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0 p-0.5"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
