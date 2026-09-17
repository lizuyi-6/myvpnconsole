import { ArrowLeft, ArrowRight, ShoppingCart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/feedback/empty-state";
import { Container } from "@/components/layout/container";
import { ProductIconTile } from "@/components/product/product-icon-tile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { cartTotals, resolveCartItems } from "@/lib/cart";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { CATEGORY_LABELS } from "@/types";

export function CartPage() {
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const resolved = resolveCartItems(items);
  const totals = cartTotals(resolved);

  if (resolved.length === 0) {
    return (
      <Container className="py-12 md:py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Cart
        </h1>
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          message="Browse the catalog and add products — volume pricing applies automatically."
          className="mt-8"
          action={
            <Button asChild>
              <Link to="/products">Browse products</Link>
            </Button>
          }
        />
      </Container>
    );
  }

  return (
    <Container className="py-12 md:py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        Cart
      </h1>
      <p className="mt-1.5 text-sm text-muted">
        {totals.itemCount} item{totals.itemCount === 1 ? "" : "s"} · volume
        pricing updates automatically as you change quantities.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Items */}
        <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
          {resolved.map((item) => (
            <li key={item.key} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <ProductIconTile
                  icon={item.product.icon}
                  accent={item.product.accent}
                />
                <div className="min-w-0">
                  <Link
                    to={`/products/${item.product.slug}`}
                    className="text-[15px] font-medium text-foreground hover:text-primary focus-ring rounded-sm"
                  >
                    {item.product.name}
                  </Link>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-subtle">
                    <Badge variant="neutral">{CATEGORY_LABELS[item.product.category]}</Badge>
                    Plan: {item.plan.label}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <QuantityStepper
                  value={item.quantity}
                  onChange={(qty) =>
                    setQuantity(item.product.slug, item.plan.id, qty)
                  }
                />
                <div className="w-28 text-right">
                  <p className="text-sm font-semibold tabular-nums text-foreground">
                    {formatCurrency(item.lineTotal)}
                  </p>
                  <p className="text-xs text-subtle">
                    {formatCurrency(item.unitPrice)} / item
                    {item.unitPrice < item.listUnitPrice && (
                      <span className="ml-1 text-success">
                        −{formatCurrency(item.lineListTotal - item.lineTotal)}
                      </span>
                    )}
                  </p>
                </div>
                <button
                  aria-label={`Remove ${item.product.name} from cart`}
                  onClick={() => removeItem(item.product.slug, item.plan.id)}
                  className="rounded-lg p-2 text-subtle transition-colors hover:bg-white/5 hover:text-danger focus-ring"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Summary */}
        <aside className="h-fit rounded-xl border border-border bg-surface p-6 lg:sticky lg:top-24">
          <h2 className="text-[15px] font-semibold text-foreground">
            Order summary
          </h2>
          <dl className="mt-4 space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="tabular-nums text-foreground">
                {formatCurrency(totals.subtotal)}
              </dd>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted">Volume discount</dt>
                <dd className="tabular-nums text-success">
                  −{formatCurrency(totals.discount)}
                </dd>
              </div>
            )}
            <div className="flex justify-between border-t border-border pt-3 text-base">
              <dt className="font-medium text-foreground">Total</dt>
              <dd className="font-semibold tabular-nums text-foreground">
                {formatCurrency(totals.total)}
              </dd>
            </div>
          </dl>

          <Button asChild className="mt-6 w-full" size="lg">
            <Link to="/checkout">
              Checkout
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="mt-2 w-full">
            <Link to="/products">
              <ArrowLeft className="size-4" />
              Continue shopping
            </Link>
          </Button>
        </aside>
      </div>
    </Container>
  );
}
