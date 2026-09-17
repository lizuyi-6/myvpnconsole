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
import { Container } from "@/components/layout/container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { brand } from "@/config/brand";

const TOPICS = [
  {
    icon: Rocket,
    title: "Getting started",
    description: "Activate access and connect your first device.",
    to: "/setup",
  },
  {
    icon: Copy,
    title: "Import subscription",
    description: "Add your subscription URL to a compatible client.",
    to: "/setup",
  },
  {
    icon: MonitorSmartphone,
    title: "Device limit",
    description: "Manage the devices using your subscription.",
    to: "/console/devices",
  },
  {
    icon: RefreshCw,
    title: "Renewal",
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
    title: "Subscription URL",
    description: "Reveal, copy or regenerate your personal link.",
    to: "/console/subscription",
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
    <Container className="max-w-[1000px] py-14 md:py-20">
      <div className="max-w-xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Help Center
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Answers, guides and a direct line to support.
        </p>
      </div>

      {/* Search */}
      <div className="relative mt-8 max-w-xl">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search help — e.g. renew, device, subscription URL"
          aria-label="Search help"
          className="h-11 pl-10"
        />
      </div>

      {/* Popular topics */}
      {!query && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-foreground">
            Popular topics
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOPICS.map((topic) => (
              <Link
                key={topic.title}
                to={topic.to}
                className="group rounded-xl border border-border bg-surface p-5 shadow-card transition-colors duration-150 hover:border-primary/40 focus-ring"
              >
                <div className="flex size-9 items-center justify-center rounded-lg bg-tint">
                  <topic.icon className="size-[18px] text-primary" />
                </div>
                <h3 className="mt-3.5 text-sm font-semibold text-foreground group-hover:text-primary">
                  {topic.title}
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">
                  {topic.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* FAQ */}
      <div className="mt-12">
        <h2 className="text-lg font-semibold text-foreground">
          {query ? `Results for “${query.trim()}”` : "Frequently asked"}
        </h2>
        {filteredFaq.length === 0 ? (
          <p className="mt-5 text-sm text-muted">
            No matching answers. Try different words, or{" "}
            <Link
              to="/console/support"
              className="text-primary hover:underline focus-ring rounded-sm"
            >
              contact support
            </Link>
            .
          </p>
        ) : (
          <div className="mt-4 max-w-3xl">
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

      {/* Contact */}
      <div className="mt-14 flex flex-col gap-5 rounded-xl border border-border bg-surface p-7 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-tint">
            <LifeBuoy className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="text-[15px] font-semibold text-foreground">
              Still stuck?
            </h2>
            <p className="mt-1 max-w-md text-sm leading-relaxed text-muted">
              Signed-in users can open a ticket in the console, or write to{" "}
              <a
                href={`mailto:${brand.supportEmail}`}
                className="text-primary hover:underline focus-ring rounded-sm"
              >
                {brand.supportEmail}
              </a>
              .
            </p>
          </div>
        </div>
        <Button asChild variant="secondary" className="shrink-0">
          <Link to="/console/support">Contact support</Link>
        </Button>
      </div>
    </Container>
  );
}
