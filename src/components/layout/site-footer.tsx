import { Link } from "react-router-dom";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/layout/container";
import { brand } from "@/config/brand";

const FOOTER_GROUPS = [
  {
    title: "Products",
    links: [
      { to: "/products?category=ai", label: "AI Subscriptions" },
      { to: "/products?category=network", label: "Network" },
      { to: "/products?category=bundle", label: "Bundles" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/pricing", label: "Pricing" },
      { to: "/help", label: "Help Center" },
      { to: "/dashboard/support", label: "Support" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70">
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
                    className="text-[13px] text-muted transition-colors hover:text-foreground focus-ring rounded-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <div className="border-t border-border/70">
        <Container className="flex h-14 items-center justify-between text-xs text-subtle">
          <span>© {new Date().getFullYear()} {brand.name}. All rights reserved.</span>
          <span>Built for digital services.</span>
        </Container>
      </div>
    </footer>
  );
}
