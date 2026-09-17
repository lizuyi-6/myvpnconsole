/**
 * Central brand configuration.
 *
 * Change the values here to rebrand the entire application.
 * The primary color is injected into CSS variables at runtime
 * (see main.tsx), so Tailwind's `primary` color follows it.
 */

export const brand = {
  /** Brand display name */
  name: "NOVA",
  /** Site <title> */
  siteTitle: "NOVA — Network Access",
  /** One-line description used for meta tags and footer */
  description:
    "Reliable network access. One subscription, multiple regions, simple setup across your devices.",
  /** Homepage hero */
  hero: {
    eyebrow: "NOVA Network",
    title: "Reliable network access,\nready when you need it.",
    subtitle:
      "One subscription. Multiple regions. Simple setup across your devices.",
  },
  /** Theme colors (hex). Primary is injected as a CSS variable at runtime. */
  colors: {
    primary: "#4C82F7",
    primaryForeground: "#FFFFFF",
  },
  /** Support destination shown in help pages */
  supportEmail: "support@nova.example",
} as const;

export type Brand = typeof brand;
