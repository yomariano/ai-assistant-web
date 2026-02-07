"use client";

import { Phone, Copy, Check, ExternalLink, Loader2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface PhoneNumberStepProps {
  phoneNumbers: { number: string; label: string }[];
  onNext: () => void;
  onBack: () => void;
}

export function PhoneNumberStep({ phoneNumbers, onNext, onBack }: PhoneNumberStepProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Check if number is pending (Argentina provisioning in progress)
  const isPending = phoneNumbers.length === 1 && phoneNumbers[0].number === 'PENDING';

  const copyToClipboard = async (number: string, index: number) => {
    try {
      await navigator.clipboard.writeText(number);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatPhoneNumber = (number: string) => {
    // Format Irish numbers nicely
    if (number.startsWith("+353")) {
      const local = number.slice(4);
      return `+353 ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5)}`;
    }
    // Format Argentine numbers
    if (number.startsWith("+54")) {
      return number;
    }
    return number;
  };

  // Render pending state for Argentina users
  if (isPending) {
    return (
      <div className="py-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-2xl flex items-center justify-center">
            <Clock className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-xl font-heading font-bold text-foreground mb-2">
            Setting Up Your Number
          </h2>
          <p className="text-muted-foreground text-sm">
            Your Argentina phone number is being provisioned
          </p>
        </div>

        {/* Pending Status */}
        <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Loader2 className="w-5 h-5 text-amber-600 animate-spin" />
            <p className="font-semibold text-amber-800">Provisioning in progress...</p>
          </div>
          <p className="text-sm text-amber-700">
            We&apos;re setting up your Argentina (+54) phone number. This usually takes a few minutes.
            You&apos;ll receive an email once your number is ready.
          </p>
        </div>

        {/* Info box */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
          <h4 className="font-semibold text-foreground text-sm mb-2">
            What happens next?
          </h4>
          <p className="text-sm text-muted-foreground">
            Once your number is ready, you&apos;ll be able to forward your existing business calls to it.
            Our AI receptionist will answer instantly and handle conversations for you.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button variant="hero" onClick={onNext} className="flex-1">
            <span className="truncate">Continue Setup</span>
            <ExternalLink className="w-4 h-4 ml-1 shrink-0" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-2xl flex items-center justify-center">
          <Phone className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-xl font-heading font-bold text-foreground mb-2">
          Your VoiceFleet Number{phoneNumbers.length > 1 ? 's' : ''}
        </h2>
        <p className="text-muted-foreground text-sm">
          This is the number your callers will be forwarded to
        </p>
      </div>

      {/* Phone Numbers */}
      <div className="space-y-3 mb-6">
        {phoneNumbers.map((phone, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-2 p-4 bg-muted/50 rounded-xl border border-border"
          >
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground mb-1">{phone.label}</p>
              <p className="text-base sm:text-lg font-mono font-semibold text-foreground truncate">
                {formatPhoneNumber(phone.number)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(phone.number, index)}
              className="shrink-0"
            >
              {copiedIndex === index ? (
                <>
                  <Check className="w-4 h-4 mr-1 text-accent" />
                  <span className="hidden sm:inline">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Copy</span>
                </>
              )}
            </Button>
          </div>
        ))}
      </div>

      {/* Info box */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
        <h4 className="font-semibold text-foreground text-sm mb-2">
          What happens next?
        </h4>
        <p className="text-sm text-muted-foreground">
          You&apos;ll forward your existing business calls to this number. When someone
          calls you, our AI receptionist will answer instantly and handle the conversation.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button variant="hero" onClick={onNext} className="flex-1">
          <span className="truncate">Continue to Call Forwarding</span>
          <ExternalLink className="w-4 h-4 ml-1 shrink-0" />
        </Button>
      </div>
    </div>
  );
}

export default PhoneNumberStep;
