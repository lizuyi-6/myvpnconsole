import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type StatusTone = "success" | "warning" | "danger" | "neutral";

const TONE_CLASSES: Record<StatusTone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  neutral: "bg-subtle",
};

/**
 * Minimal status indicator — a small dot, no pill, no badge.
 * `pulse` adds a slow "live" ring (aggregate network status only —
 * too noisy for per-row dots). Reduced-motion disables the animation.
 */
export function StatusDot({
  tone,
  pulse = false,
  className,
}: {
  tone: StatusTone;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block size-1.5 shrink-0 rounded-full",
        TONE_CLASSES[tone],
        pulse && tone === "success" && "animate-status-pulse",
        className,
      )}
    />
  );
}

/** Dot + label in one row */
export function StatusText({
  tone,
  children,
  className,
}: {
  tone: StatusTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-[13px] text-muted",
        className,
      )}
    >
      <StatusDot tone={tone} />
      <span className="text-foreground">{children}</span>
    </span>
  );
}
