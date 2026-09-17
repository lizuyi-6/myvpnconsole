import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { TierPriceTable } from "@/components/product/tier-price-table";
import { Button } from "@/components/ui/button";
import { mockProducts } from "@/mocks/products";

const PRINCIPLES = [
  {
    title: "Volume tiers, applied automatically",
    description:
      "Unit prices drop as quantity increases. The discount applies instantly in the catalog, in your cart and at checkout — no coupon codes, no negotiation.",
  },
  {
    title: "Longer terms cost less",
    description:
      "90-day and annual plans price below the monthly rate multiplied out. Pick a term on any product page and watch the math update.",
  },
  {
    title: "What you see is what you pay",
    description:
      "Prices include delivery and replacement support for the full term. No setup fees, no hidden charges at checkout.",
  },
];

export function PricingPage() {
  // Use a representative product to illustrate the tier model
  const example = mockProducts.find((p) => p.slug === "gemini-pro")!;

  return (
    <Container className="py-12 md:py-16">
      <Reveal>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Pricing
        </h1>
        <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-muted">
          Every product follows the same transparent model: a base 30-day price,
          automatic volume tiers, and lower effective rates on longer terms.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-3">
        {PRINCIPLES.map((principle, i) => (
          <Reveal key={principle.title} delay={i * 0.06}>
            <p className="font-mono text-xs tracking-widest text-primary/80">
              0{i + 1}
            </p>
            <h2 className="mt-3 text-[15px] font-semibold text-foreground">
              {principle.title}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              {principle.description}
            </p>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-14 max-w-xl">
        <h2 className="text-lg font-semibold text-foreground">
          Example — {example.name}, 30-day plan
        </h2>
        <p className="mt-1.5 text-sm text-muted">
          The same tier structure applies across the catalog.
        </p>
        <div className="mt-5">
          <TierPriceTable
            tiers={example.tiers}
            planFactor={1}
            activeQuantity={0}
          />
        </div>
      </Reveal>

      <Reveal className="mt-14 rounded-xl border border-border bg-surface p-8 text-center">
        <h2 className="text-xl font-semibold text-foreground">
          Buying for a team or reselling?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
          Orders above 50 units unlock the lowest tier automatically. For
          recurring bulk purchasing, sign in and manage everything from one
          dashboard.
        </p>
        <Button asChild className="mt-6">
          <Link to="/products">
            Browse products
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </Reveal>
    </Container>
  );
}
