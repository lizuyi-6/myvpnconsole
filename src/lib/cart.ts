import { findProductBySlug } from "@/mocks/products";
import { round2, unitPriceFor } from "@/lib/pricing";
import type { CartItem, OrderItem, Product, ProductPlan } from "@/types";

export interface ResolvedCartItem {
  key: string;
  product: Product;
  plan: ProductPlan;
  quantity: number;
  /** Plan-adjusted price before volume discount */
  listUnitPrice: number;
  /** Unit price after volume tier */
  unitPrice: number;
  lineTotal: number;
  lineListTotal: number;
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  total: number;
  itemCount: number;
}

export function cartItemKey(item: Pick<CartItem, "productSlug" | "planId">) {
  return `${item.productSlug}:${item.planId}`;
}

/** Join raw cart items with catalog data and compute live tier pricing. */
export function resolveCartItems(items: CartItem[]): ResolvedCartItem[] {
  const resolved: ResolvedCartItem[] = [];
  for (const item of items) {
    const product = findProductBySlug(item.productSlug);
    if (!product) continue;
    const plan =
      product.plans.find((p) => p.id === item.planId) ?? product.plans[0];
    const listUnitPrice = unitPriceFor(plan.priceFactor, 1, product.tiers);
    const unitPrice = unitPriceFor(
      plan.priceFactor,
      item.quantity,
      product.tiers,
    );
    resolved.push({
      key: cartItemKey(item),
      product,
      plan,
      quantity: item.quantity,
      listUnitPrice,
      unitPrice,
      lineTotal: round2(unitPrice * item.quantity),
      lineListTotal: round2(listUnitPrice * item.quantity),
    });
  }
  return resolved;
}

export function cartTotals(items: ResolvedCartItem[]): CartTotals {
  const subtotal = round2(items.reduce((s, i) => s + i.lineListTotal, 0));
  const total = round2(items.reduce((s, i) => s + i.lineTotal, 0));
  return {
    subtotal,
    discount: round2(Math.max(0, subtotal - total)),
    total,
    itemCount: items.reduce((s, i) => s + i.quantity, 0),
  };
}

export function toOrderItems(items: ResolvedCartItem[]): OrderItem[] {
  return items.map((item) => ({
    productSlug: item.product.slug,
    name: item.product.name,
    category: item.product.category,
    planLabel: item.plan.label,
    quantity: item.quantity,
    listUnitPrice: item.listUnitPrice,
    unitPrice: item.unitPrice,
  }));
}
