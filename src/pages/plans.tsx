import {
  AppWindow,
  Check,
  Copy,
  Globe,
  LifeBuoy,
  MonitorSmartphone,
  RefreshCw,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ErrorState } from "@/components/feedback/error-state";
import { StatusDot } from "@/components/feedback/status-dot";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Panel, PanelLink } from "@/components/layout/panel";
import { SideRail } from "@/components/layout/side-rail";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/hooks/use-async";
import { cn, formatCurrency } from "@/lib/utils";
import { DEVICE_LIMIT, INCLUDED, SERVICE_NAME } from "@/mocks/plans";
import { networkService } from "@/services/network";
import { planService } from "@/services/plans";

const PLATFORMS = ["Windows", "macOS", "iOS", "Android", "Linux"];

/**
 * Plans is not a catalog. There is one service — Network Access —
 * and the only decision is duration. Desktop layout: service details on
 * the left, a sticky purchase panel on the right.
 */
export function PlansPage() {
  const navigate = useNavigate();
  const { data: plans, loading, error, retry } = useAsync(
    () => planService.listPlans(),
    [],
  );
  const status = useAsync(() => networkService.getStatus(), []);
  const [selected, setSelected] = useState("90d");

  const baseMonthly = plans?.[0]
    ? plans[0].price / (plans[0].durationDays / 30)
    : null;
  const selectedPlan = plans?.find((p) => p.id === selected);

  return (
    <Container className="py-12 md:py-16 lg:py-20">
      <PageHeader
        size="lg"
        title={SERVICE_NAME}
        description="Everything you need to connect. Choose how long you want access."
      />

      {error ? (
        <div className="mt-12">
          <ErrorState message="We couldn't load plans." onRetry={retry} />
        </div>
      ) : (
        <div className="mt-10 grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Service details */}
          <div className="space-y-6 lg:col-span-7">
            <Panel title="What's included">
              <ul className="grid gap-x-10 gap-y-3.5 sm:grid-cols-2">
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
            </Panel>

            <Panel
              title="Region access"
              action={<PanelLink to="/network">View network</PanelLink>}
            >
              <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-muted">
                <StatusDot
                  tone={
                    status.data?.status === "operational" ? "success" : "warning"
                  }
                />
                <span className="tabular-nums text-foreground">
                  {status.data
                    ? `${status.data.activeRegions} of ${status.data.totalRegions} regions available`
                    : "…"}
                </span>
                across North America, Asia Pacific, Europe and Oceania
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Every duration includes all regions. Switch regions anytime
                from your client — status and latency are always public on the
                network page.
              </p>
            </Panel>

            <Panel title="Devices and platforms">
              <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
                <p className="flex items-center gap-3 text-sm text-foreground">
                  <MonitorSmartphone className="size-4 text-primary" />
                  Up to {DEVICE_LIMIT} devices at once
                </p>
                <p className="flex items-center gap-3 text-sm text-foreground">
                  <AppWindow className="size-4 text-primary" />
                  {PLATFORMS.join(" · ")}
                </p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Add, rename or remove devices anytime from the console. Setup
                guides with a recommended client are published for every
                platform.
              </p>
            </Panel>

            <Panel title="How activation works">
              <ol className="grid gap-x-10 gap-y-5 sm:grid-cols-3">
                {[
                  {
                    icon: Zap,
                    title: "Activate",
                    text: "Checkout completes and your subscription starts immediately.",
                  },
                  {
                    icon: Copy,
                    title: "Copy your URL",
                    text: "Your personal subscription URL appears in the console.",
                  },
                  {
                    icon: Globe,
                    title: "Connect",
                    text: "Import the URL into a compatible client and pick a region.",
                  },
                ].map((step, i) => (
                  <li key={step.title}>
                    <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <span className="tabular-nums text-primary">{i + 1}.</span>
                      {step.title}
                    </p>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                      {step.text}
                    </p>
                  </li>
                ))}
              </ol>
            </Panel>

            <Panel title="Renewal behavior">
              <p className="flex items-start gap-3 text-sm leading-relaxed text-muted">
                <RefreshCw className="mt-0.5 size-4 shrink-0 text-subtle" />
                Renewing before expiry extends your current end date, so no
                paid time is lost. Your subscription URL stays the same across
                renewals — no need to update your clients.
              </p>
              <p className="mt-4 border-t border-border pt-4 text-sm text-muted">
                Questions?{" "}
                <Link
                  to="/help"
                  className="rounded-sm text-primary hover:underline focus-ring"
                >
                  Check the Help Center
                </Link>
                .
              </p>
            </Panel>
          </div>

          {/* Sticky purchase panel */}
          <SideRail className="lg:col-span-5">
            <Panel title="Choose duration" className="shadow-panel">
              {loading ? (
                <div className="space-y-3">
                  {[0, 1, 2].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <>
                  <div
                    role="radiogroup"
                    aria-label="Plan duration"
                    className="space-y-3"
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

                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                    <span className="text-sm text-muted">Total</span>
                    <span className="text-lg font-semibold tabular-nums text-foreground">
                      {formatCurrency(selectedPlan?.price ?? 0)}
                    </span>
                  </div>

                  <Button
                    size="lg"
                    className="mt-4 w-full"
                    onClick={() => navigate(`/checkout?plan=${selected}`)}
                  >
                    Continue — {formatCurrency(selectedPlan?.price ?? 0)}
                  </Button>

                  {/* Purchase trust — what happens after payment */}
                  <ul className="mt-6 space-y-2.5 border-t border-border pt-5 text-[13px] text-muted">
                    <li className="flex items-center gap-2.5">
                      <Zap className="size-3.5 shrink-0 text-subtle" />
                      Immediate activation — URL in your console right away
                    </li>
                    <li className="flex items-center gap-2.5">
                      <MonitorSmartphone className="size-3.5 shrink-0 text-subtle" />
                      Manage devices and renewals from the console
                    </li>
                    <li className="flex items-center gap-2.5">
                      <LifeBuoy className="size-3.5 shrink-0 text-subtle" />
                      Human support on every plan
                    </li>
                  </ul>
                </>
              )}
            </Panel>

            <p className="text-sm text-muted">
              Already have access?{" "}
              <Link
                to="/console/subscription"
                className="rounded-sm text-primary hover:underline focus-ring"
              >
                Manage your subscription
              </Link>
              .
            </p>
          </SideRail>
        </div>
      )}
    </Container>
  );
}
