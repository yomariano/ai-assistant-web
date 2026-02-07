"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { OnboardingProgress } from "./OnboardingProgress";
import {
  PaywallStep,
  WelcomeStep,
  PhoneNumberStep,
  CallForwardingStep,
  TemplateSelectionStep,
  BusinessDetailsStep,
  IntegrationStep,
  TestCallStep,
  CompletionStep,
} from "./steps";
import type { PlanId } from "./steps/PaywallStep";
import { useRegion } from "@/hooks/useRegion";

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
  requiresSubscription?: boolean;
  hasSubscription?: boolean;
  onRefreshSubscription?: () => Promise<void> | void;
}

export function OnboardingTour({
  open,
  onOpenChange,
  data,
  onComplete,
  onProgressUpdate,
  requiresSubscription = false,
  hasSubscription = true,
  onRefreshSubscription,
}: OnboardingTourProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [stepsCompleted, setStepsCompleted] = useState<string[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [testCallMade, setTestCallMade] = useState(false);
  const [isRefreshingSubscription, setIsRefreshingSubscription] = useState(false);
  const [assistantCreated, setAssistantCreated] = useState(false);

  // Get region-based pricing
  const { plans: regionPlans, currencySymbol, loading: isLoadingRegion, region } = useRegion();

  const voicefleetNumber = data.phoneNumbers[0]?.number || "+353 1 234 5678";

  // Detect region from phone number prefix for call forwarding providers
  const phoneRegion = voicefleetNumber.replace(/\s/g, '').startsWith('+54') ? 'AR'
    : voicefleetNumber.replace(/\s/g, '').startsWith('+353') ? 'IE'
    : region || 'IE';

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

  const stepTitles = requiresSubscription
    ? ["Plan", "Welcome", "Phone Number", "Call Forwarding", "Industry", "Business", "Integration", "Test Call", "Complete"]
    : ["Welcome", "Phone Number", "Call Forwarding", "Industry", "Business", "Integration", "Test Call", "Complete"];

  const totalSteps = stepTitles.length;

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      markStepComplete(stepTitles[currentStep - 1] ?? `Step ${currentStep}`);
      goToStep(currentStep + 1);
    }
  }, [currentStep, totalSteps, markStepComplete, goToStep, stepTitles]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  }, [currentStep, goToStep]);

  const handleSelectPlan = useCallback(
    (planId: PlanId) => {
      // Close modal before navigating so /checkout can run its redirect effect unobstructed.
      onOpenChange(false);
      router.push(`/checkout?plan=${planId}`);
    },
    [onOpenChange, router]
  );

  const handleRefreshSubscription = useCallback(async () => {
    if (!onRefreshSubscription) return;
    setIsRefreshingSubscription(true);
    try {
      await onRefreshSubscription();
    } finally {
      setIsRefreshingSubscription(false);
    }
  }, [onRefreshSubscription]);

  const handleProviderSelect = useCallback((providerId: string) => {
    setSelectedProvider(providerId);
  }, []);

  const handleTemplateSelect = useCallback((templateId: string) => {
    setSelectedTemplate(templateId);
  }, []);

  const handleTestCallMade = useCallback(() => {
    setTestCallMade(true);
  }, []);

  const handleAssistantCreated = useCallback(() => {
    setAssistantCreated(true);
  }, []);

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

  const offset = requiresSubscription ? 1 : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-xl"
        showCloseButton={currentStep > 1}
      >
        {/* Progress indicator */}
        {currentStep > 1 && currentStep < totalSteps && (
          <div className="mb-4">
            <OnboardingProgress
              currentStep={currentStep}
              totalSteps={totalSteps}
              steps={steps}
            />
          </div>
        )}

        {/* Step content */}
        <div className="min-h-[300px] min-w-0">
          {requiresSubscription && currentStep === 1 && (
            <PaywallStep
              hasSubscription={hasSubscription}
              isRefreshing={isRefreshingSubscription}
              onSelectPlan={handleSelectPlan}
              onRefresh={handleRefreshSubscription}
              onContinue={nextStep}
              regionPlans={regionPlans}
              currencySymbol={currencySymbol || "€"}
              isLoadingRegion={isLoadingRegion}
            />
          )}
          {currentStep === 1 + offset && (
            <WelcomeStep userName={data.userName} onNext={nextStep} />
          )}
          {currentStep === 2 + offset && (
            <PhoneNumberStep
              phoneNumbers={data.phoneNumbers}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 3 + offset && (
            <CallForwardingStep
              voicefleetNumber={voicefleetNumber}
              onProviderSelect={handleProviderSelect}
              onNext={nextStep}
              onBack={prevStep}
              region={phoneRegion}
            />
          )}
          {currentStep === 4 + offset && (
            <TemplateSelectionStep
              selectedTemplate={selectedTemplate}
              onSelect={handleTemplateSelect}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 5 + offset && selectedTemplate && (
            <BusinessDetailsStep
              templateId={selectedTemplate}
              onComplete={nextStep}
              onBack={prevStep}
              onAssistantCreated={handleAssistantCreated}
            />
          )}
          {currentStep === 6 + offset && (
            <IntegrationStep
              onNext={nextStep}
              onBack={prevStep}
              canGoBack={!assistantCreated}
            />
          )}
          {currentStep === 7 + offset && (
            <TestCallStep
              voicefleetNumber={voicefleetNumber}
              onTestCallMade={handleTestCallMade}
              onNext={nextStep}
              onBack={prevStep}
              canGoBack={!assistantCreated}
            />
          )}
          {currentStep === 8 + offset && <CompletionStep onComplete={handleComplete} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default OnboardingTour;
