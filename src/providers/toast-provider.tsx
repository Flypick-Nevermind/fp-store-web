"use client";

import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import type React from "react";
import { createContext, useCallback, useContext, useState } from "react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  showToast: (title: string, message?: string, type?: ToastType) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (title: string, message?: string, type: ToastType = "info") => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, title, message, type }]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast],
  );

  const success = useCallback(
    (title: string, message?: string) => showToast(title, message, "success"),
    [showToast],
  );
  const error = useCallback(
    (title: string, message?: string) => showToast(title, message, "error"),
    [showToast],
  );
  const info = useCallback(
    (title: string, message?: string) => showToast(title, message, "info"),
    [showToast],
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error, info }}>
      {children}
      {/* Toast container floating top right */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-none border-2 shadow-[4px_4px_0px_0px_#1A1A24] bg-white transition-all transform animate-in slide-in-from-top-2 ${
              toast.type === "success"
                ? "border-[#2323FF] bg-[#FFF8E1]"
                : toast.type === "error"
                  ? "border-red-600 bg-red-50"
                  : "border-[#1A1A24] bg-white"
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === "success" && (
                <CheckCircle2 className="w-5 h-5 text-[#2323FF]" />
              )}
              {toast.type === "error" && (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              {toast.type === "info" && (
                <Info className="w-5 h-5 text-[#2323FF]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-xs uppercase tracking-wider font-bold text-[#1A1A24]">
                {toast.title}
              </p>
              {toast.message && (
                <p className="text-xs text-[#1A1A24]/80 mt-0.5 font-sans">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-[#1A1A24]/60 hover:text-[#1A1A24] p-1 -mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
