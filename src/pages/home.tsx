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
import { useAsync } from "@/hooks/use-async";
import { interpolate, useI18n } from "@/i18n";
import { DEVICE_LIMIT } from "@/mocks/plans";
import { networkService } from "@/services/network";
import { planService } from "@/services/plans";
import type { Region, RegionArea } from "@/types";

const PLATFORM_COUNT = 5;

/* ---------------- Hero ---------------- */

const DIAGRAM_REGION_IDS = ["us-west", "jp", "sg", "de"];

function Hero() {
  const regions = useAsync(() => networkService.listRegions(), []);
  const status = useAsync(() => networkService.getStatus(), []);
  const { t, dict } = useI18n();

  const diagramRegions = (regions.data ?? [])
    .filter((r) => DIAGRAM_REGION_IDS.includes(r.id))
    .map((r) => ({
      id: r.id,
      label:
        dict.common.regionShort[r.id as keyof typeof dict.common.regionShort] ??
        r.name,
      latencyMs: r.latencyMs,
      status: r.status,
    }));

  return (
    <section>
      <Container className="grid items-center gap-14 py-16 md:py-20 lg:grid-cols-12 lg:gap-12 lg:py-24 xl:py-28">
        <div className="lg:col-span-7">
          <p className="text-[13px] font-semibold uppercase tracking-widest text-primary">
            {t("home.hero.eyebrow")}
          </p>
          <h1 className="mt-4 text-balance text-5xl font-semibold leading-[1.08] tracking-tight text-foreground md:text-[3.5rem]">
            <span className="block">{t("home.hero.titleLine1")}</span>
            <span className="block">{t("home.hero.titleLine2")}</span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted md:text-[17px]">
            {t("home.hero.subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link to="/plans">{t("home.hero.getAccess")}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/setup">{t("home.hero.seeHow")}</Link>
            </Button>
          </div>
          <p className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-subtle">
            <span className="tabular-nums">
              {status.data
                ? t("home.hero.factsRegions", {
                    count: status.data.totalRegions,
                  })
                : "…"}
            </span>
            <span aria-hidden>·</span>
            <span>{t("home.hero.factsDevices", { count: DEVICE_LIMIT })}</span>
            <span aria-hidden>·</span>
            <span>{t("common.platformLine")}</span>
          </p>
        </div>

        {/* Network service panel — a product surface, not an illustration */}
        <div className="lg:col-span-5">
          <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-panel">
            <div className="flex items-center justify-between gap-3 border-b border-border px-6 py-4">
              <p className="text-sm font-semibold text-foreground">
                {t("home.hero.panelTitle")}
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
                    pulse={status.data?.status === "operational"}
                  />
                  {status.data?.status === "operational"
                    ? t("common.statusOperational")
                    : t("common.statusDegraded")}
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
                  label: t("home.hero.metricRegions"),
                  value: status.data ? `${status.data.totalRegions}` : "…",
                },
                {
                  label: t("home.hero.metricDevices"),
                  value: t("home.hero.metricUpTo", { count: DEVICE_LIMIT }),
                },
                {
                  label: t("home.hero.metricPlatforms"),
                  value: `${PLATFORM_COUNT}`,
                },
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
  const { t } = useI18n();

  const items = [
    {
      icon: null,
      label: t("home.serviceBar.networkStatus"),
      value: status.data
        ? status.data.status === "operational"
          ? t("common.statusOperational")
          : t("common.statusDegraded")
        : "…",
      tone: status.data?.status === "operational" ? "success" : "warning",
    },
    {
      icon: Globe,
      label: t("home.serviceBar.regions"),
      value: status.data
        ? t("home.serviceBar.regionsAvailable", {
            count: status.data.activeRegions,
          })
        : "…",
    },
    {
      icon: MonitorSmartphone,
      label: t("home.serviceBar.devices"),
      value: t("home.hero.metricUpTo", { count: DEVICE_LIMIT }),
    },
    {
      icon: AppWindow,
      label: t("home.serviceBar.platforms"),
      value: t("home.serviceBar.platformsSupported", {
        count: PLATFORM_COUNT,
      }),
    },
    {
      icon: Copy,
      label: t("home.serviceBar.setup"),
      value: t("home.serviceBar.setupValue"),
    },
  ] as const;

  return (
    <section
      aria-label={t("home.serviceBar.ariaLabel")}
      className="border-y border-border bg-surface"
    >
      <Container>
        <dl className="grid grid-cols-2 divide-border sm:grid-cols-3 lg:grid-cols-5 lg:divide-x">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 px-1 py-5 lg:px-6 lg:first:pl-0"
            >
              {"tone" in item ? (
                <StatusDot
                  tone={item.tone}
                  pulse={item.tone === "success"}
                  className="size-2"
                />
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

const TRUST_ICONS = [Globe, MonitorSmartphone, Copy, LifeBuoy];

function TrustBand() {
  const { t, dict } = useI18n();

  return (
    <section className="py-16 md:py-20 lg:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              {t("home.trust.title")}
            </h2>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted">
              {t("home.trust.description")}
            </p>
          </div>
          <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:col-span-8">
            {dict.home.trust.facts.map((fact, i) => {
              const Icon = TRUST_ICONS[i];
              return (
                <div key={fact.title} className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-tint">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-foreground">
                      {fact.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">
                      {interpolate(fact.description, { count: DEVICE_LIMIT })}
                    </p>
                  </div>
                </div>
              );
            })}
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
  const { t, dict } = useI18n();

  const regionName = (region: Region) =>
    dict.common.regionNames[region.id as keyof typeof dict.common.regionNames] ??
    region.name;

  return (
    <section className="bg-tint/60 py-16 md:py-20 lg:py-24">
      <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {t("home.network.title")}
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
            {t("home.network.description")}
          </p>
          <p className="mt-5 flex items-center gap-2 text-sm text-muted">
            <StatusDot
              tone={status.data?.status === "operational" ? "success" : "warning"}
              pulse={status.data?.status === "operational"}
            />
            {status.data
              ? status.data.status === "operational"
                ? t("common.allSystemsOperational")
                : t("common.someRegionsDegraded")
              : "…"}
          </p>
          <Button asChild variant="secondary" className="mt-7">
            <Link to="/network">
              {t("home.network.viewNetwork")}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        {/* Network overview panel — header, summary, content, footer */}
        <div className="lg:col-span-8">
          <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
            <div className="flex items-center justify-between gap-3 border-b border-border px-6 py-4 lg:px-7">
              <h3 className="text-sm font-semibold text-foreground">
                {t("home.network.panelTitle")}
              </h3>
              <PanelLink to="/network">
                {t("home.network.viewAllRegions")}
              </PanelLink>
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
                          {t(`common.areas.${group.area}`)}
                        </span>
                        <span className="text-xs tabular-nums text-subtle">
                          {t(
                            group.regions.length === 1
                              ? "common.regionsOne"
                              : "common.regionsMany",
                            { count: group.regions.length },
                          )}
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
                              {regionName(region)}
                              {/* Status is color-coded — keep it perceivable without color */}
                              <span className="sr-only">
                                ({t(`common.regionStatus.${region.status}`)})
                              </span>
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
                        ? t("home.network.footerCount", {
                            active: status.data.activeRegions,
                            total: status.data.totalRegions,
                          })
                        : "…"}
                    </span>{" "}
                    {t("home.network.footerAvailable")}
                  </p>
                  <PanelLink to="/network">
                    {t("home.network.fullStatus")}
                  </PanelLink>
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
  const { t, dict } = useI18n();

  const flowIcons = [UserRound, Copy, AppWindow];
  const flow = [
    ...dict.home.how.flow.map((node, i) => ({
      icon: flowIcons[i],
      label: node.label,
      sub: node.sub,
    })),
    {
      icon: Globe,
      label: t("home.how.flowNetworkLabel"),
      sub: status.data
        ? t("home.how.flowNetworkSub", { count: status.data.activeRegions })
        : t("home.how.flowNetworkSubFallback"),
    },
  ];

  return (
    <section className="py-16 md:py-20 lg:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              {t("home.how.title")}
            </h2>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">
              {t("home.how.description")}
            </p>
          </div>
          <Button asChild variant="secondary">
            <Link to="/setup">
              {t("home.how.openGuide")}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        {/* Connection pipeline */}
        <div className="mt-10 flex items-stretch gap-2 overflow-x-auto pb-1 sm:gap-3">
          {flow.map((node, i) => (
            <div
              key={node.label}
              className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3"
            >
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
                <ArrowRight
                  className="size-4 shrink-0 text-subtle"
                  aria-hidden
                />
              )}
            </div>
          ))}
        </div>

        <ol className="mt-12 grid gap-10 sm:grid-cols-3">
          {dict.home.how.steps.map((step, i) => (
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
  { icon: Monitor, label: "Windows", noteKey: "windows" },
  { icon: Laptop, label: "macOS", noteKey: "macos" },
  { icon: Smartphone, label: "iOS", noteKey: "ios" },
  { icon: TabletSmartphone, label: "Android", noteKey: "android" },
  { icon: Terminal, label: "Linux", noteKey: "linux" },
] as const;

function Platforms() {
  const { t } = useI18n();

  return (
    <section className="border-t border-border bg-surface py-16 md:py-20 lg:py-24">
      <Container className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {t("home.platforms.title")}
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
            {t("home.platforms.description")}
          </p>
          <Button asChild variant="secondary" className="mt-7">
            <Link to="/setup">
              {t("home.platforms.viewGuides")}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="lg:col-span-7">
          <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
            <p className="border-b border-border px-6 py-4 text-sm font-semibold text-foreground lg:px-7">
              {t("home.platforms.panelTitle")}
            </p>
            <ul className="grid sm:grid-cols-2">
              {PLATFORMS.map((platform) => (
                <li
                  key={platform.label}
                  className="flex items-center gap-4 border-b border-border/70 px-6 py-4 sm:odd:border-r lg:px-7"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-tint">
                    <platform.icon
                      className="size-5 text-primary"
                      strokeWidth={1.75}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {platform.label}
                    </p>
                    <p className="text-xs text-subtle">
                      {t(`home.platforms.notes.${platform.noteKey}`)}
                    </p>
                  </div>
                  <span className="flex items-center gap-1.5 text-[13px] text-success">
                    <Check className="size-3.5" />
                    {t("home.platforms.supported")}
                  </span>
                </li>
              ))}
              <li className="hidden items-center gap-2 px-6 py-4 text-[13px] text-subtle sm:flex lg:px-7">
                {t("home.platforms.filler")}
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
  const { t, dict, formatCurrency } = useI18n();
  const entry = plans?.[0];

  return (
    <section className="bg-navy py-16 md:py-20 lg:py-24">
      <Container className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="text-[13px] font-semibold uppercase tracking-widest text-primary">
            {t("home.plansPreview.eyebrow")}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-navy-foreground md:text-3xl">
            {t("home.plansPreview.title", {
              service: t("common.serviceName"),
            })}
          </h2>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-navy-muted">
            {t("home.plansPreview.description")}
          </p>
          <ul className="mt-8 grid max-w-xl gap-x-10 gap-y-3.5 sm:grid-cols-2">
            {dict.plans.included.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm text-navy-foreground"
              >
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                {interpolate(item, { count: DEVICE_LIMIT })}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-7 lg:p-8">
            <p className="text-[13px] font-medium uppercase tracking-wide text-navy-muted">
              {t("home.plansPreview.startingPrice")}
            </p>
            <p className="mt-3 text-navy-foreground">
              {loading ? (
                <Skeleton className="h-10 w-44 bg-white/10" />
              ) : (
                <>
                  {t("home.plansPreview.from") && (
                    <span className="text-sm text-navy-muted">
                      {t("home.plansPreview.from")}{" "}
                    </span>
                  )}
                  <span className="text-4xl font-semibold tabular-nums">
                    {entry ? formatCurrency(entry.price) : "—"}
                  </span>
                  <span className="text-sm text-navy-muted">
                    {" "}
                    {t("home.plansPreview.perDays", {
                      days: entry?.durationDays ?? 30,
                    })}
                  </span>
                </>
              )}
            </p>
            <ul className="mt-6 space-y-2.5 border-t border-white/10 pt-6 text-sm text-navy-muted">
              <li className="tabular-nums">
                {status.data
                  ? t("home.plansPreview.regionsIncluded", {
                      count: status.data.totalRegions,
                    })
                  : t("home.plansPreview.regionsIncludedFallback")}
              </li>
              <li>
                {t("home.plansPreview.devicesAtOnce", { count: DEVICE_LIMIT })}
              </li>
              <li>{t("common.platformLine")}</li>
            </ul>
            <Button asChild size="lg" className="mt-7 w-full">
              <Link to="/plans">
                {t("home.plansPreview.viewPlans")}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <p className="mt-4 text-center text-[13px] text-navy-muted">
              {t("home.plansPreview.activationNote")}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------------- FAQ ---------------- */

function HomeFaq() {
  const { t, dict } = useI18n();

  return (
    <section className="bg-surface py-16 md:py-20 lg:py-24">
      <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {t("home.faq.title")}
          </h2>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted">
            {t("home.faq.description")}
          </p>
          <p className="mt-6 text-sm text-muted">
            {t("home.faq.morePre")}
            <Link
              to="/help"
              className="rounded-sm text-primary hover:underline focus-ring"
            >
              {t("home.faq.moreLink")}
            </Link>
            {t("home.faq.morePost")}
          </p>
        </div>
        <div className="lg:col-span-8">
          <Accordion type="single" collapsible>
            {dict.home.faq.items.map((item, i) => (
              <AccordionItem key={item.question} value={`home-faq-${i}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>
                  {interpolate(item.answer, { count: DEVICE_LIMIT })}
                </AccordionContent>
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
