import { Menu } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Logo } from "@/components/brand/logo";
import { StatusDot } from "@/components/feedback/status-dot";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAsync } from "@/hooks/use-async";
import { useScrolled } from "@/hooks/use-scrolled";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";
import { networkService } from "@/services/network";
import { useAuthStore } from "@/store/auth";

const NAV_LINKS = [
  { to: "/network", key: "network" },
  { to: "/plans", key: "plans" },
  { to: "/setup", key: "setup" },
  { to: "/help", key: "help" },
] as const;

function navLinkClass({ isActive }: { isActive: boolean }) {
  return cn(
    "relative rounded-md px-3 py-2 text-sm transition-colors duration-150 focus-ring",
    isActive
      ? "font-medium text-foreground after:absolute after:inset-x-3 after:-bottom-[17px] after:h-0.5 after:rounded-full after:bg-primary"
      : "text-muted hover:text-foreground",
  );
}

function NetworkStatusIndicator() {
  const { data } = useAsync(() => networkService.getStatus(), []);
  const { t } = useI18n();
  if (!data) return null;
  const operational = data.status === "operational";
  return (
    <Link
      to="/network"
      className="hidden items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-[13px] text-muted transition-colors hover:text-foreground focus-ring xl:flex"
    >
      <StatusDot tone={operational ? "success" : "warning"} pulse={operational} />
      {operational ? t("common.statusOperational") : t("common.statusDegraded")}
    </Link>
  );
}

export function SiteHeader() {
  const user = useAuthStore((s) => s.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useScrolled();
  const { t } = useI18n();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border/80 bg-surface/90 backdrop-blur-md transition-shadow duration-200",
        scrolled && "shadow-[0_12px_28px_-20px_rgb(16_24_40/0.25)]",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-10">
          <Link
            to="/"
            aria-label={t("header.homeAria")}
            className="focus-ring rounded-md"
          >
            <Logo />
          </Link>

          <nav
            aria-label={t("header.navPrimaryAria")}
            className="hidden items-center gap-1 md:flex"
          >
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass}>
                {t(`header.nav.${link.key}`)}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <NetworkStatusIndicator />
          <LanguageSwitcher />
          {user ? (
            <Button
              asChild
              variant="secondary"
              size="sm"
              className="hidden sm:inline-flex"
            >
              <Link to="/console">{t("header.console")}</Link>
            </Button>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
              >
                <Link to="/login">{t("header.signIn")}</Link>
              </Button>
              <Button asChild size="sm" className="hidden sm:inline-flex">
                <Link to="/plans">{t("header.getAccess")}</Link>
              </Button>
            </>
          )}

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button
                aria-label={t("header.openMenu")}
                className="flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-foreground/[0.05] hover:text-foreground focus-ring md:hidden"
              >
                <Menu className="size-5" />
              </button>
            </SheetTrigger>
            <SheetContent aria-describedby={undefined}>
              <SheetTitle className="sr-only">
                {t("header.menuTitle")}
              </SheetTitle>
              <div className="border-b border-border p-5">
                <Logo />
              </div>
              <nav
                aria-label={t("header.navMobileAria")}
                className="flex flex-col gap-1 p-4"
              >
                {NAV_LINKS.map((link) => (
                  <SheetClose asChild key={link.to}>
                    <Link
                      to={link.to}
                      className="rounded-md px-3 py-2.5 text-sm text-muted transition-colors hover:bg-foreground/[0.04] hover:text-foreground focus-ring"
                    >
                      {t(`header.nav.${link.key}`)}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-2 border-t border-border p-4">
                {user ? (
                  <SheetClose asChild>
                    <Button asChild variant="secondary">
                      <Link to="/console">{t("header.console")}</Link>
                    </Button>
                  </SheetClose>
                ) : (
                  <>
                    <SheetClose asChild>
                      <Button asChild variant="secondary">
                        <Link to="/login">{t("header.signIn")}</Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button asChild>
                        <Link to="/plans">{t("header.getAccess")}</Link>
                      </Button>
                    </SheetClose>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
