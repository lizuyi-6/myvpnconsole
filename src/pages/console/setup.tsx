import { useSearchParams } from "react-router-dom";
import { StatusDot } from "@/components/feedback/status-dot";
import { PageHeader } from "@/components/layout/page-header";
import { Panel, PanelLink } from "@/components/layout/panel";
import { SideRail } from "@/components/layout/side-rail";
import { SetupGuide } from "@/components/setup/setup-guide";
import { SubscriptionUrlField } from "@/components/subscription/subscription-url-field";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/hooks/use-async";
import { deviceService } from "@/services/devices";
import { networkService } from "@/services/network";
import { subscriptionService } from "@/services/subscription";

export function ConsoleSetupPage() {
  const [searchParams] = useSearchParams();
  const platform = searchParams.get("platform");

  const subscription = useAsync(() => subscriptionService.getCurrent(), []);
  const devices = useAsync(() => deviceService.listDevices(), []);
  const status = useAsync(() => networkService.getStatus(), []);

  return (
    <div>
      <PageHeader
        title="Setup"
        description="Get a new device connected in a few minutes."
      />

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-12">
        <Panel className="xl:col-span-8">
          {/* key remounts the guide when arriving via a platform shortcut */}
          <SetupGuide key={platform ?? "default"} initialPlatform={platform} />
        </Panel>

        <SideRail className="xl:col-span-4">
          <Panel
            title="Your subscription"
            action={<PanelLink to="/console/subscription">Manage</PanelLink>}
          >
            {subscription.loading ? (
              <Skeleton className="h-[42px] w-full" />
            ) : subscription.data ? (
              <>
                <SubscriptionUrlField
                  token={subscription.data.subscriptionToken}
                />
                <dl className="mt-4 space-y-2.5 border-t border-border pt-4 text-[13px]">
                  <div className="flex items-center justify-between">
                    <dt className="text-muted">Devices</dt>
                    <dd className="font-medium tabular-nums text-foreground">
                      {devices.data
                        ? `${devices.data.length} / ${subscription.data.deviceLimit}`
                        : "…"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted">Network</dt>
                    <dd className="flex items-center gap-1.5 font-medium text-foreground">
                      <StatusDot
                        tone={
                          status.data?.status === "operational"
                            ? "success"
                            : "warning"
                        }
                      />
                      {status.data
                        ? status.data.status === "operational"
                          ? "Operational"
                          : "Degraded"
                        : "…"}
                    </dd>
                  </div>
                </dl>
              </>
            ) : (
              <p className="text-sm text-muted">
                Couldn't load your subscription.{" "}
                <button
                  onClick={subscription.retry}
                  className="rounded-sm text-primary hover:underline focus-ring"
                >
                  Retry
                </button>
              </p>
            )}
          </Panel>
        </SideRail>
      </div>
    </div>
  );
}
