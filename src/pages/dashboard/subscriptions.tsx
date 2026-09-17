import { Radio } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { ProductIconTile } from "@/components/product/product-icon-tile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/hooks/use-async";
import { formatDate } from "@/lib/utils";
import { subscriptionService } from "@/services/library";

export function SubscriptionsPage() {
  const { data, loading, error, retry } = useAsync(
    () => subscriptionService.listSubscriptions(),
    [],
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Subscriptions
      </h1>
      <p className="mt-1 text-sm text-muted">
        Manage your network services, devices and subscription links.
      </p>

      <div className="mt-8">
        {loading ? (
          <ul className="space-y-3">
            {[0, 1].map((i) => (
              <Skeleton key={i} className="h-[88px] rounded-xl" />
            ))}
          </ul>
        ) : error ? (
          <ErrorState
            message="We couldn't load your subscriptions."
            onRetry={retry}
          />
        ) : !data || data.length === 0 ? (
          <EmptyState
            icon={Radio}
            title="No subscriptions"
            message="Network subscriptions you purchase will appear here."
            action={
              <Button asChild>
                <Link to="/products?category=network">
                  Browse network plans
                </Link>
              </Button>
            }
          />
        ) : (
          <ul className="space-y-3">
            {data.map((sub) => (
              <li
                key={sub.id}
                className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5 sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <ProductIconTile icon={sub.icon} accent={sub.accent} />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-[15px] font-semibold text-foreground">
                        {sub.name}
                      </h2>
                      {sub.status === "active" ? (
                        <Badge variant="success" dot>
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="neutral" dot>
                          Expired
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-subtle">
                      Expires {formatDate(sub.expiresAt)} · Devices{" "}
                      {sub.devicesUsed} / {sub.deviceLimit}
                    </p>
                  </div>
                </div>
                {sub.status === "active" ? (
                  <Button asChild variant="secondary" size="sm">
                    <Link to={`/dashboard/subscriptions/${sub.id}`}>
                      Manage
                    </Link>
                  </Button>
                ) : (
                  <Button asChild variant="secondary" size="sm">
                    <Link to={`/products/${sub.productSlug}`}>Renew</Link>
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
