'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  type?: ToastType;
}

interface ToastContextValue {
  toast: (options: { title: string; description?: string; type?: ToastType }) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, type = 'success' }: { title: string; description?: string; type?: ToastType }) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newToast: ToastItem = { id, title, description, type };
      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none p-2 sm:p-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-xl backdrop-blur-md transition-all animate-in slide-in-from-bottom-2 fade-in duration-200 ${
              t.type === 'success'
                ? 'bg-zinc-900/95 border-emerald-500/30 text-zinc-100 shadow-emerald-500/5'
                : t.type === 'error'
                ? 'bg-zinc-900/95 border-rose-500/30 text-zinc-100 shadow-rose-500/5'
                : t.type === 'warning'
                ? 'bg-zinc-900/95 border-amber-500/30 text-zinc-100 shadow-amber-500/5'
                : 'bg-zinc-900/95 border-indigo-500/30 text-zinc-100 shadow-indigo-500/5'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {t.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
              {t.type === 'error' && <AlertCircle className="h-5 w-5 text-rose-400" />}
              {t.type === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-400" />}
              {t.type === 'info' && <Info className="h-5 w-5 text-indigo-400" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-zinc-100">{t.title}</div>
              {t.description && (
                <div className="mt-0.5 text-[11px] text-zinc-400 leading-relaxed">{t.description}</div>
              )}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="shrink-0 rounded p-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
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
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
