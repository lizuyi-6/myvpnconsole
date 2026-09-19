import type { LegalDoc } from "@/content/legal";

const EFFECTIVE_DATE = "September 17, 2026";

/**
 * English dictionary — the reference shape. Every other locale must
 * implement `Dictionary`, so missing or extra keys are compile errors.
 *
 * `{name}` placeholders are interpolated by t() / interpolate().
 * Arrays of content (FAQs, legal sections) are consumed directly
 * through `dict`, not through t().
 */

const termsDoc: LegalDoc = {
  slug: "terms",
  title: "Terms of Service",
  summary: "The terms that govern your use of the NOVA network access service.",
  effectiveDate: EFFECTIVE_DATE,
  sections: [
    {
      heading: "1. The service",
      paragraphs: [
        'NOVA provides "Network Access": a time-based subscription that gives you a personal subscription URL. Importing this URL into a compatible client gives you access to the network regions listed on the Network page, on up to 5 of your personal devices at the same time.',
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
        "To the maximum extent permitted by law, NOVA's total liability for any claim relating to the service is limited to the amounts you paid for the service in the 12 months before the claim.",
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
      paragraphs: ["Questions about these terms: support@nova.example."],
    },
  ],
};

const privacyDoc: LegalDoc = {
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
        "You can request a copy of your data, correct it, or delete your account by writing to support@nova.example from your account email.",
      ],
    },
    {
      heading: "9. Changes",
      paragraphs: [
        "Changes to this policy are posted here with an updated effective date.",
      ],
    },
  ],
};

const refundsDoc: LegalDoc = {
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
        "Open a ticket from Console → Support and reference the payment number (e.g. NOVA-260902-1031) from your billing history, or write to support@nova.example. Approved refunds go back to the original payment method within 5–10 business days.",
      ],
    },
  ],
};

