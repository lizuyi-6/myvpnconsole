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
 */
export function StatusDot({
  tone,
  className,
}: {
  tone: StatusTone;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block size-1.5 shrink-0 rounded-full",
        TONE_CLASSES[tone],
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
