"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: { title: string; completed: boolean }[];
}

export function OnboardingProgress({
  currentStep,
  totalSteps,
  steps,
}: OnboardingProgressProps) {
  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="relative mb-6">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-hero rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep) / totalSteps) * 100}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round((currentStep / totalSteps) * 100)}% complete</span>
        </div>
      </div>

      {/* Step indicators (for larger screens) */}
      <div className="hidden md:flex items-center justify-between gap-1 min-w-0">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = step.completed;

          return (
            <div key={index} className="flex items-center flex-1 min-w-0">
              <div className="flex flex-col items-center min-w-0">
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 shrink-0",
                    isCompleted
                      ? "bg-accent text-accent-foreground"
                      : isActive
                      ? "bg-primary text-primary-foreground ring-2 ring-primary/20"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <span
                  className={cn(
                    "mt-1 text-[10px] text-center max-w-[60px] truncate leading-tight",
                    isActive ? "text-foreground font-medium" : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-1 min-w-[8px]",
                    isCompleted ? "bg-accent" : "bg-muted"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OnboardingProgress;
