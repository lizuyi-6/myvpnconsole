import {
  ChevronDown,
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
import { useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Logo } from "@/components/brand/logo";
import { StatusDot } from "@/components/feedback/status-dot";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAsync } from "@/hooks/use-async";
import { cn, initialsOf } from "@/lib/utils";
import { networkService } from "@/services/network";
import { useAuthStore } from "@/store/auth";

const NAV_ITEMS = [
  { to: "/console", label: "Overview", icon: LayoutGrid, end: true },
  { to: "/console/subscription", label: "Subscription", icon: Radio },
  { to: "/console/devices", label: "Devices", icon: MonitorSmartphone },
  { to: "/console/setup", label: "Setup", icon: Wrench },
  { to: "/console/billing", label: "Billing", icon: CreditCard },
  { to: "/console/support", label: "Support", icon: LifeBuoy },
];

const PAGE_TITLES: [RegExp, string][] = [
  [/^\/console$/, "Overview"],
  [/^\/console\/subscription/, "Subscription"],
  [/^\/console\/devices/, "Devices"],
  [/^\/console\/setup/, "Setup"],
  [/^\/console\/billing/, "Billing"],
  [/^\/console\/support/, "Support"],
  [/^\/console\/settings/, "Settings"],
];

function consoleNavClass(isActive: boolean) {
  return cn(
    "flex h-10 items-center gap-2.5 rounded-lg px-3 text-sm transition-colors duration-150 focus-ring",
    isActive
      ? "bg-tint font-medium text-primary"
      : "text-muted hover:bg-foreground/[0.04] hover:text-foreground",
  );
}

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
            className={({ isActive }) => consoleNavClass(isActive)}
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
          className={({ isActive }) => consoleNavClass(isActive)}
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
          className="flex h-10 w-full items-center gap-2.5 rounded-lg px-3 text-sm text-muted transition-colors duration-150 hover:bg-foreground/[0.04] hover:text-foreground focus-ring"
        >
          <LogOut className="size-4 shrink-0" />
          Sign out
        </button>

        {user && (
          <div className="mt-2 flex items-center gap-2.5 rounded-lg border border-border bg-background px-3 py-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-tint text-xs font-semibold text-primary">
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

/** Desktop user menu — settings and sign out. */
function UserMenu() {
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  if (!user) return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors duration-150 hover:bg-foreground/[0.04] focus-ring"
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-tint text-xs font-semibold text-primary">
          {initialsOf(user.name)}
        </span>
        <span className="hidden max-w-40 truncate text-sm font-medium text-foreground lg:block">
          {user.name}
        </span>
        <ChevronDown className="size-3.5 text-subtle" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-1.5 w-56 animate-content-in rounded-lg border border-border bg-surface p-1.5 shadow-panel"
        >
          <div className="border-b border-border px-3 py-2.5">
            <p className="truncate text-[13px] font-medium text-foreground">
              {user.name}
            </p>
            <p className="truncate text-xs text-subtle">{user.email}</p>
          </div>
          <Link
            to="/console/settings"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="mt-1 flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted transition-colors hover:bg-foreground/[0.04] hover:text-foreground focus-ring"
          >
            <Settings className="size-4" />
            Settings
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              signOut();
              navigate("/");
            }}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted transition-colors hover:bg-foreground/[0.04] hover:text-foreground focus-ring"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

/** Desktop topbar — current page, live network status, help, user menu. */
function ConsoleTopbar() {
  const location = useLocation();
  const status = useAsync(() => networkService.getStatus(), []);
  const title =
    PAGE_TITLES.find(([pattern]) => pattern.test(location.pathname))?.[1] ??
    "Console";

  return (
    <div className="sticky top-0 z-30 hidden h-16 items-center justify-between border-b border-border bg-surface/90 px-8 backdrop-blur-md md:flex lg:px-10">
      <p className="text-[15px] font-semibold text-foreground">{title}</p>

      <div className="flex items-center gap-2">
        <Link
          to="/network"
          className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-[13px] text-muted transition-colors hover:text-foreground focus-ring"
        >
          <StatusDot
            tone={status.data?.status === "operational" ? "success" : "warning"}
          />
          {status.data
            ? status.data.status === "operational"
              ? "Operational"
              : "Degraded"
            : "…"}
        </Link>
        <Link
          to="/help"
          aria-label="Help Center"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-foreground/[0.05] hover:text-foreground focus-ring"
        >
          <LifeBuoy className="size-[18px]" />
        </Link>
        <span aria-hidden className="mx-1 h-5 w-px bg-border" />
        <UserMenu />
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
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-surface md:flex">
        <div className="flex h-16 items-center border-b border-border px-5">
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
        <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-surface/90 px-5 backdrop-blur-md md:hidden">
          <Link to="/" aria-label="NOVA home" className="focus-ring rounded-md">
            <Logo />
          </Link>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Open console menu"
                className="flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-foreground/[0.05] hover:text-foreground focus-ring"
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

        <ConsoleTopbar />

        <main className="mx-auto w-full max-w-workspace flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
