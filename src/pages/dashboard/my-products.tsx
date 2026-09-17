import { PackageOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { UserProductStatusBadge } from "@/components/feedback/status-badges";
import { ProductIconTile } from "@/components/product/product-icon-tile";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/hooks/use-async";
import { formatDate } from "@/lib/utils";
import { libraryService } from "@/services/library";

export function MyProductsPage() {
  const { data, loading, error, retry } = useAsync(
    () => libraryService.listUserProducts(),
    [],
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        My Products
      </h1>
      <p className="mt-1 text-sm text-muted">
        Purchased accounts and their credentials.
      </p>

      <div className="mt-8">
        {loading ? (
          <ul className="space-y-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-[88px] rounded-xl" />
            ))}
          </ul>
        ) : error ? (
          <ErrorState
            message="We couldn't load your products."
            onRetry={retry}
          />
        ) : !data || data.length === 0 ? (
          <EmptyState
            icon={PackageOpen}
            title="No products yet"
            message="Purchased accounts will appear here with their credentials."
            action={
              <Button asChild>
                <Link to="/products?category=ai">Browse AI products</Link>
              </Button>
            }
          />
        ) : (
          <ul className="space-y-3">
            {data.map((product) => (
              <li
                key={product.id}
                className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5 sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <ProductIconTile
                    icon={product.icon}
                    accent={product.accent}
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-[15px] font-semibold text-foreground">
                        {product.name}
                      </h2>
                      <UserProductStatusBadge status={product.status} />
                    </div>
                    <p className="mt-1 text-xs text-subtle">
                      Expires {formatDate(product.expiresAt)} · Order{" "}
                      <span className="font-mono">#{product.orderNumber}</span>
                    </p>
                  </div>
                </div>
                <Button asChild variant="secondary" size="sm">
                  <Link to={`/dashboard/products/${product.id}`}>
                    View details
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
