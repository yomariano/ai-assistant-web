"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  Copy,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Sparkles,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/umami";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type CallStatus = "idle" | "loading" | "connecting" | "connected" | "ended" | "error";

type TranscriptMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

function coerceTranscript(value: unknown): string | null {
  if (typeof value === "string") return value.trim() ? value : null;
  if (value == null) return null;

  if (typeof value === "object") {
    const maybe = value as Record<string, unknown>;
    const text = maybe.text;
    if (typeof text === "string" && text.trim()) return text;
  }

  const asString = String(value);
  return asString.trim() ? asString : null;
}

/**
 * Safely extract a string error message from an unknown value.
 * Handles cases where Vapi returns error objects like {type, msg, details}
 * instead of plain strings, preventing React error #31.
 */
function safeErrorMessage(value: unknown, fallback: string): string {
  if (typeof value === "string" && value.trim()) return value;
  if (value == null) return fallback;

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    // Try common error message properties
    if (typeof obj.msg === "string" && obj.msg.trim()) return obj.msg;
    if (typeof obj.message === "string" && obj.message.trim()) return obj.message;
    if (typeof obj.error === "string" && obj.error.trim()) return obj.error;
  }

  return fallback;
}

type DemoScenario = {
  id: string;
  label: string;
  businessName: string;
  firstMessage: string;
  firstMessageByLanguage?: Partial<Record<DemoLanguageId, string>>;
  systemPrompt: string;
  suggestedPhrases: string[];
  suggestedPhrasesByLanguage?: Partial<Record<DemoLanguageId, string[]>>;
};

type DemoLanguageId = "en" | "es" | "fr" | "de" | "it";

type DemoLanguage = {
  id: DemoLanguageId;
  label: string;
  transcriberLanguage?: string;
};

type VapiVoiceId =
  | "Elliot"
  | "Kylie"
  | "Rohan"
  | "Lily"
  | "Savannah"
  | "Hana"
  | "Neha"
  | "Cole"
  | "Harry"
  | "Paige"
  | "Spencer"
  | "Leah"
  | "Tara";

type DemoVoice = {
  id: string;
  label: string;
  provider: "vapi" | "11labs";
  defaultLanguageId?: DemoLanguageId;
  enforceLanguage?: "en" | "es" | "fr" | "de" | "it";
  model?: "eleven_turbo_v2_5" | "eleven_multilingual_v2";
};

const DEFAULT_ARGENTINA_DEMO_VOICE_ID =
  process.env.NEXT_PUBLIC_DEMO_ARGENTINA_VOICE_ID || "1709f1e8-d660-4e22-b253-158ccf68bf0a";
const DEFAULT_IRISH_DEMO_VOICE_ID =
  process.env.NEXT_PUBLIC_DEMO_IRISH_VOICE_ID || "f1dbef4d-b259-4549-90d0-912478492273";

const LANGUAGES: DemoLanguage[] = [
  { id: "en", label: "English", transcriberLanguage: "en" },
  { id: "es", label: "Spanish", transcriberLanguage: "es" },
  { id: "fr", label: "French", transcriberLanguage: "fr" },
  { id: "de", label: "German", transcriberLanguage: "de" },
  { id: "it", label: "Italian", transcriberLanguage: "it" },
];

function shouldHangUpForUserUtterance(languageId: DemoLanguageId, utterance: string): boolean {
  const text = utterance.toLowerCase().trim();
  if (!text) return false;

  const patternsByLanguage: Record<DemoLanguageId, RegExp[]> = {
    en: [
      /\bbye\b/i,
      /\bgoodbye\b/i,
      /\bsee you\b/i,
      /\bthank(s| you).*(bye|goodbye)\b/i,
    ],
    es: [/\bad(i|í)os\b/i, /\bhasta luego\b/i, /\bhasta pronto\b/i, /\bchao\b/i],
    fr: [/\bau revoir\b/i, /\bà bient(ô|o)t\b/i, /\bmerci.*(au revoir|bye)\b/i],
    de: [/\btsch(ü|u)ss\b/i, /\bauf wiedersehen\b/i, /\bbis bald\b/i],
    it: [/\barrivederci\b/i, /\ba presto\b/i, /\bgrazie.*(ciao|arrivederci)\b/i],
  };

  const patterns = patternsByLanguage[languageId] || patternsByLanguage.en;
  return patterns.some((re) => re.test(text));
}

