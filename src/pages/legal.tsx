import { Link, useParams } from "react-router-dom";
import { Container } from "@/components/layout/container";
import { legalDocOrder, legalDocs } from "@/content/legal";
import { cn } from "@/lib/utils";

export function LegalPage() {
  const { doc } = useParams();
  const entry = (doc ? legalDocs[doc] : undefined) ?? legalDocs.terms;

  return (
    <Container className="py-12 md:py-16 lg:py-20">
      <div className="grid items-start gap-10 lg:grid-cols-12">
        {/* Document navigation — vertical on desktop, pills on mobile */}
        <nav
          aria-label="Legal documents"
          className="flex flex-wrap gap-2 lg:sticky lg:top-24 lg:col-span-3 lg:flex-col lg:gap-1"
        >
          <p className="hidden px-3 pb-2 text-xs font-medium uppercase tracking-wide text-subtle lg:block">
            Legal
          </p>
          {legalDocOrder.map((slug) => {
            const d = legalDocs[slug];
            const active = d.slug === entry.slug;
            return (
              <Link
                key={slug}
                to={`/legal/${slug}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-lg border px-3.5 py-2 text-sm transition-colors duration-150 focus-ring lg:border-transparent lg:px-3 lg:py-2.5",
                  active
                    ? "border-primary/40 bg-tint font-medium text-primary"
                    : "border-border bg-surface text-muted hover:text-foreground lg:bg-transparent lg:hover:bg-foreground/[0.04]",
                )}
              >
                {d.title}
              </Link>
            );
          })}
        </nav>

        {/* Document body */}
        <div className="max-w-article lg:col-span-9">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
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
              className="rounded-sm text-primary hover:underline focus-ring"
            >
              Back to Help Center
            </Link>
          </p>
        </div>
      </div>
    </Container>
  );
}
