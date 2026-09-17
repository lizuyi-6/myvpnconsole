import {
  LayoutGrid,
  LifeBuoy,
  ListOrdered,
  LogOut,
  Menu,
  Package,
  Radio,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/layout/container";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn, initialsOf } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Overview", icon: LayoutGrid, end: true },
  { to: "/dashboard/orders", label: "Orders", icon: ListOrdered },
  { to: "/dashboard/products", label: "My Products", icon: Package },
  { to: "/dashboard/subscriptions", label: "Subscriptions", icon: Radio },
  { to: "/dashboard/support", label: "Support", icon: LifeBuoy },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();

  return (
    <div className="flex h-full flex-col">
      <nav aria-label="Dashboard" className="flex flex-col gap-0.5 p-3">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors duration-150 focus-ring",
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
          to="/dashboard/settings"
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors duration-150 focus-ring",
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
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted transition-colors duration-150 hover:bg-white/[0.03] hover:text-foreground focus-ring"
        >
          <LogOut className="size-4 shrink-0" />
          Sign out
        </button>

        {user && (
          <div className="mt-2 flex items-center gap-2.5 rounded-lg px-3 py-2">
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

export function DashboardLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Container className="py-8 md:py-10">
      <div className="md:grid md:grid-cols-[220px_1fr] md:gap-10">
        {/* Mobile top bar with drawer */}
        <div className="mb-6 flex items-center justify-between md:hidden">
          <span className="text-sm font-medium text-muted">Dashboard</span>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Open dashboard menu"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:bg-white/5 hover:text-foreground focus-ring"
              >
                <Menu className="size-4" />
              </button>
            </SheetTrigger>
            <SheetContent aria-describedby={undefined}>
              <SheetTitle className="sr-only">Dashboard menu</SheetTitle>
              <div className="border-b border-border p-5">
                <Logo />
              </div>
              <div className="flex-1 overflow-y-auto">
                <SidebarNav onNavigate={() => setMenuOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop sidebar */}
        <aside className="hidden md:block">
          <div className="sticky top-24 rounded-xl border border-border bg-surface">
            <SidebarNav />
          </div>
        </aside>

        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </Container>
  );
}
