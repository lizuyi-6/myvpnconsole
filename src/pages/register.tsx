import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n, type Dictionary } from "@/i18n";
import { EmailTakenError } from "@/services/auth";
import { useAuthStore } from "@/store/auth";

function buildRegisterSchema(dict: Dictionary) {
  const errors = dict.auth.register.errors;
  return z
    .object({
      name: z.string().min(2, errors.nameMin),
      email: z.string().email(errors.emailInvalid),
      password: z.string().min(8, errors.passwordMin),
      confirmPassword: z.string(),
    })
    .refine((values) => values.password === values.confirmPassword, {
      path: ["confirmPassword"],
      message: errors.mismatch,
    });
}

type RegisterForm = z.infer<ReturnType<typeof buildRegisterSchema>>;

export function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const registerUser = useAuthStore((s) => s.register);
  const { t, dict } = useI18n();
  const [serverError, setServerError] = useState<string | null>(null);
  const schema = useMemo(() => buildRegisterSchema(dict), [dict]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await registerUser(values.name, values.email, values.password);
      const next = searchParams.get("next");
      navigate(next && next.startsWith("/") ? next : "/dashboard", {
        replace: true,
      });
    } catch (err) {
      // Input stays filled — only the error is shown.
      setServerError(
        err instanceof EmailTakenError
          ? t("auth.register.errors.emailTaken")
          : t("auth.register.errors.generic"),
      );
    }
  });

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-8 shadow-card">
        <div className="flex flex-col items-center text-center">
          <Logo />
          <h1 className="mt-6 text-xl font-semibold tracking-tight text-foreground">
            {t("auth.register.title")}
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            {t("auth.register.subtitle")}
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
          {serverError && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-lg border border-danger/30 bg-danger/[0.08] px-4 py-3 text-sm text-danger"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              {serverError}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="name">{t("auth.register.name")}</Label>
            <Input
              id="name"
              autoComplete="name"
              autoFocus
              placeholder={t("auth.register.namePlaceholder")}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "register-name-error" : undefined}
              {...register("name")}
            />
            <FieldError id="register-name-error" message={errors.name?.message} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">{t("auth.register.email")}</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={
                errors.email ? "register-email-error" : undefined
              }
              {...register("email")}
            />
            <FieldError
              id="register-email-error"
              message={errors.email?.message}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="password">{t("auth.register.password")}</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder={t("auth.register.passwordPlaceholder")}
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "register-password-error" : undefined
                }
                {...register("password")}
              />
              <FieldError
                id="register-password-error"
                message={errors.password?.message}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">
                {t("auth.register.confirm")}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder={t("auth.register.confirmPlaceholder")}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={
                  errors.confirmPassword ? "register-confirm-error" : undefined
                }
                {...register("confirmPassword")}
              />
              <FieldError
                id="register-confirm-error"
                message={errors.confirmPassword?.message}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {t("auth.register.submitting")}
              </>
            ) : (
              t("auth.register.submit")
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-subtle">
          {t("auth.register.footerPre")}{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline focus-ring rounded-sm"
          >
            {t("auth.register.footerLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
