import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ProductIconTile } from "@/components/product/product-icon-tile";
import { StockBadge } from "@/components/product/stock-badge";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { CATEGORY_LABELS, type Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const out = product.stock.status === "out_of_stock";

  return (
    <Link
      to={`/products/${product.slug}`}
      aria-label={`View ${product.name}`}
      className="group flex flex-col rounded-xl border border-border bg-surface p-5 transition-colors duration-150 hover:border-white/[0.14] focus-ring"
    >
      <div className="flex items-start justify-between">
        <ProductIconTile icon={product.icon} accent={product.accent} />
        <Badge variant="neutral">{CATEGORY_LABELS[product.category]}</Badge>
      </div>

      <div className="mt-4 flex-1">
        <h3 className="text-[15px] font-semibold text-foreground">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-muted">
          {product.tagline}
        </p>
      </div>

      <div className="mt-5 flex items-end justify-between">
        <div>
          <p className="text-lg font-semibold tabular-nums text-foreground">
            {formatCurrency(product.basePrice)}
          </p>
          <p className="text-xs text-subtle">per 30 days</p>
        </div>
        <StockBadge stock={product.stock} />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-[13px]">
        <span className="text-subtle">
          {out ? "Unavailable" : "Volume pricing available"}
        </span>
        <span className="inline-flex items-center gap-1 font-medium text-muted transition-colors group-hover:text-foreground">
          View
          <ArrowRight className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between">
        <Skeleton className="size-11" />
        <Skeleton className="h-5 w-20" />
      </div>
      <Skeleton className="mt-4 h-4 w-2/3" />
      <Skeleton className="mt-2 h-3 w-full" />
      <div className="mt-5 flex items-end justify-between">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-5 w-20" />
      </div>
      <div className="mt-4 border-t border-border pt-3">
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}
