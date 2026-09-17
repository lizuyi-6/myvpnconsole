import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
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
    question: "How fast is delivery?",
    answer:
      "Delivery is automated. Purchased accounts and subscription links appear in your dashboard within a few minutes of payment confirmation.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "Credit and debit cards, major cryptocurrencies, and account balance. Balance can be topped up from your dashboard.",
  },
  {
    question: "What if an account stops working?",
    answer:
      "Open a replacement ticket from the support page. Valid claims within the subscription period are replaced free of charge — usually the same day.",
  },
  {
    question: "Do you offer bulk pricing?",
    answer:
      "Yes. Volume tiers apply automatically from 5 units up. The product page shows exact per-unit pricing at every quantity before you buy.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "Undelivered or faulty items are refundable within the replacement window. Open a ticket and include your order number for the fastest resolution.",
  },
];

export function HelpPage() {
  return (
    <Container className="max-w-3xl py-12 md:py-16">
      <Reveal>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Help Center
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Answers to common questions. Signed-in users can also open a support
          ticket.
        </p>
      </Reveal>

      <Reveal className="mt-10">
        <Accordion type="single" collapsible>
          {FAQ.map((item, i) => (
            <AccordionItem key={item.question} value={`help-${i}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>

      <Reveal className="mt-12 rounded-xl border border-border bg-surface p-6 sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-foreground">
            Still need help?
          </h2>
          <p className="mt-1 text-sm text-muted">
            Open a ticket and we'll get back to you, or write to{" "}
            <a
              href={`mailto:${brand.supportEmail}`}
              className="text-primary hover:underline focus-ring rounded-sm"
            >
              {brand.supportEmail}
            </a>
            .
          </p>
        </div>
        <Button asChild variant="secondary" className="mt-4 sm:mt-0">
          <Link to="/dashboard/support">
            Open a ticket
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </Reveal>
    </Container>
  );
}
