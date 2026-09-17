import {
  AppWindow,
  ArrowRight,
  Copy,
  Globe,
  Laptop,
  LifeBuoy,
  Monitor,
  MonitorSmartphone,
  Smartphone,
  TabletSmartphone,
  Terminal,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { StatusDot } from "@/components/feedback/status-dot";
import { Container } from "@/components/layout/container";
import { NetworkDiagram } from "@/components/marketing/network-diagram";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { brand } from "@/config/brand";
import { useAsync } from "@/hooks/use-async";
import { formatCurrency } from "@/lib/utils";
import { DEVICE_LIMIT, SERVICE_NAME } from "@/mocks/plans";
import { networkService } from "@/services/network";
import { planService } from "@/services/plans";
import type { Region, RegionArea } from "@/types";

/* ---------------- Hero ---------------- */

const DIAGRAM_LABELS: Record<string, string> = {
  "us-west": "US West",
  jp: "Japan",
  sg: "Singapore",
  de: "Germany",
};

function Hero() {
  const regions = useAsync(() => networkService.listRegions(), []);
  const status = useAsync(() => networkService.getStatus(), []);

  const diagramRegions = (regions.data ?? [])
    .filter((r) => r.id in DIAGRAM_LABELS)
    .map((r) => ({
      id: r.id,
      label: DIAGRAM_LABELS[r.id],
      latencyMs: r.latencyMs,
      status: r.status,
    }));

  return (
    <section>
      <Container className="grid items-center gap-14 py-20 md:py-24 lg:grid-cols-2 lg:gap-12 lg:py-28">
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-widest text-primary">
            {brand.hero.eyebrow}
          </p>
          <h1 className="mt-4 text-balance text-5xl font-semibold leading-[1.08] tracking-tight text-foreground md:text-[3.5rem]">
            {brand.hero.title.split("\n").map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
            {brand.hero.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link to="/plans">Get access</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/setup">See how it works</Link>
            </Button>
          </div>
          <p className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-subtle">
            <span className="tabular-nums">
              {status.data ? `${status.data.totalRegions} regions` : "…"}
            </span>
            <span aria-hidden>·</span>
            <span>Up to {DEVICE_LIMIT} devices</span>
            <span aria-hidden>·</span>
            <span>Windows, macOS, iOS, Android, Linux</span>
          </p>
        </div>

        {/* Service topology visual */}
        <div className="rounded-xl border border-border bg-surface p-5 shadow-card sm:p-7">
          {regions.loading ? (
            <Skeleton className="aspect-[480/344] w-full" />
          ) : (
            <NetworkDiagram regions={diagramRegions} />
          )}
        </div>
      </Container>
    </section>
  );
}

/* ---------------- Trust band ---------------- */

const FACTS = [
  {
    icon: Globe,
    title: "Multiple regions",
    description: "One subscription works across every supported region.",
  },
  {
    icon: MonitorSmartphone,
    title: "Multi-device",
    description: `Use the same service on up to ${DEVICE_LIMIT} of your personal devices.`,
  },
  {
    icon: Copy,
    title: "Simple setup",
    description:
      "Copy your subscription URL, import it into a compatible client, connect.",
  },
  {
    icon: LifeBuoy,
    title: "Human support",
    description:
      "Get help when setup or access doesn't work as expected.",
  },
];

function TrustBand() {
  return (
    <section className="border-y border-border bg-surface py-16 md:py-20">
      <Container>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Built for everyday access
        </h2>
        <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {FACTS.map((fact) => (
            <div key={fact.title}>
              <div className="flex size-10 items-center justify-center rounded-lg bg-tint">
                <fact.icon className="size-5 text-primary" />
              </div>
              <h3 className="mt-4 text-[15px] font-semibold text-foreground">
                {fact.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {fact.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ---------------- Network coverage ---------------- */

const AREA_ORDER: RegionArea[] = [
  "North America",
  "Asia Pacific",
  "Europe",
  "Oceania",
];

function groupByArea(regions: Region[]) {
  return AREA_ORDER.map((area) => ({
    area,
    regions: regions.filter((r) => r.area === area),
  })).filter((group) => group.regions.length > 0);
}

function NetworkSection() {
  const { data: regions, loading } = useAsync(
    () => networkService.listRegions(),
    [],
  );

  return (
    <section className="bg-tint/60 py-16 md:py-24">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            A network that covers where you go
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
            Every plan includes access to all available regions. Switch
            anytime from your client — region status and latency are always
            public.
          </p>
          <Button asChild variant="secondary" className="mt-7">
            <Link to="/network">
              View network
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 shadow-card sm:p-7">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {groupByArea(regions ?? []).map((group) => (
                <div key={group.area}>
                  <p className="text-xs font-medium uppercase tracking-wide text-subtle">
                    {group.area}
                  </p>
                  <ul className="mt-2 divide-y divide-border/70">
                    {group.regions.map((region) => (
                      <li
                        key={region.id}
                        className="flex items-center justify-between py-2.5 text-sm"
                      >
                        <span className="flex items-center gap-2.5 text-foreground">
                          <StatusDot
                            tone={
                              region.status === "available"
                                ? "success"
                                : region.status === "degraded"
                                  ? "warning"
                                  : "danger"
                            }
                          />
                          {region.name}
                        </span>
                        <span className="tabular-nums text-[13px] text-subtle">
                          {region.latencyMs !== null
                            ? `${region.latencyMs} ms`
                            : "—"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

/* ---------------- How it works ---------------- */

const FLOW = [
  { icon: UserRound, label: "Account" },
  { icon: Copy, label: "Subscription URL" },
  { icon: AppWindow, label: "Client" },
  { icon: Globe, label: "Network" },
];

const HOW_STEPS = [
  {
    title: "Get access",
    description:
      "Choose your access period and activate your subscription in a minute.",
  },
  {
    title: "Add your subscription",
    description:
      "Copy the subscription URL from your console into a supported client.",
  },
  {
    title: "Connect",
    description: "Choose an available region and connect. That's it.",
  },
];

function HowItWorks() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          How {brand.name} works
        </h2>

        {/* Connection flow */}
        <div className="mt-10 flex items-center gap-2 overflow-x-auto pb-1 sm:gap-3">
          {FLOW.map((node, i) => (
            <div key={node.label} className="flex shrink-0 items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2.5 rounded-lg border border-border bg-surface px-4 py-2.5 shadow-card">
                <node.icon className="size-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  {node.label}
                </span>
              </div>
              {i < FLOW.length - 1 && (
                <ArrowRight className="size-4 shrink-0 text-subtle" aria-hidden />
              )}
            </div>
          ))}
        </div>

        <ol className="mt-12 grid gap-10 sm:grid-cols-3">
          {HOW_STEPS.map((step, i) => (
            <li key={step.title}>
              <p className="text-sm font-semibold tabular-nums text-primary">
                {i + 1}.
              </p>
              <h3 className="mt-2 text-[15px] font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

/* ---------------- Platforms ---------------- */

const PLATFORMS = [
  { icon: Monitor, label: "Windows" },
  { icon: Laptop, label: "macOS" },
  { icon: Smartphone, label: "iOS" },
  { icon: TabletSmartphone, label: "Android" },
  { icon: Terminal, label: "Linux" },
];

function Platforms() {
  return (
    <section className="border-t border-border bg-surface py-16 md:py-20">
      <Container className="text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Works everywhere you do
        </h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {PLATFORMS.map((platform) => (
            <div
              key={platform.label}
              className="flex flex-col items-center gap-2.5"
            >
              <platform.icon className="size-7 text-muted" strokeWidth={1.5} />
              <span className="text-sm font-medium text-foreground">
                {platform.label}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-10 text-sm text-muted">
          Setup guides available for every supported platform.
        </p>
        <Button asChild variant="secondary" className="mt-4">
          <Link to="/setup">
            View setup guides
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </Container>
    </section>
  );
}

/* ---------------- Plans preview (dark) ---------------- */

function PlansPreview() {
  const { data: plans, loading } = useAsync(() => planService.listPlans(), []);
  const status = useAsync(() => networkService.getStatus(), []);
  const entry = plans?.[0];

  return (
    <section className="bg-navy py-16 md:py-24">
      <Container className="text-center">
        <p className="text-[13px] font-semibold uppercase tracking-widest text-primary">
          Plans
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-navy-foreground md:text-3xl">
          {SERVICE_NAME}. One service — choose your duration.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-navy-muted">
          Every duration includes the same service. No tiers, no feature
          gates — just time.
        </p>

        <p className="mt-8 text-navy-foreground">
          {loading ? (
            <Skeleton className="mx-auto h-8 w-40 bg-white/10" />
          ) : (
            <>
              <span className="text-sm text-navy-muted">From </span>
              <span className="text-3xl font-semibold tabular-nums">
                {entry ? formatCurrency(entry.price) : "—"}
              </span>
              <span className="text-sm text-navy-muted">
                {" "}
                / {entry?.durationDays ?? 30} days
              </span>
            </>
          )}
        </p>

        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-navy-muted">
          <li className="tabular-nums">
            {status.data ? `${status.data.totalRegions} regions` : "All regions"}
          </li>
          <li>Up to {DEVICE_LIMIT} devices</li>
          <li>All supported platforms</li>
        </ul>

        <Button asChild size="lg" className="mt-9">
          <Link to="/plans">
            View plans
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </Container>
    </section>
  );
}

/* ---------------- FAQ ---------------- */

const HOME_FAQ = [
  {
    question: "What exactly am I buying?",
    answer:
      "A time-based subscription to the NOVA network. You get a personal subscription URL that imports all regions into a compatible client on any supported platform.",
  },
  {
    question: "How many devices can I use?",
    answer: `Up to ${DEVICE_LIMIT} devices at the same time. You can rename or remove devices anytime from the console.`,
  },
  {
    question: "What happens when my subscription expires?",
    answer:
      "Access stops at expiry. Renewing before expiry extends your current end date, so no time is lost. Your subscription URL stays the same across renewals.",
  },
  {
    question: "Which clients are supported?",
    answer:
      "Any client that accepts a standard subscription URL. We publish a recommended client per platform — Windows, macOS, iOS, Android and Linux — in the setup guide.",
  },
];

function HomeFaq() {
  return (
    <section className="bg-surface py-16 md:py-24">
      <Container className="max-w-3xl">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Common questions
        </h2>
        <div className="mt-8">
          <Accordion type="single" collapsible>
            {HOME_FAQ.map((item, i) => (
              <AccordionItem key={item.question} value={`home-faq-${i}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <p className="mt-8 text-sm text-muted">
          More in the{" "}
          <Link
            to="/help"
            className="text-primary hover:underline focus-ring rounded-sm"
          >
            Help Center
          </Link>
          .
        </p>
      </Container>
    </section>
  );
}

/* ---------------- Page ---------------- */

export function HomePage() {
  return (
    <>
      <Hero />
      <TrustBand />
      <NetworkSection />
      <HowItWorks />
      <Platforms />
      <PlansPreview />
      <HomeFaq />
    </>
  );
}
