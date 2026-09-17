import { ArrowRight, CircleCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { ErrorState } from "@/components/feedback/error-state";
import { Container } from "@/components/layout/container";
import { SubscriptionUrlField } from "@/components/subscription/subscription-url-field";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/hooks/use-async";
import { daysUntil, formatDate } from "@/lib/utils";
import { subscriptionService } from "@/services/subscription";

/**
 * Post-purchase: the next thing a user wants is their subscription URL.
 * No "order confirmed" commerce framing — access is already live.
 */
export function ActivatedPage() {
  const { data: subscription, loading, error, retry } = useAsync(
    () => subscriptionService.getCurrent(),
    [],
  );

  return (
    <Container className="max-w-xl py-16 md:py-24">
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-72" />
          <Skeleton className="mt-6 h-[42px] w-full" />
        </div>
      ) : error || !subscription ? (
        <ErrorState
          title="Access activated"
          message="Your subscription is ready, but we couldn't load it here. Open your console to find your subscription URL."
          onRetry={retry}
        />
      ) : (
        <>
          <div className="flex size-12 items-center justify-center rounded-full bg-tint">
            <CircleCheck className="size-6 text-primary" />
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground">
            Access activated.
          </h1>
          <p className="mt-2 text-[15px] text-muted">
            {subscription.name} · {subscription.planLabel} ·{" "}
            {daysUntil(subscription.expiresAt)} days remaining (expires{" "}
            {formatDate(subscription.expiresAt)})
          </p>

          <div className="mt-8 rounded-xl border border-border bg-surface p-5 shadow-card sm:p-6">
            <p className="text-sm font-medium text-foreground">
              Your subscription URL
            </p>
            <SubscriptionUrlField
              token={subscription.subscriptionToken}
              className="mt-3"
            />
            <p className="mt-2.5 text-[13px] text-subtle">
              Paste this into your client to import all regions.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/setup">
                Open setup guide
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link to="/console">Go to console</Link>
            </Button>
          </div>
        </>
      )}
    </Container>
  );
}
