"use client";

import { CheckCircle2, ArrowRight, Phone, Settings, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CompletionStepProps {
  onComplete: () => void;
}

export function CompletionStep({ onComplete }: CompletionStepProps) {
  return (
    <div className="py-4 text-center">
      {/* Success icon */}
      <div className="w-20 h-20 mx-auto mb-6 bg-accent rounded-full flex items-center justify-center">
        <CheckCircle2 className="w-12 h-12 text-accent-foreground" />
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
        You&apos;re All Set!
      </h2>
      <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
        Your AI receptionist is now ready to answer calls 24/7.
        Sit back and let us handle your phone.
      </p>

      {/* Next steps */}
      <div className="space-y-3 mb-8 text-left">
        <h3 className="font-semibold text-foreground text-sm text-center mb-4">
          What&apos;s Next?
        </h3>

        <Link
          href="/dashboard"
          className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
        >
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-foreground text-sm">View Dashboard</h4>
            <p className="text-xs text-muted-foreground">See call logs and messages</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>

        <Link
          href="/assistant"
          className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
        >
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Settings className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-foreground text-sm">Customise Assistant</h4>
            <p className="text-xs text-muted-foreground">Fine-tune your AI&apos;s responses</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>

        <Link
          href="/phone-numbers"
          className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
        >
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Phone className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-foreground text-sm">Manage Phone Numbers</h4>
            <p className="text-xs text-muted-foreground">View or add more numbers</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>
      </div>

      {/* CTA */}
      <Button variant="hero" size="lg" onClick={onComplete} className="w-full">
        Go to Dashboard
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>

      {/* Support note */}
      <p className="text-xs text-muted-foreground mt-6">
        Questions? Email us at{" "}
        <a href="mailto:support@voicefleet.ai" className="text-primary hover:underline">
          support@voicefleet.ai
        </a>
      </p>
    </div>
  );
}

export default CompletionStep;
