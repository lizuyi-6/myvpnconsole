import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

/**
 * Standard content panel — white surface, light border and shadow.
 * The primary building block of desktop layouts; pair with rails and
 * 12-column grids rather than stacking full-width cards.
 */
export function Panel({
  title,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-surface shadow-card",
        className,
      )}
    >
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 px-6 pt-6 lg:px-7 lg:pt-7">
          <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
          {action}
        </div>
      )}
      <div
        className={cn(
          "px-6 py-6 lg:px-7 lg:py-7",
          (title || action) && "pt-4 lg:pt-4",
          bodyClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}

/** Compact arrow link used in panel headers. */
export function PanelLink({
  to,
  children,
}: {
  to: string;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1 rounded-sm text-[13px] font-medium text-primary transition-colors hover:underline focus-ring"
    >
      {children}
      <ArrowRight className="size-3.5" />
    </Link>
  );
}
