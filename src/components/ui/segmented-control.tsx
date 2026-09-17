import { cn } from "@/lib/utils";

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  "aria-label": string;
  className?: string;
}

/**
 * Compact segmented control used for filters and plan selection.
 * Keyboard accessible via roving focus of native buttons in a radiogroup.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
  ...aria
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      {...aria}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-lg border border-border bg-background p-0.5",
        className,
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "h-8 rounded-md px-3 text-[13px] font-medium transition-colors duration-150 focus-ring",
              active
                ? "bg-surface text-foreground shadow-sm"
                : "text-subtle hover:text-muted",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
