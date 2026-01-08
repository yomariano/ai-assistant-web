"use client";

import { Bot, Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AssistantConfigStepProps {
  hasExistingAssistant: boolean;
  onNext: () => void;
  onBack: () => void;
  onConfigureNow: () => void;
}

export function AssistantConfigStep({
  hasExistingAssistant,
  onNext,
  onBack,
  onConfigureNow,
}: AssistantConfigStepProps) {
  return (
    <div className="py-4">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
          <Bot className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-heading font-bold text-foreground mb-2">
          Customise Your AI Assistant
        </h2>
        <p className="text-muted-foreground text-sm">
          Tell your AI how to greet callers and what information to collect
        </p>
      </div>

      {/* Info cards */}
      <div className="space-y-3 mb-6">
        <div className="p-4 bg-muted/50 rounded-xl border border-border">
          <h4 className="font-semibold text-foreground text-sm mb-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-accent" />
            What You Can Customise
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Your business name and greeting</li>
            <li>• How to handle different types of calls</li>
            <li>• What information to collect from callers</li>
            <li>• When to transfer calls vs take messages</li>
            <li>• Industry-specific templates available</li>
          </ul>
        </div>

        {hasExistingAssistant ? (
          <div className="p-4 bg-accent/10 rounded-xl border border-accent/20">
            <h4 className="font-semibold text-foreground text-sm mb-1">
              You Already Have an Assistant Configured
            </h4>
            <p className="text-sm text-muted-foreground">
              Your AI receptionist is ready to go! You can still customise it
              further in your dashboard.
            </p>
          </div>
        ) : (
          <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
            <h4 className="font-semibold text-foreground text-sm mb-1">
              Default Settings Active
            </h4>
            <p className="text-sm text-muted-foreground">
              We&apos;ve set up a professional default greeting. You can customise
              this now or later from your dashboard.
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button
          variant="hero"
          onClick={onConfigureNow}
          className="w-full"
        >
          Customise Now
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button variant="ghost" onClick={onNext} className="flex-1">
            Use Default Settings
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4">
        You can always change these settings later in your dashboard
      </p>
    </div>
  );
}

export default AssistantConfigStep;
