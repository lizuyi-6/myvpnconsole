import { LifeBuoy, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { ErrorState } from "@/components/feedback/error-state";
import { StatusDot } from "@/components/feedback/status-dot";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Panel, PanelLink } from "@/components/layout/panel";
import { SideRail } from "@/components/layout/side-rail";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/hooks/use-async";
import { useI18n } from "@/i18n";
import { networkService } from "@/services/network";
import type { Region, RegionArea, RegionStatus } from "@/types";

const STATUS_TONE: Record<RegionStatus, "success" | "warning" | "danger"> = {
  available: "success",
  degraded: "warning",
  offline: "danger",
};

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

function StatusRailPanel() {
  const status = useAsync(() => networkService.getStatus(), []);
  const { t } = useI18n();
  return (
    <Panel title={t("network.statusPanel")}>
      {status.loading ? (
        <Skeleton className="h-5 w-44" />
      ) : (
        <>
          <p className="flex items-center gap-2.5 text-[15px] font-medium text-foreground">
            <StatusDot
              tone={status.data?.status === "operational" ? "success" : "warning"}
              pulse={status.data?.status === "operational"}
            />
            {status.data?.status === "operational"
              ? t("common.allSystemsOperational")
              : t("common.someRegionsDegraded")}
          </p>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted">{t("network.availableRegions")}</dt>
              <dd className="font-medium tabular-nums text-foreground">
                {status.data
                  ? `${status.data.activeRegions} / ${status.data.totalRegions}`
                  : "—"}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted">{t("network.coverage")}</dt>
              <dd className="text-foreground">
                {t("network.coverageValue", { count: AREA_ORDER.length })}
              </dd>
            </div>
          </dl>
        </>
      )}
    </Panel>
  );
}

export function NetworkPage() {
  const regions = useAsync(() => networkService.listRegions(), []);
  const { t, dict } = useI18n();
  const groups = groupByArea(regions.data ?? []);

  const regionName = (region: Region) =>
    dict.common.regionNames[region.id as keyof typeof dict.common.regionNames] ??
    region.name;

  return (
    <Container className="py-12 md:py-16 lg:py-20">
      <PageHeader
        size="lg"
        title={t("network.title")}
        description={t("network.description")}
      />

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
        {/* Region table — the primary desktop surface */}
        <div className="order-2 lg:order-1 lg:col-span-8">
          {regions.loading ? (
            <Skeleton className="h-[480px] w-full" />
          ) : regions.error ? (
            <ErrorState
              message={t("network.loadError")}
              onRetry={regions.retry}
            />
          ) : (
            <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
              <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-border bg-background/60 px-6 py-3 text-xs font-medium uppercase tracking-wide text-subtle sm:grid-cols-[1.2fr_1fr_120px_90px] lg:px-7">
                <span>{t("network.colRegion")}</span>
                <span className="hidden sm:block">{t("network.colArea")}</span>
                <span>{t("network.colStatus")}</span>
                <span className="text-right">{t("network.colLatency")}</span>
              </div>
              {groups.map((group) => (
                <div key={group.area}>
                  <p className="flex items-center justify-between border-b border-border/70 bg-background/40 px-6 py-2.5 text-xs font-medium uppercase tracking-wide text-subtle lg:px-7">
                    {t(`common.areas.${group.area}`)}
                    <span className="tabular-nums normal-case tracking-normal">
                      {t(
                        group.regions.length === 1
                          ? "common.regionsOne"
                          : "common.regionsMany",
                        { count: group.regions.length },
                      )}
                    </span>
                  </p>
                  <ul className="divide-y divide-border/70">
                    {group.regions.map((region) => (
                      <li
                        key={region.id}
                        className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-6 py-4 text-sm sm:grid-cols-[1.2fr_1fr_120px_90px] lg:px-7"
                      >
                        <span className="font-medium text-foreground">
                          {regionName(region)}
                        </span>
                        <span className="hidden text-muted sm:block">
                          {t(`common.areas.${region.area}`)}
                        </span>
                        <span className="inline-flex items-center gap-2 text-muted">
                          <StatusDot tone={STATUS_TONE[region.status]} />
                          {t(`common.regionStatus.${region.status}`)}
                        </span>
                        <span className="text-right tabular-nums text-muted">
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
          <p className="mt-3 text-xs text-subtle">{t("network.latencyNote")}</p>
        </div>

        {/* Context rail */}
        <SideRail className="order-1 lg:order-2 lg:col-span-4">
          <StatusRailPanel />

          <Panel title={t("network.areaPanel")}>
            {regions.loading ? (
              <Skeleton className="h-28 w-full" />
            ) : (
              <ul className="space-y-3 text-sm">
                {groups.map((group) => {
                  const available = group.regions.filter(
                    (r) => r.status === "available",
                  ).length;
                  return (
                    <li
                      key={group.area}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="flex items-center gap-2.5 text-foreground">
                        <StatusDot
                          tone={
                            available === group.regions.length
                              ? "success"
                              : available === 0
                                ? "danger"
                                : "warning"
                          }
                        />
                        {t(`common.areas.${group.area}`)}
                      </span>
                      <span className="tabular-nums text-muted">
                        {available}/{group.regions.length}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>

          <Panel title={t("network.issuesPanel")}>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Wrench className="mt-0.5 size-4 shrink-0 text-subtle" />
                <span className="text-muted">
                  {t("network.issueSetupPre")}
                  <Link
                    to="/setup"
                    className="rounded-sm text-primary hover:underline focus-ring"
                  >
                    {t("network.issueSetupLink")}
                  </Link>
                  {t("network.issueSetupPost")}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <LifeBuoy className="mt-0.5 size-4 shrink-0 text-subtle" />
                <span className="text-muted">
                  {t("network.issueSupportPre")}
                  <Link
                    to="/console/support"
                    className="rounded-sm text-primary hover:underline focus-ring"
                  >
                    {t("network.issueSupportLink")}
                  </Link>
                  {t("network.issueSupportPost")}
                </span>
              </li>
            </ul>
            <div className="mt-5 border-t border-border pt-4">
              <PanelLink to="/help">{t("network.browseHelp")}</PanelLink>
            </div>
          </Panel>
        </SideRail>
      </div>
    </Container>
  );
}
