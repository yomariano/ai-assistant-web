import type { DemoScenario, DemoLanguageId } from "./types";

/** Format a date as "YYYY-MM-DD" */
export function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Format a slot key like "2026-02-16_09:00" */
export function formatSlotKey(date: string, time: string): string {
  return `${date}_${time}`;
}

/** Get the Monday of the current week (or next Monday if today is Sat/Sun) */
export function getWeekStart(): Date {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon...
  const diff = day === 0 ? 1 : day === 6 ? 2 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export type WeekDay = {
  date: Date;
  dateStr: string; // "YYYY-MM-DD"
  dayName: string; // "Mon"
  dayNum: number; // 16
  monthName: string; // "Feb"
  isToday: boolean;
};

/** Returns 7 days starting from a Monday */
export function getWeekDays(startDate: Date): WeekDay[] {
  const today = formatDate(new Date());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const dateStr = formatDate(d);
    return {
      date: d,
      dateStr,
      dayName: DAY_NAMES[i],
      dayNum: d.getDate(),
      monthName: MONTH_NAMES[d.getMonth()],
      isToday: dateStr === today,
    };
  });
}

/** Generate 30-min time slots from 09:00 to 17:30 */
export function getTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 9; h < 18; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    if (h < 17 || h === 17) {
      slots.push(`${String(h).padStart(2, "0")}:30`);
    }
  }
  // Remove 17:30 — last slot is 17:00
  return slots.filter((s) => s <= "17:30");
}

