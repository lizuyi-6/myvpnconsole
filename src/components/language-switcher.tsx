import { Check, Globe } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMenuA11y } from "@/hooks/use-menu-a11y";
import { useI18n, type Language } from "@/i18n";
import { cn } from "@/lib/utils";

const LANGUAGES: { id: Language; label: string; short: string }[] = [
  { id: "en", label: "English", short: "EN" },
  { id: "zh", label: "简体中文", short: "中文" },
];

/**
 * Compact language switcher — globe button with a small dropdown.
 * Used in the site header and the console topbar.
 * Full keyboard support: arrows move, Escape returns focus to the trigger.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  useMenuA11y({ open, onClose: close, containerRef: menuRef, triggerRef });

  const current = LANGUAGES.find((l) => l.id === lang) ?? LANGUAGES[0];

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("header.language")}
        className="flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-medium text-muted transition-colors duration-150 hover:bg-foreground/[0.05] hover:text-foreground focus-ring"
      >
        <Globe className="size-4" />
        {current.short}
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-label={t("header.language")}
          className="absolute right-0 top-full z-50 mt-1.5 w-36 animate-content-in rounded-lg border border-border bg-surface p-1.5 shadow-panel"
        >
          {LANGUAGES.map((language) => {
            const active = language.id === lang;
            return (
              <button
                key={language.id}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  setLang(language.id);
                  setOpen(false);
                  triggerRef.current?.focus();
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition-colors duration-150 focus-ring",
                  active
                    ? "font-medium text-primary"
                    : "text-muted hover:bg-foreground/[0.04] hover:text-foreground",
                )}
              >
                {language.label}
                {active && <Check className="size-3.5" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
