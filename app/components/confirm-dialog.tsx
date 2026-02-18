"use client";

import { useState, useCallback, type ReactNode, createContext, useContext } from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

interface ConfirmContextType {
  showConfirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) throw new Error("useConfirm must be used within ConfirmProvider");
  return context;
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<{
    options: ConfirmOptions;
    resolve: (value: boolean) => void;
  } | null>(null);

  const showConfirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialog({ options, resolve });
    });
  }, []);

  const handleConfirm = () => {
    dialog?.resolve(true);
    setDialog(null);
  };

  const handleCancel = () => {
    dialog?.resolve(false);
    setDialog(null);
  };

  return (
    <ConfirmContext.Provider value={{ showConfirm }}>
      {children}
      {dialog && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCancel}
          />
          <div className="relative bg-gray-900 border border-gray-700/50 rounded-2xl shadow-2xl p-5 sm:p-6 w-full max-w-sm animate-scale-up">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
              </div>
              <div className="flex-1 pt-0.5 sm:pt-1">
                <h3 className="text-base sm:text-lg font-semibold text-white">
                  {dialog.options.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  {dialog.options.message}
                </p>
              </div>
            </div>
            <div className="flex gap-2.5 sm:gap-3 mt-5 sm:mt-6">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 active:bg-gray-600 border border-gray-700 rounded-xl transition-colors"
              >
                {dialog.options.cancelText || "Cancel"}
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-500 active:bg-red-700 rounded-xl transition-colors"
              >
                {dialog.options.confirmText || "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
