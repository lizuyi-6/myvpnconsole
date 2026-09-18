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
import { daysUntil, formatCurrency, formatDate } from "@/lib/utils";
import { billingService } from "@/services/billing";
import { subscriptionService } from "@/services/subscription";
import { PAYMENT_METHOD_LABELS, type PaymentStatus } from "@/types";

const PAYMENT_STATUS: Record<
  PaymentStatus,
  { label: string; tone: "success" | "warning" | "neutral" }
> = {
  completed: { label: "Completed", tone: "success" },
  processing: { label: "Processing", tone: "warning" },
  refunded: { label: "Refunded", tone: "neutral" },
};

export function ConsoleBillingPage() {
  const subscription = useAsync(() => subscriptionService.getCurrent(), []);
  const payments = useAsync(() => billingService.listPayments(), []);

  return (
    <div>
      <PageHeader
        title="Billing"
        description="Your current access term and payment history."
        actions={
          <Button asChild size="sm">
            <Link to="/plans">Renew</Link>
          </Button>
        }
      />

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-12">
        {/* Payment history */}
        <div className="xl:col-span-8">
          <Panel title="Payment history" bodyClassName="px-3 pb-3 pt-0 lg:px-3 lg:pb-3 lg:pt-0">
            {payments.loading ? (
              <Skeleton className="mt-4 h-48 w-full" />
            ) : payments.error ? (
              <div className="px-3 py-4">
                <ErrorState
                  message="We couldn't load payment history."
                  onRetry={payments.retry}
                />
              </div>
            ) : !payments.data || payments.data.length === 0 ? (
              <p className="px-3 py-4 text-sm text-muted">No payments yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="hidden md:table-cell">Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Status</TableHead>
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
                          {payment.description}
                        </span>
                        <span className="block font-mono text-xs text-subtle">
                          {payment.number}
                        </span>
                      </TableCell>
                      <TableCell className="hidden text-muted md:table-cell">
                        {PAYMENT_METHOD_LABELS[payment.method]}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-foreground">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="inline-flex items-center gap-2 text-muted">
                          <StatusDot
                            tone={PAYMENT_STATUS[payment.status].tone}
                          />
                          {PAYMENT_STATUS[payment.status].label}
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
          <Panel title="Current access">
            {subscription.loading ? (
              <Skeleton className="h-32 w-full" />
            ) : subscription.error || !subscription.data ? (
              <p className="text-sm text-muted">
                Couldn't load your plan.{" "}
                <button
                  onClick={subscription.retry}
                  className="rounded-sm text-primary hover:underline focus-ring"
                >
                  Retry
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
                  {subscription.data.name} — {subscription.data.planLabel}
                </p>
                <dl className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-muted">Expires</dt>
                    <dd className="font-medium text-foreground">
                      {formatDate(subscription.data.expiresAt)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted">Remaining</dt>
                    <dd className="font-medium tabular-nums text-foreground">
                      {daysUntil(subscription.data.expiresAt)} days
                    </dd>
                  </div>
                </dl>
                <Button asChild className="mt-6 w-full">
                  <Link to="/plans">Renew access</Link>
                </Button>
                <p className="mt-3 text-[13px] leading-relaxed text-muted">
                  Renewing before expiry extends your current end date — no
                  paid time is lost.
                </p>
              </>
            )}
          </Panel>

          <Panel title="Refund policy">
            <p className="text-sm leading-relaxed text-muted">
              First purchases can be refunded within 7 days; renewals within
              3 days.
            </p>
            <div className="mt-4 border-t border-border pt-4">
              <PanelLink to="/legal/refunds">Read the refund policy</PanelLink>
            </div>
          </Panel>
        </SideRail>
      </div>
    </div>
  );
}
