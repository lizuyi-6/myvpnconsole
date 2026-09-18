import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { en, type Dictionary } from "./en";
import { zh } from "./zh";

export type { Dictionary } from "./en";
export type Language = "en" | "zh";

const STORAGE_KEY = "nova.lang";
const DICTIONARIES: Record<Language, Dictionary> = { en, zh };

/* ---------------- Typed key paths ---------------- */

/** Dot-separated paths to string leaves, e.g. "common.retry". */
type StringPaths<T> = {
  [K in keyof T & string]: T[K] extends string
    ? K
    : T[K] extends readonly unknown[]
      ? never
      : T[K] extends object
        ? `${K}.${StringPaths<T[K]>}`
        : never;
}[keyof T & string];

export type TranslationKey = StringPaths<Dictionary>;

export type InterpolationVars = Record<string, string | number>;

/** Replace `{name}` placeholders in a template. */
export function interpolate(
  template: string,
  vars?: InterpolationVars,
): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

function resolvePath(dict: Dictionary, path: string): string {
  const value = path
    .split(".")
    .reduce<unknown>(
      (acc, key) => (acc as Record<string, unknown> | undefined)?.[key],
      dict,
    );
  return typeof value === "string" ? value : path;
}

/* ---------------- Server-data display helpers ----------------
 * Mock services return English strings ("90 Days", "Network Access —
 * 90 Days") as a real backend would. These helpers localize them for
 * display without touching the stored data.
 */

/** "90 Days" → localized plan label. Passes through unrecognized values. */
export function displayPlanLabel(label: string, dict: Dictionary): string {
  const match = /^(\d+)\s+Days$/i.exec(label.trim());
  if (!match) return label;
  return interpolate(dict.common.planLabel, { days: Number(match[1]) });
}

/** "Network Access — 90 Days" → localized payment description. */
export function displayPaymentDescription(
  description: string,
  dict: Dictionary,
): string {
  const match = /^(.+?)\s+—\s+(\d+)\s+Days$/i.exec(description.trim());
  if (!match) return description;
  return `${dict.common.serviceName} — ${interpolate(dict.common.planLabel, { days: Number(match[2]) })}`;
}

/* ---------------- Locale detection & persistence ---------------- */

function initialLanguage(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "zh") return stored;
  } catch {
    // storage unavailable — fall through to detection
  }
  return navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
}

/* ---------------- Context ---------------- */

interface I18nContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  /** Translate a dotted key, interpolating `{var}` placeholders. */
  t: (key: TranslationKey, vars?: InterpolationVars) => string;
  /** Direct dictionary access for structured content (FAQs, legal docs…). */
  dict: Dictionary;
  /** Locale-aware date, e.g. "Sep 17, 2026" / "2026年9月17日". */
  formatDate: (iso: string) => string;
  /** Locale-aware USD price. */
  formatCurrency: (value: number) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(initialLanguage);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // storage unavailable — language just won't persist
    }
  }, []);

  useEffect(() => {
    // html lang only — document.title is owned by PageTitleManager (App.tsx)
    // so each route gets its own localized title.
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [lang]);

  const value = useMemo<I18nContextValue>(() => {
    const dict = DICTIONARIES[lang];
    const dateFormatter = new Intl.DateTimeFormat(
      lang === "zh" ? "zh-CN" : "en-US",
      { month: "short", day: "numeric", year: "numeric" },
    );
    const currencyFormatter = new Intl.NumberFormat(
      lang === "zh" ? "zh-CN" : "en-US",
      { style: "currency", currency: "USD" },
    );
    return {
      lang,
      setLang,
      dict,
      t: (key, vars) => interpolate(resolvePath(dict, key), vars),
      formatDate: (iso) => dateFormatter.format(new Date(iso)),
      formatCurrency: (amount) => currencyFormatter.format(amount),
    };
  }, [lang, setLang]);

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}
