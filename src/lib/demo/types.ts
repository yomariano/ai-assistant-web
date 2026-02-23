export type TimeSlot = {
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  available: boolean;
};

export type Booking = {
  date: string;
  time: string;
  customerName: string;
  service?: string;
  notes?: string;
  confirmationNumber?: string;
  createdAt: number;
};

export type DemoLanguageId = "en" | "es" | "fr" | "de" | "it";

export type DemoScenario = {
  id: string;
  label: string;
  icon: string; // Lucide icon name
  businessName: string;
  firstMessage: string;
  firstMessageByLanguage?: Partial<Record<DemoLanguageId, string>>;
  systemPrompt: string;
  suggestedPhrases: string[];
  suggestedPhrasesByLanguage?: Partial<Record<DemoLanguageId, string[]>>;
  defaultAvailability: Record<number, { start: string; end: string }>; // dayOfWeek (1=Mon) -> hours
};

export type DemoStep = 1 | 2 | 3 | 4;

export type CallStatus =
  | "idle"
  | "loading"
  | "connecting"
  | "connected"
  | "ended"
  | "error";

export type TranscriptMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};
