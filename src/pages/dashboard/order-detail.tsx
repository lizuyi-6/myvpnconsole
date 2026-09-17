import { ArrowLeft, LifeBuoy, PackageCheck } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ErrorState } from "@/components/feedback/error-state";
import { OrderStatusBadge } from "@/components/feedback/status-badges";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/hooks/use-async";
import { formatCurrency, formatDate } from "@/lib/utils";
import { orderService } from "@/services/orders";
import { CATEGORY_LABELS, PAYMENT_METHOD_LABELS } from "@/types";

export function OrderDetailPage() {
  const { id = "" } = useParams();
  const { data: order, loading, error, retry } = useAsync(
    () => orderService.getOrder(id),
    [id],
  );

  if (loading) {
    return (
      <div>
        <Skeleton className="h-5 w-28" />
        <Skeleton className="mt-6 h-20 rounded-xl" />
        <Skeleton className="mt-4 h-48 rounded-xl" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div>
        <ErrorState
          title="Order not found"
          message="This order doesn't exist or failed to load."
          onRetry={retry}
        />
        <Button asChild variant="ghost" size="sm" className="mt-4">
          <Link to="/dashboard/orders">
            <ArrowLeft className="size-4" />
            Back to Orders
          </Link>
        </Button>
      </div>
    );
  }

  const delivered = order.status === "delivered" || order.status === "paid";

  return (
    <div className="max-w-2xl">
      <Button asChild variant="ghost" size="sm" className="-ml-3">
        <Link to="/dashboard/orders">
          <ArrowLeft className="size-4" />
          Orders
        </Link>
      </Button>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-mono text-lg font-semibold text-foreground">
            {order.number}
          </h1>
          <p className="mt-0.5 text-xs text-subtle">
            Placed {formatDate(order.createdAt)} · {order.contactEmail}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Items */}
      <section className="mt-6">
        <h2 className="text-[15px] font-semibold text-foreground">Items</h2>
        <ul className="mt-3 divide-y divide-border rounded-xl border border-border bg-surface">
          {order.items.map((item, i) => (
            <li key={i} className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-foreground">
                    {item.name}
                  </p>
                  <Badge variant="neutral">
                    {CATEGORY_LABELS[item.category]}
                  </Badge>
                </div>
                <p className="mt-0.5 text-xs text-subtle">
                  {item.planLabel} · {formatCurrency(item.unitPrice)} ×{" "}
                  {item.quantity}
                </p>
              </div>
              <p className="text-sm font-medium tabular-nums text-foreground">
                {formatCurrency(item.unitPrice * item.quantity)}
              </p>
            </li>
          ))}
        </ul>

        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="tabular-nums text-foreground">
              {formatCurrency(order.subtotal)}
            </dd>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted">Volume discount</dt>
              <dd className="tabular-nums text-success">
                −{formatCurrency(order.discount)}
              </dd>
            </div>
          )}
          <div className="flex justify-between border-t border-border pt-3">
            <dt className="font-medium text-foreground">Total</dt>
            <dd className="font-semibold tabular-nums text-foreground">
              {formatCurrency(order.total)}
            </dd>
          </div>
        </dl>
      </section>

      {/* Payment */}
      <section className="mt-8">
        <h2 className="text-[15px] font-semibold text-foreground">Payment</h2>
        <div className="mt-3 rounded-xl border border-border bg-surface px-5 py-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Method</span>
            <span className="text-foreground">
              {PAYMENT_METHOD_LABELS[order.paymentMethod]}
            </span>
          </div>
        </div>
      </section>

      {/* Delivery */}
      {delivered && (
        <section className="mt-8">
          <h2 className="text-[15px] font-semibold text-foreground">
            Delivery
          </h2>
          <div className="mt-3 flex items-start gap-3 rounded-xl border border-border bg-surface px-5 py-4">
            <PackageCheck className="mt-0.5 size-4 shrink-0 text-success" />
            <div className="text-sm">
              <p className="text-foreground">Delivered to your library</p>
              <p className="mt-0.5 text-muted">
                AI accounts are under{" "}
                <Link
                  to="/dashboard/products"
                  className="text-primary hover:underline focus-ring rounded-sm"
                >
                  My Products
                </Link>
                ; network services under{" "}
                <Link
                  to="/dashboard/subscriptions"
                  className="text-primary hover:underline focus-ring rounded-sm"
                >
                  Subscriptions
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Support entry */}
      <div className="mt-8 flex items-center justify-between rounded-xl border border-border bg-surface px-5 py-4">
        <div className="flex items-center gap-3">
          <LifeBuoy className="size-4 text-subtle" />
          <p className="text-sm text-muted">Something wrong with this order?</p>
        </div>
        <Button asChild variant="secondary" size="sm">
          <Link to={`/dashboard/support?order=${order.number}`}>
            Create ticket
          </Link>
        </Button>
      </div>
    </div>
  );
}
