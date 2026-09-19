import {
  ArrowRight,
  Laptop,
  Monitor,
  ShieldCheck,
  Smartphone,
  TabletSmartphone,
  Terminal,
} from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { StatusDot } from "@/components/feedback/status-dot";
import { PageHeader } from "@/components/layout/page-header";
import { Panel, PanelLink } from "@/components/layout/panel";
import { SubscriptionUrlField } from "@/components/subscription/subscription-url-field";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/hooks/use-async";
import {
  displayPaymentDescription,
  displayPlanLabel,
  useI18n,
} from "@/i18n";
import { daysUntil } from "@/lib/utils";
import { billingService } from "@/services/billing";
import { deviceService } from "@/services/devices";
import { networkService } from "@/services/network";
import { subscriptionService } from "@/services/subscription";

const SETUP_PLATFORMS = [
  { id: "windows", label: "Windows", icon: Monitor },
  { id: "macos", label: "macOS", icon: Laptop },
  { id: "ios", label: "iOS", icon: Smartphone },
  { id: "android", label: "Android", icon: TabletSmartphone },
  { id: "linux", label: "Linux", icon: Terminal },
];

export function ConsoleOverviewPage() {
  const subscription = useAsync(() => subscriptionService.getCurrent(), []);
  const devices = useAsync(() => deviceService.listDevices(), []);
  const payments = useAsync(() => billingService.listPayments(), []);
  const status = useAsync(() => networkService.getStatus(), []);
  const { t, dict, formatDate, formatCurrency } = useI18n();

  if (subscription.error) {
    return (
      <ErrorState
        message={t("console.overview.loadError")}
        onRetry={subscription.retry}
      />
    );
  }

  const sub = subscription.data;

  // Fresh account, no purchase yet — say so instead of an empty dashboard.
  if (!subscription.loading && !sub) {
    return (
      <div className="space-y-6">
        <PageHeader title={t("console.overview.title")} />
        <EmptyState
          icon={ShieldCheck}
          title={t("console.noAccess.title")}
          message={t("console.noAccess.body")}
          action={
            <Button asChild>
              <Link to="/plans">{t("console.noAccess.cta")}</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("console.overview.title")}
        actions={
          <Button asChild size="sm">
            <Link to="/plans">{t("console.renew")}</Link>
          </Button>
        }
      />

      {/* Service header — full width */}
      <Panel>
        {subscription.loading ? (
          <div className="space-y-3">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
        ) : (
          sub && (
            <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <h2 className="text-xl font-semibold text-foreground">
                  {t("common.serviceName")}
                </h2>
                <span className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-[13px] text-muted">
                  <StatusDot
                    tone={sub.status === "active" ? "success" : "neutral"}
                  />
                  {sub.status === "active"
                    ? t("common.statusActive")
                    : t("common.statusExpired")}
                </span>
              </div>
              <dl className="flex flex-wrap items-center gap-x-10 gap-y-3 text-sm">
                <div>
                  <dt className="text-xs text-subtle">
                    {t("console.overview.currentTerm")}
                  </dt>
                  <dd className="mt-1 font-medium text-foreground">
                    {displayPlanLabel(sub.planLabel, dict)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-subtle">
                    {t("console.overview.expires")}
                  </dt>
                  <dd className="mt-1 font-medium text-foreground">
                    {formatDate(sub.expiresAt)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-subtle">
                    {t("console.overview.remaining")}
                  </dt>
                  <dd className="mt-1 font-medium tabular-nums text-foreground">
                    {t("common.days", { count: daysUntil(sub.expiresAt) })}
                  </dd>
                </div>
              </dl>
            </div>
          )
        )}
      </Panel>

      {/* Subscription + device usage */}
      <div className="grid gap-6 xl:grid-cols-12">
        <Panel
          className="xl:col-span-8"
          title={t("console.overview.subscriptionPanel")}
          action={
            <PanelLink to="/console/subscription">
              {t("console.overview.manage")}
            </PanelLink>
          }
        >
          {subscription.loading ? (
            <Skeleton className="h-[42px] w-full" />
          ) : (
            sub && (
              <>
                <SubscriptionUrlField token={sub.subscriptionToken} />
                <p className="mt-2.5 text-[13px] text-subtle">
                  {t("console.overview.urlHint")}
                </p>
              </>
            )
          )}
        </Panel>

        <Panel
          className="xl:col-span-4"
          title={t("console.overview.devicesPanel")}
          action={
            <PanelLink to="/console/devices">
              {t("console.overview.manage")}
            </PanelLink>
          }
        >
          <p className="text-3xl font-semibold tabular-nums text-foreground">
            {devices.loading ? (
              <Skeleton className="inline-block h-8 w-20" />
            ) : (
              <>
                {devices.data?.length ?? 0}
                <span className="text-lg font-normal text-subtle">
                  {" "}
                  / {sub?.deviceLimit ?? "—"}
                </span>
              </>
            )}
          </p>
          <p className="mt-1.5 text-[13px] text-muted">
            {t("console.overview.devicesUsed")}
          </p>
        </Panel>
      </div>

      {/* Quick setup + network health */}
      <div className="grid gap-6 xl:grid-cols-12">
        <Panel
          className="xl:col-span-7"
          title={t("console.overview.quickSetup")}
          action={
            <PanelLink to="/console/setup">
              {t("console.overview.fullGuide")}
            </PanelLink>
          }
        >
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {SETUP_PLATFORMS.map((platform) => (
              <Link
                key={platform.id}
                to={`/console/setup?platform=${platform.id}`}
                className="group inline-flex items-center gap-2.5 rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground transition-[color,border-color,box-shadow] duration-150 hover:border-primary/40 hover:bg-surface hover:text-primary hover:shadow-card focus-ring"
              >
                <platform.icon className="size-4 text-muted transition-colors group-hover:text-primary" />
                {platform.label}
              </Link>
            ))}
          </div>
        </Panel>

        <Panel
          className="xl:col-span-5"
          title={t("console.overview.networkHealth")}
          action={
            <PanelLink to="/network">
              {t("console.overview.viewNetwork")}
            </PanelLink>
          }
        >
          {status.loading ? (
            <Skeleton className="h-5 w-56" />
          ) : (
            <>
              <p className="flex items-center gap-2.5 text-sm text-foreground">
                <StatusDot
                  tone={
                    status.data?.status === "operational" ? "success" : "warning"
                  }
                  pulse={status.data?.status === "operational"}
                />
                {status.data?.status === "operational"
                  ? t("common.allSystemsOperational")
                  : t("common.someRegionsDegraded")}
              </p>
              <p className="mt-2 text-[13px] text-muted">
                <span className="tabular-nums">
                  {status.data
                    ? t("console.overview.regionsCount", {
                        active: status.data.activeRegions,
                        total: status.data.totalRegions,
                      })
                    : "…"}
                </span>{" "}
                {t("console.overview.regionsAvailable")}
              </p>
            </>
          )}
        </Panel>
      </div>

      {/* Recent payments + billing summary */}
      <div className="grid gap-6 xl:grid-cols-12">
        <Panel
          className="xl:col-span-8"
          title={t("console.overview.recentPayments")}
          action={
            <PanelLink to="/console/billing">
              {t("console.overview.billing")}
            </PanelLink>
          }
          bodyClassName="pt-0 lg:pt-0"
        >
          {payments.loading ? (
            <Skeleton className="mt-4 h-32 w-full" />
          ) : !payments.data || payments.data.length === 0 ? (
            <p className="mt-4 text-sm text-muted">
              {t("console.overview.noPayments")}
            </p>
          ) : (
            <ul className="divide-y divide-border/70">
              {payments.data.slice(0, 3).map((payment) => (
                <li
                  key={payment.id}
                  className="flex items-center justify-between gap-4 py-3.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-foreground">
                      {displayPaymentDescription(payment.description, dict)}
                    </p>
                    <p className="mt-0.5 text-xs text-subtle">
                      {formatDate(payment.createdAt)} ·{" "}
                      <span className="font-mono">{payment.number}</span>
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-medium tabular-nums text-foreground">
                    {formatCurrency(payment.amount)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          className="xl:col-span-4"
          title={t("console.overview.billingSummary")}
          action={
            <Link
              to="/console/billing"
              className="inline-flex items-center gap-1 rounded-sm text-[13px] font-medium text-primary transition-colors hover:underline focus-ring"
            >
              {t("console.overview.details")}
              <ArrowRight className="size-3.5" />
            </Link>
          }
        >
          {subscription.loading ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            sub && (
              <>
                <dl className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-muted">
                      {t("console.overview.currentTerm")}
                    </dt>
                    <dd className="font-medium text-foreground">
                      {displayPlanLabel(sub.planLabel, dict)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted">
                      {t("console.overview.expires")}
                    </dt>
                    <dd className="font-medium text-foreground">
                      {formatDate(sub.expiresAt)}
                    </dd>
                  </div>
                </dl>
                <Button asChild variant="secondary" className="mt-5 w-full">
                  <Link to="/plans">{t("console.overview.renewAccess")}</Link>
                </Button>
              </>
            )
          )}
        </Panel>
      </div>
    </div>
  );
}
