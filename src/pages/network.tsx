import { ErrorState } from "@/components/feedback/error-state";
import { StatusDot } from "@/components/feedback/status-dot";
import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/hooks/use-async";
import { networkService } from "@/services/network";
import type { Region, RegionArea, RegionStatus } from "@/types";

const STATUS_LABEL: Record<RegionStatus, string> = {
  available: "Available",
  degraded: "Degraded",
  offline: "Offline",
};

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

export function NetworkPage() {
  const regions = useAsync(() => networkService.listRegions(), []);
  const status = useAsync(() => networkService.getStatus(), []);

  return (
    <Container className="max-w-[1000px] py-14 md:py-20">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        Network
      </h1>
      <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
        Region availability and current service status — always public,
        updated continuously.
      </p>

      {/* Service status panel */}
      <div className="mt-10 rounded-xl border border-border bg-surface px-6 py-5 shadow-card">
        {status.loading ? (
          <Skeleton className="h-5 w-64" />
        ) : status.error ? (
          <p className="text-sm text-muted">
            Status unavailable right now.{" "}
            <button
              onClick={status.retry}
              className="text-primary hover:underline focus-ring rounded-sm"
            >
              Retry
            </button>
          </p>
        ) : (
          <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[15px] text-foreground">
            <StatusDot
              tone={status.data?.status === "operational" ? "success" : "warning"}
            />
            <span className="font-medium">
              {status.data?.status === "operational"
                ? "All systems operational"
                : "Some regions degraded"}
            </span>
            <span className="text-muted">
              · {status.data?.activeRegions} of {status.data?.totalRegions}{" "}
              regions available
            </span>
          </p>
        )}
      </div>

      {/* Regions, grouped by area */}
      <div className="mt-8">
        {regions.loading ? (
          <Skeleton className="h-96 w-full" />
        ) : regions.error ? (
          <ErrorState
            message="We couldn't load region information."
            onRetry={regions.retry}
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
            <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-border bg-background/60 px-6 py-3 text-xs font-medium uppercase tracking-wide text-subtle sm:grid-cols-[1fr_120px_90px]">
              <span>Region</span>
              <span>Status</span>
              <span className="text-right">Latency</span>
            </div>
            {groupByArea(regions.data ?? []).map((group) => (
              <div key={group.area}>
                <p className="border-b border-border/70 bg-background/40 px-6 py-2.5 text-xs font-medium uppercase tracking-wide text-subtle">
                  {group.area}
                </p>
                <ul className="divide-y divide-border/70">
                  {group.regions.map((region) => (
                    <li
                      key={region.id}
                      className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-6 py-3.5 text-sm sm:grid-cols-[1fr_120px_90px]"
                    >
                      <span className="text-foreground">{region.name}</span>
                      <span className="inline-flex items-center gap-2 text-muted">
                        <StatusDot tone={STATUS_TONE[region.status]} />
                        {STATUS_LABEL[region.status]}
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
        <p className="mt-3 text-xs text-subtle">
          Latency is indicative from our monitoring point and varies with your
          own connection.
        </p>
      </div>
    </Container>
  );
}
