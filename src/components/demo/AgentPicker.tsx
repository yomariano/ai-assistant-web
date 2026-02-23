"use client";

import { ArrowLeft, Mic, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/umami";
import type { DemoLanguageId } from "@/lib/demo/types";
import { DEMO_LANGUAGES } from "@/lib/demo/calendar-utils";
import { VOICE_GROUPS, type DemoVoice } from "@/lib/demo/voices";

type AgentPickerProps = {
  selectedVoice: DemoVoice;
  languageId: DemoLanguageId;
  isCreatingSession: boolean;
  onSelectVoice: (voice: DemoVoice) => void;
  onLanguageChange: (id: DemoLanguageId) => void;
  onStartCall: () => void;
  onBack: () => void;
};

export default function AgentPicker({
  selectedVoice,
  languageId,
  isCreatingSession,
  onSelectVoice,
  onLanguageChange,
  onStartCall,
  onBack,
}: AgentPickerProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to calendar
        </button>
      </div>

      <div className="text-center">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Pick your AI receptionist
        </h2>
        <p className="text-sm text-muted-foreground">
          Choose a voice and language for your demo call.
        </p>
      </div>

      {/* Voice cards grouped by region */}
      <div className="space-y-6">
        {VOICE_GROUPS.map((group) => (
          <div key={group.heading}>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              {group.heading}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {group.voices.map((voice) => {
                const isSelected = selectedVoice.id === voice.id;
                return (
                  <button
                    key={voice.id}
                    type="button"
                    onClick={() => {
                      onSelectVoice(voice);
                      trackEvent("demo_voice_selected", { voice: voice.label });
                      if (voice.defaultLanguageId && voice.defaultLanguageId !== languageId) {
                        onLanguageChange(voice.defaultLanguageId);
                      }
                    }}
                    className={`relative rounded-xl border-2 p-4 text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-border bg-background hover:border-primary/40 hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Mic className={`w-4 h-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                      <span className={`text-sm font-semibold ${isSelected ? "text-foreground" : "text-foreground"}`}>
                        {voice.label}
                      </span>
                    </div>
                    {voice.personality && (
                      <span className="text-xs text-muted-foreground">
                        {voice.personality}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Language selector */}
      <div className="max-w-xs">
        <label className="block text-sm font-medium text-muted-foreground mb-1">
          Language
        </label>
        <select
          value={languageId}
          onChange={(e) => {
            const lang = e.target.value as DemoLanguageId;
            onLanguageChange(lang);
            trackEvent("demo_language_selected", { language: lang });
          }}
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          disabled={!!selectedVoice.enforceLanguage}
        >
          {DEMO_LANGUAGES.map((l) => (
            <option key={l.id} value={l.id}>
              {l.label}
            </option>
          ))}
        </select>
        {selectedVoice.enforceLanguage && (
          <p className="text-xs text-muted-foreground mt-1">
            Language is fixed for this voice.
          </p>
        )}
      </div>

      {/* Start Demo Call button */}
      <div className="flex justify-center">
        <Button
          variant="hero"
          size="lg"
          onClick={onStartCall}
          disabled={isCreatingSession}
          className="min-w-[200px]"
        >
          {isCreatingSession ? (
            "Setting up..."
          ) : (
            <>
              Start Demo Call
              <Phone className="w-4 h-4 ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