export const en = {
  common: {
    siteTitle: "NOVA — Network Access",
    serviceName: "Network Access",
    brandDescription:
      "Reliable network access. One subscription, multiple regions, simple setup across your devices.",
    retry: "Retry",
    cancel: "Cancel",
    days: "{count} days",
    daysRemaining: "{count} days remaining",
    upToDevices: "Up to {count} devices",
    planLabel: "{days} Days",
    platformLine: "Windows, macOS, iOS, Android, Linux",
    couldntLoadSubscription: "Couldn't load your subscription.",
    showUrl: "Show subscription URL",
    hideUrl: "Hide subscription URL",
    copyUrl: "Copy subscription URL",
    copied: "Copied to clipboard",
    skipToContent: "Skip to main content",
    closeDialog: "Close dialog",
    closeMenu: "Close menu",
    regionsOne: "{count} region",
    regionsMany: "{count} regions",
    statusOperational: "Operational",
    statusDegraded: "Degraded",
    statusActive: "Active",
    statusExpired: "Expired",
    allSystemsOperational: "All systems operational",
    someRegionsDegraded: "Some regions degraded",
    regionStatus: {
      available: "Available",
      degraded: "Degraded",
      offline: "Offline",
    },
    areas: {
      "North America": "North America",
      "Asia Pacific": "Asia Pacific",
      Europe: "Europe",
      Oceania: "Oceania",
    },
    regionNames: {
      "us-west": "United States — West",
      "us-east": "United States — East",
      jp: "Japan",
      sg: "Singapore",
      hk: "Hong Kong",
      kr: "South Korea",
      au: "Australia",
      de: "Germany",
      uk: "United Kingdom",
      nl: "Netherlands",
    },
    regionShort: {
      "us-west": "US West",
      jp: "Japan",
      sg: "Singapore",
      de: "Germany",
    },
    paymentMethod: {
      card: "Credit / Debit Card",
      crypto: "Crypto",
      balance: "Balance",
    },
    paymentStatus: {
      completed: "Completed",
      processing: "Processing",
      refunded: "Refunded",
    },
    ticketStatus: {
      open: "Open",
      answered: "Answered",
      closed: "Closed",
    },
    ticketCategory: {
      account: "Account",
      connection: "Connection",
      payment: "Payment",
      subscription: "Subscription",
      other: "Other",
    },
    errorTitle: "Something went wrong",
    errorMessage: "We couldn't load this section. Please try again.",
  },

  /** Per-page document titles — rendered as "{page} — NOVA". */
  meta: {
    titles: {
      network: "Network",
      plans: "Plans",
      setup: "Setup guide",
      help: "Help center",
      login: "Sign in",
      register: "Create account",
      checkout: "Checkout",
      activated: "Access activated",
      notFound: "Page not found",
    },
  },

  header: {
    homeAria: "NOVA home",
    openMenu: "Open menu",
    menuTitle: "Navigation menu",
    navPrimaryAria: "Primary",
    navMobileAria: "Mobile",
    language: "Language",
    nav: {
      network: "Network",
      plans: "Plans",
      setup: "Setup",
      help: "Help",
    },
    console: "Console",
    signIn: "Sign in",
    getAccess: "Get access",
  },

  footer: {
    groups: {
      service: "Service",
      resources: "Resources",
      account: "Account",
      legal: "Legal",
    },
    links: {
      network: "Network",
      plans: "Plans",
      setup: "Setup",
      helpCenter: "Help Center",
      gettingStarted: "Getting Started",
      contactSupport: "Contact support",
      signIn: "Sign in",
      console: "Console",
      privacy: "Privacy",
      terms: "Terms",
      refunds: "Refund Policy",
    },
    serviceStatus: "Service status:",
    copyright: "© {year} NOVA",
  },

  home: {
    hero: {
      eyebrow: "NOVA Network",
      titleLine1: "Global access.",
      titleLine2: "One simple subscription.",
      subtitle:
        "Connect your devices through a reliable global network with one subscription and a straightforward setup.",
      getAccess: "Get access",
      seeHow: "See how it works",
      factsRegions: "{count} regions",
      factsDevices: "Up to {count} devices",
      panelTitle: "NOVA Network",
      metricRegions: "Regions",
      metricDevices: "Devices",
      metricPlatforms: "Platforms",
      metricUpTo: "Up to {count}",
      diagram: {
        device: "Your device",
        anyPlatform: "Any platform",
        network: "NOVA network",
        oneSubscription: "One subscription",
        secureConnection: "Secure connection",
        ariaLabel:
          "Diagram: your device connects through the NOVA network to regions worldwide",
      },
    },
    serviceBar: {
      ariaLabel: "Service facts",
      networkStatus: "Network status",
      regions: "Regions",
      regionsAvailable: "{count} available",
      devices: "Devices",
      platforms: "Platforms",
      platformsSupported: "{count} supported",
      setup: "Setup",
      setupValue: "A few minutes",
    },
    trust: {
      title: "Built for everyday access",
      description:
        "The essentials of a network service, done properly — nothing more, nothing hidden.",
      facts: [
        {
          title: "Multiple regions",
          description: "One subscription works across every supported region.",
        },
        {
          title: "Multi-device",
          description:
            "Use the same service on up to {count} of your personal devices.",
        },
        {
          title: "Simple setup",
          description:
            "Copy your subscription URL, import it into a compatible client, connect.",
        },
        {
          title: "Human support",
          description: "Get help when setup or access doesn't work as expected.",
        },
      ],
    },
    network: {
      title: "A network that covers where you go",
      description:
        "Every plan includes access to all available regions. Switch anytime from your client — region status and latency are always public.",
      viewNetwork: "View network",
      panelTitle: "Network overview",
      viewAllRegions: "View all regions",
      footerAvailable: "regions available",
      footerCount: "{active} of {total}",
      fullStatus: "Full network status",
    },
    how: {
      title: "How NOVA works",
      description:
        "One subscription flows from your account to every device you connect.",
      openGuide: "Open the setup guide",
      flow: [
        { label: "Account", sub: "One sign-in" },
        { label: "Subscription URL", sub: "Personal link" },
        { label: "Client", sub: "Any supported client" },
      ],
      flowNetworkLabel: "NOVA Network",
      flowNetworkSub: "{count} regions available",
      flowNetworkSubFallback: "Available regions",
      steps: [
        {
          title: "Get access",
          description:
            "Choose your access period and activate your subscription in a minute.",
        },
        {
          title: "Add your subscription",
          description:
            "Copy the subscription URL from your console into a supported client.",
        },
        {
          title: "Connect",
          description: "Choose an available region and connect. That's it.",
        },
      ],
    },
    platforms: {
      title: "Works everywhere you do",
      description:
        "One subscription across desktop and mobile. Every platform has a step-by-step guide with a recommended client.",
      viewGuides: "View setup guides",
      panelTitle: "Device compatibility",
      supported: "Supported",
      filler: "Guides included for every platform.",
      notes: {
        windows: "10 and later",
        macos: "Apple silicon & Intel",
        ios: "iPhone and iPad",
        android: "Android 7+",
        linux: "AppImage & packages",
      },
    },
    plansPreview: {
      eyebrow: "Plans",
      title: "{service}. One service — choose your duration.",
      description:
        "Every duration includes the same service. No tiers, no feature gates — just time.",
      startingPrice: "Starting price",
      from: "From",
      perDays: "/ {days} days",
      regionsIncluded: "{count} regions included",
      regionsIncludedFallback: "All regions included",
      devicesAtOnce: "Up to {count} devices at once",
      viewPlans: "View plans",
      activationNote: "Subscription URL available immediately after activation.",
    },
    faq: {
      title: "Common questions",
      description: "Straight answers about access, devices and renewals.",
      morePre: "More in the ",
      moreLink: "Help Center",
      morePost: ".",
      items: [
        {
          question: "What exactly am I buying?",
          answer:
            "A time-based subscription to the NOVA network. You get a personal subscription URL that imports all regions into a compatible client on any supported platform.",
        },
        {
          question: "How many devices can I use?",
          answer:
            "Up to {count} devices at the same time. You can rename or remove devices anytime from the console.",
        },
        {
          question: "What happens when my subscription expires?",
          answer:
            "Access stops at expiry. Renewing before expiry extends your current end date, so no time is lost. Your subscription URL stays the same across renewals.",
        },
        {
          question: "Which clients are supported?",
          answer:
            "Any client that accepts a standard subscription URL. We publish a recommended client per platform — Windows, macOS, iOS, Android and Linux — in the setup guide.",
        },
      ],
    },
  },

  network: {
    title: "Network",
    description:
      "Region availability and current service status — always public, updated continuously.",
    loadError: "We couldn't load region information.",
    colRegion: "Region",
    colArea: "Area",
    colStatus: "Status",
    colLatency: "Latency",
    latencyNote:
      "Latency is indicative from our monitoring point and varies with your own connection.",
    statusPanel: "Network status",
    availableRegions: "Available regions",
    coverage: "Coverage",
    coverageValue: "{count} areas",
    areaPanel: "Area coverage",
    issuesPanel: "Having connection issues?",
    issueSetupPre: "Re-import your subscription or switch clients — see the ",
    issueSetupLink: "setup guide",
    issueSetupPost: ".",
    issueSupportPre: "Still stuck? ",
    issueSupportLink: "Contact support",
    issueSupportPost: " with the affected region.",
    browseHelp: "Browse the Help Center",
  },

  plans: {
    title: "{service}",
    description:
      "Everything you need to connect. Choose how long you want access.",
    loadError: "We couldn't load plans.",
    includedPanel: "What's included",
    included: [
      "All available regions",
      "Up to {count} devices",
      "No traffic cap — fair-use policy",
      "Subscription link management",
      "Support on every plan",
    ],
    regionPanel: "Region access",
    viewNetwork: "View network",
    regionStatus: "{active} of {total} regions available",
    regionAreasLine: "across North America, Asia Pacific, Europe and Oceania",
    regionBody:
      "Every duration includes all regions. Switch regions anytime from your client — status and latency are always public on the network page.",
    devicesPanel: "Devices and platforms",
    devicesAtOnce: "Up to {count} devices at once",
    devicesBody:
      "Add, rename or remove devices anytime from the console. Setup guides with a recommended client are published for every platform.",
    activationPanel: "How activation works",
    activation: [
      {
        title: "Activate",
        text: "Checkout completes and your subscription starts immediately.",
      },
      {
        title: "Copy your URL",
        text: "Your personal subscription URL appears in the console.",
      },
      {
        title: "Connect",
        text: "Import the URL into a compatible client and pick a region.",
      },
    ],
    renewalPanel: "Renewal behavior",
    renewalBody:
      "Renewing before expiry extends your current end date, so no paid time is lost. Your subscription URL stays the same across renewals — no need to update your clients.",
    questionsPre: "Questions? ",
    questionsLink: "Check the Help Center",
    questionsPost: ".",
    durationPanel: "Choose duration",
    durationAria: "Plan duration",
    monthlyEquivalent: "{price} / month equivalent",
    save: "Save {percent}%",
    total: "Total",
    continue: "Continue — {price}",
    trustImmediate: "Immediate activation — URL in your console right away",
    trustManage: "Manage devices and renewals from the console",
    trustSupport: "Human support on every plan",
    alreadyHavePre: "Already have access? ",
    alreadyHaveLink: "Manage your subscription",
    alreadyHavePost: ".",
  },

  setup: {
    title: "Set up your device",
    description:
      "Four steps, a few minutes. No account required to read this guide.",
    platformNavLabel: "Platforms",
    platformNavAria: "Platforms",
    subscriptionPanel: "Your subscription",
    signedOutBody:
      "Sign in to see your personal subscription URL here while you follow the guide.",
    signIn: "Sign in",
    devices: "Devices",
    network: "Network",
    helpPanel: "Need help?",
    helpBody:
      "Setup not working as described? Support can check your subscription and region status.",
    contactSupport: "Contact support",
    guide: {
      platformAria: "Platform",
      recommendedClient: "Recommended client — {client}",
      clientNotes: {
        windows: "Free, open-source client with system proxy support.",
        macos: "Lightweight menu-bar client for macOS.",
        ios: "Available on the App Store.",
        android: "Open-source client for Android 7+.",
        linux: "AppImage and package builds for major distros.",
      },
      step1Title: "Install {client}",
      step1Body:
        "Download {client} for {platform} from its official release page and install it like any other application.",
      step2Title: "Copy your subscription URL",
      step2SignInLink: "Sign in",
      step2SignInPost:
        " to view your subscription URL. You can finish the rest of the guide first.",
      step3Title: "Import the subscription",
      step3Body:
        "In {client}, find the profiles or subscriptions section, add a new profile from URL, and paste your subscription link. The region list downloads automatically.",
      step4Title: "Connect",
      step4Pre:
        "Pick a region and enable the connection. If a region feels slow, switch to another — check the ",
      step4Link: "network page",
      step4Post: " for current status.",
    },
  },

  help: {
    title: "Help Center",
    description: "Answers, guides and a direct line to support.",
    searchPlaceholder: "Search help — e.g. renew, device, subscription URL",
    searchAria: "Search help",
    categoriesLabel: "Categories",
    categoriesAria: "Help categories",
    categories: [
      {
        title: "Getting started",
        description: "Activate access and connect your first device.",
      },
      {
        title: "Subscription URL",
        description: "Import, reveal, copy or regenerate your personal link.",
      },
      {
        title: "Devices",
        description: "Manage the devices using your subscription.",
      },
      {
        title: "Billing & renewal",
        description: "Extend your access without losing remaining time.",
      },
      {
        title: "Connection issues",
        description: "Check region status and switch locations.",
      },
      {
        title: "Account",
        description: "Profile, notifications and sign-in.",
      },
    ],
    resultsFor: "Results for “{query}”",
    frequentlyAsked: "Frequently asked",
    noResultsPre: "No matching answers. Try different words, or ",
    noResultsLink: "contact support",
    noResultsPost: ".",
    faq: [
      {
        question: "How do I start using the service?",
        answer:
          "Pick a duration on the plans page, complete checkout, and your subscription activates immediately. Then follow the setup guide — install a client, paste your subscription URL, connect.",
      },
      {
        question: "Which clients are supported?",
        answer:
          "Any client that accepts a standard subscription URL. We publish a recommended client per platform — Windows, macOS, iOS, Android and Linux — in the setup guide.",
      },
      {
        question: "How many devices can I use?",
        answer:
          "Up to {count} devices at the same time. You can rename or remove devices anytime from the console.",
      },
      {
        question: "A region feels slow or unreachable. What should I do?",
        answer:
          "Check the network page for current region status and latency, then switch to another region in your client. If the problem persists, open a ticket with the affected region and time.",
      },
      {
        question: "What happens when my subscription expires?",
        answer:
          "Access stops at expiry. Renewing before expiry extends your current end date, so no time is lost. Your subscription URL stays the same across renewals.",
      },
      {
        question: "My subscription URL leaked. What now?",
        answer:
          "Go to Console → Subscription and regenerate the link. This invalidates the old URL immediately; update your clients with the new one.",
      },
    ],
    statusPanel: "Network status",
    viewNetwork: "View network",
    subscriptionPanel: "Your subscription",
    expiresAt: "Expires {date}",
    manageSubscription: "Manage subscription",
    contactPanel: "Contact support",
    contactBody:
      "Signed-in users can open a ticket in the console, or email us directly.",
    openTicket: "Open a ticket",
    setupGuide: "Setup guide",
  },

  legal: {
    navLabel: "Legal",
    navAria: "Legal documents",
    effective: "Effective {date}",
    back: "Back to Help Center",
    docs: {
      terms: termsDoc,
      privacy: privacyDoc,
      refunds: refundsDoc,
    },
  },

  checkout: {
    title: "Checkout",
    contact: "Contact",
    fullName: "Full name",
    email: "Email",
    paymentMethod: "Payment method",
    paymentMethodAria: "Payment method",
    cardNumber: "Card number",
    cardExpiry: "Expiry",
    cardCvc: "CVC",
    cryptoNote:
      "After you confirm, a payment address with the exact amount is shown. Access activates when the transaction is detected. (Mock — completes instantly.)",
    balanceNote:
      "The amount is deducted from your account balance. (Mock — completes instantly.)",
    activating: "Activating…",
    activate: "Activate access — {price}",
    mockNote: "Mock checkout — no real payment is processed.",
    summary: "Summary",
    activatesImmediately: "{label} · activates immediately",
    includedRegions: "All available regions",
    includedDevices: "Up to {count} devices",
    includedPlatforms: "All supported platforms",
    totalDue: "Total due today",
    afterActivation:
      "After activation, your subscription URL is available immediately in your console.",
    planUnavailableTitle: "This plan isn't available",
    planUnavailableBody:
      "The selected plan could not be found. Pick a duration on the plans page.",
    backToPlans: "Back to plans",
    errors: {
      nameMin: "Enter your full name",
      emailInvalid: "Enter a valid email address",
      cardNumber: "Enter a valid card number",
      cardExpiry: "Use MM/YY",
      cardCvc: "3–4 digits",
      submitFailed: "Payment failed. Please try again.",
    },
  },

  auth: {
    login: {
      title: "Sign in to your account",
      subtitle: "Welcome back. Enter your details to continue.",
      email: "Email",
      password: "Password",
      forgot: "Forgot password?",
      submit: "Sign in",
      submitting: "Signing in…",
      footerPre: "New here? ",
      footerLink: "Create an account",
      errors: {
        emailInvalid: "Enter a valid email address",
        passwordRequired: "Enter your password",
        invalidCredentials: "Invalid email or password.",
        network: "Network error. Please check your connection and try again.",
        generic: "Sign in failed. Please try again.",
      },
    },
    register: {
      title: "Create your account",
      subtitle: "Activate, manage and renew in one place.",
      name: "Full name",
      namePlaceholder: "Alex Chen",
      email: "Email",
      password: "Password",
      passwordPlaceholder: "8+ characters",
      confirm: "Confirm",
      confirmPlaceholder: "Repeat it",
      submit: "Create account",
      submitting: "Creating account…",
      footerPre: "Already have an account? ",
      footerLink: "Sign in",
      errors: {
        nameMin: "Enter your name",
        emailInvalid: "Enter a valid email address",
        passwordMin: "Use at least 8 characters",
        mismatch: "Passwords don't match",
        emailTaken: "An account with this email already exists. Sign in instead.",
        generic: "Could not create your account. Please try again.",
      },
    },
  },

  activated: {
    errorTitle: "Access activated",
    errorBody:
      "Your subscription is ready, but we couldn't load it here. Open your console to find your subscription URL.",
    title: "Access activated.",
    summary: "{name} · {plan} · {days} days remaining (expires {date})",
    urlPanel: "Your subscription URL",
    urlHint: "Paste this into your client to import all regions.",
    openSetup: "Open setup guide",
    goConsole: "Go to console",
  },

  notFound: {
    title: "This page doesn't exist",
    body: "The link may be broken or the page may have moved.",
    backHome: "Back to home",
    viewPlans: "View plans",
  },

  console: {
    navAria: "Console",
    openMenu: "Open console menu",
    menuTitle: "Console menu",
    helpAria: "Help Center",
    nav: {
      overview: "Overview",
      subscription: "Subscription",
      devices: "Devices",
      setup: "Setup",
      billing: "Billing",
      support: "Support",
      settings: "Settings",
    },
    signOut: "Sign out",
    renew: "Renew",
    noAccess: {
      title: "No active access",
      body: "You don't have a Network Access subscription yet. Pick a duration to activate your access — it starts the moment payment completes.",
      cta: "View plans",
    },
    overview: {
      title: "Overview",
      loadError: "We couldn't load your subscription.",
      currentTerm: "Current term",
      expires: "Expires",
      remaining: "Remaining",
      subscriptionPanel: "Subscription",
      manage: "Manage",
      urlHint: "Import this URL into a compatible client on any of your devices.",
      devicesPanel: "Devices",
      devicesUsed: "Devices currently using your subscription.",
      quickSetup: "Quick setup",
      fullGuide: "Full guide",
      networkHealth: "Network health",
      viewNetwork: "View network",
      regionsAvailable: "regions available",
      regionsCount: "{active} of {total}",
      recentPayments: "Recent payments",
      billing: "Billing",
      noPayments: "No payments yet.",
      billingSummary: "Billing summary",
      details: "Details",
      renewAccess: "Renew access",
    },
    subscription: {
      title: "Subscription",
      loadError: "We couldn't load your subscription.",
      expires: "Expires",
      remaining: "Remaining",
      renewalTerm: "Renewal term",
      deviceLimit: "Device limit",
      urlPanel: "Subscription URL",
      regeneratedNote:
        "New link generated. Update any client using the previous URL.",
      urlBody:
        "This URL is personal to your account. It stays the same across renewals; regenerate it from the security panel if it leaks.",
      regionsPanel: "Regions",
      fullStatus: "Full status",
      couldntLoadRegions: "Couldn't load regions.",
      colRegion: "Region",
      colArea: "Area",
      colLatency: "Latency",
      colStatus: "Status",
      securityPanel: "Security",
      securityBody:
        "Regenerating your URL invalidates the old link immediately. Clients using it lose access until you import the new one.",
      regenerate: "Regenerate subscription URL",
      quickSetup: "Quick setup",
      quickSetupBody:
        "Connect a new device with your subscription URL — guides for every platform.",
      openGuide: "Open setup guide",
      statusPanel: "Network status",
      viewNetwork: "View network",
      dialog: {
        title: "Regenerate subscription URL?",
        body: "Existing subscription configurations will stop updating after regeneration. Clients using the old URL lose access until you import the new one.",
        confirm: "Regenerate",
        confirming: "Regenerating…",
      },
    },
    devices: {
      title: "Devices",
      description:
        "Devices using your subscription. Rename for clarity, remove what you no longer use.",
      usedCount: "{used} / {limit} used",
      setupDevice: "Set up a device",
      loadError: "We couldn't load your devices.",
      emptyTitle: "No devices connected",
      emptyBody: "Set up a device to see it here.",
      openSetup: "Open setup",
      colDevice: "Device",
      colPlatform: "Platform",
      colLastActive: "Last active",
      colActions: "Actions",
      renameAria: "Rename {name}",
      removeAria: "Remove {name}",
      renamedToast: "Renamed to “{name}”",
      removedToast: "{name} removed from your devices",
      lastActive: {
        justNow: "Just now",
        minAgo: "{count} min ago",
        hoursAgo: "{count} h ago",
        yesterday: "Yesterday",
        daysAgo: "{count} days ago",
      },
      renameDialog: {
        title: "Rename device",
        body: "Give this device a name you'll recognize.",
        nameLabel: "Name",
        save: "Save",
        saving: "Saving…",
      },
      removeDialog: {
        title: "Remove {name}?",
        body: "This device will lose access. You can set it up again anytime — this only affects this device.",
        confirm: "Remove device",
        removing: "Removing…",
      },
    },
    billing: {
      title: "Billing",
      description: "Your current access term and payment history.",
      historyPanel: "Payment history",
      loadError: "We couldn't load payment history.",
      noPayments: "No payments yet.",
      colDate: "Date",
      colDescription: "Description",
      colMethod: "Method",
      colAmount: "Amount",
      colStatus: "Status",
      accessPanel: "Current access",
      couldntLoadPlan: "Couldn't load your plan.",
      expires: "Expires",
      remaining: "Remaining",
      renewAccess: "Renew access",
      renewNote:
        "Renewing before expiry extends your current end date — no paid time is lost.",
      refundPanel: "Refund policy",
      refundBody:
        "First purchases can be refunded within 7 days; renewals within 3 days.",
      refundLink: "Read the refund policy",
    },
    support: {
      title: "Support",
      description: "Track existing tickets or open a new one.",
      createTicket: "Create ticket",
      createdToast: "Ticket submitted — we'll reply by email.",
      ticketsPanel: "Your tickets",
      loadError: "We couldn't load your tickets.",
      emptyTitle: "No tickets",
      emptyBody: "You haven't opened any support tickets yet.",
      updatedAt: "Updated {date}",
      paymentRef: "Payment {number}",
      beforePanel: "Before opening a ticket",
      checkStatus: "Check network status",
      regionStatus: "Region status",
      rerunSetup: "Re-run the setup guide",
      rerunBody: "Re-import your subscription URL — it fixes most client issues.",
      openSetup: "Open setup",
      browseAnswers: "Browse common answers",
      browseBody:
        "Renewal, device limits and subscription URLs are covered in the Help Center.",
      helpCenter: "Help Center",
      ticketTip:
        "Opening a ticket anyway? Include the affected region and the approximate time — it speeds things up.",
      dialog: {
        title: "Create a ticket",
        body: "Describe the issue and we'll get back to you. Your draft stays put if submission fails.",
        subject: "Subject",
        subjectPlaceholder: "e.g. Slow speeds on Japan in the evening",
        category: "Category",
        relatedPayment: "Related payment",
        noPayment: "None",
        message: "Message",
        messagePlaceholder: "What happened, and what did you expect?",
        submit: "Submit ticket",
        submitting: "Submitting…",
        errors: {
          subjectMin: "Give your ticket a short subject",
          messageMin: "Describe the issue in at least 20 characters",
        },
      },
    },
    settings: {
      title: "Settings",
      description: "Your profile and notification preferences.",
      profilePanel: "Profile",
      fullName: "Full name",
      email: "Email",
      emailNote: "Email changes are handled by support for account security.",
      saveChanges: "Save changes",
      saved: "Saved.",
      notificationsPanel: "Notifications",
      expiryReminders: "Expiry reminders",
      expiryRemindersBody: "Email 3 days before your subscription expires.",
      expiryAria: "Toggle expiry reminder emails",
      statusAlerts: "Network status alerts",
      statusAlertsBody: "Email when a region you use is degraded or restored.",
      statusAria: "Toggle network status alerts",
      accountPanel: "Account",
    },
    setup: {
      title: "Setup",
      description: "Get a new device connected in a few minutes.",
      subscriptionPanel: "Your subscription",
      manage: "Manage",
      devices: "Devices",
      network: "Network",
    },
  },
};

export type Dictionary = typeof en;
