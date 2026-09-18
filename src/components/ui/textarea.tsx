import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[96px] w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-subtle transition-colors duration-150 hover:border-subtle/60 focus-ring disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border aria-[invalid=true]:border-danger/60 aria-[invalid=true]:hover:border-danger/80",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
