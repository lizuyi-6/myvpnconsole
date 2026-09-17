import { ListOrdered } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { OrderStatusBadge } from "@/components/feedback/status-badges";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAsync } from "@/hooks/use-async";
import { formatCurrency, formatDate } from "@/lib/utils";
import { orderService } from "@/services/orders";

export function OrdersPage() {
  const navigate = useNavigate();
  const { data, loading, error, retry } = useAsync(
    () => orderService.listOrders(),
    [],
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Orders
      </h1>
      <p className="mt-1 text-sm text-muted">
        Your full purchase history.
      </p>

      <div className="mt-8">
        {loading ? (
          <Skeleton className="h-64 rounded-xl" />
        ) : error ? (
          <ErrorState
            message="We couldn't load your orders."
            onRetry={retry}
          />
        ) : !data || data.length === 0 ? (
          <EmptyState
            icon={ListOrdered}
            title="No orders yet"
            message="When you make a purchase it will appear here."
            action={
              <Button asChild>
                <Link to="/products">Browse products</Link>
              </Button>
            }
          />
        ) : (
          <div className="rounded-xl border border-border bg-surface px-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="hidden sm:table-cell">Items</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((order) => (
                  <TableRow
                    key={order.id}
                    data-clickable
                    tabIndex={0}
                    aria-label={`Order ${order.number}`}
                    className="focus-ring"
                    onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        navigate(`/dashboard/orders/${order.id}`);
                    }}
                  >
                    <TableCell className="font-mono text-[13px] text-foreground">
                      {order.number}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell className="hidden tabular-nums text-muted sm:table-cell">
                      {order.items.reduce((s, i) => s + i.quantity, 0)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-foreground">
                      {formatCurrency(order.total)}
                    </TableCell>
                    <TableCell className="text-right">
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
