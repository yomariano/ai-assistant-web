'use client';

import { UtensilsCrossed, Stethoscope, Scissors, Dumbbell, Settings, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { IndustryTemplate } from '@/types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  UtensilsCrossed,
  Stethoscope,
  Scissors,
  Dumbbell,
  Settings,
};

interface IndustryTemplateSelectorProps {
  templates: IndustryTemplate[];
  selectedTemplateId: string | null;
  onSelectTemplate: (template: IndustryTemplate) => void;
}

export function IndustryTemplateSelector({
  templates,
  selectedTemplateId,
  onSelectTemplate,
}: IndustryTemplateSelectorProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <h2 className="text-lg font-bold text-slate-900">Choose Your Industry</h2>
        <p className="text-sm text-slate-500 mt-1">
          Select a template that matches your business type. This pre-configures the booking fields and settings.
        </p>
      </div>

      <div className="lg:col-span-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {templates.map((template) => {
            const Icon = iconMap[template.icon] || Settings;
            const isSelected = selectedTemplateId === template.id;

            return (
              <button
                key={template.id}
                onClick={() => onSelectTemplate(template)}
                className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                  isSelected ? 'bg-primary' : 'bg-slate-100'
                }`}>
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-slate-600'}`} />
                </div>
                <h3 className={`font-semibold text-sm ${isSelected ? 'text-primary' : 'text-slate-900'}`}>
                  {template.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {template.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
