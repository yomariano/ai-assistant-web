"use client";

import { useState } from "react";
import { PhoneCall, Check, Clock, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TestCallStepProps {
  voicefleetNumber: string;
  onTestCallMade: () => void;
  onNext: () => void;
  onBack: () => void;
  canGoBack?: boolean;
}

export function TestCallStep({
  voicefleetNumber,
  onTestCallMade,
  onNext,
  onBack,
  canGoBack = true,
}: TestCallStepProps) {
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "skipped">("idle");

  const formatPhoneNumber = (number: string) => {
    if (number.startsWith("+353")) {
      const local = number.slice(4);
      return `+353 ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5)}`;
    }
    return number;
  };

  const handleMarkAsTested = () => {
    setTestStatus("success");
    onTestCallMade();
  };

  const handleSkip = () => {
    setTestStatus("skipped");
    onNext();
  };

  if (testStatus === "success") {
    return (
      <div className="py-4 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-accent/10 rounded-full flex items-center justify-center">
          <Check className="w-10 h-10 text-accent" />
        </div>
        <h2 className="text-xl font-heading font-bold text-foreground mb-2">
          Test Call Successful!
        </h2>
        <p className="text-muted-foreground mb-6">
          Great! Your AI receptionist is working perfectly.
        </p>
        <Button variant="hero" onClick={onNext} className="w-full sm:w-auto">
          Continue
        </Button>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-2xl flex items-center justify-center">
          <PhoneCall className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-xl font-heading font-bold text-foreground mb-2">
          Make a Test Call
        </h2>
        <p className="text-muted-foreground text-sm">
          Call your VoiceFleet number to hear your AI receptionist in action
        </p>
      </div>

      {/* Phone number to call */}
      <div className="bg-gradient-hero rounded-xl p-6 text-center mb-6">
        <p className="text-primary-foreground/80 text-sm mb-2">
          Call this number from your phone:
        </p>
        <a
          href={`tel:${voicefleetNumber}`}
          className="text-2xl font-mono font-bold text-primary-foreground hover:underline"
        >
          {formatPhoneNumber(voicefleetNumber)}
        </a>
      </div>

      {/* Tips */}
      <div className="bg-muted/50 rounded-xl p-4 mb-6">
        <h4 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-primary" />
          What to Expect
        </h4>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li className="flex items-start gap-2">
            <Clock className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
            Your AI receptionist will answer within 1 second
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 mt-0.5 text-accent shrink-0" />
            It will greet you and ask how it can help
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 mt-0.5 text-accent shrink-0" />
            Try asking about business hours or leaving a message
          </li>
        </ul>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button
          variant="hero"
          onClick={handleMarkAsTested}
          className="w-full"
        >
          <Check className="w-4 h-4 mr-2" />
          I&apos;ve Made a Test Call
        </Button>

        <div className="flex gap-3">
          {canGoBack && (
            <Button variant="outline" onClick={onBack} className="flex-1">
              Back
            </Button>
          )}
          <Button variant="ghost" onClick={handleSkip} className={canGoBack ? "flex-1" : "w-full"}>
            Skip Test Call
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4">
        This is optional but recommended to ensure everything works
      </p>
    </div>
  );
}

export default TestCallStep;
