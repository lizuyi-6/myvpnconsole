import { PackageSearch, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { Container } from "@/components/layout/container";
import {
  ProductCard,
  ProductCardSkeleton,
} from "@/components/product/product-card";
import { Input } from "@/components/ui/input";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { useAsync } from "@/hooks/use-async";
import { productService } from "@/services/products";
import type { ProductCategory, ProductFilter } from "@/types";

type CategoryFilter = ProductCategory | "all";
type StockFilter = "all" | "available" | "low";

const CATEGORY_OPTIONS: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "ai", label: "AI" },
  { value: "network", label: "Network" },
  { value: "bundle", label: "Bundle" },
];

const BILLING_OPTIONS = [
  { value: "any", label: "Any term" },
  { value: "30", label: "30 Days" },
  { value: "90", label: "90 Days" },
  { value: "365", label: "Annual" },
];

const STOCK_OPTIONS: { value: StockFilter; label: string }[] = [
  { value: "all", label: "Any stock" },
  { value: "available", label: "Available" },
  { value: "low", label: "Low stock" },
];

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = (searchParams.get("category") ?? "all") as CategoryFilter;
  const [billing, setBilling] = useState("any");
  const [stock, setStock] = useState<StockFilter>("all");
  const [search, setSearch] = useState("");

  const filter: ProductFilter = useMemo(
    () => ({
      category,
      planDays: billing === "any" ? undefined : Number(billing),
      stock: stock === "all" ? undefined : stock,
      search: search || undefined,
    }),
    [category, billing, stock, search],
  );

  const { data, loading, error, retry } = useAsync(
    () => productService.listProducts(filter),
    [filter],
  );

  const hasFilters =
    category !== "all" || billing !== "any" || stock !== "all" || search !== "";

  const clearFilters = () => {
    setSearchParams({});
    setBilling("any");
    setStock("all");
    setSearch("");
  };

  return (
    <Container className="py-12 md:py-16">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Products
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Browse all available digital services.
        </p>
      </header>

      {/* Filters */}
      <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <SegmentedControl
            aria-label="Category"
            options={CATEGORY_OPTIONS}
            value={category}
            onChange={(value) => {
              if (value === "all") {
                searchParams.delete("category");
                setSearchParams(searchParams, { replace: true });
              } else {
                setSearchParams({ category: value }, { replace: true });
              }
            }}
          />
          <SegmentedControl
            aria-label="Billing term"
            options={BILLING_OPTIONS}
            value={billing}
            onChange={setBilling}
          />
          <SegmentedControl
            aria-label="Stock"
            options={STOCK_OPTIONS}
            value={stock}
            onChange={setStock}
          />
        </div>

        <div className="relative lg:w-64">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle"
          />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products"
            aria-label="Search products"
            className="pl-9 pr-8"
          />
          {search && (
            <button
              aria-label="Clear search"
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-subtle transition-colors hover:text-foreground focus-ring"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="mt-8">
        {error ? (
          <ErrorState
            message="We couldn't load the catalog. Please try again."
            onRetry={retry}
          />
        ) : loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : !data || data.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title={search ? "No results found" : "No products match"}
            message={
              search
                ? `Nothing matches "${search}". Try a different search or clear filters.`
                : "Try adjusting the filters to see more products."
            }
            action={
              hasFilters ? (
                <button
                  onClick={clearFilters}
                  className="text-sm font-medium text-primary hover:underline focus-ring rounded-sm"
                >
                  Clear all filters
                </button>
              ) : undefined
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
