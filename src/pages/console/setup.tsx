import { useSearchParams } from "react-router-dom";
import { StatusDot } from "@/components/feedback/status-dot";
import { PageHeader } from "@/components/layout/page-header";
import { Panel, PanelLink } from "@/components/layout/panel";
import { SideRail } from "@/components/layout/side-rail";
import { SetupGuide } from "@/components/setup/setup-guide";
import { SubscriptionUrlField } from "@/components/subscription/subscription-url-field";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/hooks/use-async";
import { useI18n } from "@/i18n";
import { deviceService } from "@/services/devices";
import { networkService } from "@/services/network";
import { subscriptionService } from "@/services/subscription";

export function ConsoleSetupPage() {
  const [searchParams] = useSearchParams();
  const platform = searchParams.get("platform");
  const { t } = useI18n();

  const subscription = useAsync(() => subscriptionService.getCurrent(), []);
  const devices = useAsync(() => deviceService.listDevices(), []);
  const status = useAsync(() => networkService.getStatus(), []);

  return (
    <div>
      <PageHeader
        title={t("console.setup.title")}
        description={t("console.setup.description")}
      />

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-12">
        <Panel className="xl:col-span-8">
          {/* key remounts the guide when arriving via a platform shortcut */}
          <SetupGuide key={platform ?? "default"} initialPlatform={platform} />
        </Panel>

        <SideRail className="xl:col-span-4">
          <Panel
            title={t("console.setup.subscriptionPanel")}
            action={
              <PanelLink to="/console/subscription">
                {t("console.setup.manage")}
              </PanelLink>
            }
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
                    <dt className="text-muted">{t("console.setup.devices")}</dt>
                    <dd className="font-medium tabular-nums text-foreground">
                      {devices.data
                        ? `${devices.data.length} / ${subscription.data.deviceLimit}`
                        : "…"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted">{t("console.setup.network")}</dt>
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
                          ? t("common.statusOperational")
                          : t("common.statusDegraded")
                        : "…"}
                    </dd>
                  </div>
                </dl>
              </>
            ) : (
              <p className="text-sm text-muted">
                {t("common.couldntLoadSubscription")}{" "}
                <button
                  onClick={subscription.retry}
                  className="rounded-sm text-primary hover:underline focus-ring"
                >
                  {t("common.retry")}
                </button>
              </p>
            )}
          </Panel>
        </SideRail>
      </div>
    </div>
  );
}
