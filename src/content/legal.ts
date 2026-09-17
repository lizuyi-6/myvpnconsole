import { brand } from "@/config/brand";

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

const EFFECTIVE_DATE = "September 17, 2026";

/**
 * Legal documents shown at /legal/:doc.
 *
 * These are working documents for the service as it operates today
 * (manual renewal, no auto-billing, 5-device limit, subscription URL
 * model). Review with qualified counsel before a public commercial
 * launch.
 */
export const legalDocs: Record<string, LegalDoc> = {
  terms: {
    slug: "terms",
    title: "Terms of Service",
    summary: "The terms that govern your use of the NOVA network access service.",
    effectiveDate: EFFECTIVE_DATE,
    sections: [
      {
        heading: "1. The service",
        paragraphs: [
          `${brand.name} provides "Network Access": a time-based subscription that gives you a personal subscription URL. Importing this URL into a compatible client gives you access to the network regions listed on the Network page, on up to 5 of your personal devices at the same time.`,
          "The service is a connectivity tool. You are responsible for how you use it and for complying with the laws that apply to you.",
        ],
      },
      {
        heading: "2. Eligibility",
        paragraphs: [
          "You must be at least 18 years old, or the age of majority in your jurisdiction, to purchase a subscription. The registration information you provide must be accurate and kept up to date.",
        ],
      },
      {
        heading: "3. Regional availability — mainland China",
        paragraphs: [
          "The service is not offered, sold, or made available to residents of mainland China, and no part of the service is directed at mainland China.",
          "If you are located in, or are a resident of, mainland China, do not purchase, access, or use the service. Where we reasonably believe an account is registered or used in violation of this restriction, we may suspend or terminate it. In such cases, any unused paid time will be refunded to the original payment method.",
        ],
      },
      {
        heading: "4. Your account and subscription URL",
        paragraphs: [
          "Your subscription URL is personal to your account — treat it like a password. Do not publish or share it. If it leaks, regenerate it immediately from Console → Subscription; the old URL stops working at once.",
          "You may not resell, rent, or share access to your account or subscription URL.",
        ],
      },
      {
        heading: "5. Payments and renewal",
        paragraphs: [
          "Prices are shown at checkout and charged once per purchase. We do not store full card numbers; only the payment method and the last four digits are kept for your records.",
          "There are no automatic recurring charges. Access ends when your paid period expires. Renewing before expiry extends your current end date, so no paid time is lost, and your subscription URL stays the same across renewals.",
        ],
      },
      {
        heading: "6. Acceptable use",
        list: [
          "Use the service lawfully. You may not use it for fraud, spam, attacks on networks or services, or to distribute unlawful content.",
          "Traffic is unmetered under a fair-use policy: the service is for normal personal use, not for reselling bandwidth or running commercial relay services.",
          "The device limit (5 concurrent devices) is enforced automatically. Manage your devices in the console.",
        ],
      },
      {
        heading: "7. Availability",
        paragraphs: [
          "Region availability and latency are published on the Network page. We work to keep the service reliable, but we do not guarantee uninterrupted availability, and individual regions may be degraded or withdrawn at any time.",
        ],
      },
      {
        heading: "8. Termination",
        paragraphs: [
          "You can stop using the service at any time; access simply ends at expiry. We may suspend or terminate accounts that violate these terms, with a refund of unused paid time unless the termination results from unlawful use or abuse.",
        ],
      },
      {
        heading: "9. Disclaimers and limitation of liability",
        paragraphs: [
          'The service is provided "as is" and "as available", without warranties of any kind, express or implied.',
          `To the maximum extent permitted by law, ${brand.name}'s total liability for any claim relating to the service is limited to the amounts you paid for the service in the 12 months before the claim.`,
        ],
      },
      {
        heading: "10. Changes to these terms",
        paragraphs: [
          "If we change these terms, we will post the new version here and update the effective date. Continuing to use the service after a change means you accept the new terms.",
        ],
      },
      {
        heading: "11. Contact",
        paragraphs: [
          `Questions about these terms: ${brand.supportEmail}.`,
        ],
      },
    ],
  },

  privacy: {
    slug: "privacy",
    title: "Privacy Policy",
    summary: "What data the service collects, why, and what you can do about it.",
    effectiveDate: EFFECTIVE_DATE,
    sections: [
      {
        heading: "1. What we collect",
        list: [
          "Account data — your name and email address, used to sign you in and reach you about your subscription.",
          "Billing metadata — payment number, amount, method and, for card payments, the last four digits. We never see or store full card numbers.",
          "Subscription and device data — your subscription URL token, its expiry, and the names and platforms you assign to your devices.",
          "Support conversations — tickets you open, including any payment number you reference.",
          "Minimal operational data — what is technically required to enforce the device limit and keep regions reachable.",
        ],
      },
      {
        heading: "2. What we do not do",
        list: [
          "We do not sell your personal data.",
          "We do not inspect or log the content of your traffic.",
          "We do not use advertising trackers on the console.",
        ],
      },
      {
        heading: "3. How we use data",
        paragraphs: [
          "We use the data above to operate the service (authentication, subscription status, device limits), to process payments and refunds, to answer support requests, and to send service notices such as expiry reminders — which you can turn off in Console → Settings.",
        ],
      },
      {
        heading: "4. Retention",
        paragraphs: [
          "Account and billing records are kept while your account exists and for as long afterwards as accounting rules require. Support tickets are kept for 24 months. You can ask us to delete your account at any time.",
        ],
      },
      {
        heading: "5. Who we share it with",
        paragraphs: [
          "Only the processors needed to run the service: our payment processor (to charge you) and our email provider (to reach you). We may also disclose data if required by law.",
        ],
      },
      {
        heading: "6. Security",
        paragraphs: [
          "Credentials and subscription URLs are masked by default and revealed only when you ask. If your subscription URL leaks, regenerating it in the console invalidates the old URL immediately.",
        ],
      },
      {
        heading: "7. Regional restriction",
        paragraphs: [
          "The service is not directed at mainland China, and we do not knowingly collect personal data from residents of mainland China. See the Terms of Service for details.",
        ],
      },
      {
        heading: "8. Your rights",
        paragraphs: [
          `You can request a copy of your data, correct it, or delete your account by writing to ${brand.supportEmail} from your account email.`,
        ],
      },
      {
        heading: "9. Changes",
        paragraphs: [
          "Changes to this policy are posted here with an updated effective date.",
        ],
      },
    ],
  },

  refunds: {
    slug: "refunds",
    title: "Refund Policy",
    summary: "When and how payments can be refunded.",
    effectiveDate: EFFECTIVE_DATE,
    sections: [
      {
        heading: "1. First purchase",
        paragraphs: [
          "If the service doesn't work for you, your first purchase can be fully refunded within 7 days of payment — no questions asked.",
        ],
      },
      {
        heading: "2. Renewals",
        paragraphs: [
          "A renewal payment can be refunded within 3 days of payment, as long as the renewed period hasn't materially been used. Renewing extends your existing end date, so a refunded renewal simply removes the added time.",
        ],
      },
      {
        heading: "3. When refunds don't apply",
        list: [
          "Accounts suspended or terminated for violating the Terms of Service (unlawful use, abuse, or reselling access).",
          "Requests outside the windows above, where the service was available and working.",
        ],
      },
      {
        heading: "4. Regional restriction",
        paragraphs: [
          "The service is not offered to residents of mainland China. Purchases made in violation of this restriction are refunded in full and the account is closed. See the Terms of Service, section 3.",
        ],
      },
      {
        heading: "5. How to request a refund",
        paragraphs: [
          `Open a ticket from Console → Support and reference the payment number (e.g. NOVA-260902-1031) from your billing history, or write to ${brand.supportEmail}. Approved refunds go back to the original payment method within 5–10 business days.`,
        ],
      },
    ],
  },
};

export const legalDocOrder = ["terms", "privacy", "refunds"] as const;
