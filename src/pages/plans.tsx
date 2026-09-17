import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ErrorState } from "@/components/feedback/error-state";
import { StatusDot } from "@/components/feedback/status-dot";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/hooks/use-async";
import { formatCurrency } from "@/lib/utils";
import { INCLUDED, SERVICE_NAME } from "@/mocks/plans";
import { planService } from "@/services/plans";

/**
 * Plans is not a catalog. There is one service — Network Access —
 * and the only decision is duration.
 */
export function PlansPage() {
  const navigate = useNavigate();
  const { data: plans, loading, error, retry } = useAsync(
    () => planService.listPlans(),
    [],
  );
  const [selected, setSelected] = useState("90d");

  return (
    <Container className="max-w-2xl py-12 md:py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Plans
      </h1>
      <p className="mt-1.5 text-sm text-muted">
        {SERVICE_NAME}. Every duration includes the same service — pick how
        long you want it.
      </p>

      {error ? (
        <div className="mt-10">
          <ErrorState
            message="We couldn't load plans."
            onRetry={retry}
          />
        </div>
      ) : loading ? (
        <div className="mt-10 space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <>
          {/* Duration selection — rows, not pricing cards */}
          <div
            role="radiogroup"
            aria-label="Plan duration"
            className="mt-10 divide-y divide-border border-y border-border"
          >
            {plans?.map((plan) => {
              const active = selected === plan.id;
              return (
                <label
                  key={plan.id}
                  className="flex cursor-pointer items-center justify-between gap-4 py-4"
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="plan"
                      value={plan.id}
                      checked={active}
                      onChange={() => setSelected(plan.id)}
                      className="size-4 accent-[rgb(var(--primary))] focus-ring"
                    />
                    <span>
                      <span className="block text-sm font-medium text-foreground">
                        {plan.label}
                      </span>
                      <span className="block text-xs text-subtle">
                        {formatCurrency(plan.price / (plan.durationDays / 30))}{" "}
                        / month equivalent
                      </span>
                    </span>
                  </span>
                  <span className="text-sm font-semibold tabular-nums text-foreground">
                    {formatCurrency(plan.price)}
                  </span>
                </label>
              );
            })}
          </div>

          <Button
            size="lg"
            className="mt-6 w-full sm:w-auto"
            onClick={() => navigate(`/checkout?plan=${selected}`)}
          >
            Get access —{" "}
            {formatCurrency(
              plans?.find((p) => p.id === selected)?.price ?? 0,
            )}
          </Button>

          {/* What's included — one flat list */}
          <div className="mt-12">
            <h2 className="text-sm font-semibold text-foreground">
              Included in every plan
            </h2>
            <ul className="mt-4 space-y-2.5">
              {INCLUDED.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 text-sm text-muted"
                >
                  <StatusDot tone="neutral" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-10 text-sm text-muted">
            Already have access?{" "}
            <Link
              to="/console/subscription"
              className="text-primary hover:underline focus-ring rounded-sm"
            >
              Manage your subscription
            </Link>
            .
          </p>
        </>
      )}
    </Container>
  );
}
