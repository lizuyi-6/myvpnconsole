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

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const signIn = useAuthStore((s) => s.signIn);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
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
        err instanceof Error ? err.message : "Sign in failed. Please try again.",
      );
    }
  });

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-8 shadow-card">
        <div className="flex flex-col items-center text-center">
          <Logo />
          <h1 className="mt-6 text-xl font-semibold tracking-tight text-foreground">
            Sign in to your account
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Welcome back. Enter your details to continue.
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-danger">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                to="/login"
                className="text-xs text-subtle transition-colors hover:text-primary focus-ring rounded-sm"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-danger">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-subtle">
          New here?{" "}
          <Link
            to="/register"
            className="font-medium text-primary hover:underline focus-ring rounded-sm"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
