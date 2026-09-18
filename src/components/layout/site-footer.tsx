import { Link } from "react-router-dom";
import { Logo } from "@/components/brand/logo";
import { StatusDot } from "@/components/feedback/status-dot";
import { Container } from "@/components/layout/container";
import { useAsync } from "@/hooks/use-async";
import { useI18n } from "@/i18n";
import { networkService } from "@/services/network";

type FooterLinkKey =
  | "network"
  | "plans"
  | "setup"
  | "helpCenter"
  | "gettingStarted"
  | "contactSupport"
  | "signIn"
  | "console"
  | "privacy"
  | "terms"
  | "refunds";

const FOOTER_GROUPS: {
  titleKey: "service" | "resources" | "account" | "legal";
  links: { to: string; key: FooterLinkKey }[];
}[] = [
  {
    titleKey: "service",
    links: [
      { to: "/network", key: "network" },
      { to: "/plans", key: "plans" },
      { to: "/setup", key: "setup" },
    ],
  },
  {
    titleKey: "resources",
    links: [
      { to: "/help", key: "helpCenter" },
      { to: "/setup", key: "gettingStarted" },
      { to: "/console/support", key: "contactSupport" },
    ],
  },
  {
    titleKey: "account",
    links: [
      { to: "/login", key: "signIn" },
      { to: "/console", key: "console" },
    ],
  },
  {
    titleKey: "legal",
    links: [
      { to: "/legal/privacy", key: "privacy" },
      { to: "/legal/terms", key: "terms" },
      { to: "/legal/refunds", key: "refunds" },
    ],
  },
];

function FooterStatus() {
  const { data: status } = useAsync(() => networkService.getStatus(), []);
  const { t } = useI18n();
  const operational = status?.status !== "outage";

  return (
    <span className="inline-flex items-center gap-2">
      <StatusDot tone={operational ? "success" : "warning"} />
      {t("footer.serviceStatus")}{" "}
      <span className="text-navy-foreground">
        {status
          ? operational
            ? t("common.statusOperational")
            : t("common.statusDegraded")
          : "—"}
      </span>
    </span>
  );
}

export function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="bg-navy">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">
        <div>
          <Logo dark />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-navy-muted">
            {t("common.brandDescription")}
          </p>
        </div>
        {FOOTER_GROUPS.map((group) => (
          <div key={group.titleKey}>
            <p className="text-xs font-medium uppercase tracking-wide text-navy-muted">
              {t(`footer.groups.${group.titleKey}`)}
            </p>
            <ul className="mt-4 space-y-2.5">
              {group.links.map((link) => (
                <li key={link.key}>
                  <Link
                    to={link.to}
                    className="rounded-sm text-sm text-navy-muted transition-colors hover:text-navy-foreground focus-ring"
                  >
                    {t(`footer.links.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex h-16 items-center justify-between gap-4 text-[13px] text-navy-muted">
          <span>{t("footer.copyright", { year: new Date().getFullYear() })}</span>
          <FooterStatus />
        </Container>
      </div>
    </footer>
  );
}
