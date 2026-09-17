import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth";

const registerSchema = z
  .object({
    name: z.string().min(2, "Enter your name"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Use at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const registerUser = useAuthStore((s) => s.register);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
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
      setServerError(
        err instanceof Error
          ? err.message
          : "Could not create your account. Please try again.",
      );
    }
  });

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-8 shadow-card">
        <div className="flex flex-col items-center text-center">
          <Logo />
          <h1 className="mt-6 text-xl font-semibold tracking-tight text-foreground">
            Create your account
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Activate, manage and renew in one place.
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
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              autoComplete="name"
              autoFocus
              placeholder="Alex Chen"
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
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-danger">{errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="8+ characters"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-danger">{errors.password.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Repeat it"
                aria-invalid={!!errors.confirmPassword}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-danger">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Creating account…
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-subtle">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline focus-ring rounded-sm"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
