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

type DemoScenario = {
  id: string;
  label: string;
  businessName: string;
  firstMessage: string;
  systemPrompt: string;
  suggestedPhrases: string[];
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

const SCENARIOS: DemoScenario[] = [
  {
    id: "restaurant-reservation",
    label: "Restaurant reservation",
    businessName: "Harbor Bistro",
    firstMessage:
      "Hi, thanks for calling Harbor Bistro. This is the AI receptionist. How can I help today?",
    systemPrompt:
      "You are the AI phone receptionist for Harbor Bistro, a busy small restaurant.\n\nGoals:\n- Help callers book or change a reservation.\n- Ask for: name, party size, date, time, and a contact number.\n- Confirm details back clearly.\n- Answer common questions (opening hours, location, dietary notes).\n\nConstraints (demo mode):\n- Do NOT claim you actually checked a real calendar or created a real reservation.\n- Instead say you are taking a reservation request for this demo and would send confirmation in the real product.\n- If the caller asks for a human, offer to take a message and summarize it.\n\nTone: friendly, concise, professional.",
    suggestedPhrases: [
      "Hi, I'd like to book a table for 4 tomorrow around 7pm.",
      "What time do you close on Sunday?",
      "Can you note a gluten allergy on the booking?",
    ],
  },
  {
    id: "dentist-appointment",
    label: "Dentist appointment",
    businessName: "BrightSmile Dental",
    firstMessage:
      "Hello, you've reached BrightSmile Dental. This is the AI receptionist. How can I help?",
    systemPrompt:
      "You are the AI phone receptionist for BrightSmile Dental.\n\nGoals:\n- Help callers book, reschedule, or cancel appointments.\n- Ask for: patient name, reason for visit, preferred day/time, phone number.\n- For emergencies, gather symptoms and suggest urgent escalation.\n\nConstraints (demo mode):\n- Do NOT provide medical advice beyond basic triage and escalation.\n- Do NOT claim to access patient records.\n- Do NOT claim you booked a real slot; treat it as a demo booking request.\n\nTone: calm, reassuring, professional.",
    suggestedPhrases: [
      "I'd like to book a cleaning next week.",
      "I need to reschedule my appointment.",
      "I have severe tooth pain - can I be seen today?",
    ],
  },
  {
    id: "gym-membership",
    label: "Gym booking / class",
    businessName: "Northside Fitness",
    firstMessage:
      "Hi, thanks for calling Northside Fitness. This is the AI receptionist. What can I do for you?",
    systemPrompt:
      "You are the AI phone receptionist for Northside Fitness (a local gym).\n\nGoals:\n- Help callers book a class or intro session, and answer membership questions.\n- Ask for: name, class type, preferred time, and contact number.\n- Confirm details.\n\nConstraints (demo mode):\n- Do NOT claim you checked live availability.\n- Treat it as a demo booking request.\n\nTone: upbeat, helpful, concise.",
    suggestedPhrases: [
      "Can I book a beginner class this weekend?",
      "What are your membership prices?",
      "Do you have personal training available?",
    ],
  },
  {
    id: "plumber-callout",
    label: "Plumber emergency call-out",
    businessName: "RapidFlow Plumbing",
    firstMessage:
      "Hello, RapidFlow Plumbing. This is the AI receptionist. What's going on today?",
    systemPrompt:
      "You are the AI phone receptionist for RapidFlow Plumbing.\n\nGoals:\n- Qualify emergency vs non-emergency.\n- Ask for: name, address/area, issue description, urgency, and callback number.\n- If urgent (active leak, no heat in winter, flooding), offer to escalate and confirm best contact method.\n\nConstraints (demo mode):\n- Do NOT claim a technician is dispatched.\n- Treat it as a demo intake; summarize details and suggest escalation.\n\nTone: direct, reassuring, efficient.",
    suggestedPhrases: [
      "I have a leak under the kitchen sink - can someone come out today?",
      "My boiler stopped working - what's the next step?",
      "Can I get a rough quote for a tap replacement?",
    ],
  },
];

const VOICES: Array<{ id: VapiVoiceId; label: string }> = [
  { id: "Savannah", label: "Savannah (friendly)" },
  { id: "Rohan", label: "Rohan (warm)" },
  { id: "Lily", label: "Lily (natural)" },
  { id: "Elliot", label: "Elliot (conversational)" },
  { id: "Cole", label: "Cole (professional)" },
  { id: "Paige", label: "Paige (clear)" },
];

export default function LiveDemoCall() {
  const [open, setOpen] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const [voiceId, setVoiceId] = useState<VapiVoiceId>(VOICES[0].id);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vapiRef = useRef<any>(null);

  const scenario = useMemo(() => {
    return SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0];
  }, [scenarioId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
        });

        vapi.on("call-end", () => {
          setCallStatus("ended");
          setIsAssistantSpeaking(false);
          setVolumeLevel(0);
        });

        vapi.on("speech-start", () => {
          setIsAssistantSpeaking(true);
        });

        vapi.on("speech-end", () => {
          setIsAssistantSpeaking(false);
        });

        vapi.on("volume-level", (level: number) => {
          setVolumeLevel(level);
        });

        vapi.on(
          "message",
          (message: { type: string; role?: string; transcript?: string; transcriptType?: string }) => {
            if (message.type === "transcript" && message.transcriptType === "final" && message.transcript) {
              const role = message.role === "user" ? "user" : "assistant";
              setMessages((prev) => [
                ...prev,
                { role, content: message.transcript!, timestamp: new Date() },
              ]);
            }
          }
        );

        vapi.on("error", (err: unknown) => {
          let errorMessage = "An error occurred during the demo call.";
          if (err && typeof err === "object") {
            const vapiError = err as { message?: string; error?: { message?: string }; type?: string };
            if (vapiError.error?.message) errorMessage = vapiError.error.message;
            else if (vapiError.message) errorMessage = vapiError.message;
            else if (vapiError.type === "start-method-error") {
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
    };
  }, [open]);

  const startCall = useCallback(async () => {
    if (!vapiRef.current) {
      setError("Live demo is still loading. Please try again.");
      return;
    }

    try {
      setCallStatus("connecting");
      setError(null);
      setMessages([]);
      setIsMuted(false);

      await vapiRef.current.start({
        name: `VoiceFleet Demo - ${scenario.label}`,
        firstMessage: scenario.firstMessage,
        firstMessageMode: "assistant-speaks-first",
        backgroundSound: "office",
        maxDurationSeconds: 240,
        voice: { provider: "vapi", voiceId },
        model: {
          provider: "openai",
          model: "gpt-4o-mini",
          messages: [{ role: "system", content: scenario.systemPrompt }],
        },
      });
    } catch (err: unknown) {
      let errorMessage = "Failed to start the demo. Please allow microphone access and try again.";
      if (err && typeof err === "object") {
        const e = err as { message?: string; error?: { message?: string } };
        if (e.error?.message) errorMessage = e.error.message;
        else if (e.message) errorMessage = e.message;
      }
      setError(errorMessage);
      setCallStatus("error");
    }
  }, [scenario.firstMessage, scenario.label, scenario.systemPrompt, voiceId]);

  const endCall = useCallback(() => {
    if (vapiRef.current) vapiRef.current.stop();
    setCallStatus("ended");
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
      <Button variant="outline" size="xl" onClick={() => setOpen(true)}>
        <Sparkles className="w-5 h-5" />
        Try Live Demo
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Try a live demo call</DialogTitle>
            <DialogDescription>
              Talk to an AI receptionist in your browser (microphone required). This is a demo - no real bookings are
              created.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
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
                value={voiceId}
                onChange={(e) => setVoiceId(e.target.value as VapiVoiceId)}
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
                {scenario.suggestedPhrases.map((p) => (
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
                <Button variant="outline" onClick={toggleMute} disabled={callStatus !== "connected"}>
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
                <Button variant="outline" onClick={endCall} className="border-destructive/30 text-destructive hover:bg-destructive/10">
                  <PhoneOff className="w-4 h-4" />
                  End call
                </Button>
              </>
            ) : (
              <Button variant="hero" onClick={startCall} disabled={callStatus === "loading"}>
                <Phone className="w-4 h-4" />
                {callStatus === "error" || callStatus === "ended" ? "Try again" : "Start demo call"}
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
