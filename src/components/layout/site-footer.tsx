import { Link } from "react-router-dom";
import { Logo } from "@/components/brand/logo";
import { StatusDot } from "@/components/feedback/status-dot";
import { Container } from "@/components/layout/container";
import { brand } from "@/config/brand";
import { useAsync } from "@/hooks/use-async";
import { networkService } from "@/services/network";

const FOOTER_GROUPS = [
  {
    title: "Service",
    links: [
      { to: "/network", label: "Network" },
      { to: "/plans", label: "Plans" },
      { to: "/setup", label: "Setup" },
    ],
  },
  {
    title: "Resources",
    links: [
      { to: "/help", label: "Help Center" },
      { to: "/setup", label: "Getting Started" },
      { to: "/console/support", label: "Contact support" },
    ],
  },
  {
    title: "Account",
    links: [
      { to: "/login", label: "Sign in" },
      { to: "/console", label: "Console" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/legal/privacy", label: "Privacy" },
      { to: "/legal/terms", label: "Terms" },
      { to: "/legal/refunds", label: "Refund Policy" },
    ],
  },
];

function FooterStatus() {
  const { data: status } = useAsync(() => networkService.getStatus(), []);
  const operational = status?.status !== "outage";

  return (
    <span className="inline-flex items-center gap-2">
      <StatusDot tone={operational ? "success" : "warning"} />
      Service status:{" "}
      <span className="text-navy-foreground">
        {status ? (operational ? "Operational" : "Degraded") : "—"}
      </span>
    </span>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-navy">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">
        <div>
          <Logo dark />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-navy-muted">
            {brand.description}
          </p>
        </div>
        {FOOTER_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="text-xs font-medium uppercase tracking-wide text-navy-muted">
              {group.title}
            </p>
            <ul className="mt-4 space-y-2.5">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="rounded-sm text-sm text-navy-muted transition-colors hover:text-navy-foreground focus-ring"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex h-16 items-center justify-between gap-4 text-[13px] text-navy-muted">
          <span>© {new Date().getFullYear()} {brand.name}</span>
          <FooterStatus />
        </Container>
      </div>
    </footer>
  );
}
