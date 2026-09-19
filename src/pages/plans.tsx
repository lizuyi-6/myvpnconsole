import {
  AppWindow,
  Check,
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
import { interpolate, useI18n } from "@/i18n";
import { cn } from "@/lib/utils";
import { DEVICE_LIMIT } from "@/config/product";
import { networkService } from "@/services/network";
import { planService } from "@/services/plans";

/**
 * Plans is not a catalog. There is one service — Network Access —
 * and the only decision is duration. Desktop layout: service details on
 * the left, a sticky purchase panel on the right.
 */
export function PlansPage() {
  const navigate = useNavigate();
  const { t, dict, formatCurrency } = useI18n();
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
        title={t("plans.title", { service: t("common.serviceName") })}
        description={t("plans.description")}
      />

      {error ? (
        <div className="mt-12">
          <ErrorState message={t("plans.loadError")} onRetry={retry} />
        </div>
      ) : (
        <div className="mt-10 grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Service details */}
          <div className="space-y-6 lg:col-span-7">
            <Panel title={t("plans.includedPanel")}>
              <ul className="grid gap-x-10 gap-y-3.5 sm:grid-cols-2">
                {dict.plans.included.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-foreground"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {interpolate(item, { count: DEVICE_LIMIT })}
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel
              title={t("plans.regionPanel")}
              action={
                <PanelLink to="/network">{t("plans.viewNetwork")}</PanelLink>
              }
            >
              <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-muted">
                <StatusDot
                  tone={
                    status.data?.status === "operational" ? "success" : "warning"
                  }
                />
                <span className="tabular-nums text-foreground">
                  {status.data
                    ? t("plans.regionStatus", {
                        active: status.data.activeRegions,
                        total: status.data.totalRegions,
                      })
                    : "…"}
                </span>
                {t("plans.regionAreasLine")}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {t("plans.regionBody")}
              </p>
            </Panel>

            <Panel title={t("plans.devicesPanel")}>
              <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
                <p className="flex items-center gap-3 text-sm text-foreground">
                  <MonitorSmartphone className="size-4 text-primary" />
                  {t("plans.devicesAtOnce", { count: DEVICE_LIMIT })}
                </p>
                <p className="flex items-center gap-3 text-sm text-foreground">
                  <AppWindow className="size-4 text-primary" />
                  {t("common.platformLine")}
                </p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {t("plans.devicesBody")}
              </p>
            </Panel>

            <Panel title={t("plans.activationPanel")}>
              <ol className="grid gap-x-10 gap-y-5 sm:grid-cols-3">
                {dict.plans.activation.map((step, i) => (
                  <li key={step.title}>
                    <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <span className="tabular-nums text-primary">
                        {i + 1}.
                      </span>
                      {step.title}
                    </p>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                      {step.text}
                    </p>
                  </li>
                ))}
              </ol>
            </Panel>

            <Panel title={t("plans.renewalPanel")}>
              <p className="flex items-start gap-3 text-sm leading-relaxed text-muted">
                <RefreshCw className="mt-0.5 size-4 shrink-0 text-subtle" />
                {t("plans.renewalBody")}
              </p>
              <p className="mt-4 border-t border-border pt-4 text-sm text-muted">
                {t("plans.questionsPre")}{" "}
                <Link
                  to="/help"
                  className="rounded-sm text-primary hover:underline focus-ring"
                >
                  {t("plans.questionsLink")}
                </Link>
                {t("plans.questionsPost")}
              </p>
            </Panel>
          </div>

          {/* Sticky purchase panel */}
          <SideRail className="lg:col-span-5">
            <Panel title={t("plans.durationPanel")} className="shadow-panel">
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
                    aria-label={t("plans.durationAria")}
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
                            "flex cursor-pointer items-center justify-between gap-4 rounded-lg border bg-surface px-4 py-3.5 transition-[border-color,box-shadow] duration-150 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/40 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-surface",
                            active
                              ? "border-primary shadow-sm ring-1 ring-primary/30"
                              : "border-border hover:border-subtle/60 hover:shadow-card",
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
                                {t("common.planLabel", {
                                  days: plan.durationDays,
                                })}
                              </span>
                              <span className="block text-xs text-subtle">
                                {t("plans.monthlyEquivalent", {
                                  price: formatCurrency(monthly),
                                })}
                              </span>
                            </span>
                          </span>
                          <span className="text-right">
                            <span className="block text-[15px] font-semibold tabular-nums text-foreground">
                              {formatCurrency(plan.price)}
                            </span>
                            {savePct > 0 && (
                              <span className="block text-xs font-medium text-success">
                                {t("plans.save", { percent: savePct })}
                              </span>
                            )}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                    <span className="text-sm text-muted">{t("plans.total")}</span>
                    <span className="text-lg font-semibold tabular-nums text-foreground">
                      {formatCurrency(selectedPlan?.price ?? 0)}
                    </span>
                  </div>

                  <Button
                    size="lg"
                    className="mt-4 w-full"
                    onClick={() => navigate(`/checkout?plan=${selected}`)}
                  >
                    {t("plans.continue", {
                      price: formatCurrency(selectedPlan?.price ?? 0),
                    })}
                  </Button>

                  {/* Purchase trust — what happens after payment */}
                  <ul className="mt-6 space-y-2.5 border-t border-border pt-5 text-[13px] text-muted">
                    <li className="flex items-center gap-2.5">
                      <Zap className="size-3.5 shrink-0 text-subtle" />
                      {t("plans.trustImmediate")}
                    </li>
                    <li className="flex items-center gap-2.5">
                      <MonitorSmartphone className="size-3.5 shrink-0 text-subtle" />
                      {t("plans.trustManage")}
                    </li>
                    <li className="flex items-center gap-2.5">
                      <LifeBuoy className="size-3.5 shrink-0 text-subtle" />
                      {t("plans.trustSupport")}
                    </li>
                  </ul>
                </>
              )}
            </Panel>

            <p className="text-sm text-muted">
              {t("plans.alreadyHavePre")}{" "}
              <Link
                to="/console/subscription"
                className="rounded-sm text-primary hover:underline focus-ring"
              >
                {t("plans.alreadyHaveLink")}
              </Link>
              {t("plans.alreadyHavePost")}
            </p>
          </SideRail>
        </div>
      )}
    </Container>
  );
}
