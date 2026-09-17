import { brand } from "@/config/brand";
import { cn } from "@/lib/utils";

/**
 * Brand logo: minimal geometric mark + wordmark.
 * Swap `brand.name` in src/config/brand.ts to rebrand.
 */
export function Logo({
  className,
  markOnly = false,
}: {
  className?: string;
  markOnly?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        className="shrink-0"
      >
        <path
          d="M12 2 L21 12 L12 22 L3 12 Z"
          stroke="rgb(var(--primary))"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="2.5" fill="rgb(var(--primary))" />
      </svg>
      {!markOnly && (
        <span className="text-[15px] font-semibold tracking-[0.18em] text-foreground">
          {brand.name}
        </span>
      )}
    </span>
  );
}
