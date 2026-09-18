import { useI18n } from "@/i18n";

/**
 * "Skip to main content" — the first focusable element on the page.
 * Slides into view when it receives keyboard focus (WCAG 2.4.1).
 * (Not sr-only:not-sr-only — its `padding:0` would out-specify the pill styles.)
 */
export function SkipLink({ href = "#main-content" }: { href?: string }) {
  const { t } = useI18n();
  return (
    <a
      href={href}
      className="absolute left-4 top-3 z-[80] -translate-y-[300%] rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground opacity-0 shadow-panel outline-none transition-[transform,opacity] duration-150 focus:translate-y-0 focus:opacity-100"
    >
      {t("common.skipToContent")}
    </a>
  );
}
