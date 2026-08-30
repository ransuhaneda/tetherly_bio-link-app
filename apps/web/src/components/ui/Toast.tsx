import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import sty from './Toast.module.scss';

type ToastKind = 'success' | 'error';
type Toast = { id: number; message: string; kind: ToastKind };
type ToastContextValue = {
  showToast: (message: string, kind?: ToastKind) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const dismiss = useCallback((id: number) => {
    setToasts(current => current.filter(toast => toast.id !== id));
  }, []);
  const showToast = useCallback(
    (message: string, kind: ToastKind = 'success') => {
      setToasts(current => {
        const duplicate = current.find(toast => toast.message === message);
        if (duplicate)
          return current.map(toast =>
            toast.id === duplicate.id ? { ...toast, kind } : toast
          );
        const next = [...current, { id: Date.now(), message, kind }].slice(-3);
        return next;
      });
      if (kind === 'success') {
        window.setTimeout(() => {
          setToasts(current =>
            current.filter(toast => toast.message !== message)
          );
        }, 4000);
      }
    },
    []
  );
  const value = useMemo(() => ({ showToast }), [showToast]);
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={sty.region} aria-label="Notifications">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`${sty.toast} ${sty[toast.kind]}`}
            role={toast.kind === 'error' ? 'alert' : 'status'}
            aria-live="polite"
          >
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss notification"
            >
              Dismiss
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider');
  return context;
}

export type { ToastKind };
