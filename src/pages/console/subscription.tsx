import { Loader2, RefreshCw, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ErrorState } from "@/components/feedback/error-state";
import { StatusDot } from "@/components/feedback/status-dot";
import { PageHeader } from "@/components/layout/page-header";
import { Panel, PanelLink } from "@/components/layout/panel";
import { SideRail } from "@/components/layout/side-rail";
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
import { displayPlanLabel, useI18n } from "@/i18n";
import { daysUntil } from "@/lib/utils";
import { networkService } from "@/services/network";
import { subscriptionService } from "@/services/subscription";

export function ConsoleSubscriptionPage() {
  const subscription = useAsync(() => subscriptionService.getCurrent(), []);
  const regions = useAsync(() => networkService.listRegions(), []);
  const status = useAsync(() => networkService.getStatus(), []);
  const { t, dict, formatDate } = useI18n();

  const [token, setToken] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [regenerated, setRegenerated] = useState(false);

  if (subscription.loading) {
    return (
      <div>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-6 h-40 w-full" />
      </div>
    );
  }

  if (subscription.error || !subscription.data) {
    return (
      <ErrorState
        message={t("console.subscription.loadError")}
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
      <PageHeader
        title={t("console.subscription.title")}
        actions={
          <Button asChild size="sm">
            <Link to="/plans">{t("console.renew")}</Link>
          </Button>
        }
      />

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-12">
        {/* Main column */}
        <div className="space-y-6 xl:col-span-8">
          {/* Facts */}
          <Panel>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <h2 className="text-lg font-semibold text-foreground">
                {t("common.serviceName")}
              </h2>
              <span className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-[13px] text-muted">
                <StatusDot tone={sub.status === "active" ? "success" : "neutral"} />
                {sub.status === "active"
                  ? t("common.statusActive")
                  : t("common.statusExpired")}
              </span>
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-x-10 gap-y-5 text-sm sm:grid-cols-4">
              <div>
                <dt className="text-xs text-subtle">
                  {t("console.subscription.expires")}
                </dt>
                <dd className="mt-1 text-[15px] font-medium text-foreground">
                  {formatDate(sub.expiresAt)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-subtle">
                  {t("console.subscription.remaining")}
                </dt>
                <dd className="mt-1 text-[15px] font-medium tabular-nums text-foreground">
                  {t("common.days", { count: remaining })}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-subtle">
                  {t("console.subscription.renewalTerm")}
                </dt>
                <dd className="mt-1 text-[15px] font-medium text-foreground">
                  {displayPlanLabel(sub.planLabel, dict)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-subtle">
                  {t("console.subscription.deviceLimit")}
                </dt>
                <dd className="mt-1 text-[15px] font-medium tabular-nums text-foreground">
                  {sub.deviceLimit}
                </dd>
              </div>
            </dl>
          </Panel>

          {/* Subscription URL */}
          <Panel title={t("console.subscription.urlPanel")}>
            <SubscriptionUrlField token={activeToken} />

            {regenerated && (
              <p className="mt-3 flex items-center gap-2 text-[13px] text-success">
                <StatusDot tone="success" />
                {t("console.subscription.regeneratedNote")}
              </p>
            )}

            <p className="mt-4 border-t border-border pt-4 text-[13px] leading-relaxed text-muted">
              {t("console.subscription.urlBody")}
            </p>
          </Panel>

          {/* Regions */}
          <Panel
            title={t("console.subscription.regionsPanel")}
            action={
              <PanelLink to="/network">
                {t("console.subscription.fullStatus")}
              </PanelLink>
            }
            bodyClassName="pt-0 lg:pt-0"
          >
            {regions.loading ? (
              <Skeleton className="mt-4 h-48 w-full" />
            ) : regions.error ? (
              <p className="mt-4 text-sm text-muted">
                {t("console.subscription.couldntLoadRegions")}{" "}
                <button
                  onClick={regions.retry}
                  className="rounded-sm text-primary hover:underline focus-ring"
                >
                  {t("common.retry")}
                </button>
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("console.subscription.colRegion")}</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      {t("console.subscription.colArea")}
                    </TableHead>
                    <TableHead className="hidden text-right md:table-cell">
                      {t("console.subscription.colLatency")}
                    </TableHead>
                    <TableHead className="text-right">
                      {t("console.subscription.colStatus")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {regions.data?.map((region) => (
                    <TableRow key={region.id}>
                      <TableCell className="font-medium text-foreground">
                        {dict.common.regionNames[
                          region.id as keyof typeof dict.common.regionNames
                        ] ?? region.name}
                      </TableCell>
                      <TableCell className="hidden text-muted sm:table-cell">
                        {t(`common.areas.${region.area}`)}
                      </TableCell>
                      <TableCell className="hidden text-right tabular-nums text-muted md:table-cell">
                        {region.latencyMs !== null
                          ? `${region.latencyMs} ms`
                          : "—"}
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
                          {t(`common.regionStatus.${region.status}`)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Panel>
        </div>

        {/* Context rail */}
        <SideRail className="xl:col-span-4">
          <Panel title={t("console.subscription.securityPanel")}>
            <p className="flex items-start gap-3 text-sm leading-relaxed text-muted">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-subtle" />
              {t("console.subscription.securityBody")}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setConfirmOpen(true)}
            >
              <RefreshCw className="size-3.5" />
              {t("console.subscription.regenerate")}
            </Button>
          </Panel>

          <Panel title={t("console.subscription.quickSetup")}>
            <p className="text-sm leading-relaxed text-muted">
              {t("console.subscription.quickSetupBody")}
            </p>
            <div className="mt-4 border-t border-border pt-4">
              <PanelLink to="/console/setup">
                {t("console.subscription.openGuide")}
              </PanelLink>
            </div>
          </Panel>

          <Panel title={t("console.subscription.statusPanel")}>
            {status.loading ? (
              <Skeleton className="h-5 w-40" />
            ) : (
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
            )}
            <div className="mt-4 border-t border-border pt-4">
              <PanelLink to="/network">
                {t("console.subscription.viewNetwork")}
              </PanelLink>
            </div>
          </Panel>
        </SideRail>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogTitle>{t("console.subscription.dialog.title")}</DialogTitle>
          <DialogDescription>
            {t("console.subscription.dialog.body")}
          </DialogDescription>
          <div className="mt-6 flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setConfirmOpen(false)}
              disabled={regenerating}
            >
              {t("common.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleRegenerate}
              disabled={regenerating}
            >
              {regenerating ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {t("console.subscription.dialog.confirming")}
                </>
              ) : (
                t("console.subscription.dialog.confirm")
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
