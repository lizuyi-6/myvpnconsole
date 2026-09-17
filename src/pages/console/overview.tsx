import {
  Laptop,
  Monitor,
  Smartphone,
  TabletSmartphone,
  Terminal,
  ArrowRight,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ErrorState } from "@/components/feedback/error-state";
import { StatusDot } from "@/components/feedback/status-dot";
import { SubscriptionUrlField } from "@/components/subscription/subscription-url-field";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/hooks/use-async";
import { daysUntil, formatDate } from "@/lib/utils";
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

function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-surface p-6 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function PanelLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1 text-[13px] font-medium text-primary transition-colors hover:underline focus-ring rounded-sm"
    >
      {children}
      <ArrowRight className="size-3.5" />
    </Link>
  );
}

export function ConsoleOverviewPage() {
  const subscription = useAsync(() => subscriptionService.getCurrent(), []);
  const devices = useAsync(() => deviceService.listDevices(), []);
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
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Overview
      </h1>

      {/* Service summary */}
      <section className="mt-6 rounded-xl border border-border bg-surface p-6 shadow-card sm:p-7">
        {subscription.loading ? (
          <div className="space-y-3">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
        ) : (
          sub && (
            <div className="flex flex-wrap items-center justify-between gap-5">
              <div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h2 className="text-xl font-semibold text-foreground">
                    {sub.name}
                  </h2>
                  <span className="flex items-center gap-2 text-sm text-muted">
                    <StatusDot
                      tone={sub.status === "active" ? "success" : "neutral"}
                    />
                    {sub.status === "active" ? "Active" : "Expired"}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-muted">
                  Expires {formatDate(sub.expiresAt)} ·{" "}
                  <span className="tabular-nums">
                    {daysUntil(sub.expiresAt)} days remaining
                  </span>
                </p>
              </div>
              <Button asChild>
                <Link to="/plans">Renew</Link>
              </Button>
            </div>
          )
        )}
      </section>

      {/* Subscription + devices */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel
          title="Subscription"
          action={<PanelLink to="/console/subscription">Manage</PanelLink>}
        >
          {subscription.loading ? (
            <Skeleton className="mt-4 h-[42px] w-full" />
          ) : (
            sub && (
              <>
                <SubscriptionUrlField
                  token={sub.subscriptionToken}
                  className="mt-4"
                />
                <p className="mt-2.5 text-[13px] text-subtle">
                  Import this URL into a compatible client on any of your
                  devices.
                </p>
              </>
            )
          )}
        </Panel>

        <Panel
          title="Devices"
          action={<PanelLink to="/console/devices">Manage</PanelLink>}
        >
          <p className="mt-4 text-2xl font-semibold tabular-nums text-foreground">
            {devices.loading ? (
              <Skeleton className="inline-block h-7 w-16" />
            ) : (
              <>
                {devices.data?.length ?? 0}
                <span className="text-base font-normal text-subtle">
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

      {/* Quick setup */}
      <div className="mt-6">
        <Panel
          title="Quick setup"
          action={<PanelLink to="/console/setup">Full guide</PanelLink>}
        >
          <div className="mt-4 flex flex-wrap gap-2.5">
            {SETUP_PLATFORMS.map((platform) => (
              <Link
                key={platform.id}
                to={`/console/setup?platform=${platform.id}`}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground transition-colors duration-150 hover:border-primary/40 hover:text-primary focus-ring"
              >
                <platform.icon className="size-4 text-muted" />
                {platform.label}
              </Link>
            ))}
          </div>
        </Panel>
      </div>

      {/* Network status */}
      <div className="mt-6">
        <Panel title="Network status">
          {status.loading ? (
            <Skeleton className="mt-4 h-4 w-56" />
          ) : (
            <p className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-muted">
              <StatusDot
                tone={status.data?.status === "operational" ? "success" : "warning"}
              />
              <span className="text-foreground">
                {status.data?.status === "operational"
                  ? "All systems operational"
                  : "Some regions degraded"}
              </span>
              <PanelLink to="/network">View network</PanelLink>
            </p>
          )}
        </Panel>
      </div>
    </div>
  );
}
