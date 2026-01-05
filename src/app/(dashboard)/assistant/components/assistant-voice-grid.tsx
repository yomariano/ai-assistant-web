'use client';

import { memo } from 'react';
import { Volume2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Voice } from '@/types';

export interface AssistantVoiceGridProps {
  voices: Voice[];
  selectedVoice: string;
  onSelectVoice: (voiceId: string) => void;
}

export const AssistantVoiceGrid = memo(function AssistantVoiceGrid({
  voices,
  selectedVoice,
  onSelectVoice,
}: AssistantVoiceGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <h2 className="text-lg font-bold text-slate-900">Voice</h2>
        <p className="text-sm text-slate-500 mt-1">Choose the voice for your AI assistant.</p>
      </div>

      <div className="lg:col-span-2">
        <Card className="border-none shadow-md ring-1 ring-slate-200 overflow-hidden">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {voices.map((voice) => (
                <button
                  key={voice.id}
                  onClick={() => onSelectVoice(voice.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedVoice === voice.id
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{voice.name}</p>
                      <p className="text-xs text-slate-500">{voice.provider}</p>
                    </div>
                    <Volume2
                      className={`w-5 h-5 ${selectedVoice === voice.id ? 'text-primary' : 'text-slate-400'}`}
                    />
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});


