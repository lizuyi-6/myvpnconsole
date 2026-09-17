import { ArrowLeft, Check, CircleAlert, ShoppingCart, Zap } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ErrorState } from "@/components/feedback/error-state";
import { Container } from "@/components/layout/container";
import { ProductIconTile } from "@/components/product/product-icon-tile";
import { StockBadge } from "@/components/product/stock-badge";
import { TierPriceTable } from "@/components/product/tier-price-table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/hooks/use-async";
import { round2, unitPriceFor } from "@/lib/pricing";
import { formatCurrency } from "@/lib/utils";
import { productService } from "@/services/products";
import { useCartStore } from "@/store/cart";
import { CATEGORY_LABELS } from "@/types";

function ProductDetailSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-[5fr_6fr]">
      <Skeleton className="aspect-[4/3] w-full rounded-xl" />
      <div>
        <Skeleton className="h-5 w-28" />
        <Skeleton className="mt-3 h-9 w-2/3" />
        <Skeleton className="mt-3 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-4/5" />
        <Skeleton className="mt-8 h-10 w-40" />
        <Skeleton className="mt-6 h-32 w-full" />
        <Skeleton className="mt-6 h-11 w-full" />
      </div>
    </div>
  );
}

export function ProductDetailPage() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);

  const { data: product, loading, error, retry } = useAsync(
    () => productService.getProduct(slug),
    [slug],
  );

  const [planId, setPlanId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (loading) {
    return (
      <Container className="py-10 md:py-14">
        <ProductDetailSkeleton />
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container className="py-10 md:py-14">
        <ErrorState
          title="Product not available"
          message="This product doesn't exist or failed to load."
          onRetry={retry}
        />
        <div className="mt-6">
          <Button asChild variant="ghost" size="sm">
            <Link to="/products">
              <ArrowLeft className="size-4" />
              Back to products
            </Link>
          </Button>
        </div>
      </Container>
    );
  }

  const plan = product.plans.find((p) => p.id === planId) ?? product.plans[0];
  const listUnitPrice = unitPriceFor(plan.priceFactor, 1, product.tiers);
  const unitPrice = unitPriceFor(plan.priceFactor, quantity, product.tiers);
  const subtotal = round2(unitPrice * quantity);
  const savings = round2(Math.max(0, listUnitPrice * quantity - subtotal));
  const out = product.stock.status === "out_of_stock";

  const handleAddToCart = () => {
    addItem(product.slug, plan.id, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const handleBuyNow = () => {
    addItem(product.slug, plan.id, quantity);
    navigate("/checkout");
  };

  return (
    <Container className="py-8 md:py-12">
      <Button asChild variant="ghost" size="sm" className="-ml-3 mb-6">
        <Link to="/products">
          <ArrowLeft className="size-4" />
          All products
        </Link>
      </Button>

      <div className="grid gap-10 lg:grid-cols-[5fr_6fr] lg:gap-14">
        {/* Visual panel */}
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-border bg-surface lg:aspect-auto lg:min-h-[420px]">
          <div
            aria-hidden
            className="absolute inset-0 opacity-60"
            style={{
              background: `radial-gradient(ellipse 60% 50% at 50% 45%, ${product.accent.from}14, transparent 70%)`,
            }}
          />
          <ProductIconTile icon={product.icon} accent={product.accent} size="lg" />
          <p className="absolute bottom-4 left-5 text-xs text-subtle">
            {CATEGORY_LABELS[product.category]}
          </p>
        </div>

        {/* Purchase panel */}
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="primary">{CATEGORY_LABELS[product.category]}</Badge>
            <StockBadge stock={product.stock} />
          </div>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            {product.name}
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
            {product.description}
          </p>

          {/* Plan + quantity are edited together — no artificial steps */}
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-[13px] font-medium text-muted">Plan</p>
              <SegmentedControl
                aria-label="Billing plan"
                options={product.plans.map((p) => ({
                  value: p.id,
                  label: p.label,
                }))}
                value={plan.id}
                onChange={setPlanId}
              />
            </div>
            <div>
              <p className="mb-2 text-[13px] font-medium text-muted">Quantity</p>
              <QuantityStepper
                value={quantity}
                onChange={setQuantity}
                max={999}
              />
            </div>
          </div>

          {/* Live pricing */}
          <div className="mt-6 rounded-xl border border-border bg-surface p-5">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-subtle">Quantity</p>
                <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">
                  {quantity}
                </p>
              </div>
              <div>
                <p className="text-xs text-subtle">Unit price</p>
                <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">
                  {formatCurrency(unitPrice)}
                </p>
              </div>
              <div>
                <p className="text-xs text-subtle">Subtotal</p>
                <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">
                  {formatCurrency(subtotal)}
                </p>
              </div>
            </div>
            {savings > 0 && (
              <p className="mt-3 border-t border-border pt-3 text-[13px] text-success">
                Volume discount applied — you save {formatCurrency(savings)}
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              variant="secondary"
              className="flex-1"
              disabled={out}
              onClick={handleAddToCart}
            >
              {added ? (
                <>
                  <Check className="size-4 text-success" />
                  Added to cart
                </>
              ) : (
                <>
                  <ShoppingCart className="size-4" />
                  Add to cart
                </>
              )}
            </Button>
            <Button
              size="lg"
              className="flex-1"
              disabled={out}
              onClick={handleBuyNow}
            >
              <Zap className="size-4" />
              Buy now
            </Button>
          </div>
          {out && (
            <p className="mt-3 flex items-center gap-1.5 text-[13px] text-warning">
              <CircleAlert className="size-3.5" />
              Currently out of stock. Check back soon.
            </p>
          )}

          {/* Volume pricing */}
          <div className="mt-8">
            <p className="mb-2 text-[13px] font-medium text-muted">
              Volume pricing · {plan.label}
            </p>
            <TierPriceTable
              tiers={product.tiers}
              planFactor={plan.priceFactor}
              activeQuantity={quantity}
            />
            <p className="mt-2 text-xs text-subtle">
              Adjust quantity to see pricing update in real time — no account
              needed.
            </p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="mt-14 grid gap-10 border-t border-border pt-10 lg:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            What you receive
          </h2>
          <ul className="mt-4 space-y-2.5">
            {product.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-muted">
                <Check className="mt-0.5 size-4 shrink-0 text-success" />
                {feature}
              </li>
            ))}
          </ul>

          <h2 className="mt-10 text-lg font-semibold text-foreground">
            Important notes
          </h2>
          <ul className="mt-4 space-y-2.5">
            {product.notes.map((note) => (
              <li key={note} className="flex items-start gap-2.5 text-sm text-muted">
                <span
                  aria-hidden
                  className="mt-[7px] size-1 shrink-0 rounded-full bg-subtle"
                />
                {note}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground">FAQ</h2>
          <Accordion type="single" collapsible className="mt-3">
            {product.faq.map((item, i) => (
              <AccordionItem key={item.question} value={`faq-${i}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </Container>
  );
}
