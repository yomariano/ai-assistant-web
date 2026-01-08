"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { OnboardingProgress } from "./OnboardingProgress";
import {
  WelcomeStep,
  PhoneNumberStep,
  CallForwardingStep,
  AssistantConfigStep,
  TestCallStep,
  CompletionStep,
} from "./steps";

export interface OnboardingData {
  userId: string;
  phoneNumbers: { number: string; label: string }[];
  userName?: string;
  hasExistingAssistant: boolean;
}

interface OnboardingTourProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: OnboardingData;
  onComplete: () => void;
  onProgressUpdate?: (step: number, stepsCompleted: string[], provider?: string, testCallMade?: boolean) => void;
}

const TOTAL_STEPS = 6;

const stepTitles = [
  "Welcome",
  "Phone Number",
  "Call Forwarding",
  "AI Setup",
  "Test Call",
  "Complete",
];

export function OnboardingTour({
  open,
  onOpenChange,
  data,
  onComplete,
  onProgressUpdate,
}: OnboardingTourProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [stepsCompleted, setStepsCompleted] = useState<string[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [testCallMade, setTestCallMade] = useState(false);

  const voicefleetNumber = data.phoneNumbers[0]?.number || "+353 1 234 5678";

  const markStepComplete = useCallback((stepName: string) => {
    setStepsCompleted((prev) => {
      if (prev.includes(stepName)) return prev;
      return [...prev, stepName];
    });
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
    onProgressUpdate?.(step, stepsCompleted, selectedProvider || undefined, testCallMade);
  }, [stepsCompleted, selectedProvider, testCallMade, onProgressUpdate]);

  const nextStep = useCallback(() => {
    if (currentStep < TOTAL_STEPS) {
      markStepComplete(stepTitles[currentStep - 1]);
      goToStep(currentStep + 1);
    }
  }, [currentStep, markStepComplete, goToStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  }, [currentStep, goToStep]);

  const handleProviderSelect = useCallback((providerId: string) => {
    setSelectedProvider(providerId);
  }, []);

  const handleTestCallMade = useCallback(() => {
    setTestCallMade(true);
  }, []);

  const handleConfigureNow = useCallback(() => {
    // Close modal and navigate to assistant config
    onOpenChange(false);
    router.push("/assistant");
  }, [onOpenChange, router]);

  const handleComplete = useCallback(() => {
    markStepComplete("Complete");
    onComplete();
    onOpenChange(false);
    router.push("/dashboard");
  }, [markStepComplete, onComplete, onOpenChange, router]);

  const steps = stepTitles.map((title, index) => ({
    title,
    completed: stepsCompleted.includes(title) || index < currentStep - 1,
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-lg max-h-[90vh] overflow-y-auto"
        showCloseButton={currentStep > 1}
      >
        {/* Progress indicator */}
        {currentStep > 1 && currentStep < TOTAL_STEPS && (
          <div className="mb-4">
            <OnboardingProgress
              currentStep={currentStep}
              totalSteps={TOTAL_STEPS}
              steps={steps}
            />
          </div>
        )}

        {/* Step content */}
        <div className="min-h-[300px]">
          {currentStep === 1 && (
            <WelcomeStep userName={data.userName} onNext={nextStep} />
          )}
          {currentStep === 2 && (
            <PhoneNumberStep
              phoneNumbers={data.phoneNumbers}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 3 && (
            <CallForwardingStep
              voicefleetNumber={voicefleetNumber}
              onProviderSelect={handleProviderSelect}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 4 && (
            <AssistantConfigStep
              hasExistingAssistant={data.hasExistingAssistant}
              onNext={nextStep}
              onBack={prevStep}
              onConfigureNow={handleConfigureNow}
            />
          )}
          {currentStep === 5 && (
            <TestCallStep
              voicefleetNumber={voicefleetNumber}
              onTestCallMade={handleTestCallMade}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 6 && <CompletionStep onComplete={handleComplete} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default OnboardingTour;
