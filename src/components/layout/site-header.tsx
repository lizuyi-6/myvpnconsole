import { Menu } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";

const NAV_LINKS = [
  { to: "/network", label: "Network" },
  { to: "/plans", label: "Plans" },
  { to: "/setup", label: "Setup" },
  { to: "/help", label: "Help" },
];

function navLinkClass({ isActive }: { isActive: boolean }) {
  return cn(
    "relative rounded-md px-3 py-2 text-sm transition-colors duration-150 focus-ring",
    isActive
      ? "font-medium text-foreground after:absolute after:inset-x-3 after:-bottom-[17px] after:h-0.5 after:rounded-full after:bg-primary"
      : "text-muted hover:text-foreground",
  );
}

export function SiteHeader() {
  const user = useAuthStore((s) => s.user);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-surface/90 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link to="/" aria-label="NOVA home" className="focus-ring rounded-md">
            <Logo />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <Button asChild variant="secondary" size="sm" className="hidden sm:inline-flex">
              <Link to="/console">Console</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm" className="hidden sm:inline-flex">
                <Link to="/plans">Get access</Link>
              </Button>
            </>
          )}

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Open menu"
                className="flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-foreground/[0.05] hover:text-foreground focus-ring md:hidden"
              >
                <Menu className="size-5" />
              </button>
            </SheetTrigger>
            <SheetContent aria-describedby={undefined}>
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <div className="border-b border-border p-5">
                <Logo />
              </div>
              <nav aria-label="Mobile" className="flex flex-col gap-1 p-4">
                {NAV_LINKS.map((link) => (
                  <SheetClose asChild key={link.to}>
                    <Link
                      to={link.to}
                      className="rounded-md px-3 py-2.5 text-sm text-muted transition-colors hover:bg-foreground/[0.04] hover:text-foreground focus-ring"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-2 border-t border-border p-4">
                {user ? (
                  <SheetClose asChild>
                    <Button asChild variant="secondary">
                      <Link to="/console">Console</Link>
                    </Button>
                  </SheetClose>
                ) : (
                  <>
                    <SheetClose asChild>
                      <Button asChild variant="secondary">
                        <Link to="/login">Sign in</Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button asChild>
                        <Link to="/plans">Get access</Link>
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
