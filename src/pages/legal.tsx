import { Link, useParams } from "react-router-dom";
import { Container } from "@/components/layout/container";
import { legalDocOrder, legalDocs } from "@/content/legal";
import { cn } from "@/lib/utils";

export function LegalPage() {
  const { doc } = useParams();
  const entry = (doc ? legalDocs[doc] : undefined) ?? legalDocs.terms;

  return (
    <Container className="max-w-3xl py-14 md:py-20">
      {/* Document switcher */}
      <nav aria-label="Legal documents" className="flex flex-wrap gap-2">
        {legalDocOrder.map((slug) => {
          const d = legalDocs[slug];
          const active = d.slug === entry.slug;
          return (
            <Link
              key={slug}
              to={`/legal/${slug}`}
              className={cn(
                "rounded-lg border px-3.5 py-2 text-sm transition-colors duration-150 focus-ring",
                active
                  ? "border-primary/40 bg-tint font-medium text-primary"
                  : "border-border bg-surface text-muted hover:text-foreground",
              )}
            >
              {d.title}
            </Link>
          );
        })}
      </nav>

      <h1 className="mt-8 text-3xl font-semibold tracking-tight text-foreground">
        {entry.title}
      </h1>
      <p className="mt-2 text-[15px] text-muted">{entry.summary}</p>
      <p className="mt-1 text-[13px] text-subtle">
        Effective {entry.effectiveDate}
      </p>

      <div className="mt-10 space-y-9">
        {entry.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-[15px] font-semibold text-foreground">
              {section.heading}
            </h2>
            {section.paragraphs?.map((p) => (
              <p
                key={p.slice(0, 40)}
                className="mt-2.5 text-sm leading-relaxed text-muted"
              >
                {p}
              </p>
            ))}
            {section.list && (
              <ul className="mt-2.5 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted marker:text-subtle">
                {section.list.map((item) => (
                  <li key={item.slice(0, 40)}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <p className="mt-12 border-t border-border pt-6 text-sm text-muted">
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
