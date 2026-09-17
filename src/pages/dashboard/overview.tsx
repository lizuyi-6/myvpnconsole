import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ErrorState } from "@/components/feedback/error-state";
import { OrderStatusBadge, UserProductStatusBadge } from "@/components/feedback/status-badges";
import { ProductIconTile } from "@/components/product/product-icon-tile";
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
import { daysUntil, formatCurrency, formatDate } from "@/lib/utils";
import { libraryService } from "@/services/library";
import { orderService } from "@/services/orders";
import { useAuthStore } from "@/store/auth";

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function OverviewSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-48 rounded-xl" />
      <Skeleton className="h-40 rounded-xl" />
    </div>
  );
}

export function DashboardOverviewPage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const products = useAsync(() => libraryService.listUserProducts(), []);
  const orders = useAsync(() => orderService.listOrders(), []);

  const activeProducts =
    products.data?.filter((p) => p.status !== "expired") ?? [];
  const expiringSoon =
    products.data?.filter((p) => p.status === "expiring") ?? [];
  const recentOrders = orders.data?.slice(0, 5) ?? [];

  const loading = products.loading || orders.loading;
  const failed = products.error || orders.error;

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        {greeting()}, {user?.name.split(" ")[0]}
      </h1>
      <p className="mt-1 text-sm text-muted">
        Here's what's happening with your services.
      </p>

      <div className="mt-8">
        {loading ? (
          <OverviewSkeleton />
        ) : failed ? (
          <ErrorState
            onRetry={() => {
              products.retry();
              orders.retry();
            }}
          />
        ) : (
          <div className="space-y-10">
            {/* Key numbers — three, and only three */}
            <dl className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
              {[
                { label: "Active products", value: activeProducts.length },
                { label: "Expiring soon", value: expiringSoon.length },
                { label: "Total orders", value: orders.data?.length ?? 0 },
              ].map((stat) => (
                <div key={stat.label} className="bg-surface px-5 py-4">
                  <dt className="text-xs text-subtle">{stat.label}</dt>
                  <dd className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Active services */}
            <section>
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-semibold text-foreground">
                  Active services
                </h2>
                <Link
                  to="/dashboard/products"
                  className="inline-flex items-center gap-1 text-[13px] font-medium text-muted transition-colors hover:text-foreground focus-ring rounded-sm"
                >
                  View all
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
              <ul className="mt-3 divide-y divide-border rounded-xl border border-border bg-surface">
                {activeProducts.slice(0, 4).map((product) => (
                  <li key={product.id}>
                    <Link
                      to={`/dashboard/products/${product.id}`}
                      className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.02] focus-ring"
                    >
                      <ProductIconTile
                        icon={product.icon}
                        accent={product.accent}
                        size="sm"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {product.name}
                        </p>
                        <p className="text-xs text-subtle">
                          {daysUntil(product.expiresAt)} days remaining
                        </p>
                      </div>
                      <UserProductStatusBadge status={product.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            {/* Recent orders */}
            <section>
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-semibold text-foreground">
                  Recent orders
                </h2>
                <Link
                  to="/dashboard/orders"
                  className="inline-flex items-center gap-1 text-[13px] font-medium text-muted transition-colors hover:text-foreground focus-ring rounded-sm"
                >
                  View all
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
              <div className="mt-3 rounded-xl border border-border bg-surface px-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow
                        key={order.id}
                        data-clickable
                        onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            navigate(`/dashboard/orders/${order.id}`);
                        }}
                        tabIndex={0}
                        className="focus-ring"
                        aria-label={`Order ${order.number}`}
                      >
                        <TableCell className="font-mono text-[13px] text-foreground">
                          {order.number}
                        </TableCell>
                        <TableCell className="text-muted">
                          {formatDate(order.createdAt)}
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
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
