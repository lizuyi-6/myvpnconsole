import { Link, useParams } from "react-router-dom";
import { Container } from "@/components/layout/container";
import { brand } from "@/config/brand";

const DOCS: Record<string, { title: string; summary: string }> = {
  privacy: {
    title: "Privacy Policy",
    summary: "How account and usage data is collected, used and retained.",
  },
  terms: {
    title: "Terms of Service",
    summary: "The terms that govern use of the service.",
  },
  refunds: {
    title: "Refund Policy",
    summary: "When and how payments can be refunded.",
  },
};

/**
 * Placeholder for legal documents. The page structure and routing are
 * final; the document text itself must be supplied by the service
 * operator before launch — none is fabricated here.
 */
export function LegalPage() {
  const { doc } = useParams();
  const entry = (doc ? DOCS[doc] : undefined) ?? {
    title: "Legal",
    summary: "Legal documents for the service.",
  };

  return (
    <Container className="max-w-3xl py-14 md:py-20">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        {entry.title}
      </h1>
      <p className="mt-3 text-base text-muted">{entry.summary}</p>

      <div className="mt-8 rounded-xl border border-dashed border-border bg-surface p-7">
        <p className="text-sm leading-relaxed text-muted">
          This document is being prepared and will be published here before
          launch. Questions in the meantime:{" "}
          <a
            href={`mailto:${brand.supportEmail}`}
            className="text-primary hover:underline focus-ring rounded-sm"
          >
            {brand.supportEmail}
          </a>
          .
        </p>
      </div>

      <p className="mt-8 text-sm text-muted">
        <Link
          to="/help"
          className="text-primary hover:underline focus-ring rounded-sm"
        >
          Back to Help Center
        </Link>
      </p>
    </Container>
  );
}
