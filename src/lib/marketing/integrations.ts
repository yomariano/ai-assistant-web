export type IntegrationFaqItem = {
  question: string;
  answer: string;
};

export type Integration = {
  slug: string;
  name: string;
  category: "calendar" | "booking";
  shortDescription: string;
  whatItUnlocks: string[];
  setupSteps: string[];
  recommendedFor: string[];
  faq: IntegrationFaqItem[];
};

export const INTEGRATIONS: Integration[] = [
  {
    slug: "google-calendar",
    name: "Google Calendar",
    category: "calendar",
    shortDescription: "Let your AI receptionist check availability and book directly into Google Calendar.",
    whatItUnlocks: [
      "Check availability before confirming an appointment",
      "Create events with caller details and notes",
      "Reduce double-bookings and missed callbacks",
    ],
    setupSteps: [
      "Connect Google Calendar in your VoiceFleet dashboard",
      "Choose which calendar(s) to use for bookings",
      "Set your booking rules (duration, buffers, working hours)",
      "Go live and start routing calls to your AI receptionist",
    ],
    recommendedFor: ["dentists", "clinics", "salons", "gyms"],
    faq: [
      {
        question: "Can VoiceFleet book appointments in my Google Calendar?",
        answer:
          "Yes. Once connected, your AI receptionist can check availability and create calendar events based on your booking rules.",
      },
      {
        question: "Will it prevent double-bookings?",
        answer:
          "VoiceFleet checks availability before confirming. You can also add buffers and working hours to reduce scheduling conflicts.",
      },
      {
        question: "Can I choose which calendar to book into?",
        answer:
          "Yes. You can select the calendar(s) used for availability and booking inside your VoiceFleet dashboard.",
      },
    ],
  },
  {
    slug: "microsoft-365",
    name: "Microsoft 365 (Outlook)",
    category: "calendar",
    shortDescription: "Sync bookings to Outlook so callers can schedule while your team stays focused.",
    whatItUnlocks: [
      "Book appointments into Outlook calendars",
      "Standardize intake details captured on calls",
      "Keep your existing workflow (no new tools for staff)",
    ],
    setupSteps: [
      "Connect Microsoft 365 in your VoiceFleet dashboard",
      "Select the mailbox/calendar for bookings",
      "Configure booking durations and business hours",
      "Turn on call summaries to keep your team informed",
    ],
    recommendedFor: ["dentists", "accountants", "law-firms", "clinics"],
    faq: [
      {
        question: "Does VoiceFleet work with Outlook calendars?",
        answer:
          "Yes. Connect Microsoft 365 to let VoiceFleet read availability and create bookings in Outlook calendars.",
      },
      {
        question: "Do we need to change our current booking process?",
        answer:
          "No. The goal is to keep your workflow the same while VoiceFleet handles the phone intake and scheduling step.",
      },
    ],
  },
  {
    slug: "calendly",
    name: "Calendly",
    category: "booking",
    shortDescription: "Turn phone calls into confirmed Calendly bookings with fewer back-and-forths.",
    whatItUnlocks: [
      "Route callers to the right meeting type",
      "Collect required details before booking",
      "Send confirmations and summaries after the call",
    ],
    setupSteps: [
      "Connect Calendly in your VoiceFleet dashboard",
      "Pick the event type(s) callers can book",
      "Define what information the AI must collect",
      "Test with a demo call, then forward your number",
    ],
    recommendedFor: ["consultants", "clinics", "salons", "plumbers"],
    faq: [
      {
        question: "Can the AI book my Calendly links for callers?",
        answer:
          "Yes. After you connect Calendly and choose event types, VoiceFleet can schedule based on your availability rules.",
      },
      {
        question: "Can I require specific information before booking?",
        answer:
          "Yes. You can configure required fields (name, phone number, reason, address, etc.) per workflow.",
      },
    ],
  },
  {
    slug: "cal-com",
    name: "Cal.com",
    category: "booking",
    shortDescription: "Book calls into Cal.com while keeping your scheduling infrastructure flexible.",
    whatItUnlocks: [
      "Support self-hosted or managed scheduling",
      "Standardize appointment intake from phone calls",
      "Reduce no-shows with confirmations and reminders",
    ],
    setupSteps: [
      "Connect Cal.com in your VoiceFleet dashboard",
      "Select booking types and availability rules",
      "Configure confirmations (SMS/email) and summaries",
      "Run a test call and go live",
    ],
    recommendedFor: ["gyms", "clinics", "service-businesses"],
    faq: [
      {
        question: "Does VoiceFleet support Cal.com?",
        answer:
          "Yes. Connect Cal.com to let VoiceFleet schedule appointments from calls based on your configured rules.",
      },
    ],
  },
  {
    slug: "square-appointments",
    name: "Square Appointments",
    category: "booking",
    shortDescription: "Convert calls into booked services inside Square Appointments.",
    whatItUnlocks: [
      "Book services without manual receptionist work",
      "Capture customer details consistently",
      "Fit naturally into Square-based workflows",
    ],
    setupSteps: [
      "Connect Square in your VoiceFleet dashboard",
      "Choose services/staff availability for booking",
      "Set booking rules (buffers, hours, lead time)",
      "Forward your number and monitor bookings",
    ],
    recommendedFor: ["salons", "spas", "studios", "clinics"],
    faq: [
      {
        question: "Can VoiceFleet create bookings in Square Appointments?",
        answer:
          "Yes. After connecting Square and selecting booking rules, the AI can schedule services from phone calls.",
      },
    ],
  },
  {
    slug: "simplybook-me",
    name: "SimplyBook.me",
    category: "booking",
    shortDescription: "Let callers schedule into SimplyBook.me while your staff stays on the floor.",
    whatItUnlocks: [
      "Book appointments without picking up the phone",
      "Collect key details before confirming",
      "Keep everything synced to your booking system",
    ],
    setupSteps: [
      "Connect SimplyBook.me in your VoiceFleet dashboard",
      "Select booking services and availability preferences",
      "Set required intake fields and confirmations",
      "Enable escalation rules for urgent calls",
    ],
    recommendedFor: ["salons", "clinics", "gyms", "dentists"],
    faq: [
      {
        question: "Can VoiceFleet integrate with SimplyBook.me?",
        answer:
          "Yes. Connect your SimplyBook.me account so VoiceFleet can book appointments from phone calls.",
      },
    ],
  },
  {
    slug: "mindbody",
    name: "Mindbody",
    category: "booking",
    shortDescription: "Handle class and membership calls and sync bookings into Mindbody (beta).",
    whatItUnlocks: [
      "Book classes and intro sessions",
      "Answer pricing and schedule questions",
      "Reduce front desk interruptions",
    ],
    setupSteps: [
      "Connect Mindbody in your VoiceFleet dashboard (beta)",
      "Choose which services/classes can be booked",
      "Configure membership and pricing FAQs",
      "Test calls and adjust the script",
    ],
    recommendedFor: ["gyms", "studios", "fitness-centers"],
    faq: [
      {
        question: "Is the Mindbody integration available?",
        answer:
          "Yes, in beta. If you need a specific Mindbody workflow, contact support and we can help configure it.",
      },
    ],
  },
  {
    slug: "thefork",
    name: "TheFork",
    category: "booking",
    shortDescription: "Capture reservation calls and route them into TheFork workflows (beta).",
    whatItUnlocks: [
      "Take reservations during peak service",
      "Capture party size, date/time, and special requests",
      "Reduce missed calls and missed tables",
    ],
    setupSteps: [
      "Connect TheFork in your VoiceFleet dashboard (beta)",
      "Set your reservation rules (hours, party size limits, policies)",
      "Choose escalation behavior for complex requests",
      "Forward your number and monitor reservation summaries",
    ],
    recommendedFor: ["restaurants"],
    faq: [
      {
        question: "Does VoiceFleet integrate with TheFork?",
        answer:
          "TheFork support is available as a beta integration. If you use TheFork, we can confirm the best setup for your restaurant and workflow.",
      },
    ],
  },
  {
    slug: "opentable",
    name: "OpenTable",
    category: "booking",
    shortDescription: "Route reservation calls into OpenTable workflows (beta / partnership dependent).",
    whatItUnlocks: [
      "Take reservation details over the phone",
      "Reduce missed bookings during rush",
      "Standardize intake (party size, time, contact info)",
    ],
    setupSteps: [
      "Connect OpenTable in your VoiceFleet dashboard (beta)",
      "Define your reservation rules and fallback behavior",
      "Test reservation calls with the live demo",
      "Go live and monitor call summaries",
    ],
    recommendedFor: ["restaurants"],
    faq: [
      {
        question: "Does VoiceFleet integrate with OpenTable?",
        answer:
          "OpenTable support is available as a beta/partnership-dependent integration. If you use OpenTable, we can confirm the best setup for your account.",
      },
    ],
  },
  {
    slug: "resy",
    name: "Resy",
    category: "booking",
    shortDescription: "Convert reservation calls into Resy-ready booking details (beta / partnership dependent).",
    whatItUnlocks: [
      "Capture reservation intent and details reliably",
      "Reduce back-and-forth on busy days",
      "Escalate VIP or complex requests to staff",
    ],
    setupSteps: [
      "Connect Resy in your VoiceFleet dashboard (beta)",
      "Define what details to collect and confirm",
      "Enable escalation rules for special cases",
      "Go live with call forwarding",
    ],
    recommendedFor: ["restaurants"],
    faq: [
      {
        question: "Does VoiceFleet integrate with Resy?",
        answer:
          "Resy support is available as a beta/partnership-dependent integration. We can advise the recommended setup based on your Resy configuration.",
      },
    ],
  },
];

export function getIntegration(slug: string): Integration | undefined {
  return INTEGRATIONS.find((i) => i.slug === slug);
}
