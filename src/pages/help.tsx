import { Link } from "react-router-dom";
import { Container } from "@/components/layout/container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { brand } from "@/config/brand";

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
  return (
    <Container className="max-w-3xl py-12 md:py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Help
      </h1>
      <p className="mt-1.5 text-sm text-muted">
        Common questions. Signed-in users can open a ticket from the console.
      </p>

      <div className="mt-8">
        <Accordion type="single" collapsible>
          {FAQ.map((item, i) => (
            <AccordionItem key={item.question} value={`help-${i}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="mt-10 border-t border-border pt-8 sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Still stuck?
          </h2>
          <p className="mt-1 text-sm text-muted">
            Open a ticket in the console, or write to{" "}
            <a
              href={`mailto:${brand.supportEmail}`}
              className="text-primary hover:underline focus-ring rounded-sm"
            >
              {brand.supportEmail}
            </a>
            .
          </p>
        </div>
        <Button asChild variant="secondary" size="sm" className="mt-4 sm:mt-0">
          <Link to="/console/support">Contact support</Link>
        </Button>
      </div>
    </Container>
  );
}
