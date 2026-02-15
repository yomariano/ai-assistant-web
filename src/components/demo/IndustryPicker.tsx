"use client";

import {
  UtensilsCrossed,
  Stethoscope,
  Dumbbell,
  Sparkles,
  Wrench,
} from "lucide-react";
import { DEMO_SCENARIOS } from "@/lib/demo/calendar-utils";

const ICONS: Record<string, React.ReactNode> = {
  UtensilsCrossed: <UtensilsCrossed className="w-6 h-6" />,
  Stethoscope: <Stethoscope className="w-6 h-6" />,
  Dumbbell: <Dumbbell className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
  Wrench: <Wrench className="w-6 h-6" />,
};

const DESCRIPTIONS: Record<string, string> = {
  "restaurant-reservation": "Book tables, manage reservations",
  "dentist-appointment": "Schedule cleanings, handle emergencies",
  "gym-membership": "Book classes, answer membership Qs",
  "beauty-salon": "Book hair, nails, spa appointments",
  "plumber-callout": "Schedule visits, triage emergencies",
};

type IndustryPickerProps = {
  selectedId: string | null;
  onSelect: (scenarioId: string) => void;
};

export default function IndustryPicker({
  selectedId,
  onSelect,
}: IndustryPickerProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {DEMO_SCENARIOS.map((s) => {
        const isSelected = selectedId === s.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(s.id)}
            className={`relative flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
              isSelected
                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                : "border-border bg-card hover:border-primary/30 hover:bg-muted/30"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isSelected
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {ICONS[s.icon]}
            </div>
            <span className="text-sm font-semibold text-foreground">
              {s.label}
            </span>
            <span className="text-xs text-muted-foreground text-center leading-tight">
              {DESCRIPTIONS[s.id]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
