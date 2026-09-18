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
import { InvalidCredentialsError } from "@/services/auth";
import { useAuthStore } from "@/store/auth";

function buildLoginSchema(dict: Dictionary) {
  return z.object({
    email: z.string().email(dict.auth.login.errors.emailInvalid),
    password: z.string().min(1, dict.auth.login.errors.passwordRequired),
  });
}

type LoginForm = z.infer<ReturnType<typeof buildLoginSchema>>;

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const signIn = useAuthStore((s) => s.signIn);
  const { t, dict } = useI18n();
  const [serverError, setServerError] = useState<string | null>(null);
  const schema = useMemo(() => buildLoginSchema(dict), [dict]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await signIn(values.email, values.password);
      const next = searchParams.get("next");
      navigate(next && next.startsWith("/") ? next : "/dashboard", {
        replace: true,
      });
    } catch (err) {
      // Email stays filled — only the error is shown.
      setServerError(
        err instanceof InvalidCredentialsError
          ? t("auth.login.errors.invalidCredentials")
          : t("auth.login.errors.generic"),
      );
    }
  });

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-8 shadow-card">
        <div className="flex flex-col items-center text-center">
          <Logo />
          <h1 className="mt-6 text-xl font-semibold tracking-tight text-foreground">
            {t("auth.login.title")}
          </h1>
          <p className="mt-1.5 text-sm text-muted">{t("auth.login.subtitle")}</p>
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
            <Label htmlFor="email">{t("auth.login.email")}</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "login-email-error" : undefined}
              {...register("email")}
            />
            <FieldError id="login-email-error" message={errors.email?.message} />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t("auth.login.password")}</Label>
              <Link
                to="/login"
                className="text-xs text-subtle transition-colors hover:text-primary focus-ring rounded-sm"
              >
                {t("auth.login.forgot")}
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? "login-password-error" : undefined
              }
              {...register("password")}
            />
            <FieldError
              id="login-password-error"
              message={errors.password?.message}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {t("auth.login.submitting")}
              </>
            ) : (
              t("auth.login.submit")
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-subtle">
          {t("auth.login.footerPre")}{" "}
          <Link
            to="/register"
            className="font-medium text-primary hover:underline focus-ring rounded-sm"
          >
            {t("auth.login.footerLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
