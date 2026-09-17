import { Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ErrorState } from "@/components/feedback/error-state";
import { StatusDot } from "@/components/feedback/status-dot";
import { SubscriptionUrlField } from "@/components/subscription/subscription-url-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { daysUntil, formatDate } from "@/lib/utils";
import { networkService } from "@/services/network";
import { subscriptionService } from "@/services/subscription";

export function ConsoleSubscriptionPage() {
  const subscription = useAsync(() => subscriptionService.getCurrent(), []);
  const regions = useAsync(() => networkService.listRegions(), []);

  const [token, setToken] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [regenerated, setRegenerated] = useState(false);

  if (subscription.loading) {
    return (
      <div>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="mt-6 h-40 w-full" />
      </div>
    );
  }

  if (subscription.error || !subscription.data) {
    return (
      <ErrorState
        message="We couldn't load your subscription."
        onRetry={subscription.retry}
      />
    );
  }

  const sub = subscription.data;
  const activeToken = token ?? sub.subscriptionToken;
  const remaining = daysUntil(sub.expiresAt);

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const result = await subscriptionService.regenerateLink();
      setToken(result.subscriptionToken);
      setRegenerated(true);
      setConfirmOpen(false);
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <div>
      <h1 className="text-lg font-semibold text-foreground">Subscription</h1>

      {/* Facts */}
      <section className="mt-6 border-t border-border py-6">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h2 className="text-xl font-semibold text-foreground">{sub.name}</h2>
          <span className="flex items-center gap-2 text-sm text-foreground">
            <StatusDot tone={sub.status === "active" ? "success" : "neutral"} />
            {sub.status === "active" ? "Active" : "Expired"}
          </span>
        </div>
        <dl className="mt-4 grid max-w-lg grid-cols-2 gap-x-10 gap-y-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs text-subtle">Expires</dt>
            <dd className="mt-0.5 text-foreground">
              {formatDate(sub.expiresAt)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-subtle">Remaining</dt>
            <dd className="mt-0.5 tabular-nums text-foreground">
              {remaining} days
            </dd>
          </div>
          <div>
            <dt className="text-xs text-subtle">Renewal term</dt>
            <dd className="mt-0.5 text-foreground">{sub.planLabel}</dd>
          </div>
        </dl>
        <div className="mt-5">
          <Button asChild variant="secondary" size="sm">
            <Link to="/plans">Renew</Link>
          </Button>
        </div>
      </section>

      {/* Subscription URL */}
      <section className="border-t border-border py-6">
        <h2 className="text-sm font-semibold text-foreground">
          Subscription URL
        </h2>
        <SubscriptionUrlField token={activeToken} className="mt-3 max-w-lg" />

        {regenerated && (
          <p className="mt-3 flex items-center gap-2 text-[13px] text-success">
            <StatusDot tone="success" />
            New link generated. Update any client using the previous URL.
          </p>
        )}

        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setConfirmOpen(true)}
          >
            <RefreshCw className="size-3.5" />
            Regenerate subscription URL
          </Button>
        </div>

        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent>
            <DialogTitle>Regenerate subscription URL?</DialogTitle>
            <DialogDescription>
              Existing subscription configurations will stop updating after
              regeneration. Clients using the old URL lose access until you
              import the new one.
            </DialogDescription>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setConfirmOpen(false)}
                disabled={regenerating}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleRegenerate}
                disabled={regenerating}
              >
                {regenerating ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Regenerating…
                  </>
                ) : (
                  "Regenerate"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </section>

      {/* Regions */}
      <section className="border-t border-border py-6">
        <h2 className="text-sm font-semibold text-foreground">Regions</h2>
        {regions.loading ? (
          <Skeleton className="mt-3 h-48 w-full" />
        ) : regions.error ? (
          <p className="mt-3 text-sm text-muted">
            Couldn't load regions.{" "}
            <button
              onClick={regions.retry}
              className="text-primary hover:underline focus-ring rounded-sm"
            >
              Retry
            </button>
          </p>
        ) : (
          <div className="mt-3 max-w-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Region</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {regions.data?.map((region) => (
                  <TableRow key={region.id}>
                    <TableCell className="text-foreground">
                      {region.name}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex items-center gap-2 text-muted">
                        <StatusDot
                          tone={
                            region.status === "available"
                              ? "success"
                              : region.status === "degraded"
                                ? "warning"
                                : "danger"
                          }
                        />
                        {region.status === "available"
                          ? "Available"
                          : region.status === "degraded"
                            ? "Degraded"
                            : "Offline"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>
    </div>
  );
}
