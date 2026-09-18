import { ChevronDown } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Styled native <select> — accessible by default, no portal issues.
 */
const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <div className="relative">
    <select
      ref={ref}
      className={cn(
        "h-10 w-full appearance-none rounded-lg border border-border bg-surface pl-3 pr-9 text-sm text-foreground transition-colors duration-150 hover:border-subtle/60 focus-ring disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border",
        className,
      )}
      {...props}
    >
      {children}
    </select>
    <ChevronDown
      aria-hidden
      className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-subtle"
    />
  </div>
));
Select.displayName = "Select";

export { Select };
