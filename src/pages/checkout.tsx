import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Bitcoin, CreditCard, Loader2, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { ErrorState } from "@/components/feedback/error-state";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/hooks/use-async";
import { useI18n, type Dictionary } from "@/i18n";
import { cn } from "@/lib/utils";
import { DEVICE_LIMIT } from "@/mocks/plans";
import { billingService } from "@/services/billing";
import { planService } from "@/services/plans";
import { useAuthStore } from "@/store/auth";
import type { PaymentMethod } from "@/types";

/** Built per-language so validation messages are localized. */
function buildCheckoutSchema(dict: Dictionary) {
  const errors = dict.checkout.errors;
  return z
    .object({
      name: z.string().min(2, errors.nameMin),
      email: z.string().email(errors.emailInvalid),
      paymentMethod: z.enum(["card", "crypto", "balance"]),
      cardNumber: z.string(),
      cardExpiry: z.string(),
      cardCvc: z.string(),
    })
    .superRefine((values, ctx) => {
      if (values.paymentMethod !== "card") return;
      if (!/^\d{12,19}$/.test(values.cardNumber.replace(/\s/g, ""))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["cardNumber"],
          message: errors.cardNumber,
        });
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(values.cardExpiry)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["cardExpiry"],
          message: errors.cardExpiry,
        });
      }
      if (!/^\d{3,4}$/.test(values.cardCvc)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["cardCvc"],
          message: errors.cardCvc,
        });
      }
    });
}

type CheckoutForm = z.infer<ReturnType<typeof buildCheckoutSchema>>;

const PAYMENT_OPTIONS: {
  value: PaymentMethod;
  icon: typeof CreditCard;
}[] = [
  { value: "card", icon: CreditCard },
  { value: "crypto", icon: Bitcoin },
  { value: "balance", icon: Wallet },
];