const SCENARIOS: DemoScenario[] = [
  {
    id: "restaurant-reservation",
    label: "Restaurant reservation",
    businessName: "Harbor Bistro",
    firstMessage:
      "Hi, thanks for calling Harbor Bistro. This is the AI receptionist. How can I help today?",
    firstMessageByLanguage: {
      es: "Hola, gracias por llamar a Harbor Bistro. Soy la recepcionista de IA. ¿En qué puedo ayudarte hoy?",
      fr: "Bonjour, merci d’appeler Harbor Bistro. Je suis la réceptionniste IA. Comment puis-je vous aider aujourd’hui ?",
      de: "Hallo, danke für Ihren Anruf bei Harbor Bistro. Ich bin die KI-Rezeptionistin. Wie kann ich Ihnen heute helfen?",
      it: "Ciao, grazie per aver chiamato Harbor Bistro. Sono la receptionist AI. Come posso aiutarti oggi?",
    },
    systemPrompt:
      "You are the AI phone receptionist for Harbor Bistro, a busy small restaurant.\n\nGoals:\n- Help callers book or change a reservation.\n- Ask for: name, party size, date, time, and a contact number.\n- Confirm details back clearly.\n- Answer common questions (opening hours, location, dietary notes).\n\nConstraints (demo mode):\n- Do NOT claim you actually checked a real calendar or created a real reservation.\n- Instead say you are taking a reservation request for this demo and would send confirmation in the real product.\n- If the caller asks for a human, offer to take a message and summarize it.\n\nTone: friendly, concise, professional.",
    suggestedPhrases: [
      "Hi, I'd like to book a table for 4 tomorrow around 7pm.",
      "What time do you close on Sunday?",
      "Can you note a gluten allergy on the booking?",
    ],
    suggestedPhrasesByLanguage: {
      es: [
        "Hola, me gustaría reservar una mesa para 4 mañana sobre las 7.",
        "¿A qué hora cierran el domingo?",
        "¿Puedes anotar una alergia al gluten en la reserva?",
      ],
      fr: [
        "Bonjour, je voudrais réserver une table pour 4 demain vers 19h.",
        "À quelle heure fermez-vous le dimanche ?",
        "Pouvez-vous noter une allergie au gluten sur la réservation ?",
      ],
      de: [
        "Hallo, ich würde gerne für morgen gegen 19 Uhr einen Tisch für 4 reservieren.",
        "Wann schließen Sie am Sonntag?",
        "Können Sie eine Glutenallergie bei der Reservierung vermerken?",
      ],
      it: [
        "Ciao, vorrei prenotare un tavolo per 4 domani verso le 19:00.",
        "A che ora chiudete la domenica?",
        "Puoi annotare un’allergia al glutine sulla prenotazione?",
      ],
    },
  },
  {
    id: "dentist-appointment",
    label: "Dentist appointment",
    businessName: "BrightSmile Dental",
    firstMessage:
      "Hello, you've reached BrightSmile Dental. This is the AI receptionist. How can I help?",
    firstMessageByLanguage: {
      es: "Hola, has llamado a BrightSmile Dental. Soy la recepcionista de IA. ¿En qué puedo ayudarte?",
      fr: "Bonjour, vous êtes bien chez BrightSmile Dental. Je suis la réceptionniste IA. Comment puis-je vous aider ?",
      de: "Hallo, Sie haben BrightSmile Dental erreicht. Ich bin die KI-Rezeptionistin. Wie kann ich helfen?",
      it: "Ciao, hai chiamato BrightSmile Dental. Sono la receptionist AI. Come posso aiutarti?",
    },
    systemPrompt:
      "You are the AI phone receptionist for BrightSmile Dental.\n\nGoals:\n- Help callers book, reschedule, or cancel appointments.\n- Ask for: patient name, reason for visit, preferred day/time, phone number.\n- For emergencies, gather symptoms and suggest urgent escalation.\n\nConstraints (demo mode):\n- Do NOT provide medical advice beyond basic triage and escalation.\n- Do NOT claim to access patient records.\n- Do NOT claim you booked a real slot; treat it as a demo booking request.\n\nTone: calm, reassuring, professional.",
    suggestedPhrases: [
      "I'd like to book a cleaning next week.",
      "I need to reschedule my appointment.",
      "I have severe tooth pain - can I be seen today?",
    ],
    suggestedPhrasesByLanguage: {
      es: [
        "Me gustaría reservar una limpieza la semana que viene.",
        "Necesito reprogramar mi cita.",
        "Tengo un dolor de muelas fuerte. ¿Pueden verme hoy?",
      ],
      fr: [
        "J’aimerais prendre rendez-vous pour un détartrage la semaine prochaine.",
        "Je dois reprogrammer mon rendez-vous.",
        "J’ai une forte douleur dentaire. Est-ce possible aujourd’hui ?",
      ],
      de: [
        "Ich möchte nächste Woche eine Zahnreinigung buchen.",
        "Ich muss meinen Termin verschieben.",
        "Ich habe starke Zahnschmerzen. Kann ich heute kommen?",
      ],
      it: [
        "Vorrei prenotare una pulizia la prossima settimana.",
        "Devo riprogrammare il mio appuntamento.",
        "Ho un forte mal di denti. Posso essere visto oggi?",
      ],
    },
  },
  {
    id: "gym-membership",
    label: "Gym booking / class",
    businessName: "Northside Fitness",
    firstMessage:
      "Hi, thanks for calling Northside Fitness. This is the AI receptionist. What can I do for you?",
    firstMessageByLanguage: {
      es: "Hola, gracias por llamar a Northside Fitness. Soy la recepcionista de IA. ¿En qué puedo ayudarte?",
      fr: "Bonjour, merci d’appeler Northside Fitness. Je suis la réceptionniste IA. Comment puis-je vous aider ?",
      de: "Hallo, danke für Ihren Anruf bei Northside Fitness. Ich bin die KI-Rezeptionistin. Wie kann ich helfen?",
      it: "Ciao, grazie per aver chiamato Northside Fitness. Sono la receptionist AI. Come posso aiutarti?",
    },
    systemPrompt:
      "You are the AI phone receptionist for Northside Fitness (a local gym).\n\nGoals:\n- Help callers book a class or intro session, and answer membership questions.\n- Ask for: name, class type, preferred time, and contact number.\n- Confirm details.\n\nConstraints (demo mode):\n- Do NOT claim you checked live availability.\n- Treat it as a demo booking request.\n\nTone: upbeat, helpful, concise.",
    suggestedPhrases: [
      "Can I book a beginner class this weekend?",
      "What are your membership prices?",
      "Do you have personal training available?",
    ],
    suggestedPhrasesByLanguage: {
      es: [
        "¿Puedo reservar una clase para principiantes este fin de semana?",
        "¿Cuáles son los precios de la membresía?",
        "¿Tienen entrenamiento personal?",
      ],
      fr: [
        "Puis-je réserver un cours débutant ce week-end ?",
        "Quels sont vos tarifs d’abonnement ?",
        "Proposez-vous du coaching personnel ?",
      ],
      de: [
        "Kann ich dieses Wochenende einen Anfängerkurs buchen?",
        "Wie viel kostet die Mitgliedschaft?",
        "Bieten Sie Personal Training an?",
      ],
      it: [
        "Posso prenotare una lezione per principianti questo weekend?",
        "Quali sono i prezzi dell’abbonamento?",
        "Offrite personal training?",
      ],
    },
  },
  {
    id: "plumber-callout",
    label: "Plumber emergency call-out",
    businessName: "RapidFlow Plumbing",
    firstMessage:
      "Hello, RapidFlow Plumbing. This is the AI receptionist. What's going on today?",
    firstMessageByLanguage: {
      es: "Hola, RapidFlow Plumbing. Soy la recepcionista de IA. ¿Qué ha pasado hoy?",
      fr: "Bonjour, RapidFlow Plumbing. Je suis la réceptionniste IA. Que se passe-t-il aujourd’hui ?",
      de: "Hallo, RapidFlow Plumbing. Ich bin die KI-Rezeptionistin. Was ist heute passiert?",
      it: "Ciao, RapidFlow Plumbing. Sono la receptionist AI. Cosa succede oggi?",
    },
    systemPrompt:
      "You are the AI phone receptionist for RapidFlow Plumbing.\n\nGoals:\n- Qualify emergency vs non-emergency.\n- Ask for: name, address/area, issue description, urgency, and callback number.\n- If urgent (active leak, no heat in winter, flooding), offer to escalate and confirm best contact method.\n\nConstraints (demo mode):\n- Do NOT claim a technician is dispatched.\n- Treat it as a demo intake; summarize details and suggest escalation.\n\nTone: direct, reassuring, efficient.",
    suggestedPhrases: [
      "I have a leak under the kitchen sink - can someone come out today?",
      "My boiler stopped working - what's the next step?",
      "Can I get a rough quote for a tap replacement?",
    ],
    suggestedPhrasesByLanguage: {
      es: [
        "Tengo una fuga debajo del fregadero. ¿Puede venir alguien hoy?",
        "La caldera dejó de funcionar. ¿Cuál es el siguiente paso?",
        "¿Me puedes dar un presupuesto aproximado para cambiar un grifo?",
      ],
      fr: [
        "J’ai une fuite sous l’évier. Quelqu’un peut venir aujourd’hui ?",
        "Ma chaudière ne fonctionne plus. Quelle est la suite ?",
        "Pouvez-vous me donner une estimation pour remplacer un robinet ?",
      ],
      de: [
        "Ich habe ein Leck unter der Küchenspüle. Kann heute jemand kommen?",
        "Mein Boiler funktioniert nicht mehr. Was ist der nächste Schritt?",
        "Können Sie mir einen groben Preis für den Austausch eines Wasserhahns nennen?",
      ],
      it: [
        "Ho una perdita sotto il lavello. Può venire qualcuno oggi?",
        "La caldaia ha smesso di funzionare. Qual è il prossimo passo?",
        "Posso avere un preventivo indicativo per sostituire un rubinetto?",
      ],
    },
  },
  {
    id: "beauty-salon",
    label: "Beauty salon / spa",
    businessName: "Glow Beauty Studio",
    firstMessage:
      "Hi, thanks for calling Glow Beauty Studio. This is the AI receptionist. How can I help you today?",
    firstMessageByLanguage: {
      es: "Hola, gracias por llamar a Glow Beauty Studio. Soy la recepcionista de IA. ¿En qué puedo ayudarte hoy?",
      fr: "Bonjour, merci d'appeler Glow Beauty Studio. Je suis la réceptionniste IA. Comment puis-je vous aider aujourd'hui ?",
      de: "Hallo, danke für Ihren Anruf bei Glow Beauty Studio. Ich bin die KI-Rezeptionistin. Wie kann ich Ihnen heute helfen?",
      it: "Ciao, grazie per aver chiamato Glow Beauty Studio. Sono la receptionist AI. Come posso aiutarti oggi?",
    },
    systemPrompt:
      "You are the AI phone receptionist for Glow Beauty Studio, a popular beauty salon and spa.\n\nGoals:\n- Help callers book appointments for haircuts, coloring, facials, manicures, pedicures, waxing, and other beauty services.\n- Ask for: name, service type, preferred stylist or therapist (if any), date, time, and contact number.\n- Answer common questions about services, pricing ranges, and opening hours.\n- Confirm all details back clearly.\n\nConstraints (demo mode):\n- Do NOT claim you actually checked a real calendar or created a real booking.\n- Instead say you are taking a booking request for this demo and would send confirmation in the real product.\n- If the caller asks for a specific stylist, note it down but don't guarantee availability.\n- If the caller asks for a human, offer to take a message and summarize it.\n\nTone: warm, friendly, and pampering. Make callers feel relaxed and excited about their upcoming appointment.",
    suggestedPhrases: [
      "I'd like to book a haircut and blowdry for Saturday.",
      "Do you have availability for a manicure and pedicure tomorrow?",
      "How much is a full set of lash extensions?",
    ],
    suggestedPhrasesByLanguage: {
      es: [
        "Me gustaría reservar un corte de pelo y peinado para el sábado.",
        "¿Tienen disponibilidad para manicura y pedicura mañana?",
        "¿Cuánto cuesta un set completo de extensiones de pestañas?",
      ],
      fr: [
        "J'aimerais réserver une coupe et un brushing pour samedi.",
        "Avez-vous des disponibilités pour une manucure et pédicure demain ?",
        "Combien coûte une pose complète d'extensions de cils ?",
      ],
      de: [
        "Ich möchte für Samstag einen Haarschnitt mit Föhnen buchen.",
        "Haben Sie morgen noch Termine für Maniküre und Pediküre frei?",
        "Wie viel kostet ein komplettes Set Wimpernverlängerungen?",
      ],
      it: [
        "Vorrei prenotare un taglio e piega per sabato.",
        "Avete disponibilità per manicure e pedicure domani?",
        "Quanto costa un set completo di extension ciglia?",
      ],
    },
  },
];

