import {
  Copy,
  LifeBuoy,
  MonitorSmartphone,
  Radio,
  RefreshCw,
  Rocket,
  Search,
  Wifi,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { StatusDot } from "@/components/feedback/status-dot";
import { Container } from "@/components/layout/container";
import { Panel, PanelLink } from "@/components/layout/panel";
import { SideRail } from "@/components/layout/side-rail";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { brand } from "@/config/brand";
import { useAsync } from "@/hooks/use-async";
import { interpolate, useI18n } from "@/i18n";
import { cn } from "@/lib/utils";
import { DEVICE_LIMIT } from "@/config/product";
import { networkService } from "@/services/network";
import { subscriptionService } from "@/services/subscription";
import { useAuthStore } from "@/store/auth";

const CATEGORY_LINKS = [
  { icon: Rocket, to: "/setup" },
  { icon: Copy, to: "/console/subscription" },
  { icon: MonitorSmartphone, to: "/console/devices" },
  { icon: RefreshCw, to: "/console/billing" },
  { icon: Wifi, to: "/network" },
  { icon: Radio, to: "/console/settings" },
];

/** Right rail — live status, current access, contact. */
function SupportRail() {
  const user = useAuthStore((s) => s.user);
  const { t, formatDate } = useI18n();
  const status = useAsync(() => networkService.getStatus(), []);
  const subscription = useAsync(
    () => (user ? subscriptionService.getCurrent() : Promise.resolve(null)),
    [user?.email],
  );

  return (
    <SideRail>
      <Panel title={t("help.statusPanel")}>
        {status.loading ? (
          <Skeleton className="h-5 w-40" />
        ) : (
          <p className="flex items-center gap-2.5 text-sm text-foreground">
            <StatusDot
              tone={status.data?.status === "operational" ? "success" : "warning"}
              pulse={status.data?.status === "operational"}
            />
            {status.data?.status === "operational"
              ? t("common.allSystemsOperational")
              : t("common.someRegionsDegraded")}
          </p>
        )}
        <div className="mt-4 border-t border-border pt-4">
          <PanelLink to="/network">{t("help.viewNetwork")}</PanelLink>
        </div>
      </Panel>

      {user && subscription.data && (
        <Panel title={t("help.subscriptionPanel")}>
          <p className="flex items-center gap-2.5 text-sm text-foreground">
            <StatusDot
              tone={subscription.data.status === "active" ? "success" : "neutral"}
            />
            {subscription.data.status === "active"
              ? t("common.statusActive")
              : t("common.statusExpired")}
          </p>
          <p className="mt-2 text-[13px] text-muted">
            {t("help.expiresAt", { date: formatDate(subscription.data.expiresAt) })}
          </p>
          <div className="mt-4 border-t border-border pt-4">
            <PanelLink to="/console/subscription">
              {t("help.manageSubscription")}
            </PanelLink>
          </div>
        </Panel>
      )}

      <Panel title={t("help.contactPanel")}>
        <div className="flex items-start gap-3">
          <LifeBuoy className="mt-0.5 size-4 shrink-0 text-subtle" />
          <p className="text-sm leading-relaxed text-muted">
            {t("help.contactBody")}
          </p>
        </div>
        <a
          href={`mailto:${brand.supportEmail}`}
          className="mt-3 block break-all rounded-sm text-sm font-medium text-primary hover:underline focus-ring"
        >
          {brand.supportEmail}
        </a>
        <div className="mt-4 flex flex-col items-start gap-2.5 border-t border-border pt-4">
          <PanelLink to="/console/support">{t("help.openTicket")}</PanelLink>
          <PanelLink to="/setup">{t("help.setupGuide")}</PanelLink>
        </div>
      </Panel>
    </SideRail>
  );
}

export function HelpPage() {
  const [query, setQuery] = useState("");
  const { t, dict } = useI18n();

  const filteredFaq = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return dict.help.faq;
    return dict.help.faq.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q),
    );
  }, [query, dict]);

  return (
    <Container className="py-12 md:py-16 lg:py-20">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        {t("help.title")}
      </h1>
      <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
        {t("help.description")}
      </p>

      {/* Search */}
      <div className="relative mt-8 max-w-[760px]">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-subtle" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("help.searchPlaceholder")}
          aria-label={t("help.searchAria")}
          className="h-12 pl-11 text-[15px]"
        />
      </div>

      <div className="mt-12 grid items-start gap-10 lg:grid-cols-12">
        {/* Categories */}
        {!query && (
          <nav aria-label={t("help.categoriesAria")} className="lg:col-span-3">
            <p className="px-1 pb-3 text-xs font-medium uppercase tracking-wide text-subtle">
              {t("help.categoriesLabel")}
            </p>
            <ul className="space-y-1">
              {dict.help.categories.map((category, i) => {
                const link = CATEGORY_LINKS[i];
                return (
                  <li key={category.title}>
                    <Link
                      to={link.to}
                      className={cn(
                        "group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors duration-150",
                        "hover:bg-surface focus-ring",
                      )}
                    >
                      <link.icon className="mt-0.5 size-4 shrink-0 text-subtle transition-colors group-hover:text-primary" />
                      <span>
                        <span className="block text-sm font-medium text-foreground group-hover:text-primary">
                          {category.title}
                        </span>
                        <span className="mt-0.5 block text-[13px] leading-snug text-muted">
                          {category.description}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        {/* FAQ — widens to fill when searching */}
        <div className={cn(query ? "lg:col-span-9" : "lg:col-span-6")}>
          <h2 className="text-lg font-semibold text-foreground">
            {query
              ? t("help.resultsFor", { query: query.trim() })
              : t("help.frequentlyAsked")}
          </h2>
          {filteredFaq.length === 0 ? (
            <p className="mt-5 text-sm text-muted">
              {t("help.noResultsPre")}
              <Link
                to="/console/support"
                className="rounded-sm text-primary hover:underline focus-ring"
              >
                {t("help.noResultsLink")}
              </Link>
              {t("help.noResultsPost")}
            </p>
          ) : (
            <div className="mt-4">
              <Accordion type="single" collapsible>
                {filteredFaq.map((item) => (
                  <AccordionItem key={item.question} value={item.question}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>
                      {interpolate(item.answer, { count: DEVICE_LIMIT })}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>

        {/* Support rail */}
        <div className="lg:col-span-3">
          <SupportRail />
        </div>
      </div>
    </Container>
  );
}
