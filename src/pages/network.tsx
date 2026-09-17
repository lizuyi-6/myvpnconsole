import { ErrorState } from "@/components/feedback/error-state";
import { StatusDot } from "@/components/feedback/status-dot";
import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAsync } from "@/hooks/use-async";
import { networkService } from "@/services/network";
import type { RegionStatus } from "@/types";

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

export function NetworkPage() {
  const regions = useAsync(() => networkService.listRegions(), []);
  const status = useAsync(() => networkService.getStatus(), []);

  return (
    <Container className="py-12 md:py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Network
      </h1>
      <p className="mt-1.5 text-sm text-muted">
        Region availability and current service status.
      </p>

      {/* Service status — a statement, not a card */}
      <div className="mt-8 border-y border-border py-4">
        {status.loading ? (
          <Skeleton className="h-5 w-56" />
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
          <p className="flex items-center gap-2 text-sm text-foreground">
            <StatusDot
              tone={status.data?.status === "operational" ? "success" : "warning"}
            />
            {status.data?.status === "operational"
              ? "All systems operational"
              : "Some regions degraded"}
            <span className="text-subtle">
              · {status.data?.activeRegions} of {status.data?.totalRegions}{" "}
              regions available
            </span>
          </p>
        )}
      </div>

      {/* Regions */}
      <div className="mt-8">
        {regions.loading ? (
          <Skeleton className="h-72 w-full" />
        ) : regions.error ? (
          <ErrorState
            message="We couldn't load region information."
            onRetry={regions.retry}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Region</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Latency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regions.data?.map((region) => (
                <TableRow key={region.id}>
                  <TableCell className="text-foreground">{region.name}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-2 text-muted">
                      <StatusDot tone={STATUS_TONE[region.status]} />
                      {STATUS_LABEL[region.status]}
                    </span>
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted">
                    {region.latencyMs !== null ? `${region.latencyMs} ms` : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <p className="mt-3 text-xs text-subtle">
          Latency is indicative from our monitoring point and varies with your
          own connection.
        </p>
      </div>
    </Container>
  );
}
