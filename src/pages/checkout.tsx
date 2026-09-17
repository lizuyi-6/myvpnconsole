import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CreditCard, Loader2, ShoppingCart, Wallet, Bitcoin } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { EmptyState } from "@/components/feedback/empty-state";
import { Container } from "@/components/layout/container";
import { ProductIconTile } from "@/components/product/product-icon-tile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAsync } from "@/hooks/use-async";
import { cartTotals, resolveCartItems, toOrderItems } from "@/lib/cart";
import { cn, formatCurrency } from "@/lib/utils";
import { orderService } from "@/services/orders";
import { productService } from "@/services/products";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
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
  description: string;
  icon: typeof CreditCard;
}[] = [
  {
    value: "card",
    label: "Credit / Debit Card",
    description: "Visa, Mastercard, Amex",
    icon: CreditCard,
  },
  {
    value: "crypto",
    label: "Crypto",
    description: "BTC, ETH, USDT",
    icon: Bitcoin,
  },
  {
    value: "balance",
    label: "Balance",
    description: "Use your account balance",
    icon: Wallet,
  },
];

export function CheckoutPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Warm the catalog cache so product data is fresh for pricing
  useAsync(() => productService.listProducts(), []);

  const resolved = resolveCartItems(items);
  const totals = cartTotals(resolved);

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

  if (resolved.length === 0) {
    return (
      <Container className="py-12 md:py-16">
        <EmptyState
          icon={ShoppingCart}
          title="Nothing to check out"
          message="Your cart is empty. Add products before heading to checkout."
          action={
            <Button asChild>
              <Link to="/products">Browse products</Link>
            </Button>
          }
        />
      </Container>
    );
  }

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      const order = await orderService.createOrder({
        items: toOrderItems(resolved),
        contact: { name: values.name, email: values.email },
        paymentMethod: values.paymentMethod,
        cardLast4:
          values.paymentMethod === "card"
            ? values.cardNumber.replace(/\s/g, "").slice(-4)
            : undefined,
      });
      clearCart();
      navigate(`/order/success/${order.id}`);
    } catch (err) {
      // Form values are preserved by react-hook-form — nothing resets.
      setSubmitError(
        err instanceof Error ? err.message : "Payment failed. Please try again.",
      );
    }
  });

  return (
    <Container className="py-12 md:py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        Checkout
      </h1>
      <p className="mt-1.5 text-sm text-muted">
        Everything on one page — review your order, add contact details and pay.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]"
        noValidate
      >
        <div className="space-y-8">
          {/* Contact */}
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="text-[15px] font-semibold text-foreground">
              Contact
            </h2>
            <p className="mt-1 text-xs text-subtle">
              Delivery and receipts go to this email.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
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
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="text-[15px] font-semibold text-foreground">
              Payment
            </h2>
            <div
              role="radiogroup"
              aria-label="Payment method"
              className="mt-5 grid gap-3 sm:grid-cols-3"
            >
              {PAYMENT_OPTIONS.map((option) => {
                const selected = paymentMethod === option.value;
                return (
                  <label
                    key={option.value}
                    className={cn(
                      "flex cursor-pointer flex-col gap-2 rounded-lg border p-4 transition-colors duration-150 focus-within:ring-2 focus-within:ring-primary/70",
                      selected
                        ? "border-primary/50 bg-primary/[0.06]"
                        : "border-border hover:border-white/[0.14]",
                    )}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      className="sr-only"
                      {...register("paymentMethod")}
                    />
                    <option.icon
                      className={cn(
                        "size-5",
                        selected ? "text-primary" : "text-subtle",
                      )}
                    />
                    <span className="text-sm font-medium text-foreground">
                      {option.label}
                    </span>
                    <span className="text-xs text-subtle">
                      {option.description}
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
              <p className="mt-5 rounded-lg border border-border bg-white/[0.02] px-4 py-3 text-[13px] text-muted">
                After you place the order, a payment address with the exact
                amount will be shown. The order confirms automatically once the
                transaction is detected. (Mock — completes instantly.)
              </p>
            )}

            {paymentMethod === "balance" && (
              <p className="mt-5 rounded-lg border border-border bg-white/[0.02] px-4 py-3 text-[13px] text-muted">
                The total will be deducted from your account balance. (Mock —
                completes instantly.)
              </p>
            )}
          </section>

          {submitError && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-lg border border-danger/30 bg-danger/[0.08] px-4 py-3 text-sm text-danger"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              {submitError}
            </div>
          )}
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-xl border border-border bg-surface p-6 lg:sticky lg:top-24">
          <h2 className="text-[15px] font-semibold text-foreground">
            Your order
          </h2>
          <ul className="mt-4 space-y-4">
            {resolved.map((item) => (
              <li key={item.key} className="flex items-center gap-3">
                <ProductIconTile
                  icon={item.product.icon}
                  accent={item.product.accent}
                  size="sm"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-subtle">
                    {item.plan.label} · ×{item.quantity}
                  </p>
                </div>
                <p className="text-sm tabular-nums text-foreground">
                  {formatCurrency(item.lineTotal)}
                </p>
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-2.5 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="tabular-nums text-foreground">
                {formatCurrency(totals.subtotal)}
              </dd>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted">Volume discount</dt>
                <dd className="tabular-nums text-success">
                  −{formatCurrency(totals.discount)}
                </dd>
              </div>
            )}
            <div className="flex justify-between border-t border-border pt-3 text-base">
              <dt className="font-medium text-foreground">Total</dt>
              <dd className="font-semibold tabular-nums text-foreground">
                {formatCurrency(totals.total)}
              </dd>
            </div>
          </dl>

          <Button
            type="submit"
            size="lg"
            className="mt-6 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Processing…
              </>
            ) : (
              <>Pay {formatCurrency(totals.total)}</>
            )}
          </Button>
          <p className="mt-3 text-center text-xs text-subtle">
            Mock checkout — no real payment is processed.
          </p>
        </aside>
      </form>
    </Container>
  );
}
