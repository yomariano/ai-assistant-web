"use client";

import { useState, useEffect } from "react";
import { Building2, User, Sparkles, Loader2, Check, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { templatesApi, onboardingApi } from "@/lib/api";
import { cn } from "@/lib/utils";

interface BusinessDetailsStepProps {
  templateId: string;
  onComplete: () => void;
  onBack: () => void;
  onAssistantCreated?: () => void;
  region?: string;
}

export function BusinessDetailsStep({
  templateId,
  onComplete,
  onBack,
  onAssistantCreated,
  region = "IE",
}: BusinessDetailsStepProps) {
  const [businessName, setBusinessName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [greetingName, setGreetingName] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [preview, setPreview] = useState<{
    firstMessage: string;
    voiceId: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const isSpanish = region === "AR";

  // Load preview when business name changes (debounced)
  useEffect(() => {
    if (!businessName.trim()) {
      setPreview(null);
      return;
    }

    const timer = setTimeout(async () => {
      setPreviewLoading(true);
      try {
        const response = await templatesApi.preview(templateId, {
          businessName: businessName.trim(),
          businessDescription: businessDescription.trim() || undefined,
          greetingName: greetingName.trim() || undefined,
          region,
          locale: isSpanish ? "es-AR" : undefined,
        });
        if (response.success) {
          setPreview({
            firstMessage: response.preview.firstMessage,
            voiceId: response.preview.voice.voiceId,
          });
        }
      } catch (err) {
        console.error("Preview error:", err);
      } finally {
        setPreviewLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [businessName, businessDescription, greetingName, templateId, region, isSpanish]);

  const handleSubmit = async () => {
    if (!businessName.trim()) {
      setError("Please enter your business name");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await onboardingApi.quickSetup({
        templateId,
        businessName: businessName.trim(),
        businessDescription: businessDescription.trim() || undefined,
        greetingName: greetingName.trim() || undefined,
        region,
        locale: isSpanish ? "es-AR" : undefined,
      });

      if (response.success) {
        setSuccess(true);
        // Notify that assistant was created (to prevent going back)
        onAssistantCreated?.();
        // Wait a moment to show success state
        setTimeout(() => {
          onComplete();
        }, 1500);
      } else {
        setError("Failed to create assistant. Please try again.");
      }
    } catch (err) {
      console.error("Setup error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="py-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-500/10 rounded-2xl flex items-center justify-center">
          <Check className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-xl font-heading font-bold text-foreground mb-2">
          Your AI Assistant is Ready!
        </h2>
        <p className="text-muted-foreground text-sm">
          Setting up your personalized assistant...
        </p>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="text-center mb-6">
        <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-xl flex items-center justify-center">
          <Building2 className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-xl font-heading font-bold text-foreground mb-2">
          Tell us about your business
        </h2>
        <p className="text-muted-foreground text-sm">
          We&apos;ll use this to personalize your AI assistant&apos;s greeting
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4 mb-6">
        <div>
          <Label htmlFor="businessName" className="text-sm font-medium">
            Business Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="businessName"
            placeholder="e.g., Tony's Pizzeria, Smith & Co Law"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="mt-1.5"
          />
        </div>

        {/* Preview Card */}
        {(preview || previewLoading) && (
          <div className="p-4 bg-muted/50 rounded-xl border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Your AI will answer with
              </span>
            </div>
            {previewLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Generating preview...</span>
              </div>
            ) : (
              <p className="text-sm text-foreground italic">
                &ldquo;{preview?.firstMessage}&rdquo;
              </p>
            )}
          </div>
        )}

        {/* Advanced options toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <Sparkles className="w-4 h-4" />
          {showAdvanced ? "Hide" : "Show"} advanced options
        </button>

        {/* Advanced fields */}
        {showAdvanced && (
          <div className="space-y-4 pt-2 border-t border-border">
            <div>
              <Label htmlFor="greetingName" className="text-sm font-medium">
                Assistant Name
              </Label>
              <div className="flex items-center gap-2 mt-1.5">
                <User className="w-4 h-4 text-muted-foreground" />
                <Input
                  id="greetingName"
                  placeholder="e.g., Alex, Sarah, your assistant"
                  value={greetingName}
                  onChange={(e) => setGreetingName(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                How your AI introduces itself to callers
              </p>
            </div>

            <div>
              <Label htmlFor="businessDescription" className="text-sm font-medium">
                Brief Description (optional)
              </Label>
              <Textarea
                id="businessDescription"
                placeholder="e.g., Family-owned Italian restaurant serving authentic pizza since 1985"
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                className="mt-1.5 min-h-[80px]"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Helps your AI answer questions about your business
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg mb-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1" disabled={loading}>
          Back
        </Button>
        <Button
          variant="hero"
          onClick={handleSubmit}
          disabled={!businessName.trim() || loading}
          className="flex-1"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            "Create My Assistant"
          )}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4">
        You can customize everything later in your dashboard
      </p>
    </div>
  );
}

export default BusinessDetailsStep;
