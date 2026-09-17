import type { PriceTier } from "@/types";

/** Find the pricing tier that applies to a quantity. */
export function tierForQuantity(tiers: PriceTier[], quantity: number): PriceTier {
  const match = tiers.find(
    (t) => quantity >= t.min && (t.max === null || quantity <= t.max),
  );
  return match ?? tiers[tiers.length - 1];
}

/** Unit price after plan multiplier and volume tier. */
export function unitPriceFor(
  planFactor: number,
  quantity: number,
  tiers: PriceTier[],
): number {
  const tier = tierForQuantity(tiers, quantity);
  return round2(tier.price * planFactor);
}

/** Human label for a tier, e.g. "5–19" or "50+". */
export function tierRangeLabel(tier: PriceTier): string {
  return tier.max === null ? `${tier.min}+` : `${tier.min}–${tier.max}`;
}

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
