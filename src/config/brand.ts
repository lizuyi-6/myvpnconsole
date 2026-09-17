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
  /** Site <title> suffix */
  siteTitle: "NOVA — Digital Services",
  /** One-line description used for meta tags */
  description:
    "One place to purchase, manage and renew your digital services.",
  /** Homepage hero */
  hero: {
    title: "Digital services,\nwithout the friction.",
    subtitle:
      "One place to purchase, manage and renew your digital services.",
  },
  /** Theme colors (hex). Primary is injected as a CSS variable at runtime. */
  colors: {
    primary: "#5E6AD2",
    primaryForeground: "#FFFFFF",
  },
  /** Support destination shown in help pages */
  supportEmail: "support@nova.example",
} as const;

export type Brand = typeof brand;
