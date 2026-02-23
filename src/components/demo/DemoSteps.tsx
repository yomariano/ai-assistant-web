"use client";

import { Check } from "lucide-react";
import type { DemoStep } from "@/lib/demo/types";

const STEPS = [
  { num: 1 as DemoStep, label: "Choose Industry" },
  { num: 2 as DemoStep, label: "Set Availability" },
  { num: 3 as DemoStep, label: "Pick Agent" },
  { num: 4 as DemoStep, label: "Watch It Work" },
];

type DemoStepsProps = {
  currentStep: DemoStep;
};

export default function DemoSteps({ currentStep }: DemoStepsProps) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      {STEPS.map((step, i) => {
        const isCompleted = currentStep > step.num;
        const isActive = currentStep === step.num;
        return (
          <div key={step.num} className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isCompleted
                    ? "bg-primary text-primary-foreground"
                    : isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step.num
                )}
              </div>
              <span
                className={`text-sm font-medium hidden sm:block ${
                  isActive
                    ? "text-foreground"
                    : isCompleted
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-8 sm:w-12 h-px ${
                  currentStep > step.num ? "bg-primary" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
