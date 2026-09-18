import { Link } from "react-router-dom";
import { ErrorState } from "@/components/feedback/error-state";
import { StatusDot } from "@/components/feedback/status-dot";
import { PageHeader } from "@/components/layout/page-header";
import { Panel, PanelLink } from "@/components/layout/panel";
import { SideRail } from "@/components/layout/side-rail";
import { Button } from "@/components/ui/button";
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
import {
  displayPaymentDescription,
  displayPlanLabel,
  useI18n,
} from "@/i18n";
import { daysUntil } from "@/lib/utils";
import { billingService } from "@/services/billing";
import { subscriptionService } from "@/services/subscription";
import type { PaymentStatus } from "@/types";

const PAYMENT_STATUS_TONE: Record<PaymentStatus, "success" | "warning" | "neutral"> = {
  completed: "success",
  processing: "warning",
  refunded: "neutral",
};

export function ConsoleBillingPage() {
  const subscription = useAsync(() => subscriptionService.getCurrent(), []);
  const payments = useAsync(() => billingService.listPayments(), []);
  const { t, dict, formatDate, formatCurrency } = useI18n();

  return (
    <div>
      <PageHeader
        title={t("console.billing.title")}
        description={t("console.billing.description")}
        actions={
          <Button asChild size="sm">
            <Link to="/plans">{t("console.renew")}</Link>
          </Button>
        }
      />

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-12">
        {/* Payment history */}
        <div className="xl:col-span-8">
          <Panel
            title={t("console.billing.historyPanel")}
            bodyClassName="px-3 pb-3 pt-0 lg:px-3 lg:pb-3 lg:pt-0"
          >
            {payments.loading ? (
              <Skeleton className="mt-4 h-48 w-full" />
            ) : payments.error ? (
              <div className="px-3 py-4">
                <ErrorState
                  message={t("console.billing.loadError")}
                  onRetry={payments.retry}
                />
              </div>
            ) : !payments.data || payments.data.length === 0 ? (
              <p className="px-3 py-4 text-sm text-muted">
                {t("console.billing.noPayments")}
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("console.billing.colDate")}</TableHead>
                    <TableHead>{t("console.billing.colDescription")}</TableHead>
                    <TableHead className="hidden md:table-cell">
                      {t("console.billing.colMethod")}
                    </TableHead>
                    <TableHead className="text-right">
                      {t("console.billing.colAmount")}
                    </TableHead>
                    <TableHead className="text-right">
                      {t("console.billing.colStatus")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.data.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="whitespace-nowrap text-muted">
                        {formatDate(payment.createdAt)}
                      </TableCell>
                      <TableCell>
                        <span className="block text-foreground">
                          {displayPaymentDescription(payment.description, dict)}
                        </span>
                        <span className="block font-mono text-xs text-subtle">
                          {payment.number}
                        </span>
                      </TableCell>
                      <TableCell className="hidden text-muted md:table-cell">
                        {t(`common.paymentMethod.${payment.method}`)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-foreground">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="inline-flex items-center gap-2 text-muted">
                          <StatusDot
                            tone={PAYMENT_STATUS_TONE[payment.status]}
                          />
                          {t(`common.paymentStatus.${payment.status}`)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Panel>
        </div>

        {/* Current access — sticky */}
        <SideRail className="xl:col-span-4">
          <Panel title={t("console.billing.accessPanel")}>
            {subscription.loading ? (
              <Skeleton className="h-32 w-full" />
            ) : subscription.error || !subscription.data ? (
              <p className="text-sm text-muted">
                {t("console.billing.couldntLoadPlan")}{" "}
                <button
                  onClick={subscription.retry}
                  className="rounded-sm text-primary hover:underline focus-ring"
                >
                  {t("common.retry")}
                </button>
              </p>
            ) : (
              <>
                <p className="flex items-center gap-2.5 text-sm text-foreground">
                  <StatusDot
                    tone={
                      subscription.data.status === "active"
                        ? "success"
                        : "neutral"
                    }
                  />
                  {t("common.serviceName")} —{" "}
                  {displayPlanLabel(subscription.data.planLabel, dict)}
                </p>
                <dl className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-muted">
                      {t("console.billing.expires")}
                    </dt>
                    <dd className="font-medium text-foreground">
                      {formatDate(subscription.data.expiresAt)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted">
                      {t("console.billing.remaining")}
                    </dt>
                    <dd className="font-medium tabular-nums text-foreground">
                      {t("common.days", {
                        count: daysUntil(subscription.data.expiresAt),
                      })}
                    </dd>
                  </div>
                </dl>
                <Button asChild className="mt-6 w-full">
                  <Link to="/plans">{t("console.billing.renewAccess")}</Link>
                </Button>
                <p className="mt-3 text-[13px] leading-relaxed text-muted">
                  {t("console.billing.renewNote")}
                </p>
              </>
            )}
          </Panel>

          <Panel title={t("console.billing.refundPanel")}>
            <p className="text-sm leading-relaxed text-muted">
              {t("console.billing.refundBody")}
            </p>
            <div className="mt-4 border-t border-border pt-4">
              <PanelLink to="/legal/refunds">
                {t("console.billing.refundLink")}
              </PanelLink>
            </div>
          </Panel>
        </SideRail>
      </div>
    </div>
  );
}
