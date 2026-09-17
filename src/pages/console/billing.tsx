import { Link } from "react-router-dom";
import { ErrorState } from "@/components/feedback/error-state";
import { StatusDot } from "@/components/feedback/status-dot";
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
import { formatCurrency, formatDate } from "@/lib/utils";
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
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Billing</h1>

      {/* Current plan */}
      <section className="mt-6 rounded-xl border border-border bg-surface p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-[15px] font-semibold text-foreground">Current plan</h2>
          <Button asChild variant="secondary" size="sm">
            <Link to="/plans">Renew</Link>
          </Button>
        </div>
        {subscription.loading ? (
          <Skeleton className="mt-4 h-10 w-full max-w-lg" />
        ) : subscription.error || !subscription.data ? (
          <p className="mt-4 text-sm text-muted">
            Couldn't load your plan.{" "}
            <button
              onClick={subscription.retry}
              className="text-primary hover:underline focus-ring rounded-sm"
            >
              Retry
            </button>
          </p>
        ) : (
          <dl className="mt-4 flex flex-wrap gap-x-12 gap-y-3 text-sm">
            <div>
              <dt className="text-xs text-subtle">Plan</dt>
              <dd className="mt-1 text-[15px] font-medium text-foreground">
                {subscription.data.name} — {subscription.data.planLabel}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-subtle">Next expiry</dt>
              <dd className="mt-1 text-[15px] font-medium text-foreground">
                {formatDate(subscription.data.expiresAt)}
              </dd>
            </div>
          </dl>
        )}
      </section>

      {/* Payment history */}
      <section className="mt-8">
        <h2 className="text-[15px] font-semibold text-foreground">
          Payment history
        </h2>
        {payments.loading ? (
          <Skeleton className="mt-4 h-48 w-full" />
        ) : payments.error ? (
          <div className="mt-4">
            <ErrorState
              message="We couldn't load payment history."
              onRetry={payments.retry}
            />
          </div>
        ) : !payments.data || payments.data.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No payments yet.</p>
        ) : (
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface px-3 shadow-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="hidden sm:table-cell">Method</TableHead>
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
                    <TableCell className="hidden text-muted sm:table-cell">
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
          </div>
        )}
      </section>
    </div>
  );
}
