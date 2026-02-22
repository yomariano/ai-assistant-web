"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  CheckCircle2,
  Copy,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/umami";
import type {
  Booking,
  CallStatus,
  DemoLanguageId,
  DemoScenario,
  TranscriptMessage,
} from "@/lib/demo/types";
import { DEMO_LANGUAGES, formatDate, getWeekStart } from "@/lib/demo/calendar-utils";

type DemoVoice = {
  id: string;
  label: string;
  provider: "vapi" | "11labs";
  defaultLanguageId?: DemoLanguageId;
  enforceLanguage?: string;
  model?: string;
};

const DEFAULT_ARGENTINA_VOICE_ID =
  process.env.NEXT_PUBLIC_DEMO_ARGENTINA_VOICE_ID || "1709f1e8-d660-4e22-b253-158ccf68bf0a";
const DEFAULT_IRISH_VOICE_ID =
  process.env.NEXT_PUBLIC_DEMO_IRISH_VOICE_ID || "f1dbef4d-b259-4549-90d0-912478492273";

const DEMO_VOICES: DemoVoice[] = [
  // -- Vapi native (English, all accents) --
  { id: "Elliot", label: "Elliot (conversational)", provider: "vapi" },
  { id: "Savannah", label: "Savannah (friendly)", provider: "vapi" },
  { id: "Rohan", label: "Rohan (warm)", provider: "vapi" },
  { id: "Lily", label: "Lily (natural)", provider: "vapi" },
  { id: "Cole", label: "Cole (professional)", provider: "vapi" },
  { id: "Paige", label: "Paige (clear)", provider: "vapi" },
  // -- Argentine Spanish (ElevenLabs) --
  {
    id: DEFAULT_ARGENTINA_VOICE_ID,
    label: "Valentina (Argentina)",
    provider: "11labs",
    defaultLanguageId: "es",
    enforceLanguage: "es",
    model: "eleven_turbo_v2_5",
  },
  {
    id: "ErXwobaYiN019PkySvjV",
    label: "Antoni (Argentina)",
    provider: "11labs",
    defaultLanguageId: "es",
    enforceLanguage: "es",
    model: "eleven_turbo_v2_5",
  },
  {
    id: "TxGEqnHWrfWFTfGW9XjX",
    label: "Josh (Argentina)",
    provider: "11labs",
    defaultLanguageId: "es",
    enforceLanguage: "es",
    model: "eleven_turbo_v2_5",
  },
  // -- Irish English (ElevenLabs) --
  {
    id: DEFAULT_IRISH_VOICE_ID,
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

function coerceTranscript(value: unknown): string | null {
  if (typeof value === "string") return value.trim() ? value : null;
  if (value == null) return null;
  if (typeof value === "object") {
    const maybe = value as Record<string, unknown>;
    if (typeof maybe.text === "string" && maybe.text.trim()) return maybe.text;
  }
  const asString = String(value);
  return asString.trim() ? asString : null;
}

function safeErrorMessage(value: unknown, fallback: string): string {
  if (typeof value === "string" && value.trim()) return value;
  if (value == null) return fallback;
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (typeof obj.msg === "string" && obj.msg.trim()) return obj.msg;
    if (typeof obj.message === "string" && obj.message.trim()) return obj.message;
    if (typeof obj.error === "string" && obj.error.trim()) return obj.error;
  }
  return fallback;
}

/** Encode availability as compact URL param (lossless, per-slot).
 *  Format: "0223.1100.1130.1300.1330,0224.1100.1130.1200..."
 *  Each date is MMDD followed by dot-separated HHMM time slots.
 *  Days are comma-separated. Preserves gaps (e.g., missing 12:00 slot). */
function encodeCompactAvailability(availability: Record<string, boolean>): string {
  const dateSlots: Record<string, string[]> = {};
  for (const [key, avail] of Object.entries(availability)) {
    if (!avail) continue;
    const [date, time] = key.split("_");
    if (!dateSlots[date]) dateSlots[date] = [];
    dateSlots[date].push(time);
  }
  const parts: string[] = [];
  for (const [date, times] of Object.entries(dateSlots)) {
    times.sort();
    const [, mm, dd] = date.split("-");
    const timeStrs = times.map((t) => t.replace(":", ""));
    parts.push(`${mm}${dd}.${timeStrs.join(".")}`);
  }
  return parts.sort().join(",");
}

function shouldHangUpForUserUtterance(languageId: DemoLanguageId, utterance: string): boolean {
  const text = utterance.toLowerCase().trim();
  if (!text) return false;
  const patternsByLanguage: Record<DemoLanguageId, RegExp[]> = {
    en: [/\bbye\b/i, /\bgoodbye\b/i, /\bsee you\b/i, /\bthank(s| you).*(bye|goodbye)\b/i],
    es: [/\bad(i|í)os\b/i, /\bhasta luego\b/i, /\bhasta pronto\b/i, /\bchao\b/i],
    fr: [/\bau revoir\b/i, /\bà bient(ô|o)t\b/i, /\bmerci.*(au revoir|bye)\b/i],
    de: [/\btsch(ü|u)ss\b/i, /\bauf wiedersehen\b/i, /\bbis bald\b/i],
    it: [/\barrivederci\b/i, /\ba presto\b/i, /\bgrazie.*(ciao|arrivederci)\b/i],
  };
  const patterns = patternsByLanguage[languageId] || patternsByLanguage.en;
  return patterns.some((re) => re.test(text));
}

type DemoCallPanelProps = {
  scenario: DemoScenario;
  demoSessionId: string;
  availability: Record<string, boolean>;
  languageId: DemoLanguageId;
  onLanguageChange: (id: DemoLanguageId) => void;
  onBookingCreated: (booking: Booking) => void;
  onHighlightDate: (date: string | null) => void;
};

export default function DemoCallPanel({
  scenario,
  demoSessionId,
  availability,
  languageId,
  onLanguageChange,
  onBookingCreated,
  onHighlightDate,
}: DemoCallPanelProps) {
  const [selectedVoice, setSelectedVoice] = useState<DemoVoice>(DEMO_VOICES[0]);
  const [callStatus, setCallStatus] = useState<CallStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);
  const [isDemoBlocked, setIsDemoBlocked] = useState(false);
  const [bypassCode, setBypassCode] = useState("");
  const [isCheckingAllowance, setIsCheckingAllowance] = useState(false);
  const callStartTimeRef = useRef<number>(0);
  const bookingCountRef = useRef<number>(0);

  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vapiRef = useRef<any>(null);
  const hardStopTimeoutRef = useRef<number | null>(null);
  const hangupRequestedRef = useRef(false);
  const languageIdRef = useRef<DemoLanguageId>(languageId);
  const isAssistantSpeakingRef = useRef(false);

  const language = useMemo(
    () => DEMO_LANGUAGES.find((l) => l.id === languageId) || DEMO_LANGUAGES[0],
    [languageId]
  );

  const assistantFirstMessage = useMemo(
    () => scenario.firstMessageByLanguage?.[languageId] || scenario.firstMessage,
    [languageId, scenario]
  );

  const suggestedPhrases = useMemo(
    () => scenario.suggestedPhrasesByLanguage?.[languageId] || scenario.suggestedPhrases,
    [languageId, scenario]
  );

  // Build date reference table and availability summary for the AI
  const { dateReference, availableDays, unavailableDays } = useMemo(() => {
    const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Generate all 7 days of the week (Mon-Sun) so we know about EVERY day
    const weekStart = getWeekStart();
    const allWeekDates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      allWeekDates.push(formatDate(d));
    }

    // Find which dates have at least one available slot
    const datesWithSlots = new Set<string>();
    for (const [key, avail] of Object.entries(availability)) {
      if (avail) datesWithSlots.add(key.split("_")[0]);
    }

    const formatDateLabel = (date: string) => {
      const d = new Date(date + "T12:00:00");
      return `${DAY_NAMES[d.getDay()]} ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`;
    };

    // Build date reference: "Monday = February 16 (2026-02-16)"
    const dateRef = allWeekDates.map((date) => {
      const d = new Date(date + "T12:00:00");
      return `- ${DAY_NAMES[d.getDay()]} = ${MONTH_NAMES[d.getMonth()]} ${d.getDate()} (${date})`;
    }).join("\n");

    const available = allWeekDates.filter((d) => datesWithSlots.has(d)).map(formatDateLabel);
    const unavailable = allWeekDates.filter((d) => !datesWithSlots.has(d)).map(formatDateLabel);

    return {
      dateReference: dateRef,
      availableDays: available.length > 0 ? available.join(", ") : "None",
      unavailableDays: unavailable.length > 0 ? unavailable.join(", ") : "None",
    };
  }, [availability]);

  const assistantSystemPrompt = useMemo(() => {
    const now = new Date();
    const todayStr = formatDate(now);
    const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][now.getDay()];
    const monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][now.getMonth()];
    const todayFull = `${dayName}, ${monthName} ${now.getDate()}, ${now.getFullYear()} (${todayStr})`;
    const toolInstructions = [
      `\n\nToday is ${todayFull}.`,
      `\nDATE REFERENCE (use this to convert day names to dates):`,
      dateReference,
      `\nDays WITH availability: ${availableDays}`,
      `Days with NO availability (closed/fully booked): ${unavailableDays}`,
      `\nIMPORTANT RULES:`,
      `- You do NOT know specific time slots. You MUST call the check_availability tool to get available times for any date. NEVER guess or make up time slots.`,
      `- When the caller mentions a day name (e.g. "Saturday"), use the date reference above to find the correct YYYY-MM-DD date. Double-check the mapping before calling the tool.`,
      `- If the caller asks about a day listed under "NO availability", tell them immediately that date is unavailable and suggest days from the "WITH availability" list.`,
      `- When the caller mentions a specific date or time they want, call check_availability IMMEDIATELY. Do NOT ask for their name or other details first — check availability first, then collect remaining info after.`,
      `- Use the create_booking tool to confirm appointments (required: date YYYY-MM-DD, time HH:MM 24h, customerName).`,
      `\nVOICE RULES:`,
      `- Summarize availability as time ranges (e.g. "We have openings from 9 AM to 4 PM"), never list individual slots.`,
      `- When calling a tool, say ONE short phrase like "Let me check that for you" then wait silently. Do NOT repeat filler phrases.`,
      `- After getting tool results, respond naturally with the summary.`,
    ].join("\n");
    const base = scenario.systemPrompt + toolInstructions;
    if (languageId === "en") return base;
    return `${base}\n\nIMPORTANT:\n- Speak to the caller in ${language.label}.\n- Keep the same structure (collect details, confirm back).\n- If the caller switches languages, continue in ${language.label}.`;
  }, [dateReference, availableDays, unavailableDays, language.label, languageId, scenario.systemPrompt]);

  useEffect(() => {
    const container = transcriptContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    languageIdRef.current = languageId;
  }, [languageId]);

  useEffect(() => {
    isAssistantSpeakingRef.current = isAssistantSpeaking;
  }, [isAssistantSpeaking]);

  // Initialize Vapi SDK
  useEffect(() => {
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
          callStartTimeRef.current = Date.now();
          bookingCountRef.current = 0;
          trackEvent("demo_call_connected", { scenario: scenario.id });
          if (hardStopTimeoutRef.current) {
            window.clearTimeout(hardStopTimeoutRef.current);
          }
          hardStopTimeoutRef.current = window.setTimeout(() => {
            if (vapiRef.current) vapiRef.current.stop();
            setCallStatus("ended");
          }, 180_000);
        });

        vapi.on("call-end", () => {
          setCallStatus("ended");
          setIsAssistantSpeaking(false);
          isAssistantSpeakingRef.current = false;
          setVolumeLevel(0);
          hangupRequestedRef.current = false;
          onHighlightDate(null);
          const durationSec = callStartTimeRef.current
            ? Math.round((Date.now() - callStartTimeRef.current) / 1000)
            : 0;
          trackEvent("demo_call_ended", {
            duration_seconds: durationSec,
            bookings: bookingCountRef.current,
            scenario: scenario.id,
          });
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

        vapi.on("message", (message: Record<string, unknown>) => {
          // Handle transcript messages
          if (
            message.type === "transcript" &&
            message.transcriptType === "final" &&
            message.transcript
          ) {
            const transcriptText = coerceTranscript(message.transcript);
            if (!transcriptText) return;
            const role = message.role === "user" ? "user" : "assistant";

            if (role === "user" && shouldHangUpForUserUtterance(languageIdRef.current, transcriptText)) {
              hangupRequestedRef.current = true;
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

          // Handle tool-calls event — highlight calendar + optimistic booking
          if (message.type === "tool-calls") {
            const toolCalls = message.toolCalls as Array<{
              function?: { name?: string; arguments?: unknown };
            }> | undefined;
            if (toolCalls) {
              for (const tc of toolCalls) {
                const args =
                  typeof tc.function?.arguments === "string"
                    ? JSON.parse(tc.function.arguments)
                    : tc.function?.arguments || {};

                if (tc.function?.name === "check_availability") {
                  if (args.date) onHighlightDate(args.date);
                }

                // Optimistic booking: add to calendar from tool call args.
                // If tool-calls-result also fires with data, bookingMap
                // deduplicates by slot key so no visual double-up.
                if (tc.function?.name === "create_booking" && args.date && args.time) {
                  bookingCountRef.current += 1;
                  trackEvent("demo_booking_created", {
                    scenario: scenario.id,
                    booking_number: bookingCountRef.current,
                  });
                  onBookingCreated({
                    date: args.date,
                    time: args.time,
                    customerName: args.customerName || "Guest",
                    service: args.service,
                    notes: args.notes,
                    createdAt: Date.now(),
                  });
                }
              }
            }
          }

          // Handle tool-calls-result event — add booking to calendar in real-time
          if (message.type === "tool-calls-result") {
            onHighlightDate(null);
            const results = message.toolCallResult as Array<{
              result?: string;
            }> | undefined;
            // Also check message.results (Vapi can send in either format)
            const resultArray = results || (message.results as Array<{ result?: string }> | undefined);
            if (resultArray) {
              for (const r of resultArray) {
                try {
                  const parsed = typeof r.result === "string" ? JSON.parse(r.result) : r.result;
                  if (parsed?.success && parsed?.booking) {
                    onBookingCreated(parsed.booking as Booking);
                  }
                } catch {
                  // ignore parse errors
                }
              }
            }
          }
        });

        vapi.on("error", (err: unknown) => {
          const fallback = "An error occurred during the demo call.";
          let errorMessage = fallback;
          if (err && typeof err === "object") {
            const vapiError = err as Record<string, unknown>;
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
          trackEvent("demo_call_error", { error: errorMessage.slice(0, 100) });
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

      trackEvent("demo_call_started", { scenario: scenario.id, voice: selectedVoice.label, language: languageId, type: "booking" });

      // Rate limit check
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (apiUrl) {
        setIsCheckingAllowance(true);
        try {
          const res = await fetch(
            `${apiUrl.replace(/\/$/, "")}/api/public/live-demo/allow`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ bypassCode: bypassCode.trim() || undefined }),
            }
          );
          const data = (await res.json().catch(() => null)) as {
            allowed: boolean;
          } | null;
          if (data && data.allowed === false) {
            setIsDemoBlocked(true);
            setCallStatus("idle");
            setError("Live demo limit reached (10 calls per IP). Book a demo to try a full-length call.");
            trackEvent("demo_call_blocked", { reason: "rate_limit" });
            return;
          }
        } catch {
          // best-effort
        } finally {
          setIsCheckingAllowance(false);
        }
      }

      // Encode availability as compact URL param so tool server can reconstruct
      // even after server restart (in-memory sessions are lost on redeploy)
      const compactAvail = encodeCompactAvailability(availability);
      const toolServerUrl = apiUrl
        ? `${apiUrl.replace(/\/$/, "")}/api/public/demo-tools?sid=${encodeURIComponent(demoSessionId)}&av=${encodeURIComponent(compactAvail)}&sc=${encodeURIComponent(scenario.id)}&bn=${encodeURIComponent(scenario.businessName)}`
        : "";

      const assistantConfig: Record<string, unknown> = {
        name: `VoiceFleet Demo - ${scenario.label}`,
        firstMessage: assistantFirstMessage,
        firstMessageMode: "assistant-speaks-first",
        backgroundSound: "office",
        maxDurationSeconds: 180,
        clientMessages: [
          "transcript",
          "hang",
          "tool-calls",
          "tool-calls-result",
          "speech-update",
          "metadata",
          "conversation-update",
        ],
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
          model: "gpt-4.1-mini",
          messages: [
            {
              role: "system",
              content: `${assistantSystemPrompt}\n\nDemo constraint:\n- This demo call is limited to 3 minutes. If time is nearly up, politely say goodbye.`,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "check_availability",
                description:
                  "Check available appointment time slots. If called without a date, returns a summary of ALL dates that have availability. If called with a specific date, returns the detailed time slots for that day.",
                parameters: {
                  type: "object",
                  properties: {
                    date: {
                      type: "string",
                      description: "Optional. The date to check in YYYY-MM-DD format. Omit to get an overview of all dates with availability.",
                    },
                  },
                  required: [],
                },
              },
              server: { url: toolServerUrl },
            },
            {
              type: "function",
              function: {
                name: "create_booking",
                description:
                  "Create a booking/appointment at a specific date and time. Returns a confirmation number.",
                parameters: {
                  type: "object",
                  properties: {
                    date: {
                      type: "string",
                      description: "Booking date in YYYY-MM-DD format",
                    },
                    time: {
                      type: "string",
                      description: "Booking time in HH:MM format (24h)",
                    },
                    customerName: {
                      type: "string",
                      description: "Name of the customer",
                    },
                    service: {
                      type: "string",
                      description: "Type of service or appointment",
                    },
                    notes: {
                      type: "string",
                      description: "Additional notes (e.g. allergies, preferences)",
                    },
                  },
                  required: ["date", "time", "customerName"],
                },
              },
              server: { url: toolServerUrl },
            },
          ],
        },
        metadata: {
          demoSessionId,
          availability,
          scenario: scenario.id,
          businessName: scenario.businessName,
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
  }, [
    assistantFirstMessage,
    assistantSystemPrompt,
    bypassCode,
    demoSessionId,
    language.transcriberLanguage,
    languageId,
    scenario.label,
    selectedVoice,
  ]);

  const endCall = useCallback(() => {
    if (vapiRef.current) vapiRef.current.stop();
    setCallStatus("ended");
    hangupRequestedRef.current = false;
    onHighlightDate(null);
    if (hardStopTimeoutRef.current) {
      window.clearTimeout(hardStopTimeoutRef.current);
      hardStopTimeoutRef.current = null;
    }
  }, [onHighlightDate]);

  const toggleMute = useCallback(() => {
    if (!vapiRef.current) return;
    const newMuted = !isMuted;
    vapiRef.current.setMuted(newMuted);
    setIsMuted(newMuted);
  }, [isMuted]);

  const copyPhrase = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // no-op
    }
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* Scenario header */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {scenario.businessName}
        </span>
      </div>

      {/* Voice + Language pickers */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[11px] font-medium text-muted-foreground mb-1">Voice</label>
          <select
            value={selectedVoice.id}
            onChange={(e) => {
              const voice = DEMO_VOICES.find((v) => v.id === e.target.value);
              if (voice) {
                setSelectedVoice(voice);
                trackEvent("demo_voice_selected", { voice: voice.label });
                if (voice.defaultLanguageId && voice.defaultLanguageId !== languageId) {
                  onLanguageChange(voice.defaultLanguageId);
                }
              }
            }}
            className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            disabled={callStatus === "connecting" || callStatus === "connected"}
          >
            {DEMO_VOICES.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-medium text-muted-foreground mb-1">Language</label>
          <select
            value={languageId}
            onChange={(e) => { const lang = e.target.value as DemoLanguageId; onLanguageChange(lang); trackEvent("demo_language_selected", { language: lang }); }}
            className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            disabled={callStatus === "connecting" || callStatus === "connected" || !!selectedVoice.enforceLanguage}
          >
            {DEMO_LANGUAGES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error */}
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
          <Button variant="outline" size="sm" onClick={startCall} disabled={!bypassCode.trim()}>
            Try Code
          </Button>
        </div>
      )}

      {/* Call status bar */}
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
              <p className="text-xs text-muted-foreground">
                {scenario.businessName} demo receptionist
              </p>
            </div>
          </div>
          {callStatus === "connected" && (
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <div className="w-20 h-2 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all"
                  style={{ width: `${Math.min(Math.max(volumeLevel * 100, 0), 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Suggested phrases */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">Try saying:</p>
        <div className="flex flex-wrap gap-2">
          {suggestedPhrases.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => copyPhrase(p)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
            >
              <Copy className="w-3 h-3" />
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Transcript */}
      {messages.length > 0 && (
        <div ref={transcriptContainerRef} className="max-h-48 overflow-y-auto rounded-2xl border border-border bg-background p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Transcript
            </span>
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

      {/* Call controls */}
      <div className="flex gap-2">
        {callStatus === "connected" || callStatus === "connecting" ? (
          <>
            <Button
              className="flex-1"
              variant="outline"
              onClick={toggleMute}
              disabled={callStatus !== "connected"}
            >
              {isMuted ? (
                <>
                  <MicOff className="w-4 h-4" /> Unmute
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" /> Mute
                </>
              )}
            </Button>
            <Button
              className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/10"
              variant="outline"
              onClick={endCall}
            >
              <PhoneOff className="w-4 h-4" /> End call
            </Button>
          </>
        ) : (
          <Button
            className="w-full"
            variant="hero"
            onClick={startCall}
            disabled={callStatus === "loading" || isCheckingAllowance || isDemoBlocked}
          >
            <Phone className="w-4 h-4" />
            {isCheckingAllowance
              ? "Starting..."
              : callStatus === "error" || callStatus === "ended"
              ? "Try again"
              : "Start demo call"}
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Tip: if your mic is blocked, click the lock icon in your browser address bar and allow microphone access.
      </p>
    </div>
  );
}
