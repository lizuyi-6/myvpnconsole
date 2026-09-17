import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { MAX_QUANTITY } from "@/store/cart";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = MAX_QUANTITY,
  className,
}: QuantityStepperProps) {
  const clamp = (n: number) => Math.min(max, Math.max(min, Math.floor(n) || min));

  return (
    <div
      className={cn(
        "inline-flex h-10 items-center rounded-lg border border-border bg-surface",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => onChange(clamp(value - 1))}
        className="flex h-full w-10 items-center justify-center rounded-l-lg text-muted transition-colors hover:bg-white/5 hover:text-foreground focus-ring disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted"
      >
        <Minus className="size-4" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        aria-label="Quantity"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(clamp(Number(e.target.value)))}
        onBlur={(e) => onChange(clamp(Number(e.target.value)))}
        className="h-full w-14 border-x border-border bg-transparent text-center text-sm font-medium tabular-nums text-foreground focus-ring [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(clamp(value + 1))}
        className="flex h-full w-10 items-center justify-center rounded-r-lg text-muted transition-colors hover:bg-white/5 hover:text-foreground focus-ring disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
