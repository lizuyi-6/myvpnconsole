import { Link } from "react-router-dom";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/layout/container";
import { brand } from "@/config/brand";

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
    title: "Support",
    links: [
      { to: "/help", label: "Help Center" },
      { to: "/console/support", label: "Contact support" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <Container className="grid gap-10 py-12 sm:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-subtle">
            {brand.description}
          </p>
        </div>
        {FOOTER_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="text-xs font-medium uppercase tracking-wide text-subtle">
              {group.title}
            </p>
            <ul className="mt-3 space-y-2">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="rounded-sm text-[13px] text-muted transition-colors hover:text-foreground focus-ring"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <div className="border-t border-border/60">
        <Container className="flex h-14 items-center justify-between text-xs text-subtle">
          <span>
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </span>
          <span className="hidden sm:inline">Network access, simplified.</span>
        </Container>
      </div>
    </footer>
  );
}