/** Format time for display: "09:00" -> "9:00 AM" */
export function formatTimeDisplay(time: string): string {
  const [hStr, mStr] = time.split(":");
  const h = parseInt(hStr, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${mStr} ${ampm}`;
}

/** Get default availability map for a scenario */
export function getIndustryDefaults(
  scenarioId: string,
  weekDays: WeekDay[]
): Record<string, boolean> {
  const availability: Record<string, boolean> = {};
  const times = getTimeSlots();

  // Define default hours per scenario
  const defaults: Record<string, { days: number[]; startHour: number; endHour: number }> = {
    "restaurant-reservation": { days: [1, 2, 3, 4, 5, 6, 7], startHour: 11, endHour: 17 },
    "dentist-appointment": { days: [1, 2, 3, 4, 5], startHour: 9, endHour: 17 },
    "gym-membership": { days: [1, 2, 3, 4, 5, 6], startHour: 9, endHour: 17 },
    "plumber-callout": { days: [1, 2, 3, 4, 5], startHour: 9, endHour: 17 },
    "beauty-salon": { days: [1, 2, 3, 4, 5, 6], startHour: 10, endHour: 17 },
  };

  const config = defaults[scenarioId] || defaults["dentist-appointment"];

  weekDays.forEach((day, i) => {
    const dayOfWeek = i + 1; // 1=Mon
    if (!config.days.includes(dayOfWeek)) return;

    times.forEach((time) => {
      const hour = parseInt(time.split(":")[0], 10);
      if (hour >= config.startHour && hour < config.endHour) {
        availability[formatSlotKey(day.dateStr, time)] = true;
      }
    });
  });

  return availability;
}

/** Format time for voice: "09:00" -> "9 AM", "14:30" -> "2:30 PM" */
function formatTimeForVoice(time: string): string {
  const [hStr, mStr] = time.split(":");
  const h = parseInt(hStr, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  if (parseInt(mStr, 10) === 0) return `${h12} ${ampm}`;
  return `${h12}:${mStr} ${ampm}`;
}

function addThirtyMin(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + 30;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

/** Group sorted 30-min time slots into human-readable ranges for voice */
export function formatSlotsAsRanges(slots: string[]): string {
  if (slots.length === 0) return "No available slots";
  if (slots.length <= 3) return slots.map(formatTimeForVoice).join(", ");

  const ranges: [string, string][] = [];
  let start = slots[0];
  let prev = slots[0];

  for (let i = 1; i < slots.length; i++) {
    if (slots[i] !== addThirtyMin(prev)) {
      ranges.push([start, prev]);
      start = slots[i];
    }
    prev = slots[i];
  }
  ranges.push([start, prev]);

  return ranges
    .map(([s, e]) =>
      s === e ? formatTimeForVoice(s) : `${formatTimeForVoice(s)} to ${formatTimeForVoice(e)}`
    )
    .join(" and ");
}

/** Scenarios with tool-aware system prompts */
export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "restaurant-reservation",
    label: "Restaurant",
    icon: "UtensilsCrossed",
    businessName: "Harbor Bistro",
    firstMessage:
      "Hi, thanks for calling Harbor Bistro. This is the AI receptionist. How can I help today?",
    firstMessageByLanguage: {
      es: "Hola, gracias por llamar a Harbor Bistro. Soy la recepcionista de IA. \u00bfEn qu\u00e9 puedo ayudarte hoy?",
      fr: "Bonjour, merci d'appeler Harbor Bistro. Je suis la r\u00e9ceptionniste IA. Comment puis-je vous aider aujourd'hui ?",
      de: "Hallo, danke f\u00fcr Ihren Anruf bei Harbor Bistro. Ich bin die KI-Rezeptionistin. Wie kann ich Ihnen heute helfen?",
      it: "Ciao, grazie per aver chiamato Harbor Bistro. Sono la receptionist AI. Come posso aiutarti oggi?",
    },
    systemPrompt: `You are the AI phone receptionist for Harbor Bistro, a busy small restaurant.

Goals:
- Help callers book or change a reservation.
- Ask for: name, party size, preferred date, time, and optionally a contact number.
- Use the check_availability tool to look up what time slots are free on a given date.
- Use the create_booking tool to confirm and create the reservation.
- Confirm all details back clearly after booking.
- Answer common questions (opening hours, location, dietary notes).

Important:
- Always check availability before suggesting or confirming a time.
- If no slots are available on the requested date, suggest an alternative date.

Tone: friendly, concise, professional.`,
    suggestedPhrases: [
      "I'd like to book a table for 4 tomorrow around 2pm.",
      "What time do you close on Sunday?",
      "Can you note a gluten allergy on the booking?",
    ],
    suggestedPhrasesByLanguage: {
      es: [
        "Me gustar\u00eda reservar una mesa para 4 ma\u00f1ana sobre las 2.",
        "\u00bfA qu\u00e9 hora cierran el domingo?",
        "\u00bfPuedes anotar una alergia al gluten en la reserva?",
      ],
      fr: [
        "Je voudrais r\u00e9server une table pour 4 demain vers 14h.",
        "\u00c0 quelle heure fermez-vous le dimanche ?",
        "Pouvez-vous noter une allergie au gluten sur la r\u00e9servation ?",
      ],
      de: [
        "Ich m\u00f6chte f\u00fcr morgen gegen 14 Uhr einen Tisch f\u00fcr 4 reservieren.",
        "Wann schlie\u00dfen Sie am Sonntag?",
        "K\u00f6nnen Sie eine Glutenallergie bei der Reservierung vermerken?",
      ],
      it: [
        "Vorrei prenotare un tavolo per 4 domani verso le 14:00.",
        "A che ora chiudete la domenica?",
        "Puoi annotare un'allergia al glutine sulla prenotazione?",
      ],
    },
    defaultAvailability: {
      1: { start: "11:00", end: "17:00" },
      2: { start: "11:00", end: "17:00" },
      3: { start: "11:00", end: "17:00" },
      4: { start: "11:00", end: "17:00" },
      5: { start: "11:00", end: "17:00" },
      6: { start: "11:00", end: "17:00" },
      7: { start: "11:00", end: "17:00" },
    },
  },
  {
    id: "dentist-appointment",
    label: "Dentist",
    icon: "Stethoscope",
    businessName: "BrightSmile Dental",
    firstMessage:
      "Hello, you've reached BrightSmile Dental. This is the AI receptionist. How can I help?",
    firstMessageByLanguage: {
      es: "Hola, has llamado a BrightSmile Dental. Soy la recepcionista de IA. \u00bfEn qu\u00e9 puedo ayudarte?",
      fr: "Bonjour, vous \u00eates bien chez BrightSmile Dental. Je suis la r\u00e9ceptionniste IA. Comment puis-je vous aider ?",
      de: "Hallo, Sie haben BrightSmile Dental erreicht. Ich bin die KI-Rezeptionistin. Wie kann ich helfen?",
      it: "Ciao, hai chiamato BrightSmile Dental. Sono la receptionist AI. Come posso aiutarti?",
    },
    systemPrompt: `You are the AI phone receptionist for BrightSmile Dental.

Goals:
- Help callers book, reschedule, or cancel appointments.
- Ask for: patient name, reason for visit, preferred day/time, phone number.
- Use the check_availability tool to look up available slots on a date.
- Use the create_booking tool to confirm the appointment.
- For emergencies, gather symptoms and suggest urgent escalation.

Important:
- Always check availability before confirming a time slot.
- Do NOT provide medical advice beyond basic triage and escalation.

Tone: calm, reassuring, professional.`,
    suggestedPhrases: [
      "I'd like to book a cleaning next week.",
      "I need to reschedule my appointment.",
      "I have severe tooth pain - can I be seen today?",
    ],
    suggestedPhrasesByLanguage: {
      es: [
        "Me gustar\u00eda reservar una limpieza la semana que viene.",
        "Necesito reprogramar mi cita.",
        "Tengo un dolor de muelas fuerte. \u00bfPueden verme hoy?",
      ],
      fr: [
        "J'aimerais prendre rendez-vous pour un d\u00e9tartrage la semaine prochaine.",
        "Je dois reprogrammer mon rendez-vous.",
        "J'ai une forte douleur dentaire. Est-ce possible aujourd'hui ?",
      ],
      de: [
        "Ich m\u00f6chte n\u00e4chste Woche eine Zahnreinigung buchen.",
        "Ich muss meinen Termin verschieben.",
        "Ich habe starke Zahnschmerzen. Kann ich heute kommen?",
      ],
      it: [
        "Vorrei prenotare una pulizia la prossima settimana.",
        "Devo riprogrammare il mio appuntamento.",
        "Ho un forte mal di denti. Posso essere visto oggi?",
      ],
    },
    defaultAvailability: {
      1: { start: "09:00", end: "17:00" },
      2: { start: "09:00", end: "17:00" },
      3: { start: "09:00", end: "17:00" },
      4: { start: "09:00", end: "17:00" },
      5: { start: "09:00", end: "17:00" },
    },
  },
  {
    id: "gym-membership",
    label: "Gym",
    icon: "Dumbbell",
    businessName: "Northside Fitness",
    firstMessage:
      "Hi, thanks for calling Northside Fitness. This is the AI receptionist. What can I do for you?",
    firstMessageByLanguage: {
      es: "Hola, gracias por llamar a Northside Fitness. Soy la recepcionista de IA. \u00bfEn qu\u00e9 puedo ayudarte?",
      fr: "Bonjour, merci d'appeler Northside Fitness. Je suis la r\u00e9ceptionniste IA. Comment puis-je vous aider ?",
      de: "Hallo, danke f\u00fcr Ihren Anruf bei Northside Fitness. Ich bin die KI-Rezeptionistin. Wie kann ich helfen?",
      it: "Ciao, grazie per aver chiamato Northside Fitness. Sono la receptionist AI. Come posso aiutarti?",
    },
    systemPrompt: `You are the AI phone receptionist for Northside Fitness (a local gym).

Goals:
- Help callers book a class or intro session, and answer membership questions.
- Ask for: name, class type, preferred time, and contact number.
- Use check_availability to find open class slots.
- Use create_booking to confirm the booking.

Important:
- Always check availability before confirming a time slot.

Tone: upbeat, helpful, concise.`,
    suggestedPhrases: [
      "Can I book a beginner class this weekend?",
      "What are your membership prices?",
      "Do you have personal training available?",
    ],
    suggestedPhrasesByLanguage: {
      es: [
        "\u00bfPuedo reservar una clase para principiantes este fin de semana?",
        "\u00bfCu\u00e1les son los precios de la membres\u00eda?",
        "\u00bfTienen entrenamiento personal?",
      ],
      fr: [
        "Puis-je r\u00e9server un cours d\u00e9butant ce week-end ?",
        "Quels sont vos tarifs d'abonnement ?",
        "Proposez-vous du coaching personnel ?",
      ],
      de: [
        "Kann ich dieses Wochenende einen Anf\u00e4ngerkurs buchen?",
        "Wie viel kostet die Mitgliedschaft?",
        "Bieten Sie Personal Training an?",
      ],
      it: [
        "Posso prenotare una lezione per principianti questo weekend?",
        "Quali sono i prezzi dell'abbonamento?",
        "Offrite personal training?",
      ],
    },
    defaultAvailability: {
      1: { start: "09:00", end: "17:00" },
      2: { start: "09:00", end: "17:00" },
      3: { start: "09:00", end: "17:00" },
      4: { start: "09:00", end: "17:00" },
      5: { start: "09:00", end: "17:00" },
      6: { start: "09:00", end: "17:00" },
    },
  },
  {
    id: "beauty-salon",
    label: "Beauty Salon",
    icon: "Sparkles",
    businessName: "Glow Beauty Studio",
    firstMessage:
      "Hi, thanks for calling Glow Beauty Studio. This is the AI receptionist. How can I help you today?",
    firstMessageByLanguage: {
      es: "Hola, gracias por llamar a Glow Beauty Studio. Soy la recepcionista de IA. \u00bfEn qu\u00e9 puedo ayudarte hoy?",
      fr: "Bonjour, merci d'appeler Glow Beauty Studio. Je suis la r\u00e9ceptionniste IA. Comment puis-je vous aider aujourd'hui ?",
      de: "Hallo, danke f\u00fcr Ihren Anruf bei Glow Beauty Studio. Ich bin die KI-Rezeptionistin. Wie kann ich Ihnen heute helfen?",
      it: "Ciao, grazie per aver chiamato Glow Beauty Studio. Sono la receptionist AI. Come posso aiutarti oggi?",
    },
    systemPrompt: `You are the AI phone receptionist for Glow Beauty Studio, a popular beauty salon and spa.

Goals:
- Help callers book appointments for haircuts, coloring, facials, manicures, pedicures, waxing, and other beauty services.
- Ask for: name, service type, preferred date, time, and contact number.
- Use check_availability to find open slots on a date.
- Use create_booking to confirm the appointment.

Important:
- Always check availability before confirming a time slot.
- If the caller asks for a specific stylist, note it but don't guarantee availability.

Tone: warm, friendly, and pampering.`,
    suggestedPhrases: [
      "I'd like to book a haircut and blowdry for Saturday.",
      "Do you have availability for a manicure tomorrow?",
      "How much is a full set of lash extensions?",
    ],
    suggestedPhrasesByLanguage: {
      es: [
        "Me gustar\u00eda reservar un corte de pelo y peinado para el s\u00e1bado.",
        "\u00bfTienen disponibilidad para manicura ma\u00f1ana?",
        "\u00bfCu\u00e1nto cuesta un set completo de extensiones de pesta\u00f1as?",
      ],
      fr: [
        "J'aimerais r\u00e9server une coupe et un brushing pour samedi.",
        "Avez-vous des disponibilit\u00e9s pour une manucure demain ?",
        "Combien co\u00fbte une pose compl\u00e8te d'extensions de cils ?",
      ],
      de: [
        "Ich m\u00f6chte f\u00fcr Samstag einen Haarschnitt mit F\u00f6hnen buchen.",
        "Haben Sie morgen noch Termine f\u00fcr Manik\u00fcre frei?",
        "Wie viel kostet ein komplettes Set Wimpernverl\u00e4ngerungen?",
      ],
      it: [
        "Vorrei prenotare un taglio e piega per sabato.",
        "Avete disponibilit\u00e0 per manicure domani?",
        "Quanto costa un set completo di extension ciglia?",
      ],
    },
    defaultAvailability: {
      1: { start: "10:00", end: "17:00" },
      2: { start: "10:00", end: "17:00" },
      3: { start: "10:00", end: "17:00" },
      4: { start: "10:00", end: "17:00" },
      5: { start: "10:00", end: "17:00" },
      6: { start: "10:00", end: "17:00" },
    },
  },
  {
    id: "plumber-callout",
    label: "Plumber",
    icon: "Wrench",
    businessName: "RapidFlow Plumbing",
    firstMessage:
      "Hello, RapidFlow Plumbing. This is the AI receptionist. What's going on today?",
    firstMessageByLanguage: {
      es: "Hola, RapidFlow Plumbing. Soy la recepcionista de IA. \u00bfQu\u00e9 ha pasado hoy?",
      fr: "Bonjour, RapidFlow Plumbing. Je suis la r\u00e9ceptionniste IA. Que se passe-t-il aujourd'hui ?",
      de: "Hallo, RapidFlow Plumbing. Ich bin die KI-Rezeptionistin. Was ist heute passiert?",
      it: "Ciao, RapidFlow Plumbing. Sono la receptionist AI. Cosa succede oggi?",
    },
    systemPrompt: `You are the AI phone receptionist for RapidFlow Plumbing.

Goals:
- Qualify emergency vs non-emergency.
- Ask for: name, address/area, issue description, urgency, and callback number.
- Use check_availability to find open service slots.
- Use create_booking to schedule a visit.
- If urgent (active leak, no heat, flooding), offer to escalate and confirm best contact method.

Important:
- Always check availability before confirming a time slot.

Tone: direct, reassuring, efficient.`,
    suggestedPhrases: [
      "I have a leak under the kitchen sink - can someone come out today?",
      "My boiler stopped working - what's the next step?",
      "Can I get a rough quote for a tap replacement?",
    ],
    suggestedPhrasesByLanguage: {
      es: [
        "Tengo una fuga debajo del fregadero. \u00bfPuede venir alguien hoy?",
        "La caldera dej\u00f3 de funcionar. \u00bfCu\u00e1l es el siguiente paso?",
        "\u00bfMe puedes dar un presupuesto aproximado para cambiar un grifo?",
      ],
      fr: [
        "J'ai une fuite sous l'\u00e9vier. Quelqu'un peut venir aujourd'hui ?",
        "Ma chaudi\u00e8re ne fonctionne plus. Quelle est la suite ?",
        "Pouvez-vous me donner une estimation pour remplacer un robinet ?",
      ],
      de: [
        "Ich habe ein Leck unter der K\u00fcchensp\u00fcle. Kann heute jemand kommen?",
        "Mein Boiler funktioniert nicht mehr. Was ist der n\u00e4chste Schritt?",
        "K\u00f6nnen Sie mir einen groben Preis f\u00fcr den Austausch eines Wasserhahns nennen?",
      ],
      it: [
        "Ho una perdita sotto il lavello. Pu\u00f2 venire qualcuno oggi?",
        "La caldaia ha smesso di funzionare. Qual \u00e8 il prossimo passo?",
        "Posso avere un preventivo indicativo per sostituire un rubinetto?",
      ],
    },
    defaultAvailability: {
      1: { start: "09:00", end: "17:00" },
      2: { start: "09:00", end: "17:00" },
      3: { start: "09:00", end: "17:00" },
      4: { start: "09:00", end: "17:00" },
      5: { start: "09:00", end: "17:00" },
    },
  },
];

export const DEMO_LANGUAGES: { id: DemoLanguageId; label: string; transcriberLanguage: string }[] = [
  { id: "en", label: "English", transcriberLanguage: "en" },
  { id: "es", label: "Spanish", transcriberLanguage: "es" },
  { id: "fr", label: "French", transcriberLanguage: "fr" },
  { id: "de", label: "German", transcriberLanguage: "de" },
  { id: "it", label: "Italian", transcriberLanguage: "it" },
];