const VOICES: DemoVoice[] = [
  { id: "Savannah", label: "Savannah (friendly)", provider: "vapi" },
  { id: "Rohan", label: "Rohan (warm)", provider: "vapi" },
  { id: "Lily", label: "Lily (natural)", provider: "vapi" },
  { id: "Elliot", label: "Elliot (conversational)", provider: "vapi" },
  { id: "Cole", label: "Cole (professional)", provider: "vapi" },
  { id: "Paige", label: "Paige (clear)", provider: "vapi" },
  {
    id: DEFAULT_ARGENTINA_DEMO_VOICE_ID,
    label: "Valentina (Argentine)",
    provider: "11labs",
    defaultLanguageId: "es",
    enforceLanguage: "es",
    model: "eleven_turbo_v2_5",
  },
  {
    id: "ErXwobaYiN019PkySvjV",
    label: "Antoni (Argentine)",
    provider: "11labs",
    defaultLanguageId: "es",
    enforceLanguage: "es",
    model: "eleven_turbo_v2_5",
  },
  {
    id: "TxGEqnHWrfWFTfGW9XjX",
    label: "Josh (Argentine)",
    provider: "11labs",
    defaultLanguageId: "es",
    enforceLanguage: "es",
    model: "eleven_turbo_v2_5",
  },
  // -- Irish English (ElevenLabs) --
  {
    id: DEFAULT_IRISH_DEMO_VOICE_ID,
    label: "Custom (Irish)",
    provider: "11labs",
    defaultLanguageId: "en",
    enforceLanguage: "en",
    model: "eleven_turbo_v2_5",
  },
  {
    id: "D38z5RcWu1voky8WS1ja",
    label: "Fin (Irish)",
    provider: "11labs",
    defaultLanguageId: "en",
    enforceLanguage: "en",
    model: "eleven_turbo_v2_5",
  },
  {
    id: "bVMeCyTHy58xNoL34h3p",
    label: "Jeremy (Irish)",
    provider: "11labs",
    defaultLanguageId: "en",
    enforceLanguage: "en",
    model: "eleven_turbo_v2_5",
  },
];

