import { Outlet, useLocation } from "react-router-dom";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";

export function SiteLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {/* Keyed wrapper re-runs the entrance animation on route change */}
        <div key={location.pathname} className="animate-page-in">
          <Outlet />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
