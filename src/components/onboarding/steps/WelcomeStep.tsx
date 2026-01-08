"use client";

import { Phone, Sparkles, Clock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeStepProps {
  userName?: string;
  onNext: () => void;
}

export function WelcomeStep({ userName, onNext }: WelcomeStepProps) {
  return (
    <div className="text-center py-4">
      {/* Icon */}
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-hero rounded-2xl flex items-center justify-center">
        <Sparkles className="w-10 h-10 text-primary-foreground" />
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-heading font-bold text-foreground mb-3">
        Welcome{userName ? `, ${userName}` : ''}!
      </h2>
      <p className="text-lg text-primary font-medium mb-2">
        Your AI Receptionist is Ready
      </p>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Let&apos;s get you set up in just a few minutes. We&apos;ll walk you through
        connecting your phone and customising your AI assistant.
      </p>

      {/* Features preview */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-muted/50 rounded-xl">
          <Phone className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">24/7 Call Answering</p>
        </div>
        <div className="p-4 bg-muted/50 rounded-xl">
          <MessageSquare className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Message Taking</p>
        </div>
        <div className="p-4 bg-muted/50 rounded-xl">
          <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Instant Responses</p>
        </div>
      </div>

      {/* CTA */}
      <Button variant="hero" size="lg" onClick={onNext} className="w-full sm:w-auto">
        Let&apos;s Get Started
      </Button>

      <p className="text-xs text-muted-foreground mt-4">
        This will only take about 5 minutes
      </p>
    </div>
  );
}

export default WelcomeStep;
