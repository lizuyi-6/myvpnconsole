import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { StatusDot } from "@/components/feedback/status-dot";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { brand } from "@/config/brand";
import { useAsync } from "@/hooks/use-async";
import { formatCurrency } from "@/lib/utils";
import { DEVICE_LIMIT, INCLUDED, SERVICE_NAME } from "@/mocks/plans";
import { networkService } from "@/services/network";
import { planService } from "@/services/plans";

const SETUP_STEPS = [
  {
    title: "Get your subscription",
    description: "Pick a duration and activate access in under a minute.",
  },
  {
    title: "Choose your client",
    description: "Windows, macOS, iOS, Android and Linux are all supported.",
  },
  {
    title: "Connect",
    description: "Import your subscription URL into the client and you're online.",
  },
];

const PLATFORMS = ["Windows", "macOS", "iOS", "Android", "Linux"];

function NetworkSummary() {
  const { data: status, loading } = useAsync(() => networkService.getStatus(), []);

  return (
    <dl className="space-y-4 border-l border-border pl-5">
      <div>
        <dt className="text-xs text-subtle">Network</dt>
        <dd className="mt-1 flex items-center gap-2 text-sm text-foreground">
          {loading ? (
            <Skeleton className="h-4 w-24" />
          ) : (
            <>
              <StatusDot
                tone={status?.status === "operational" ? "success" : "warning"}
              />
              {status?.status === "operational" ? "Operational" : "Degraded"}
            </>
          )}
        </dd>
      </div>
      <div>
        <dt className="text-xs text-subtle">Regions</dt>
        <dd className="mt-1 text-sm tabular-nums text-foreground">
          {loading ? (
            <Skeleton className="h-4 w-12" />
          ) : (
            `${status?.totalRegions ?? "—"} locations`
          )}
        </dd>
      </div>
      <div>
        <dt className="text-xs text-subtle">Devices per plan</dt>
        <dd className="mt-1 text-sm tabular-nums text-foreground">
          Up to {DEVICE_LIMIT}
        </dd>
      </div>
      <div>
        <dt className="text-xs text-subtle">Setup time</dt>
        <dd className="mt-1 text-sm text-foreground">About 2 minutes</dd>
      </div>
    </dl>
  );
}

function HomeRegions() {
  const { data: regions, loading } = useAsync(
    () => networkService.listRegions(),
    [],
  );

  return (
    <section className="border-t border-border/60 py-14">
      <Container>
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Network coverage
          </h2>
          <Link
            to="/network"
            className="inline-flex items-center gap-1 text-[13px] text-muted transition-colors hover:text-foreground focus-ring rounded-sm"
          >
            View network
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="mt-6 grid gap-x-10 gap-y-1 sm:grid-cols-2">
          {loading
            ? Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} className="h-9 w-full" />
              ))
            : regions?.slice(0, 6).map((region) => (
                <div
                  key={region.id}
                  className="flex items-center justify-between border-b border-border/50 py-2.5 text-sm"
                >
                  <span className="text-foreground">{region.name}</span>
                  <span className="flex items-center gap-2 text-muted">
                    {region.latencyMs !== null && (
                      <span className="tabular-nums text-xs text-subtle">
                        {region.latencyMs} ms
                      </span>
                    )}
                    <StatusDot
                      tone={region.status === "available" ? "success" : "warning"}
                    />
                  </span>
                </div>
              ))}
        </div>
      </Container>
    </section>
  );
}

function HomePlans() {
  const { data: plans, loading } = useAsync(() => planService.listPlans(), []);

  return (
    <section className="border-t border-border/60 py-14">
      <Container>
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold text-foreground">Plans</h2>
          <Link
            to="/plans"
            className="inline-flex items-center gap-1 text-[13px] text-muted transition-colors hover:text-foreground focus-ring rounded-sm"
          >
            Plan details
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <p className="mt-1 text-sm text-muted">
          {SERVICE_NAME}. One plan, three durations — everything included.
        </p>

        <div className="mt-6 divide-y divide-border border-y border-border">
          {loading
            ? Array.from({ length: 3 }, (_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))
            : plans?.map((plan) => (
                <div
                  key={plan.id}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {plan.label}
                    </p>
                    <p className="mt-0.5 text-xs text-subtle">
                      {formatCurrency(plan.price / (plan.durationDays / 30))} /
                      month equivalent
                    </p>
                  </div>
                  <div className="flex items-center gap-5">
                    <span className="text-sm font-semibold tabular-nums text-foreground">
                      {formatCurrency(plan.price)}
                    </span>
                    <Button asChild variant="secondary" size="sm">
                      <Link to={`/checkout?plan=${plan.id}`}>Get access</Link>
                    </Button>
                  </div>
                </div>
              ))}
        </div>

        <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-1.5 text-[13px] text-muted">
          {INCLUDED.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <StatusDot tone="neutral" />
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export function HomePage() {
  return (
    <>
      {/* Hero — text and real service facts, nothing decorative */}
      <section>
        <Container className="grid gap-12 py-20 md:py-24 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <div>
            <p className="text-[13px] font-medium tracking-wide text-muted">
              {brand.hero.eyebrow}
            </p>
            <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.15] tracking-tight text-foreground">
              {brand.hero.title.split("\n").map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
              {brand.hero.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild>
                <Link to="/plans">Get access</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/setup">View setup</Link>
              </Button>
            </div>
          </div>

          <div className="lg:pt-14">
            <NetworkSummary />
          </div>
        </Container>
      </section>

      <HomeRegions />

      {/* Platform compatibility */}
      <section className="border-t border-border/60 py-14">
        <Container>
          <h2 className="text-lg font-semibold text-foreground">
            Works with your devices
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-muted">
            {PLATFORMS.join("  ·  ")}
          </p>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
            Any client that accepts a standard subscription URL works. We
            publish a recommended client per platform in the{" "}
            <Link
              to="/setup"
              className="text-primary hover:underline focus-ring rounded-sm"
            >
              setup guide
            </Link>
            .
          </p>
        </Container>
      </section>

      {/* Setup steps — plain numbered list */}
      <section className="border-t border-border/60 py-14">
        <Container>
          <h2 className="text-lg font-semibold text-foreground">Setup</h2>
          <ol className="mt-6 grid gap-8 sm:grid-cols-3">
            {SETUP_STEPS.map((step, i) => (
              <li key={step.title}>
                <p className="text-sm font-medium tabular-nums text-primary">
                  {i + 1}.
                </p>
                <h3 className="mt-2 text-sm font-medium text-foreground">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <HomePlans />
    </>
  );
}