interface LiveDemoCallProps {
  trigger?: React.ReactNode;
}

export default function LiveDemoCall({ trigger }: LiveDemoCallProps) {
  const [open, setOpen] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const [selectedVoice, setSelectedVoice] = useState<DemoVoice>(VOICES[0]);
  const [languageId, setLanguageId] = useState<DemoLanguageId>("en");
  const [isCheckingAllowance, setIsCheckingAllowance] = useState(false);
  const [isDemoBlocked, setIsDemoBlocked] = useState(false);
  const [bypassCode, setBypassCode] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vapiRef = useRef<any>(null);
  const hardStopTimeoutRef = useRef<number | null>(null);
  const hangupRequestedRef = useRef(false);
  const languageIdRef = useRef<DemoLanguageId>("en");
  const isAssistantSpeakingRef = useRef(false);

  const scenario = useMemo(() => {
    return SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0];
  }, [scenarioId]);

  const language = useMemo(() => {
    return LANGUAGES.find((l) => l.id === languageId) || LANGUAGES[0];
  }, [languageId]);

  const assistantFirstMessage = useMemo(() => {
    return scenario.firstMessageByLanguage?.[languageId] || scenario.firstMessage;
  }, [languageId, scenario.firstMessage, scenario.firstMessageByLanguage]);

  const suggestedPhrases = useMemo(() => {
    return scenario.suggestedPhrasesByLanguage?.[languageId] || scenario.suggestedPhrases;
  }, [languageId, scenario.suggestedPhrases, scenario.suggestedPhrasesByLanguage]);

  const assistantSystemPrompt = useMemo(() => {
    if (languageId === "en") return scenario.systemPrompt;
    const basePrompt = `${scenario.systemPrompt}\n\nIMPORTANT:\n- Speak to the caller in ${language.label}.\n- Keep the same structure (collect details, confirm back).\n- If the caller switches languages, continue in ${language.label}.`;
    if (languageId !== "es") return basePrompt;

    const argentineStylePrompt = selectedVoice.id === DEFAULT_ARGENTINA_DEMO_VOICE_ID
      ? "\n- Use neutral Argentinian (Rioplatense) Spanish with natural voseo (e.g., queres/tenes)."
      : "";

    return `${basePrompt}\n- Keep a natural LATAM Spanish delivery and avoid English phrasing.${argentineStylePrompt}`;
  }, [language.label, languageId, scenario.systemPrompt, selectedVoice.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    languageIdRef.current = languageId;
  }, [languageId]);

  useEffect(() => {
    isAssistantSpeakingRef.current = isAssistantSpeaking;
  }, [isAssistantSpeaking]);

  useEffect(() => {
    if (!open) return;

    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    if (!publicKey) {
      setCallStatus("error");
      setError("Live demo is not configured (missing Vapi public key).");
      return;
    }

    setCallStatus("loading");
    setError(null);

    import("@vapi-ai/web")
      .then(({ default: Vapi }) => {
        const vapi = new Vapi(publicKey);
        vapiRef.current = vapi;

        vapi.on("call-start", () => {
          setCallStatus("connected");
          setError(null);

          if (hardStopTimeoutRef.current) {
            window.clearTimeout(hardStopTimeoutRef.current);
            hardStopTimeoutRef.current = null;
          }

          // Hard-stop the call to avoid meeting ejection / long-running demo sessions.
          // Give the assistant time to respond; the system prompt also asks it to wrap up.
          hardStopTimeoutRef.current = window.setTimeout(() => {
            if (vapiRef.current) vapiRef.current.stop();
            setCallStatus("ended");
          }, 90_000);
        });

        vapi.on("call-end", () => {
          setCallStatus("ended");
          setIsAssistantSpeaking(false);
          isAssistantSpeakingRef.current = false;
          setVolumeLevel(0);
          hangupRequestedRef.current = false;
          if (hardStopTimeoutRef.current) {
            window.clearTimeout(hardStopTimeoutRef.current);
            hardStopTimeoutRef.current = null;
          }
        });

        vapi.on("speech-start", () => {
          isAssistantSpeakingRef.current = true;
          setIsAssistantSpeaking(true);
        });

        vapi.on("speech-end", () => {
          isAssistantSpeakingRef.current = false;
          setIsAssistantSpeaking(false);
          if (hangupRequestedRef.current && vapiRef.current) {
            hangupRequestedRef.current = false;
            vapiRef.current.stop();
            setCallStatus("ended");
          }
        });

        vapi.on("volume-level", (level: number) => {
          setVolumeLevel(level);
        });

        vapi.on(
          "message",
          (message: { type: string; role?: string; transcript?: string; transcriptType?: string }) => {
            if (message.type === "transcript" && message.transcriptType === "final" && message.transcript) {
              const transcriptText = coerceTranscript(message.transcript);
              if (!transcriptText) return;
              const role = message.role === "user" ? "user" : "assistant";

              if (role === "user" && shouldHangUpForUserUtterance(languageIdRef.current, transcriptText)) {
                hangupRequestedRef.current = true;

                // If the assistant isn't speaking, end shortly after.
                // If it is speaking, we'll end on the next speech-end event.
                window.setTimeout(() => {
                  if (hangupRequestedRef.current && !isAssistantSpeakingRef.current && vapiRef.current) {
                    hangupRequestedRef.current = false;
                    vapiRef.current.stop();
                    setCallStatus("ended");
                  }
                }, 2_000);
              }

              setMessages((prev) => [
                ...prev.slice(-29),
                { role, content: transcriptText, timestamp: new Date() },
              ]);
            }
          }
        );

        vapi.on("error", (err: unknown) => {
          const fallback = "An error occurred during the demo call.";
          let errorMessage = fallback;

          if (err && typeof err === "object") {
            const vapiError = err as Record<string, unknown>;

            // Handle nested error object
            if (vapiError.error && typeof vapiError.error === "object") {
              errorMessage = safeErrorMessage(
                (vapiError.error as Record<string, unknown>).message,
                fallback
              );
            } else if (vapiError.message !== undefined) {
              errorMessage = safeErrorMessage(vapiError.message, fallback);
            } else if (vapiError.type === "start-method-error") {
              errorMessage = "Failed to start the demo call. Check microphone permissions and try again.";
            }
          }

          setError(errorMessage);
          setCallStatus("error");
        });

        setCallStatus("idle");
      })
      .catch(() => {
        setCallStatus("error");
        setError("Failed to load the live demo. Please refresh and try again.");
      });

    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
        vapiRef.current = null;
      }
      hangupRequestedRef.current = false;
      if (hardStopTimeoutRef.current) {
        window.clearTimeout(hardStopTimeoutRef.current);
        hardStopTimeoutRef.current = null;
      }
    };
  }, [open]);

  const startCall = useCallback(async () => {
    if (!vapiRef.current) {
      setError("Live demo is still loading. Please try again.");
      return;
    }

    try {
      setIsDemoBlocked(false);
      setCallStatus("connecting");
      setError(null);
      setMessages([]);
      setIsMuted(false);

      trackEvent("demo_call_started", { scenario: scenario.id, voice: selectedVoice.label, language: languageId });

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (apiUrl) {
        setIsCheckingAllowance(true);
        try {
          const res = await fetch(`${apiUrl.replace(/\/$/, "")}/api/public/live-demo/allow`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bypassCode: bypassCode.trim() || undefined }),
          });
          const data = (await res.json().catch(() => null)) as
            | { allowed: boolean; remaining?: number; resetAt?: string; bypassed?: boolean }
            | null;

          if (data && data.allowed === false) {
            setIsDemoBlocked(true);
            setCallStatus("idle");
            setError("Live demo limit reached (2 calls per IP). Book a demo to try a full-length call.");
            return;
          }
        } catch {
          // If the allow-check fails, don't block the demo (best-effort).
        } finally {
          setIsCheckingAllowance(false);
        }
      }

      const assistantConfig: Record<string, unknown> = {
        name: `VoiceFleet Demo - ${scenario.label}`,
        firstMessage: assistantFirstMessage,
        firstMessageMode: "assistant-speaks-first",
        backgroundSound: "office",
        maxDurationSeconds: 90,
        voice: selectedVoice.provider === "11labs"
          ? {
              provider: "11labs",
              voiceId: selectedVoice.id,
              model: selectedVoice.model || "eleven_turbo_v2_5",
              language: selectedVoice.enforceLanguage || languageId,
              stability: 0.55,
              similarityBoost: 0.8,
              style: 0,
              useSpeakerBoost: true,
              optimizeStreamingLatency: 2,
            }
          : { provider: "vapi", voiceId: selectedVoice.id },
        model: {
          provider: "openai",
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `${assistantSystemPrompt}\n\nDemo constraint:\n- This demo call is limited to 90 seconds. If time is nearly up, politely say goodbye and end the call.`,
            },
          ],
        },
      };

      if (language.transcriberLanguage) {
        assistantConfig.transcriber = {
          provider: "deepgram",
          model: "nova-2",
          language: language.transcriberLanguage,
        };
      }

      try {
        await vapiRef.current.start(assistantConfig);
      } catch (startErr: unknown) {
        // If an 11labs custom voice failed, retry with a Vapi native fallback
        if (selectedVoice.provider === "11labs") {
          console.warn("[Demo] 11labs voice failed, falling back to Vapi voice:", startErr);
          assistantConfig.voice = { provider: "vapi", voiceId: "Savannah" };
          await vapiRef.current.start(assistantConfig);
        } else {
          throw startErr;
        }
      }
    } catch (err: unknown) {
      const fallback = "Failed to start the demo. Please allow microphone access and try again.";
      let errorMessage = fallback;

      if (err && typeof err === "object") {
        const e = err as Record<string, unknown>;
        if (e.error && typeof e.error === "object") {
          errorMessage = safeErrorMessage(
            (e.error as Record<string, unknown>).message,
            fallback
          );
        } else if (e.message !== undefined) {
          errorMessage = safeErrorMessage(e.message, fallback);
        }
      }

      setError(errorMessage);
      setCallStatus("error");
      setIsCheckingAllowance(false);
    }
  }, [assistantFirstMessage, assistantSystemPrompt, bypassCode, language.transcriberLanguage, languageId, scenario.label, selectedVoice]);

  const endCall = useCallback(() => {
    if (vapiRef.current) vapiRef.current.stop();
    setCallStatus("ended");
    hangupRequestedRef.current = false;
    if (hardStopTimeoutRef.current) {
      window.clearTimeout(hardStopTimeoutRef.current);
      hardStopTimeoutRef.current = null;
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (!vapiRef.current) return;
    const newMuted = !isMuted;
    vapiRef.current.setMuted(newMuted);
    setIsMuted(newMuted);
  }, [isMuted]);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next && (callStatus === "connected" || callStatus === "connecting")) {
        endCall();
      }
      if (!next) {
        setError(null);
        setMessages([]);
        setIsMuted(false);
        setIsAssistantSpeaking(false);
        setVolumeLevel(0);
        setCallStatus("idle");
        setIsCheckingAllowance(false);
        setIsDemoBlocked(false);
        setBypassCode("");
        hangupRequestedRef.current = false;
        if (hardStopTimeoutRef.current) {
          window.clearTimeout(hardStopTimeoutRef.current);
          hardStopTimeoutRef.current = null;
        }
      }
      setOpen(next);
    },
    [callStatus, endCall]
  );

  const copyPhrase = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // no-op
    }
  }, []);

  return (
    <>
      {trigger ? (
        <div
          role="button"
          tabIndex={0}
          onClick={() => { setOpen(true); trackEvent("demo_opened", { location: "trigger" }); }}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { setOpen(true); trackEvent("demo_opened", { location: "trigger" }); } }}
        >
          {trigger}
        </div>
      ) : (
        <Button variant="outline" size="xl" onClick={() => { setOpen(true); trackEvent("demo_opened", { location: "hero" }); }}>
          <Sparkles className="w-5 h-5" />
          Try Live Demo
        </Button>
      )}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Try a live demo call</DialogTitle>
            <DialogDescription>
              Talk to an AI receptionist in your browser (microphone required). This is a demo — no real bookings are
              created. Calls are limited to 90 seconds and will end automatically.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}{" "}
              {isDemoBlocked && (
                <a
                  href="https://calendly.com/voicefleet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-semibold"
                >
                  Book a demo
                </a>
              )}
            </div>
          )}

          {isDemoBlocked && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={bypassCode}
                onChange={(e) => setBypassCode(e.target.value.toUpperCase())}
                placeholder="Enter access code"
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={startCall}
                disabled={!bypassCode.trim()}
              >
                Try Code
              </Button>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Scenario</label>
              <select
                value={scenarioId}
                onChange={(e) => setScenarioId(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                disabled={callStatus === "connecting" || callStatus === "connected"}
              >
                {SCENARIOS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Voice</label>
              <select
                value={selectedVoice.id}
                onChange={(e) => {
                  const voice = VOICES.find((v) => v.id === e.target.value);
                  if (voice) {
                    setSelectedVoice(voice);
                    if (voice.defaultLanguageId && voice.defaultLanguageId !== languageId) {
                      setLanguageId(voice.defaultLanguageId);
                    }
                  }
                }}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                disabled={callStatus === "connecting" || callStatus === "connected"}
              >
                {VOICES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Language</label>
              <select
                value={languageId}
                onChange={(e) => setLanguageId(e.target.value as DemoLanguageId)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                disabled={callStatus === "connecting" || callStatus === "connected"}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-muted-foreground">Use the sample phrases below for the best demo.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-muted/30 p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
                    callStatus === "connected"
                      ? "bg-accent/10 border-accent/20"
                      : callStatus === "connecting"
                      ? "bg-primary/10 border-primary/20"
                      : "bg-background border-border"
                  }`}
                >
                  {callStatus === "connected" ? (
                    <Mic className={`w-5 h-5 ${isAssistantSpeaking ? "text-accent" : "text-muted-foreground"}`} />
                  ) : callStatus === "connecting" ? (
                    <Phone className="w-5 h-5 text-primary" />
                  ) : callStatus === "ended" ? (
                    <PhoneOff className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Phone className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {callStatus === "loading" && "Loading voice system..."}
                    {callStatus === "idle" && "Ready"}
                    {callStatus === "connecting" && "Connecting..."}
                    {callStatus === "connected" && (isAssistantSpeaking ? "Assistant speaking..." : "Listening...")}
                    {callStatus === "ended" && "Call ended"}
                    {callStatus === "error" && "Call failed"}
                  </p>
                  <p className="text-xs text-muted-foreground">{scenario.businessName} demo receptionist</p>
                </div>
              </div>

              {callStatus === "connected" && (
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                  <div className="w-24 h-2 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all"
                      style={{ width: `${Math.min(Math.max(volumeLevel * 100, 0), 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">Try saying:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedPhrases.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => copyPhrase(p)}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {p}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Click a phrase to copy.</p>
            </div>
          </div>

          {messages.length > 0 && (
            <div className="max-h-56 overflow-y-auto rounded-2xl border border-border bg-background p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Transcript</span>
              </div>
              <div className="space-y-3">
                {messages.map((m, idx) => (
                  <div key={idx} className="text-sm">
                    <span className="font-semibold text-foreground">
                      {m.role === "user" ? "You" : "Receptionist"}:
                    </span>{" "}
                    <span className="text-muted-foreground">{m.content}</span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            {callStatus === "connected" || callStatus === "connecting" ? (
              <>
                <Button
                  className="w-full sm:w-auto"
                  variant="outline"
                  onClick={toggleMute}
                  disabled={callStatus !== "connected"}
                >
                  {isMuted ? (
                    <>
                      <MicOff className="w-4 h-4" />
                      Unmute
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      Mute
                    </>
                  )}
                </Button>
                <Button
                  className="w-full sm:w-auto border-destructive/30 text-destructive hover:bg-destructive/10"
                  variant="outline"
                  onClick={endCall}
                >
                  <PhoneOff className="w-4 h-4" />
                  End call
                </Button>
              </>
            ) : (
              <Button className="w-full sm:w-auto" variant="hero" onClick={startCall} disabled={callStatus === "loading" || isCheckingAllowance || isDemoBlocked}>
                <Phone className="w-4 h-4" />
                {isCheckingAllowance ? "Starting..." : callStatus === "error" || callStatus === "ended" ? "Try again" : "Start demo call"}
              </Button>
            )}
          </DialogFooter>

          <div className="rounded-xl bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
            Tip: if your mic is blocked, click the lock icon in your browser address bar and allow microphone access.
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
