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
import { cn, formatDate } from "@/lib/utils";
import { networkService } from "@/services/network";
import { subscriptionService } from "@/services/subscription";
import { useAuthStore } from "@/store/auth";

const CATEGORIES = [
  {
    icon: Rocket,
    title: "Getting started",
    description: "Activate access and connect your first device.",
    to: "/setup",
  },
  {
    icon: Copy,
    title: "Subscription URL",
    description: "Import, reveal, copy or regenerate your personal link.",
    to: "/console/subscription",
  },
  {
    icon: MonitorSmartphone,
    title: "Devices",
    description: "Manage the devices using your subscription.",
    to: "/console/devices",
  },
  {
    icon: RefreshCw,
    title: "Billing & renewal",
    description: "Extend your access without losing remaining time.",
    to: "/console/billing",
  },
  {
    icon: Wifi,
    title: "Connection issues",
    description: "Check region status and switch locations.",
    to: "/network",
  },
  {
    icon: Radio,
    title: "Account",
    description: "Profile, notifications and sign-in.",
    to: "/console/settings",
  },
];

const FAQ = [
  {
    question: "How do I start using the service?",
    answer:
      "Pick a duration on the plans page, complete checkout, and your subscription activates immediately. Then follow the setup guide — install a client, paste your subscription URL, connect.",
  },
  {
    question: "Which clients are supported?",
    answer:
      "Any client that accepts a standard subscription URL. We publish a recommended client per platform — Windows, macOS, iOS, Android and Linux — in the setup guide.",
  },
  {
    question: "How many devices can I use?",
    answer:
      "Up to 5 devices at the same time. You can rename or remove devices anytime from the console.",
  },
  {
    question: "A region feels slow or unreachable. What should I do?",
    answer:
      "Check the network page for current region status and latency, then switch to another region in your client. If the problem persists, open a ticket with the affected region and time.",
  },
  {
    question: "What happens when my subscription expires?",
    answer:
      "Access stops at expiry. Renewing before expiry extends your current end date, so no time is lost. Your subscription URL stays the same across renewals.",
  },
  {
    question: "My subscription URL leaked. What now?",
    answer:
      "Go to Console → Subscription and regenerate the link. This invalidates the old URL immediately; update your clients with the new one.",
  },
];

/** Right rail — live status, current access, contact. */
function SupportRail() {
  const user = useAuthStore((s) => s.user);
  const status = useAsync(() => networkService.getStatus(), []);
  const subscription = useAsync(
    () => (user ? subscriptionService.getCurrent() : Promise.resolve(null)),
    [user?.email],
  );

  return (
    <SideRail>
      <Panel title="Network status">
        {status.loading ? (
          <Skeleton className="h-5 w-40" />
        ) : (
          <p className="flex items-center gap-2.5 text-sm text-foreground">
            <StatusDot
              tone={status.data?.status === "operational" ? "success" : "warning"}
            />
            {status.data?.status === "operational"
              ? "All systems operational"
              : "Some regions degraded"}
          </p>
        )}
        <div className="mt-4 border-t border-border pt-4">
          <PanelLink to="/network">View network</PanelLink>
        </div>
      </Panel>

      {user && subscription.data && (
        <Panel title="Your subscription">
          <p className="flex items-center gap-2.5 text-sm text-foreground">
            <StatusDot
              tone={subscription.data.status === "active" ? "success" : "neutral"}
            />
            {subscription.data.status === "active" ? "Active" : "Expired"}
          </p>
          <p className="mt-2 text-[13px] text-muted">
            Expires {formatDate(subscription.data.expiresAt)}
          </p>
          <div className="mt-4 border-t border-border pt-4">
            <PanelLink to="/console/subscription">Manage subscription</PanelLink>
          </div>
        </Panel>
      )}

      <Panel title="Contact support">
        <div className="flex items-start gap-3">
          <LifeBuoy className="mt-0.5 size-4 shrink-0 text-subtle" />
          <p className="text-sm leading-relaxed text-muted">
            Signed-in users can open a ticket in the console, or email us
            directly.
          </p>
        </div>
        <a
          href={`mailto:${brand.supportEmail}`}
          className="mt-3 block break-all rounded-sm text-sm font-medium text-primary hover:underline focus-ring"
        >
          {brand.supportEmail}
        </a>
        <div className="mt-4 flex flex-col items-start gap-2.5 border-t border-border pt-4">
          <PanelLink to="/console/support">Open a ticket</PanelLink>
          <PanelLink to="/setup">Setup guide</PanelLink>
        </div>
      </Panel>
    </SideRail>
  );
}

export function HelpPage() {
  const [query, setQuery] = useState("");

  const filteredFaq = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQ;
    return FAQ.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <Container className="py-12 md:py-16 lg:py-20">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        Help Center
      </h1>
      <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
        Answers, guides and a direct line to support.
      </p>

      {/* Search */}
      <div className="relative mt-8 max-w-[760px]">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-subtle" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search help — e.g. renew, device, subscription URL"
          aria-label="Search help"
          className="h-12 pl-11 text-[15px]"
        />
      </div>

      <div className="mt-12 grid items-start gap-10 lg:grid-cols-12">
        {/* Categories */}
        {!query && (
          <nav aria-label="Help categories" className="lg:col-span-3">
            <p className="px-1 pb-3 text-xs font-medium uppercase tracking-wide text-subtle">
              Categories
            </p>
            <ul className="space-y-1">
              {CATEGORIES.map((category) => (
                <li key={category.title}>
                  <Link
                    to={category.to}
                    className={cn(
                      "group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors duration-150",
                      "hover:bg-surface focus-ring",
                    )}
                  >
                    <category.icon className="mt-0.5 size-4 shrink-0 text-subtle transition-colors group-hover:text-primary" />
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
              ))}
            </ul>
          </nav>
        )}

        {/* FAQ — widens to fill when searching */}
        <div className={cn(query ? "lg:col-span-9" : "lg:col-span-6")}>
          <h2 className="text-lg font-semibold text-foreground">
            {query ? `Results for “${query.trim()}”` : "Frequently asked"}
          </h2>
          {filteredFaq.length === 0 ? (
            <p className="mt-5 text-sm text-muted">
              No matching answers. Try different words, or{" "}
              <Link
                to="/console/support"
                className="rounded-sm text-primary hover:underline focus-ring"
              >
                contact support
              </Link>
              .
            </p>
          ) : (
            <div className="mt-4">
              <Accordion type="single" collapsible>
                {filteredFaq.map((item) => (
                  <AccordionItem key={item.question} value={item.question}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
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
