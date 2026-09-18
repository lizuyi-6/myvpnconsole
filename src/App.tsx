import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { RequireAuth } from "@/components/auth/require-auth";
import { ConsoleLayout } from "@/components/layout/console-layout";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { SiteLayout } from "@/components/layout/site-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { HelpPage } from "@/pages/help";
import { HomePage } from "@/pages/home";
import { LegalPage } from "@/pages/legal";
import { LoginPage } from "@/pages/login";
import { NetworkPage } from "@/pages/network";
import { NotFoundPage } from "@/pages/not-found";
import { PlansPage } from "@/pages/plans";
import { RegisterPage } from "@/pages/register";
import { SetupPage } from "@/pages/setup";

// Checkout and console are behind auth — code-split them out of the
// public bundle so the storefront stays fast for anonymous visitors.
const CheckoutPage = lazy(() =>
  import("@/pages/checkout").then((m) => ({ default: m.CheckoutPage })),
);
const ActivatedPage = lazy(() =>
  import("@/pages/activated").then((m) => ({ default: m.ActivatedPage })),
);
const ConsoleOverviewPage = lazy(() =>
  import("@/pages/console/overview").then((m) => ({
    default: m.ConsoleOverviewPage,
  })),
);
const ConsoleSubscriptionPage = lazy(() =>
  import("@/pages/console/subscription").then((m) => ({
    default: m.ConsoleSubscriptionPage,
  })),
);
const ConsoleDevicesPage = lazy(() =>
  import("@/pages/console/devices").then((m) => ({
    default: m.ConsoleDevicesPage,
  })),
);
const ConsoleSetupPage = lazy(() =>
  import("@/pages/console/setup").then((m) => ({
    default: m.ConsoleSetupPage,
  })),
);
const ConsoleBillingPage = lazy(() =>
  import("@/pages/console/billing").then((m) => ({
    default: m.ConsoleBillingPage,
  })),
);
const ConsoleSupportPage = lazy(() =>
  import("@/pages/console/support").then((m) => ({
    default: m.ConsoleSupportPage,
  })),
);
const ConsoleSettingsPage = lazy(() =>
  import("@/pages/console/settings").then((m) => ({
    default: m.ConsoleSettingsPage,
  })),
);

function PageFallback() {
  return (
    <div className="mx-auto w-full max-w-workspace space-y-4 px-5 py-12 sm:px-8">
      <Skeleton className="h-7 w-40" />
      <Skeleton className="h-4 w-64" />
      <Skeleton className="mt-6 h-40 w-full" />
    </div>
  );
}

function lazyPage(element: React.ReactNode) {
  return <Suspense fallback={<PageFallback />}>{element}</Suspense>;
}

/** Old dashboard URLs keep working, mapped onto the console. */
function LegacyDashboardRedirect() {
  const location = useLocation();
  return (
    <Navigate
      to={location.pathname.replace(/^\/dashboard/, "/console") || "/console"}
      replace
    />
  );
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Legacy commerce routes → new IA */}
        <Route path="/products" element={<Navigate to="/plans" replace />} />
        <Route path="/products/*" element={<Navigate to="/plans" replace />} />
        <Route path="/pricing" element={<Navigate to="/plans" replace />} />
        <Route path="/cart" element={<Navigate to="/plans" replace />} />
        <Route
          path="/order/success/*"
          element={<Navigate to="/console" replace />}
        />
        <Route path="/dashboard/*" element={<LegacyDashboardRedirect />} />

        {/* Public site chrome */}
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="network" element={<NetworkPage />} />
          <Route path="plans" element={<PlansPage />} />
          <Route path="setup" element={<SetupPage />} />
          <Route path="help" element={<HelpPage />} />
          <Route path="legal/:doc" element={<LegalPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

          <Route element={<RequireAuth />}>
            <Route
              path="checkout"
              element={lazyPage(<CheckoutPage />)}
            />
            <Route
              path="access/activated"
              element={lazyPage(<ActivatedPage />)}
            />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Console — standalone shell, no marketing chrome */}
        <Route element={<RequireAuth />}>
          <Route path="/console" element={<ConsoleLayout />}>
            <Route index element={lazyPage(<ConsoleOverviewPage />)} />
            <Route
              path="subscription"
              element={lazyPage(<ConsoleSubscriptionPage />)}
            />
            <Route path="devices" element={lazyPage(<ConsoleDevicesPage />)} />
            <Route path="setup" element={lazyPage(<ConsoleSetupPage />)} />
            <Route path="billing" element={lazyPage(<ConsoleBillingPage />)} />
            <Route path="support" element={lazyPage(<ConsoleSupportPage />)} />
            <Route
              path="settings"
              element={lazyPage(<ConsoleSettingsPage />)}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