export function CheckoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planId = searchParams.get("plan") ?? "30d";
  const user = useAuthStore((s) => s.user);
  const { t, dict, formatCurrency } = useI18n();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const plan = useAsync(() => planService.getPlan(planId), [planId]);
  const schema = useMemo(() => buildCheckoutSchema(dict), [dict]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      paymentMethod: "card",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
    },
  });

  const paymentMethod = watch("paymentMethod");

  if (plan.loading) {
    return (
      <Container className="py-12 md:py-16 lg:py-20">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="mt-8 h-[420px] w-full" />
      </Container>
    );
  }

  if (plan.error || !plan.data) {
    return (
      <Container className="max-w-2xl py-14 md:py-20">
        <ErrorState
          title={t("checkout.planUnavailableTitle")}
          message={t("checkout.planUnavailableBody")}
        />
        <Button asChild variant="secondary" className="mt-6">
          <Link to="/plans">{t("checkout.backToPlans")}</Link>
        </Button>
      </Container>
    );
  }

  const selectedPlan = plan.data;
  const planLabel = t("common.planLabel", { days: selectedPlan.durationDays });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await billingService.createPayment({
        planId: selectedPlan.id,
        contact: { name: values.name, email: values.email },
        paymentMethod: values.paymentMethod,
        cardLast4:
          values.paymentMethod === "card"
            ? values.cardNumber.replace(/\s/g, "").slice(-4)
            : undefined,
      });
      navigate("/access/activated");
    } catch {
      // Form values are preserved by react-hook-form — nothing resets.
      setSubmitError(t("checkout.errors.submitFailed"));
    }
  });

  return (
    <Container className="py-12 md:py-16 lg:py-20">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        {t("checkout.title")}
      </h1>

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="space-y-8 rounded-xl border border-border bg-surface p-6 shadow-card sm:p-8 lg:col-span-7"
          noValidate
        >
          {/* Contact */}
          <section>
            <h2 className="text-[15px] font-semibold text-foreground">
              {t("checkout.contact")}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">{t("checkout.fullName")}</Label>
                <Input
                  id="name"
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "checkout-name-error" : undefined}
                  {...register("name")}
                />
                <FieldError id="checkout-name-error" message={errors.name?.message} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">{t("checkout.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={
                    errors.email ? "checkout-email-error" : undefined
                  }
                  {...register("email")}
                />
                <FieldError
                  id="checkout-email-error"
                  message={errors.email?.message}
                />
              </div>
            </div>
          </section>

          {/* Payment */}
          <section>
            <h2 className="text-[15px] font-semibold text-foreground">
              {t("checkout.paymentMethod")}
            </h2>
            <div
              role="radiogroup"
              aria-label={t("checkout.paymentMethodAria")}
              className="mt-4 divide-y divide-border overflow-hidden rounded-lg border border-border"
            >
              {PAYMENT_OPTIONS.map((option) => {
                const selected = paymentMethod === option.value;
                return (
                  <label
                    key={option.value}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 px-4 py-3.5 transition-colors duration-150 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-inset has-[:focus-visible]:ring-primary/60",
                      selected ? "bg-tint/60" : "hover:bg-background",
                    )}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      className="size-4 accent-[rgb(var(--primary))] focus-ring"
                      {...register("paymentMethod")}
                    />
                    <option.icon
                      className={cn(
                        "size-4",
                        selected ? "text-primary" : "text-subtle",
                      )}
                    />
                    <span className="text-sm text-foreground">
                      {t(`common.paymentMethod.${option.value}`)}
                    </span>
                  </label>
                );
              })}
            </div>

            {paymentMethod === "card" && (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="cardNumber">{t("checkout.cardNumber")}</Label>
                  <Input
                    id="cardNumber"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="4242 4242 4242 4242"
                    aria-invalid={!!errors.cardNumber}
                    aria-describedby={
                      errors.cardNumber ? "checkout-cardnumber-error" : undefined
                    }
                    {...register("cardNumber")}
                  />
                  <FieldError
                    id="checkout-cardnumber-error"
                    message={errors.cardNumber?.message}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cardExpiry">{t("checkout.cardExpiry")}</Label>
                  <Input
                    id="cardExpiry"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    aria-invalid={!!errors.cardExpiry}
                    aria-describedby={
                      errors.cardExpiry ? "checkout-cardexpiry-error" : undefined
                    }
                    {...register("cardExpiry")}
                  />
                  <FieldError
                    id="checkout-cardexpiry-error"
                    message={errors.cardExpiry?.message}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cardCvc">{t("checkout.cardCvc")}</Label>
                  <Input
                    id="cardCvc"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="123"
                    aria-invalid={!!errors.cardCvc}
                    aria-describedby={
                      errors.cardCvc ? "checkout-cardcvc-error" : undefined
                    }
                    {...register("cardCvc")}
                  />
                  <FieldError
                    id="checkout-cardcvc-error"
                    message={errors.cardCvc?.message}
                  />
                </div>
              </div>
            )}

            {paymentMethod === "crypto" && (
              <p className="mt-4 text-[13px] leading-relaxed text-muted">
                {t("checkout.cryptoNote")}
              </p>
            )}

            {paymentMethod === "balance" && (
              <p className="mt-4 text-[13px] leading-relaxed text-muted">
                {t("checkout.balanceNote")}
              </p>
            )}
          </section>

          {submitError && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-lg border border-danger/30 bg-danger/[0.06] px-4 py-3 text-sm text-danger"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              {submitError}
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {t("checkout.activating")}
              </>
            ) : (
              t("checkout.activate", {
                price: formatCurrency(selectedPlan.price),
              })
            )}
          </Button>
          <p className="text-xs text-subtle">{t("checkout.mockNote")}</p>
        </form>

        {/* Order summary */}
        <aside className="rounded-xl border border-border bg-surface p-6 shadow-card sm:p-7 lg:sticky lg:top-24 lg:col-span-5">
          <h2 className="text-[15px] font-semibold text-foreground">
            {t("checkout.summary")}
          </h2>
          <div className="mt-4 flex items-start justify-between gap-4 border-b border-border pb-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                {t("common.serviceName")}
              </p>
              <p className="mt-0.5 text-xs text-subtle">
                {t("checkout.activatesImmediately", { label: planLabel })}
              </p>
            </div>
            <p className="text-[15px] font-semibold tabular-nums text-foreground">
              {formatCurrency(selectedPlan.price)}
            </p>
          </div>
          <ul className="mt-4 space-y-2 text-[13px] text-muted">
            <li>{t("checkout.includedRegions")}</li>
            <li>{t("checkout.includedDevices", { count: DEVICE_LIMIT })}</li>
            <li>{t("checkout.includedPlatforms")}</li>
          </ul>
          <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
            <span className="text-sm text-muted">{t("checkout.totalDue")}</span>
            <span className="text-lg font-semibold tabular-nums text-foreground">
              {formatCurrency(selectedPlan.price)}
            </span>
          </div>
          <p className="mt-4 border-t border-border pt-4 text-[13px] leading-relaxed text-muted">
            {t("checkout.afterActivation")}
          </p>
        </aside>
      </div>
    </Container>
  );
}
