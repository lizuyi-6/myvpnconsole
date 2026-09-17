import { brand } from "@/config/brand";
import { cn } from "@/lib/utils";

/**
 * Brand logo: minimal geometric mark + wordmark.
 * Swap `brand.name` in src/config/brand.ts to rebrand.
 * `dark` renders the wordmark for dark (navy) surfaces.
 */
export function Logo({
  className,
  markOnly = false,
  dark = false,
}: {
  className?: string;
  markOnly?: boolean;
  dark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        width="22"
        height="22"
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
        <span
          className={cn(
            "text-base font-semibold tracking-[0.18em]",
            dark ? "text-navy-foreground" : "text-foreground",
          )}
        >
          {brand.name}
        </span>
      )}
    </span>
  );
}
