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
  /** Theme colors (hex). Primary is injected as a CSS variable at runtime. */
  colors: {
    primary: "#2867E8",
    primaryForeground: "#FFFFFF",
  },
  /** Support destination shown in help pages */
  supportEmail: "support@nova.example",
} as const;

export type Brand = typeof brand;
