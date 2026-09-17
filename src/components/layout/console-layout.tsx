import {
  CreditCard,
  LayoutGrid,
  LifeBuoy,
  LogOut,
  Menu,
  MonitorSmartphone,
  Radio,
  Settings,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Logo } from "@/components/brand/logo";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn, initialsOf } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";

const NAV_ITEMS = [
  { to: "/console", label: "Overview", icon: LayoutGrid, end: true },
  { to: "/console/subscription", label: "Subscription", icon: Radio },
  { to: "/console/devices", label: "Devices", icon: MonitorSmartphone },
  { to: "/console/setup", label: "Setup", icon: Wrench },
  { to: "/console/billing", label: "Billing", icon: CreditCard },
  { to: "/console/support", label: "Support", icon: LifeBuoy },
];

function ConsoleNav({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();

  return (
    <div className="flex h-full flex-col">
      <nav aria-label="Console" className="flex flex-col gap-0.5 p-3">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors duration-150 focus-ring",
                isActive
                  ? "bg-white/[0.06] font-medium text-foreground"
                  : "text-muted hover:bg-white/[0.03] hover:text-foreground",
              )
            }
          >
            <item.icon className="size-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-0.5 border-t border-border p-3">
        <NavLink
          to="/console/settings"
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors duration-150 focus-ring",
              isActive
                ? "bg-white/[0.06] font-medium text-foreground"
                : "text-muted hover:bg-white/[0.03] hover:text-foreground",
            )
          }
        >
          <Settings className="size-4 shrink-0" />
          Settings
        </NavLink>
        <button
          type="button"
          onClick={() => {
            signOut();
            navigate("/");
          }}
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted transition-colors duration-150 hover:bg-white/[0.03] hover:text-foreground focus-ring"
        >
          <LogOut className="size-4 shrink-0" />
          Sign out
        </button>

        {user && (
          <div className="mt-2 flex items-center gap-2.5 px-3 py-2">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
              {initialsOf(user.name)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-foreground">
                {user.name}
              </p>
              <p className="truncate text-xs text-subtle">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Console is a standalone shell — the public marketing navigation
 * is intentionally not shown here.
 */
export function ConsoleLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border/70 bg-surface/40 md:flex">
        <div className="flex h-14 items-center border-b border-border/70 px-5">
          <Link to="/" aria-label="NOVA home" className="focus-ring rounded-md">
            <Logo />
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ConsoleNav />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar with drawer */}
        <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border/70 bg-background/85 px-5 backdrop-blur-md md:hidden">
          <Link to="/" aria-label="NOVA home" className="focus-ring rounded-md">
            <Logo />
          </Link>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Open console menu"
                className="flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-white/5 hover:text-foreground focus-ring"
              >
                <Menu className="size-5" />
              </button>
            </SheetTrigger>
            <SheetContent aria-describedby={undefined}>
              <SheetTitle className="sr-only">Console menu</SheetTitle>
              <div className="border-b border-border p-5">
                <Logo />
              </div>
              <div className="flex-1 overflow-y-auto">
                <ConsoleNav onNavigate={() => setMenuOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <main className="mx-auto w-full max-w-[960px] flex-1 px-5 py-8 sm:px-8 md:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
