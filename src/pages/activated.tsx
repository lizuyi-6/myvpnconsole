import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ErrorState } from "@/components/feedback/error-state";
import { StatusDot } from "@/components/feedback/status-dot";
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
          <p className="flex items-center gap-2 text-sm text-foreground">
            <StatusDot tone="success" />
            Access activated
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
            Your subscription is ready.
          </h1>
          <p className="mt-2 text-sm text-muted">
            {subscription.name} · {subscription.planLabel} ·{" "}
            {daysUntil(subscription.expiresAt)} days remaining (expires{" "}
            {formatDate(subscription.expiresAt)})
          </p>

          <div className="mt-8">
            <p className="text-[13px] font-medium text-muted">
              Your subscription URL
            </p>
            <SubscriptionUrlField
              token={subscription.subscriptionToken}
              className="mt-2"
            />
            <p className="mt-2 text-xs text-subtle">
              Paste this into your client to import all regions.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link to="/setup">
                Open setup guide
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/console">Go to console</Link>
            </Button>
          </div>
        </>
      )}
    </Container>
  );
}
