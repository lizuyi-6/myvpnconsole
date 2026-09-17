import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RequireAuth } from "@/components/auth/require-auth";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { SiteLayout } from "@/components/layout/site-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { CartPage } from "@/pages/cart";
import { HelpPage } from "@/pages/help";
import { HomePage } from "@/pages/home";
import { LoginPage } from "@/pages/login";
import { NotFoundPage } from "@/pages/not-found";
import { PricingPage } from "@/pages/pricing";
import { ProductDetailPage } from "@/pages/product-detail";
import { ProductsPage } from "@/pages/products";
import { RegisterPage } from "@/pages/register";

// Dashboard and checkout are behind auth — code-split them out of the
// public bundle so the storefront stays fast for anonymous visitors.
const CheckoutPage = lazy(() =>
  import("@/pages/checkout").then((m) => ({ default: m.CheckoutPage })),
);
const OrderSuccessPage = lazy(() =>
  import("@/pages/order-success").then((m) => ({
    default: m.OrderSuccessPage,
  })),
);
const DashboardOverviewPage = lazy(() =>
  import("@/pages/dashboard/overview").then((m) => ({
    default: m.DashboardOverviewPage,
  })),
);
const OrdersPage = lazy(() =>
  import("@/pages/dashboard/orders").then((m) => ({ default: m.OrdersPage })),
);
const OrderDetailPage = lazy(() =>
  import("@/pages/dashboard/order-detail").then((m) => ({
    default: m.OrderDetailPage,
  })),
);
const MyProductsPage = lazy(() =>
  import("@/pages/dashboard/my-products").then((m) => ({
    default: m.MyProductsPage,
  })),
);
const MyProductDetailPage = lazy(() =>
  import("@/pages/dashboard/my-product-detail").then((m) => ({
    default: m.MyProductDetailPage,
  })),
);
const SubscriptionsPage = lazy(() =>
  import("@/pages/dashboard/subscriptions").then((m) => ({
    default: m.SubscriptionsPage,
  })),
);
const SubscriptionManagePage = lazy(() =>
  import("@/pages/dashboard/subscription-manage").then((m) => ({
    default: m.SubscriptionManagePage,
  })),
);
const SupportPage = lazy(() =>
  import("@/pages/dashboard/support").then((m) => ({ default: m.SupportPage })),
);
const SettingsPage = lazy(() =>
  import("@/pages/dashboard/settings").then((m) => ({
    default: m.SettingsPage,
  })),
);

function PageFallback() {
  return (
    <div className="mx-auto w-full max-w-content space-y-4 px-5 py-12 sm:px-8">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
      <Skeleton className="mt-6 h-48 rounded-xl" />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<SiteLayout />}>
          {/* Public */}
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:slug" element={<ProductDetailPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="help" element={<HelpPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route
            path="order/success/:orderId"
            element={
              <Suspense fallback={<PageFallback />}>
                <OrderSuccessPage />
              </Suspense>
            }
          />

          {/* Authenticated */}
          <Route element={<RequireAuth />}>
            <Route
              path="checkout"
              element={
                <Suspense fallback={<PageFallback />}>
                  <CheckoutPage />
                </Suspense>
              }
            />
            <Route path="dashboard" element={<DashboardLayout />}>
              <Route
                index
                element={
                  <Suspense fallback={<PageFallback />}>
                    <DashboardOverviewPage />
                  </Suspense>
                }
              />
              <Route
                path="orders"
                element={
                  <Suspense fallback={<PageFallback />}>
                    <OrdersPage />
                  </Suspense>
                }
              />
              <Route
                path="orders/:id"
                element={
                  <Suspense fallback={<PageFallback />}>
                    <OrderDetailPage />
                  </Suspense>
                }
              />
              <Route
                path="products"
                element={
                  <Suspense fallback={<PageFallback />}>
                    <MyProductsPage />
                  </Suspense>
                }
              />
              <Route
                path="products/:id"
                element={
                  <Suspense fallback={<PageFallback />}>
                    <MyProductDetailPage />
                  </Suspense>
                }
              />
              <Route
                path="subscriptions"
                element={
                  <Suspense fallback={<PageFallback />}>
                    <SubscriptionsPage />
                  </Suspense>
                }
              />
              <Route
                path="subscriptions/:id"
                element={
                  <Suspense fallback={<PageFallback />}>
                    <SubscriptionManagePage />
                  </Suspense>
                }
              />
              <Route
                path="support"
                element={
                  <Suspense fallback={<PageFallback />}>
                    <SupportPage />
                  </Suspense>
                }
              />
              <Route
                path="settings"
                element={
                  <Suspense fallback={<PageFallback />}>
                    <SettingsPage />
                  </Suspense>
                }
              />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
