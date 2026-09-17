import { Check, Copy, MonitorSmartphone, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ErrorState } from "@/components/feedback/error-state";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/hooks/use-async";
import { cn, formatCurrency } from "@/lib/utils";
import { INCLUDED, SERVICE_NAME } from "@/mocks/plans";
import { planService } from "@/services/plans";

const NEXT_STEPS = [
  {
    icon: Copy,
    title: "Works on supported clients",
    description: "Import your subscription URL into any compatible client.",
  },
  {
    icon: MonitorSmartphone,
    title: "Manage devices anytime",
    description: "Add, rename or remove devices from your console.",
  },
  {
    icon: RefreshCw,
    title: "Renew from your console",
    description: "Renewing before expiry extends your current end date.",
  },
];

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

  const baseMonthly = plans?.[0]
    ? plans[0].price / (plans[0].durationDays / 30)
    : null;
  const selectedPlan = plans?.find((p) => p.id === selected);

  return (
    <Container className="max-w-[1000px] py-14 md:py-20">
      <div className="max-w-xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {SERVICE_NAME}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Everything you need to connect. Choose how long you want access.
        </p>
      </div>

      {error ? (
        <div className="mt-12">
          <ErrorState message="We couldn't load plans." onRetry={retry} />
        </div>
      ) : loading ? (
        <Skeleton className="mt-12 h-96 w-full" />
      ) : (
        <>
          {/* Pricing panel — one service, duration is the only choice */}
          <div className="mt-12 grid overflow-hidden rounded-xl border border-border bg-surface shadow-panel md:grid-cols-[1fr_1.1fr]">
            {/* What's included */}
            <div className="p-7 sm:p-9">
              <h2 className="text-lg font-semibold text-foreground">
                {SERVICE_NAME}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                Every duration includes the same service — no tiers, no
                feature gates.
              </p>
              <ul className="mt-7 space-y-3.5">
                {INCLUDED.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-foreground"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Duration selection */}
            <div className="border-t border-border bg-background/60 p-7 sm:p-9 md:border-l md:border-t-0">
              <h2 className="text-sm font-semibold text-foreground">
                Choose duration
              </h2>
              <div
                role="radiogroup"
                aria-label="Plan duration"
                className="mt-4 space-y-3"
              >
                {plans?.map((plan) => {
                  const active = selected === plan.id;
                  const monthly = plan.price / (plan.durationDays / 30);
                  const savePct =
                    baseMonthly !== null && plan.durationDays > 30
                      ? Math.round((1 - monthly / baseMonthly) * 100)
                      : 0;
                  return (
                    <label
                      key={plan.id}
                      className={cn(
                        "flex cursor-pointer items-center justify-between gap-4 rounded-lg border bg-surface px-4 py-3.5 transition-colors duration-150",
                        active
                          ? "border-primary shadow-sm ring-1 ring-primary/30"
                          : "border-border hover:border-subtle/60",
                      )}
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
                            {formatCurrency(monthly)} / month equivalent
                          </span>
                        </span>
                      </span>
                      <span className="text-right">
                        <span className="block text-[15px] font-semibold tabular-nums text-foreground">
                          {formatCurrency(plan.price)}
                        </span>
                        {savePct > 0 && (
                          <span className="block text-xs font-medium text-success">
                            Save {savePct}%
                          </span>
                        )}
                      </span>
                    </label>
                  );
                })}
              </div>

              <Button
                size="lg"
                className="mt-5 w-full"
                onClick={() => navigate(`/checkout?plan=${selected}`)}
              >
                Continue — {formatCurrency(selectedPlan?.price ?? 0)}
              </Button>

              {/* Purchase trust — what happens after payment */}
              <div className="mt-6 border-t border-border pt-5">
                <p className="text-[13px] font-medium text-foreground">
                  What happens next?
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                  After activation, your subscription URL is available
                  immediately in your console — no waiting, no manual
                  delivery.
                </p>
              </div>
            </div>
          </div>

          {/* Reassurances */}
          <div className="mt-14 grid gap-x-10 gap-y-8 sm:grid-cols-3">
            {NEXT_STEPS.map((item) => (
              <div key={item.title} className="flex items-start gap-3.5">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-tint">
                  <item.icon className="size-[18px] text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-12 text-sm text-muted">
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
