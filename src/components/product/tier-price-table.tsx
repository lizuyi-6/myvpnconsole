import { tierRangeLabel } from "@/lib/pricing";
import { cn, formatCurrency } from "@/lib/utils";
import type { PriceTier } from "@/types";

interface TierPriceTableProps {
  tiers: PriceTier[];
  planFactor: number;
  activeQuantity: number;
}

/**
 * Volume pricing table. The row matching the current quantity is highlighted.
 */
export function TierPriceTable({
  tiers,
  planFactor,
  activeQuantity,
}: TierPriceTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="grid grid-cols-2 gap-2 border-b border-border bg-white/[0.02] px-4 py-2 text-xs font-medium uppercase tracking-wide text-subtle">
        <span>Quantity</span>
        <span className="text-right">Per item</span>
      </div>
      {tiers.map((tier) => {
        const active =
          activeQuantity >= tier.min &&
          (tier.max === null || activeQuantity <= tier.max);
        return (
          <div
            key={tierRangeLabel(tier)}
            className={cn(
              "grid grid-cols-2 gap-2 px-4 py-2.5 text-sm transition-colors duration-150",
              active
                ? "bg-primary/[0.08] text-foreground"
                : "text-muted",
            )}
            aria-current={active || undefined}
          >
            <span className="tabular-nums">{tierRangeLabel(tier)}</span>
            <span className="text-right font-medium tabular-nums">
              {formatCurrency(tier.price * planFactor)}
              {active && (
                <span className="ml-2 text-xs font-normal text-primary">
                  current
                </span>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
