import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ToastTone = "success" | "info" | "danger";

interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  /** Show a transient confirmation. Screen readers announce it (role=status). */
  toast: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/* Meaning comes from the icon shape, not color alone (HIG). */
const TONE_ICON: Record<ToastTone, typeof CheckCircle2> = {
  success: CheckCircle2,
  info: Info,
  danger: AlertCircle,
};

const MAX_VISIBLE = 3;
const DURATION_MS = 3200;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const toast = useCallback((message: string, tone: ToastTone = "success") => {
    const id = ++nextId.current;
    setToasts((current) => [...current.slice(-(MAX_VISIBLE - 1)), { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, DURATION_MS);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-5 z-[70] flex flex-col items-center gap-2 px-4 sm:bottom-6"
      >
        {toasts.map((item) => {
          const Icon = TONE_ICON[item.tone];
          return (
            <div
              key={item.id}
              role="status"
              className="pointer-events-auto flex max-w-md animate-content-in items-center gap-2.5 rounded-lg bg-navy px-4 py-2.5 text-sm text-navy-foreground shadow-panel"
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {item.message}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
