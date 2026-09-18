export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  list?: string[];
}

export interface LegalDoc {
  slug: string;
  title: string;
  summary: string;
  effectiveDate: string;
  sections: LegalSection[];
}

/**
 * Legal document *types* only. The actual documents live in the i18n
 * dictionaries (src/i18n/en.ts, src/i18n/zh.ts) so they can be localized;
 * render them via `useI18n().dict.legal`.
 *
 * These remain working documents to be reviewed with qualified counsel
 * before a public commercial launch.
 */
export const legalDocOrder = ["terms", "privacy", "refunds"] as const;
