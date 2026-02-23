import type { DemoLanguageId } from "./types";

export type DemoVoice = {
  id: string;
  label: string;
  provider: "vapi" | "11labs";
  defaultLanguageId?: DemoLanguageId;
  enforceLanguage?: string;
  model?: string;
  personality?: string;
};


export const DEMO_VOICES: DemoVoice[] = [
  // -- Vapi native (English, all accents) --
  { id: "Elliot", label: "Elliot", provider: "vapi", personality: "conversational" },
  { id: "Savannah", label: "Savannah", provider: "vapi", personality: "friendly" },
  { id: "Rohan", label: "Rohan", provider: "vapi", personality: "warm" },
  { id: "Lily", label: "Lily", provider: "vapi", personality: "natural" },
  { id: "Cole", label: "Cole", provider: "vapi", personality: "professional" },
  { id: "Paige", label: "Paige", provider: "vapi", personality: "clear" },
  // -- Argentine Spanish (ElevenLabs) --
  {
    id: "ErXwobaYiN019PkySvjV",
    label: "Antoni",
    provider: "11labs",
    defaultLanguageId: "es",
    enforceLanguage: "es",
    model: "eleven_turbo_v2_5",
    personality: "professional",
  },
  {
    id: "TxGEqnHWrfWFTfGW9XjX",
    label: "Josh",
    provider: "11labs",
    defaultLanguageId: "es",
    enforceLanguage: "es",
    model: "eleven_turbo_v2_5",
    personality: "friendly",
  },
  // -- Irish English (ElevenLabs) --
  {
    id: "D38z5RcWu1voky8WS1ja",
    label: "Fin",
    provider: "11labs",
    defaultLanguageId: "en",
    enforceLanguage: "en",
    model: "eleven_turbo_v2_5",
    personality: "conversational",
  },
  {
    id: "bVMeCyTHy58xNoL34h3p",
    label: "Jeremy",
    provider: "11labs",
    defaultLanguageId: "en",
    enforceLanguage: "en",
    model: "eleven_turbo_v2_5",
    personality: "clear",
  },
];

/** Group voices by region for the AgentPicker UI */
export const VOICE_GROUPS = [
  {
    heading: "English",
    voices: DEMO_VOICES.filter((v) => v.provider === "vapi"),
  },
  {
    heading: "Argentine Spanish",
    voices: DEMO_VOICES.filter((v) => v.provider === "11labs" && v.enforceLanguage === "es"),
  },
  {
    heading: "Irish English",
    voices: DEMO_VOICES.filter((v) => v.provider === "11labs" && v.enforceLanguage === "en"),
  },
];
