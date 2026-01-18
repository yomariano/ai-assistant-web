export type ComparisonFaqItem = {
  question: string;
  answer: string;
};

export type ComparisonPage = {
  slug: string;
  title: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  whoThisIsFor: string[];
  quickTake: { label: string; value: string }[];
  whenVoiceFleetWins: string[];
  whenAlternativeWins: string[];
  faq: ComparisonFaqItem[];
};

export const COMPARISONS: ComparisonPage[] = [
  {
    slug: "voicefleet-vs-voicemail",
    title: "VoiceFleet vs Voicemail",
    description:
      "Compare VoiceFleet (AI voice receptionist) vs voicemail for missed calls, bookings, and customer experience. See which fits your business best.",
    heroTitle: "VoiceFleet vs Voicemail: stop losing bookings to missed calls",
    heroSubtitle:
      "Voicemail records messages. VoiceFleet answers, qualifies the caller, and books appointments or captures structured details automatically.",
    whoThisIsFor: ["restaurants", "dentists", "plumbers", "gyms", "clinics"],
    quickTake: [
      { label: "Best if you want", value: "Calls handled, not just recorded" },
      { label: "Customer experience", value: "Live conversation vs beep-and-wait" },
      { label: "Outcome", value: "Bookings + summaries vs callbacks" },
    ],
    whenVoiceFleetWins: [
      "You miss calls during busy periods or after hours",
      "You want bookings/appointments created automatically",
      "You want consistent intake data (name, reason, urgency, address)",
    ],
    whenAlternativeWins: [
      "You receive very few calls and can always call back quickly",
      "Your calls are highly sensitive and you only want humans to respond",
    ],
    faq: [
      {
        question: "Is voicemail enough for booking-based businesses?",
        answer:
          "If you rely on bookings, voicemail can create delays and drop-offs. VoiceFleet is designed to capture intent and complete the next step during the call.",
      },
      {
        question: "What happens when the AI can't help?",
        answer:
          "You can configure escalation: transfer to staff, take a detailed message, or request a callback with an urgent flag.",
      },
    ],
  },
  {
    slug: "voicefleet-vs-answering-service",
    title: "VoiceFleet vs Answering Service",
    description:
      "Compare VoiceFleet vs a traditional answering service for SMB phone coverage, intake quality, and booking workflows.",
    heroTitle: "VoiceFleet vs Answering Service: automation vs message taking",
    heroSubtitle:
      "Answering services typically take messages. VoiceFleet can qualify calls, handle FAQs, and book appointments into your calendar/booking system.",
    whoThisIsFor: ["dentists", "clinics", "plumbers", "salons", "gyms"],
    quickTake: [
      { label: "Best if you want", value: "Automated bookings and structured intake" },
      { label: "Setup", value: "Forward calls + configure flows" },
      { label: "Scale", value: "Consistent handling across peak volume" },
    ],
    whenVoiceFleetWins: [
      "You want repeatable, configurable call handling (not variable agents)",
      "You want bookings created automatically (calendar/booking integrations)",
      "You want instant summaries and analytics",
    ],
    whenAlternativeWins: [
      "You need fully human-only handling for complex, bespoke calls",
      "You require niche domain judgement on every call",
    ],
    faq: [
      {
        question: "Can VoiceFleet replace an answering service?",
        answer:
          "For many SMBs, yes - especially when the main job is bookings, FAQs, intake, and routing. For complex cases, you can escalate to staff.",
      },
      {
        question: "Will callers know it's AI?",
        answer:
          "You control how the receptionist introduces itself. The focus is a helpful, professional experience and getting the caller to the right outcome quickly.",
      },
    ],
  },
  {
    slug: "voicefleet-vs-call-center",
    title: "VoiceFleet vs Call Center",
    description:
      "Compare VoiceFleet vs a call center for customer calls, appointment scheduling, and after-hours coverage for SMBs.",
    heroTitle: "VoiceFleet vs Call Center: the SMB-first phone stack",
    heroSubtitle:
      "Call centers can be effective but often require training, scripts, and ongoing management. VoiceFleet offers configurable automation and escalation for SMB workflows.",
    whoThisIsFor: ["restaurants", "home-services", "clinics", "gyms"],
    quickTake: [
      { label: "Best if you want", value: "Always-on coverage without headcount" },
      { label: "Consistency", value: "Same playbook on every call" },
      { label: "Workflow", value: "Bookings + summaries + integrations" },
    ],
    whenVoiceFleetWins: [
      "You want fast setup and consistent handling without staffing schedules",
      "You want integrations (calendar/booking) to reduce manual work",
      "You want analytics on call reasons and peak times",
    ],
    whenAlternativeWins: [
      "You need large teams handling complex, multi-step support processes",
      "Your business requires multi-agent handoffs inside each call",
    ],
    faq: [
      {
        question: "Is VoiceFleet only for big companies?",
        answer:
          "No. VoiceFleet is built for SMBs that want reliable phone coverage and a simple setup: forward calls, connect a calendar/booking system, and configure rules.",
      },
    ],
  },
];

export function getComparison(slug: string): ComparisonPage | undefined {
  return COMPARISONS.find((p) => p.slug === slug);
}

