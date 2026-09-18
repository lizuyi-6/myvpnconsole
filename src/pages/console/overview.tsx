import {
  ArrowRight,
  Laptop,
  Monitor,
  Smartphone,
  TabletSmartphone,
  Terminal,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ErrorState } from "@/components/feedback/error-state";
import { StatusDot } from "@/components/feedback/status-dot";
import { PageHeader } from "@/components/layout/page-header";
import { Panel, PanelLink } from "@/components/layout/panel";
import { SubscriptionUrlField } from "@/components/subscription/subscription-url-field";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/hooks/use-async";
import { daysUntil, formatCurrency, formatDate } from "@/lib/utils";
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

  if (subscription.error) {
    return (
      <ErrorState
        message="We couldn't load your subscription."
        onRetry={subscription.retry}
      />
    );
  }

  const sub = subscription.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        actions={
          <Button asChild size="sm">
            <Link to="/plans">Renew</Link>
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
                  {sub.name}
                </h2>
                <span className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-[13px] text-muted">
                  <StatusDot
                    tone={sub.status === "active" ? "success" : "neutral"}
                  />
                  {sub.status === "active" ? "Active" : "Expired"}
                </span>
              </div>
              <dl className="flex flex-wrap items-center gap-x-10 gap-y-3 text-sm">
                <div>
                  <dt className="text-xs text-subtle">Current term</dt>
                  <dd className="mt-1 font-medium text-foreground">
                    {sub.planLabel}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-subtle">Expires</dt>
                  <dd className="mt-1 font-medium text-foreground">
                    {formatDate(sub.expiresAt)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-subtle">Remaining</dt>
                  <dd className="mt-1 font-medium tabular-nums text-foreground">
                    {daysUntil(sub.expiresAt)} days
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
          title="Subscription"
          action={<PanelLink to="/console/subscription">Manage</PanelLink>}
        >
          {subscription.loading ? (
            <Skeleton className="h-[42px] w-full" />
          ) : (
            sub && (
              <>
                <SubscriptionUrlField token={sub.subscriptionToken} />
                <p className="mt-2.5 text-[13px] text-subtle">
                  Import this URL into a compatible client on any of your
                  devices.
                </p>
              </>
            )
          )}
        </Panel>

        <Panel
          className="xl:col-span-4"
          title="Devices"
          action={<PanelLink to="/console/devices">Manage</PanelLink>}
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
            Devices currently using your subscription.
          </p>
        </Panel>
      </div>

      {/* Quick setup + network health */}
      <div className="grid gap-6 xl:grid-cols-12">
        <Panel
          className="xl:col-span-7"
          title="Quick setup"
          action={<PanelLink to="/console/setup">Full guide</PanelLink>}
        >
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {SETUP_PLATFORMS.map((platform) => (
              <Link
                key={platform.id}
                to={`/console/setup?platform=${platform.id}`}
                className="inline-flex items-center gap-2.5 rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground transition-colors duration-150 hover:border-primary/40 hover:text-primary focus-ring"
              >
                <platform.icon className="size-4 text-muted" />
                {platform.label}
              </Link>
            ))}
          </div>
        </Panel>

        <Panel
          className="xl:col-span-5"
          title="Network health"
          action={<PanelLink to="/network">View network</PanelLink>}
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
                />
                {status.data?.status === "operational"
                  ? "All systems operational"
                  : "Some regions degraded"}
              </p>
              <p className="mt-2 text-[13px] text-muted">
                <span className="tabular-nums">
                  {status.data
                    ? `${status.data.activeRegions} of ${status.data.totalRegions}`
                    : "…"}
                </span>{" "}
                regions available
              </p>
            </>
          )}
        </Panel>
      </div>

      {/* Recent payments + billing summary */}
      <div className="grid gap-6 xl:grid-cols-12">
        <Panel
          className="xl:col-span-8"
          title="Recent payments"
          action={<PanelLink to="/console/billing">Billing</PanelLink>}
          bodyClassName="pt-0 lg:pt-0"
        >
          {payments.loading ? (
            <Skeleton className="mt-4 h-32 w-full" />
          ) : !payments.data || payments.data.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No payments yet.</p>
          ) : (
            <ul className="divide-y divide-border/70">
              {payments.data.slice(0, 3).map((payment) => (
                <li
                  key={payment.id}
                  className="flex items-center justify-between gap-4 py-3.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-foreground">
                      {payment.description}
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
          title="Billing summary"
          action={
            <Link
              to="/console/billing"
              className="inline-flex items-center gap-1 rounded-sm text-[13px] font-medium text-primary transition-colors hover:underline focus-ring"
            >
              Details
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
                    <dt className="text-muted">Current term</dt>
                    <dd className="font-medium text-foreground">
                      {sub.planLabel}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted">Expires</dt>
                    <dd className="font-medium text-foreground">
                      {formatDate(sub.expiresAt)}
                    </dd>
                  </div>
                </dl>
                <Button asChild variant="secondary" className="mt-5 w-full">
                  <Link to="/plans">Renew access</Link>
                </Button>
              </>
            )
          )}
        </Panel>
      </div>
    </div>
  );
}
