import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Page header — title left, actions right. The desktop pattern that
 * replaces stacked title-above-content layouts.
 */
export function PageHeader({
  title,
  description,
  actions,
  size = "md",
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  /** "md" for console pages, "lg" for public marketing pages */
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-x-6 gap-y-4",
        className,
      )}
    >
      <div className="min-w-0">
        <h1
          className={cn(
            "font-semibold tracking-tight text-foreground",
            size === "lg"
              ? "text-3xl md:text-4xl"
              : "text-2xl md:text-[1.75rem]",
          )}
        >
          {title}
        </h1>
        {description && (
          <p
            className={cn(
              "mt-2 leading-relaxed text-muted",
              size === "lg" ? "max-w-xl text-base" : "max-w-2xl text-sm",
            )}
          >
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
