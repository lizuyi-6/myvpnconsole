import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Bitcoin, CreditCard, Loader2, Wallet } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { ErrorState } from "@/components/feedback/error-state";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/hooks/use-async";
import { cn, formatCurrency } from "@/lib/utils";
import { DEVICE_LIMIT, SERVICE_NAME } from "@/mocks/plans";
import { billingService } from "@/services/billing";
import { planService } from "@/services/plans";
import { useAuthStore } from "@/store/auth";
import type { PaymentMethod } from "@/types";

const checkoutSchema = z
  .object({
    name: z.string().min(2, "Enter your full name"),
    email: z.string().email("Enter a valid email address"),
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
        message: "Enter a valid card number",
      });
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(values.cardExpiry)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cardExpiry"],
        message: "Use MM/YY",
      });
    }
    if (!/^\d{3,4}$/.test(values.cardCvc)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cardCvc"],
        message: "3–4 digits",
      });
    }
  });

type CheckoutForm = z.infer<typeof checkoutSchema>;

const PAYMENT_OPTIONS: {
  value: PaymentMethod;
  label: string;
  icon: typeof CreditCard;
}[] = [
  { value: "card", label: "Credit / Debit Card", icon: CreditCard },
  { value: "crypto", label: "Crypto", icon: Bitcoin },
  { value: "balance", label: "Balance", icon: Wallet },
];

export function CheckoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planId = searchParams.get("plan") ?? "30d";
  const user = useAuthStore((s) => s.user);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const plan = useAsync(() => planService.getPlan(planId), [planId]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
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
      <Container className="max-w-5xl py-14 md:py-20">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="mt-8 h-[420px] w-full" />
      </Container>
    );
  }

  if (plan.error || !plan.data) {
    return (
      <Container className="max-w-2xl py-14 md:py-20">
        <ErrorState
          title="This plan isn't available"
          message="The selected plan could not be found. Pick a duration on the plans page."
        />
        <Button asChild variant="secondary" className="mt-6">
          <Link to="/plans">Back to plans</Link>
        </Button>
      </Container>
    );
  }

  const selectedPlan = plan.data;

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
    } catch (err) {
      // Form values are preserved by react-hook-form — nothing resets.
      setSubmitError(
        err instanceof Error ? err.message : "Payment failed. Please try again.",
      );
    }
  });

  return (
    <Container className="max-w-5xl py-14 md:py-20">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        Checkout
      </h1>

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1fr_360px]">
        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="space-y-8 rounded-xl border border-border bg-surface p-6 shadow-card sm:p-8"
          noValidate
        >
          {/* Contact */}
          <section>
            <h2 className="text-[15px] font-semibold text-foreground">
              Contact
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-danger">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-danger">{errors.email.message}</p>
                )}
              </div>
            </div>
          </section>

          {/* Payment */}
          <section>
            <h2 className="text-[15px] font-semibold text-foreground">
              Payment method
            </h2>
            <div
              role="radiogroup"
              aria-label="Payment method"
              className="mt-4 divide-y divide-border overflow-hidden rounded-lg border border-border"
            >
              {PAYMENT_OPTIONS.map((option) => {
                const selected = paymentMethod === option.value;
                return (
                  <label
                    key={option.value}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 px-4 py-3.5 transition-colors duration-150",
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
                      {option.label}
                    </span>
                  </label>
                );
              })}
            </div>

            {paymentMethod === "card" && (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="cardNumber">Card number</Label>
                  <Input
                    id="cardNumber"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="4242 4242 4242 4242"
                    aria-invalid={!!errors.cardNumber}
                    {...register("cardNumber")}
                  />
                  {errors.cardNumber && (
                    <p className="text-xs text-danger">
                      {errors.cardNumber.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cardExpiry">Expiry</Label>
                  <Input
                    id="cardExpiry"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    aria-invalid={!!errors.cardExpiry}
                    {...register("cardExpiry")}
                  />
                  {errors.cardExpiry && (
                    <p className="text-xs text-danger">
                      {errors.cardExpiry.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cardCvc">CVC</Label>
                  <Input
                    id="cardCvc"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="123"
                    aria-invalid={!!errors.cardCvc}
                    {...register("cardCvc")}
                  />
                  {errors.cardCvc && (
                    <p className="text-xs text-danger">{errors.cardCvc.message}</p>
                  )}
                </div>
              </div>
            )}

            {paymentMethod === "crypto" && (
              <p className="mt-4 text-[13px] leading-relaxed text-muted">
                After you confirm, a payment address with the exact amount is
                shown. Access activates when the transaction is detected.
                (Mock — completes instantly.)
              </p>
            )}

            {paymentMethod === "balance" && (
              <p className="mt-4 text-[13px] leading-relaxed text-muted">
                The amount is deducted from your account balance. (Mock —
                completes instantly.)
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
                Activating…
              </>
            ) : (
              <>Activate access — {formatCurrency(selectedPlan.price)}</>
            )}
          </Button>
          <p className="text-xs text-subtle">
            Mock checkout — no real payment is processed.
          </p>
        </form>

        {/* Order summary */}
        <aside className="rounded-xl border border-border bg-surface p-6 shadow-card lg:sticky lg:top-24">
          <h2 className="text-[15px] font-semibold text-foreground">
            Summary
          </h2>
          <div className="mt-4 flex items-start justify-between gap-4 border-b border-border pb-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                {SERVICE_NAME}
              </p>
              <p className="mt-0.5 text-xs text-subtle">
                {selectedPlan.label} · activates immediately
              </p>
            </div>
            <p className="text-[15px] font-semibold tabular-nums text-foreground">
              {formatCurrency(selectedPlan.price)}
            </p>
          </div>
          <ul className="mt-4 space-y-2 text-[13px] text-muted">
            <li>All available regions</li>
            <li>Up to {DEVICE_LIMIT} devices</li>
            <li>All supported platforms</li>
          </ul>
          <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
            <span className="text-sm text-muted">Total due today</span>
            <span className="text-lg font-semibold tabular-nums text-foreground">
              {formatCurrency(selectedPlan.price)}
            </span>
          </div>
          <p className="mt-4 border-t border-border pt-4 text-[13px] leading-relaxed text-muted">
            After activation, your subscription URL is available immediately in
            your console.
          </p>
        </aside>
      </div>
    </Container>
  );
}
