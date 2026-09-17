import { ArrowRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { OrderStatusBadge } from "@/components/feedback/status-badges";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/hooks/use-async";
import { formatCurrency } from "@/lib/utils";
import { orderService } from "@/services/orders";

/**
 * Quiet, confident confirmation — no giant green checkmark.
 */
export function OrderSuccessPage() {
  const { orderId = "" } = useParams();
  const { data: order, loading, error } = useAsync(
    () => orderService.getOrder(orderId),
    [orderId],
  );

  return (
    <Container className="max-w-xl py-20 md:py-28">
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="mt-6 h-40 w-full rounded-xl" />
        </div>
      ) : error || !order ? (
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Order confirmed
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Your payment was received. We couldn't load the order summary here,
            but it's available in your dashboard.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button asChild>
              <Link to="/dashboard/orders">View orders</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <p className="font-mono text-xs tracking-widest text-success">
            ORDER CONFIRMED
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            Thank you, your order is in.
          </h1>
          <p className="mt-2 text-sm text-muted">
            Delivery is automated — items appear in your dashboard library
            within minutes.
          </p>

          <div className="mt-8 rounded-xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-subtle">Order</p>
                <p className="mt-0.5 font-mono text-sm font-medium text-foreground">
                  {order.number}
                </p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>

            <dl className="mt-5 grid grid-cols-3 gap-4 border-t border-border pt-5">
              <div>
                <dt className="text-xs text-subtle">Items</dt>
                <dd className="mt-0.5 text-sm font-medium tabular-nums text-foreground">
                  {order.items.reduce((s, i) => s + i.quantity, 0)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-subtle">Products</dt>
                <dd className="mt-0.5 truncate text-sm font-medium text-foreground">
                  {order.items.map((i) => i.name).join(", ")}
                </dd>
              </div>
              <div className="text-right">
                <dt className="text-xs text-subtle">Total</dt>
                <dd className="mt-0.5 text-sm font-semibold tabular-nums text-foreground">
                  {formatCurrency(order.total)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="flex-1">
              <Link to={`/dashboard/orders/${order.id}`}>
                View order
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" className="flex-1">
              <Link to="/dashboard">Go to dashboard</Link>
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
}
