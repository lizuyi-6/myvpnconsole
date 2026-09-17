import type { Product, ProductPlan } from "@/types";

const STANDARD_PLANS: ProductPlan[] = [
  { id: "30d", label: "30 Days", days: 30, priceFactor: 1 },
  { id: "90d", label: "90 Days", days: 90, priceFactor: 2.85 },
  { id: "365d", label: "Annual", days: 365, priceFactor: 10.5 },
];

const SINGLE_PLAN: ProductPlan[] = [
  { id: "30d", label: "30 Days", days: 30, priceFactor: 1 },
];

export const mockProducts: Product[] = [
  {
    id: "p_gemini_pro",
    slug: "gemini-pro",
    name: "Gemini Pro",
    category: "ai",
    tagline: "Google's advanced AI model with a 1M token context window.",
    description:
      "A full Gemini Pro subscription on an individual account. Suitable for research, writing, coding assistance and everyday AI work. Delivered as ready-to-use credentials with replacement support during the subscription period.",
    icon: "sparkles",
    accent: { from: "#5E6AD2", to: "#8B5CF6" },
    basePrice: 19.9,
    plans: STANDARD_PLANS,
    tiers: [
      { min: 1, max: 4, price: 19.9 },
      { min: 5, max: 19, price: 17.9 },
      { min: 20, max: 49, price: 15.9 },
      { min: 50, max: null, price: 13.9 },
    ],
    stock: { status: "in_stock", quantity: 142 },
    popular: true,
    features: [
      "Individual account access",
      "30-day subscription, renewable",
      "Account dashboard access",
      "Replacement support during the term",
    ],
    notes: [
      "Credentials are delivered to your account library after payment.",
      "One account per purchase — do not share credentials publicly.",
      "Region restrictions may apply depending on the service provider.",
    ],
    faq: [
      {
        question: "When do I receive my account?",
        answer:
          "Delivery is automated. Credentials appear in your dashboard library within a few minutes of payment confirmation.",
      },
      {
        question: "What happens if the account stops working?",
        answer:
          "Open a replacement ticket from the support page. Valid claims during the subscription period are replaced free of charge.",
      },
      {
        question: "Can I renew before expiry?",
        answer:
          "Yes. Renewing extends the existing expiry date, so no time is lost.",
      },
    ],
  },
  {
    id: "p_claude_pro",
    slug: "claude-pro",
    name: "Claude Pro",
    category: "ai",
    tagline: "Anthropic's flagship assistant for deep analysis and coding.",
    description:
      "Claude Pro on an individual account with priority access and higher usage limits. Well suited for long-document analysis, refactoring and agentic coding workflows.",
    icon: "bot",
    accent: { from: "#D97757", to: "#B4443C" },
    basePrice: 22.9,
    plans: STANDARD_PLANS,
    tiers: [
      { min: 1, max: 4, price: 22.9 },
      { min: 5, max: 19, price: 20.9 },
      { min: 20, max: 49, price: 18.9 },
      { min: 50, max: null, price: 16.9 },
    ],
    stock: { status: "low_stock", quantity: 8 },
    popular: true,
    features: [
      "Individual account access",
      "Higher usage limits than free tier",
      "30-day subscription, renewable",
      "Replacement support during the term",
    ],
    notes: [
      "Credentials are delivered to your account library after payment.",
      "Usage limits are enforced by the service provider.",
      "Avoid automating the account against provider terms.",
    ],
    faq: [
      {
        question: "Is this a shared account?",
        answer:
          "No. Each purchase is an individual account used only by you.",
      },
      {
        question: "Can I change the account email?",
        answer:
          "Account credentials are fixed at delivery. Contact support for exceptional cases.",
      },
    ],
  },
  {
    id: "p_ai_starter",
    slug: "ai-starter-bundle",
    name: "AI Starter Bundle",
    category: "bundle",
    tagline: "A curated entry pack of AI services for new users.",
    description:
      "A starter combination covering a general AI assistant, an image generation credit pack and a productivity toolkit. One purchase, three services, delivered together.",
    icon: "layers",
    accent: { from: "#4C9AFF", to: "#5E6AD2" },
    basePrice: 29.9,
    plans: SINGLE_PLAN,
    tiers: [
      { min: 1, max: 4, price: 29.9 },
      { min: 5, max: 19, price: 27.9 },
      { min: 20, max: 49, price: 24.9 },
      { min: 50, max: null, price: 21.9 },
    ],
    stock: { status: "in_stock", quantity: 96 },
    popular: true,
    features: [
      "Three AI services in one purchase",
      "30-day access to all included services",
      "Single delivery in your account library",
      "Replacement support during the term",
    ],
    notes: [
      "All included services share the same 30-day term.",
      "Bundle contents are fixed and cannot be swapped.",
    ],
    faq: [
      {
        question: "What exactly is included?",
        answer:
          "A general AI assistant subscription, an image generation credit pack, and a productivity toolkit. All delivered as one entry in your library.",
      },
    ],
  },
  {
    id: "p_dev_ai_pack",
    slug: "developer-ai-pack",
    name: "Developer AI Pack",
    category: "bundle",
    tagline: "Coding-focused AI tooling for builders and teams.",
    description:
      "A bundle oriented at developers: an AI pair-programming seat, API credit for model access, and a code review assistant. Built for shipping faster.",
    icon: "code",
    accent: { from: "#3ECF8E", to: "#0EA5E9" },
    basePrice: 49.9,
    plans: SINGLE_PLAN,
    tiers: [
      { min: 1, max: 4, price: 49.9 },
      { min: 5, max: 19, price: 44.9 },
      { min: 20, max: 49, price: 39.9 },
      { min: 50, max: null, price: 34.9 },
    ],
    stock: { status: "out_of_stock", quantity: 0 },
    features: [
      "AI pair-programming seat",
      "Model API credit",
      "Code review assistant access",
      "Replacement support during the term",
    ],
    notes: [
      "Currently out of stock. Availability is restored in batches.",
    ],
    faq: [
      {
        question: "When will it be back in stock?",
        answer:
          "Restocks happen in batches. Check back soon or contact support for large volume reservations.",
      },
    ],
  },
  {
    id: "p_global_network",
    slug: "global-network",
    name: "Global Network",
    category: "network",
    tagline: "Fast, stable network access across 20+ regions.",
    description:
      "Reliable network subscription with access to 20+ regions, suitable for everyday browsing, remote work and streaming. Manage devices and your subscription link from the dashboard.",
    icon: "globe",
    accent: { from: "#38BDF8", to: "#5E6AD2" },
    basePrice: 6.9,
    plans: STANDARD_PLANS,
    tiers: [
      { min: 1, max: 4, price: 6.9 },
      { min: 5, max: 19, price: 6.4 },
      { min: 20, max: 49, price: 5.9 },
      { min: 50, max: null, price: 5.4 },
    ],
    stock: { status: "in_stock", quantity: 500 },
    popular: true,
    features: [
      "Access to 20+ regions",
      "Up to 3 devices",
      "Subscription link managed in dashboard",
      "Link regeneration available anytime",
    ],
    notes: [
      "Subscription links are personal. Regenerate immediately if leaked.",
      "Fair-use policy applies to extreme traffic volumes.",
    ],
    faq: [
      {
        question: "Which clients are supported?",
        answer:
          "Any client that accepts a standard subscription URL — major desktop and mobile clients are covered.",
      },
      {
        question: "How many devices can I use?",
        answer:
          "The standard plan supports up to 3 devices simultaneously.",
      },
    ],
  },
  {
    id: "p_global_network_plus",
    slug: "global-network-plus",
    name: "Global Network Plus",
    category: "network",
    tagline: "Higher limits, priority routes, more devices.",
    description:
      "The upgraded network tier: priority routing in congested hours, 5 devices and access to premium regions. For users who depend on a stable connection daily.",
    icon: "globe-2",
    accent: { from: "#8B5CF6", to: "#EC4899" },
    basePrice: 12.9,
    plans: STANDARD_PLANS,
    tiers: [
      { min: 1, max: 4, price: 12.9 },
      { min: 5, max: 19, price: 11.9 },
      { min: 20, max: 49, price: 10.9 },
      { min: 50, max: null, price: 9.9 },
    ],
    stock: { status: "low_stock", quantity: 12 },
    features: [
      "Priority routing at peak hours",
      "Up to 5 devices",
      "Premium region access",
      "Link regeneration available anytime",
    ],
    notes: [
      "Subscription links are personal. Regenerate immediately if leaked.",
      "Fair-use policy applies to extreme traffic volumes.",
    ],
    faq: [
      {
        question: "What does priority routing mean?",
        answer:
          "Your traffic is scheduled ahead of standard plans on congested routes, keeping latency stable at peak hours.",
      },
    ],
  },
];

export function findProductBySlug(slug: string): Product | undefined {
  return mockProducts.find((p) => p.slug === slug);
}
