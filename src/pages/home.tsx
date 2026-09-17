import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, MonitorSmartphone, Timer } from "lucide-react";
import { Link } from "react-router-dom";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { ProductCard, ProductCardSkeleton } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { brand } from "@/config/brand";
import { useAsync } from "@/hooks/use-async";
import { productService } from "@/services/products";

const VALUE_PROPS = [
  {
    index: "01",
    title: "Simple purchasing",
    description: "Transparent volume pricing. No calls, no quotes, no waiting.",
  },
  {
    index: "02",
    title: "One dashboard",
    description:
      "Every account, subscription and renewal in a single place.",
  },
  {
    index: "03",
    title: "Reliable support",
    description: "Replacement guarantee and human answers when it matters.",
  },
];

function HeroVisual() {
  const reduceMotion = useReducedMotion();
  const animate = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.25, delay, ease: "easeOut" as const },
        };

  return (
    <div className="relative" aria-hidden>
      {/* Restrained glow behind the status layer */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.13] blur-3xl" />

      <motion.div
        {...animate(0.15)}
        className="ml-auto w-full max-w-sm rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-gradient-to-br from-[#5E6AD2]/20 to-[#8B5CF6]/10">
              <Timer className="size-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">AI Pro</p>
              <p className="text-xs text-subtle">29 days remaining</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-success/25 bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
            <span className="size-1.5 rounded-full bg-success" />
            Active
          </span>
        </div>
      </motion.div>

      <motion.div
        {...animate(0.28)}
        className="mt-3 w-full max-w-sm rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-sm sm:ml-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-gradient-to-br from-[#38BDF8]/20 to-[#5E6AD2]/10">
              <MonitorSmartphone className="size-4 text-[#38BDF8]" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Network Access
              </p>
              <p className="text-xs text-subtle">5 devices · 20+ regions</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-success/25 bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
            <span className="size-1.5 rounded-full bg-success" />
            Active
          </span>
        </div>
      </motion.div>

      <motion.div
        {...animate(0.41)}
        className="mt-3 inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 backdrop-blur-sm sm:ml-20"
      >
        <span className="flex size-5 items-center justify-center rounded-full bg-success/15">
          <Check className="size-3 text-success" />
        </span>
        <span className="text-xs text-muted">
          Order NOVA-260917-1042 delivered
        </span>
      </motion.div>
    </div>
  );
}

function PopularProducts() {
  const { data, loading, error, retry } = useAsync(
    () => productService.listProducts(),
    [],
  );
  const popular = data?.filter((p) => p.popular).slice(0, 4) ?? [];

  return (
    <section className="py-16 md:py-24">
      <Container>
        <Reveal className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Popular products
            </h2>
            <p className="mt-1.5 text-sm text-muted">
              What teams and resellers buy most.
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link to="/products">
              Browse all
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </Reveal>

        {error ? (
          <div className="mt-8">
            <p className="rounded-xl border border-border bg-surface px-6 py-10 text-center text-sm text-muted">
              Couldn't load products.{" "}
              <button
                onClick={retry}
                className="font-medium text-primary hover:underline focus-ring rounded-sm"
              >
                Retry
              </button>
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {loading
              ? Array.from({ length: 4 }, (_, i) => <ProductCardSkeleton key={i} />)
              : popular.map((product, i) => (
                  <Reveal key={product.id} delay={i * 0.05}>
                    <ProductCard product={product} />
                  </Reveal>
                ))}
          </div>
        )}

        <div className="mt-6 sm:hidden">
          <Button asChild variant="secondary" className="w-full">
            <Link to="/products">Browse all products</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}

export function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-border/60">
        <Container className="grid items-center gap-12 py-20 md:py-28 lg:grid-cols-2 lg:gap-16">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl"
            >
              {brand.hero.title.split("\n").map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.08, ease: "easeOut" }}
              className="mt-5 max-w-md text-base leading-relaxed text-muted"
            >
              {brand.hero.subtitle}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.16, ease: "easeOut" }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Button asChild size="lg">
                <Link to="/products">Browse products</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/pricing">View pricing</Link>
              </Button>
            </motion.div>
          </div>

          <HeroVisual />
        </Container>
      </section>

      {/* Value props */}
      <section className="border-b border-border/60">
        <Container className="grid gap-10 py-16 sm:grid-cols-3 md:py-20">
          {VALUE_PROPS.map((prop, i) => (
            <Reveal key={prop.index} delay={i * 0.06}>
              <p className="font-mono text-xs tracking-widest text-primary/80">
                {prop.index}
              </p>
              <h3 className="mt-3 text-[15px] font-semibold text-foreground">
                {prop.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {prop.description}
              </p>
            </Reveal>
          ))}
        </Container>
      </section>

      <PopularProducts />
    </>
  );
}
