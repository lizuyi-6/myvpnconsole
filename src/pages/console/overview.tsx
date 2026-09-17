import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ErrorState } from "@/components/feedback/error-state";
import { StatusDot } from "@/components/feedback/status-dot";
import { SubscriptionUrlField } from "@/components/subscription/subscription-url-field";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/hooks/use-async";
import { daysUntil, formatDate } from "@/lib/utils";
import { deviceService } from "@/services/devices";
import { networkService } from "@/services/network";
import { subscriptionService } from "@/services/subscription";

const SETUP_PLATFORMS = [
  { id: "windows", label: "Windows" },
  { id: "macos", label: "macOS" },
  { id: "ios", label: "iPhone / iPad" },
  { id: "android", label: "Android" },
  { id: "linux", label: "Linux" },
];

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

  return (
    <div>
      <h1 className="text-lg font-semibold text-foreground">Overview</h1>

      {/* Service summary — plain data rows, no KPI cards */}
      <section className="mt-6 border-t border-border">
        {subscription.loading ? (
          <div className="space-y-3 py-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
        ) : (
          subscription.data && (
            <div className="py-6">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h2 className="text-xl font-semibold text-foreground">
                  {subscription.data.name}
                </h2>
                <span className="flex items-center gap-2 text-sm text-foreground">
                  <StatusDot
                    tone={
                      subscription.data.status === "active"
                        ? "success"
                        : "neutral"
                    }
                  />
                  {subscription.data.status === "active"
                    ? "Active"
                    : "Expired"}
                </span>
              </div>
              <dl className="mt-4 flex flex-wrap gap-x-10 gap-y-3 text-sm">
                <div>
                  <dt className="text-xs text-subtle">Expires</dt>
                  <dd className="mt-0.5 text-foreground">
                    {formatDate(subscription.data.expiresAt)}
                    <span className="ml-2 text-subtle">
                      {daysUntil(subscription.data.expiresAt)} days remaining
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-subtle">Devices</dt>
                  <dd className="mt-0.5 tabular-nums text-foreground">
                    {devices.loading ? (
                      <Skeleton className="inline-block h-4 w-12" />
                    ) : (
                      `${devices.data?.length ?? 0} / ${subscription.data.deviceLimit}`
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          )
        )}
      </section>

      {/* Subscription URL */}
      {subscription.data && (
        <section className="border-t border-border py-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              Subscription
            </h2>
            <Link
              to="/console/subscription"
              className="inline-flex items-center gap-1 text-[13px] text-muted transition-colors hover:text-foreground focus-ring rounded-sm"
            >
              Manage
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <SubscriptionUrlField
            token={subscription.data.subscriptionToken}
            className="mt-3 max-w-lg"
          />
        </section>
      )}

      {/* Setup shortcuts */}
      <section className="border-t border-border py-6">
        <h2 className="text-sm font-semibold text-foreground">
          Set up a device
        </h2>
        <ul className="mt-3 divide-y divide-border/60">
          {SETUP_PLATFORMS.map((platform) => (
            <li key={platform.id}>
              <Link
                to={`/console/setup?platform=${platform.id}`}
                className="flex items-center justify-between py-2.5 text-sm text-muted transition-colors hover:text-foreground focus-ring rounded-sm"
              >
                {platform.label}
                <ArrowRight className="size-3.5 text-subtle" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Service status */}
      <section className="border-t border-border py-6">
        <h2 className="text-sm font-semibold text-foreground">
          Service status
        </h2>
        {status.loading ? (
          <Skeleton className="mt-3 h-4 w-56" />
        ) : (
          <p className="mt-3 flex items-center gap-2 text-sm text-muted">
            <StatusDot
              tone={status.data?.status === "operational" ? "success" : "warning"}
            />
            <span className="text-foreground">
              {status.data?.status === "operational"
                ? "All systems operational"
                : "Some regions degraded"}
            </span>
            <Link
              to="/network"
              className="text-primary hover:underline focus-ring rounded-sm"
            >
              View network
            </Link>
          </p>
        )}
      </section>
    </div>
  );
}
