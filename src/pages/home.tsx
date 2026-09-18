import {
  AppWindow,
  ArrowRight,
  Check,
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
import { PanelLink } from "@/components/layout/panel";
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
import { DEVICE_LIMIT, INCLUDED, SERVICE_NAME } from "@/mocks/plans";
import { networkService } from "@/services/network";
import { planService } from "@/services/plans";
import type { Region, RegionArea } from "@/types";

const PLATFORM_COUNT = 5;

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
      <Container className="grid items-center gap-14 py-16 md:py-20 lg:grid-cols-12 lg:gap-12 lg:py-24 xl:py-28">
        <div className="lg:col-span-7">
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
          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted md:text-[17px]">
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

        {/* Network service panel — a product surface, not an illustration */}
        <div className="lg:col-span-5">
          <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-panel">
            <div className="flex items-center justify-between gap-3 border-b border-border px-6 py-4">
              <p className="text-sm font-semibold text-foreground">
                {brand.name} Network
              </p>
              {status.loading ? (
                <Skeleton className="h-4 w-24" />
              ) : (
                <span className="flex items-center gap-2 text-[13px] text-muted">
                  <StatusDot
                    tone={
                      status.data?.status === "operational"
                        ? "success"
                        : "warning"
                    }
                  />
                  {status.data?.status === "operational"
                    ? "Operational"
                    : "Degraded"}
                </span>
              )}
            </div>
            <div className="px-5 py-5 sm:px-6">
              {regions.loading ? (
                <Skeleton className="aspect-[480/344] w-full" />
              ) : (
                <NetworkDiagram regions={diagramRegions} />
              )}
            </div>
            <dl className="grid grid-cols-3 divide-x divide-border border-t border-border">
              {[
                {
                  label: "Regions",
                  value: status.data ? `${status.data.totalRegions}` : "…",
                },
                { label: "Devices", value: `Up to ${DEVICE_LIMIT}` },
                { label: "Platforms", value: `${PLATFORM_COUNT}` },
              ].map((metric) => (
                <div key={metric.label} className="px-4 py-4 text-center">
                  <dd className="text-lg font-semibold tabular-nums text-foreground">
                    {metric.value}
                  </dd>
                  <dt className="mt-0.5 text-xs text-subtle">{metric.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------------- Service bar ---------------- */

function ServiceBar() {
  const status = useAsync(() => networkService.getStatus(), []);

  const items = [
    {
      icon: null,
      label: "Network status",
      value: status.data
        ? status.data.status === "operational"
          ? "Operational"
          : "Degraded"
        : "…",
      tone: status.data?.status === "operational" ? "success" : "warning",
    },
    {
      icon: Globe,
      label: "Regions",
      value: status.data ? `${status.data.activeRegions} available` : "…",
    },
    {
      icon: MonitorSmartphone,
      label: "Devices",
      value: `Up to ${DEVICE_LIMIT}`,
    },
    {
      icon: AppWindow,
      label: "Platforms",
      value: `${PLATFORM_COUNT} supported`,
    },
    {
      icon: Copy,
      label: "Setup",
      value: "A few minutes",
    },
  ] as const;

  return (
    <section aria-label="Service facts" className="border-y border-border bg-surface">
      <Container>
        <dl className="grid grid-cols-2 divide-border sm:grid-cols-3 lg:grid-cols-5 lg:divide-x">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 px-1 py-5 lg:px-6 lg:first:pl-0"
            >
              {"tone" in item ? (
                <StatusDot tone={item.tone} className="size-2" />
              ) : (
                item.icon && (
                  <item.icon className="size-4 shrink-0 text-subtle" />
                )
              )}
              <div className="min-w-0">
                <dt className="text-xs text-subtle">{item.label}</dt>
                <dd className="mt-0.5 truncate text-sm font-medium tabular-nums text-foreground">
                  {item.value}
                </dd>
              </div>
            </div>
          ))}
        </dl>
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
    <section className="py-16 md:py-20 lg:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Built for everyday access
            </h2>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted">
              The essentials of a network service, done properly — nothing
              more, nothing hidden.
            </p>
          </div>
          <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:col-span-8">
            {FACTS.map((fact) => (
              <div key={fact.title} className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-tint">
                  <fact.icon className="size-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-foreground">
                    {fact.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {fact.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
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
  const status = useAsync(() => networkService.getStatus(), []);

  return (
    <section className="bg-tint/60 py-16 md:py-20 lg:py-24">
      <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            A network that covers where you go
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
            Every plan includes access to all available regions. Switch
            anytime from your client — region status and latency are always
            public.
          </p>
          <p className="mt-5 flex items-center gap-2 text-sm text-muted">
            <StatusDot
              tone={status.data?.status === "operational" ? "success" : "warning"}
            />
            {status.data
              ? status.data.status === "operational"
                ? "All systems operational"
                : "Some regions degraded"
              : "…"}
          </p>
          <Button asChild variant="secondary" className="mt-7">
            <Link to="/network">
              View network
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        {/* Network overview panel — header, summary, content, footer */}
        <div className="lg:col-span-8">
          <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
            <div className="flex items-center justify-between gap-3 border-b border-border px-6 py-4 lg:px-7">
              <h3 className="text-sm font-semibold text-foreground">
                Network overview
              </h3>
              <PanelLink to="/network">View all regions</PanelLink>
            </div>

            {loading ? (
              <div className="space-y-3 px-6 py-6 lg:px-7">
                {Array.from({ length: 6 }, (_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2">
                  {groupByArea(regions ?? []).map((group) => (
                    <div
                      key={group.area}
                      className="border-b border-border/70 px-6 py-5 sm:odd:border-r lg:px-7"
                    >
                      <p className="flex items-baseline justify-between gap-3">
                        <span className="text-xs font-medium uppercase tracking-wide text-subtle">
                          {group.area}
                        </span>
                        <span className="text-xs tabular-nums text-subtle">
                          {group.regions.length}{" "}
                          {group.regions.length === 1 ? "region" : "regions"}
                        </span>
                      </p>
                      <ul className="mt-2.5 space-y-2">
                        {group.regions.slice(0, 2).map((region) => (
                          <li
                            key={region.id}
                            className="flex items-center justify-between gap-3 text-sm"
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
                <div className="flex items-center justify-between gap-3 bg-background/60 px-6 py-3.5 lg:px-7">
                  <p className="text-[13px] text-muted">
                    <span className="tabular-nums">
                      {status.data
                        ? `${status.data.activeRegions} of ${status.data.totalRegions}`
                        : "…"}
                    </span>{" "}
                    regions available
                  </p>
                  <PanelLink to="/network">Full network status</PanelLink>
                </div>
              </>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------------- How it works ---------------- */

function HowItWorks() {
  const status = useAsync(() => networkService.getStatus(), []);

  const flow = [
    { icon: UserRound, label: "Account", sub: "One sign-in" },
    { icon: Copy, label: "Subscription URL", sub: "Personal link" },
    { icon: AppWindow, label: "Client", sub: "Any supported client" },
    {
      icon: Globe,
      label: `${brand.name} Network`,
      sub: status.data
        ? `${status.data.activeRegions} regions available`
        : "Available regions",
    },
  ];

  const steps = [
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

  return (
    <section className="py-16 md:py-20 lg:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              How {brand.name} works
            </h2>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">
              One subscription flows from your account to every device you
              connect.
            </p>
          </div>
          <Button asChild variant="secondary">
            <Link to="/setup">
              Open the setup guide
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        {/* Connection pipeline */}
        <div className="mt-10 flex items-stretch gap-2 overflow-x-auto pb-1 sm:gap-3">
          {flow.map((node, i) => (
            <div key={node.label} className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
              <div className="min-w-[160px] flex-1 rounded-lg border border-border bg-surface px-4 py-3.5 shadow-card">
                <p className="flex items-center gap-2.5">
                  <node.icon className="size-4 shrink-0 text-primary" />
                  <span className="truncate text-sm font-medium text-foreground">
                    {node.label}
                  </span>
                </p>
                <p className="mt-1 truncate pl-[26px] text-xs text-subtle">
                  {node.sub}
                </p>
              </div>
              {i < flow.length - 1 && (
                <ArrowRight className="size-4 shrink-0 text-subtle" aria-hidden />
              )}
            </div>
          ))}
        </div>

        <ol className="mt-12 grid gap-10 sm:grid-cols-3">
          {steps.map((step, i) => (
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
  { icon: Monitor, label: "Windows", note: "10 and later" },
  { icon: Laptop, label: "macOS", note: "Apple silicon & Intel" },
  { icon: Smartphone, label: "iOS", note: "iPhone and iPad" },
  { icon: TabletSmartphone, label: "Android", note: "Android 7+" },
  { icon: Terminal, label: "Linux", note: "AppImage & packages" },
];

function Platforms() {
  return (
    <section className="border-t border-border bg-surface py-16 md:py-20 lg:py-24">
      <Container className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Works everywhere you do
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
            One subscription across desktop and mobile. Every platform has a
            step-by-step guide with a recommended client.
          </p>
          <Button asChild variant="secondary" className="mt-7">
            <Link to="/setup">
              View setup guides
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="lg:col-span-7">
          <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
            <p className="border-b border-border px-6 py-4 text-sm font-semibold text-foreground lg:px-7">
              Device compatibility
            </p>
            <ul className="grid sm:grid-cols-2">
              {PLATFORMS.map((platform) => (
                <li
                  key={platform.label}
                  className="flex items-center gap-4 border-b border-border/70 px-6 py-4 sm:odd:border-r lg:px-7"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-tint">
                    <platform.icon className="size-5 text-primary" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {platform.label}
                    </p>
                    <p className="text-xs text-subtle">{platform.note}</p>
                  </div>
                  <span className="flex items-center gap-1.5 text-[13px] text-success">
                    <Check className="size-3.5" />
                    Supported
                  </span>
                </li>
              ))}
              <li className="hidden items-center gap-2 px-6 py-4 text-[13px] text-subtle sm:flex lg:px-7">
                Guides included for every platform.
              </li>
            </ul>
          </div>
        </div>
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
    <section className="bg-navy py-16 md:py-20 lg:py-24">
      <Container className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="text-[13px] font-semibold uppercase tracking-widest text-primary">
            Plans
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-navy-foreground md:text-3xl">
            {SERVICE_NAME}. One service — choose your duration.
          </h2>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-navy-muted">
            Every duration includes the same service. No tiers, no feature
            gates — just time.
          </p>
          <ul className="mt-8 grid max-w-xl gap-x-10 gap-y-3.5 sm:grid-cols-2">
            {INCLUDED.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm text-navy-foreground"
              >
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-7 lg:p-8">
            <p className="text-[13px] font-medium uppercase tracking-wide text-navy-muted">
              Starting price
            </p>
            <p className="mt-3 text-navy-foreground">
              {loading ? (
                <Skeleton className="h-10 w-44 bg-white/10" />
              ) : (
                <>
                  <span className="text-sm text-navy-muted">From </span>
                  <span className="text-4xl font-semibold tabular-nums">
                    {entry ? formatCurrency(entry.price) : "—"}
                  </span>
                  <span className="text-sm text-navy-muted">
                    {" "}
                    / {entry?.durationDays ?? 30} days
                  </span>
                </>
              )}
            </p>
            <ul className="mt-6 space-y-2.5 border-t border-white/10 pt-6 text-sm text-navy-muted">
              <li className="tabular-nums">
                {status.data
                  ? `${status.data.totalRegions} regions included`
                  : "All regions included"}
              </li>
              <li>Up to {DEVICE_LIMIT} devices at once</li>
              <li>Windows, macOS, iOS, Android, Linux</li>
            </ul>
            <Button asChild size="lg" className="mt-7 w-full">
              <Link to="/plans">
                View plans
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <p className="mt-4 text-center text-[13px] text-navy-muted">
              Subscription URL available immediately after activation.
            </p>
          </div>
        </div>
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
    <section className="bg-surface py-16 md:py-20 lg:py-24">
      <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Common questions
          </h2>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted">
            Straight answers about access, devices and renewals.
          </p>
          <p className="mt-6 text-sm text-muted">
            More in the{" "}
            <Link
              to="/help"
              className="rounded-sm text-primary hover:underline focus-ring"
            >
              Help Center
            </Link>
            .
          </p>
        </div>
        <div className="lg:col-span-8">
          <Accordion type="single" collapsible>
            {HOME_FAQ.map((item, i) => (
              <AccordionItem key={item.question} value={`home-faq-${i}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Container>
    </section>
  );
}

/* ---------------- Page ---------------- */

export function HomePage() {
  return (
    <>
      <Hero />
      <ServiceBar />
      <TrustBand />
      <NetworkSection />
      <HowItWorks />
      <Platforms />
      <PlansPreview />
      <HomeFaq />
    </>
  );
}
