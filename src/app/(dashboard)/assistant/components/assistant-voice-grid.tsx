'use client';

import { memo } from 'react';
import { Volume2, ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Voice } from '@/types';

export interface AssistantVoiceGridProps {
  voices: Voice[];
  selectedVoice: string;
  onSelectVoice: (voiceId: string) => void;
}

// Extract short name from full ElevenLabs name (e.g., "Sarah - Mature, Reassuring" -> "Sarah")
function getShortName(fullName: string): string {
  return fullName.split(' - ')[0] || fullName;
}

// Extract description from full ElevenLabs name (e.g., "Sarah - Mature, Reassuring" -> "Mature, Reassuring")
function getDescription(fullName: string): string {
  const parts = fullName.split(' - ');
  return parts[1] || '';
}

// Format gender for display
function formatGender(gender?: string): string {
  if (!gender || gender === 'unknown') return '';
  return gender.charAt(0).toUpperCase() + gender.slice(1);
}

// Format accent for display
function formatAccent(accent?: string): string {
  if (!accent || accent === 'unknown') return '';
  return accent.charAt(0).toUpperCase() + accent.slice(1);
}

export const AssistantVoiceGrid = memo(function AssistantVoiceGrid({
  voices,
  selectedVoice,
  onSelectVoice,
}: AssistantVoiceGridProps) {
  const selectedVoiceData = voices.find(v => v.id === selectedVoice);
  const selectedName = selectedVoiceData ? getShortName(selectedVoiceData.name) : 'Select a voice';
  const selectedDesc = selectedVoiceData ? getDescription(selectedVoiceData.name) : '';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <h2 className="text-lg font-bold text-slate-900">Voice</h2>
        <p className="text-sm text-slate-500 mt-1">Choose from {voices.length} premium ElevenLabs voices.</p>
      </div>

      <div className="lg:col-span-2">
        <Card className="border-none shadow-md ring-1 ring-slate-200 overflow-hidden">
          <CardContent className="p-6">
            <div className="relative">
              <select
                value={selectedVoice}
                onChange={(e) => onSelectVoice(e.target.value)}
                className="w-full appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-3 pr-10 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer hover:border-slate-300"
              >
                <option value="" disabled>Select a voice...</option>
                {voices.map((voice) => {
                  const shortName = getShortName(voice.name);
                  const description = getDescription(voice.name);
                  const gender = formatGender(voice.gender);
                  const accent = formatAccent(voice.accent);
                  const details = [gender, accent, description].filter(Boolean).join(' · ');

                  return (
                    <option key={voice.id} value={voice.id}>
                      {shortName} — {details}
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>

            {/* Selected voice preview */}
            {selectedVoiceData && (
              <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Volume2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{selectedName}</p>
                    <p className="text-sm text-slate-500">
                      {[
                        formatGender(selectedVoiceData.gender),
                        formatAccent(selectedVoiceData.accent),
                        selectedDesc
                      ].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
});



