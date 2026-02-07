"use client";

import { useState } from "react";
import {
  Phone,
  Smartphone,
  Building2,
  Home,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  generateActivationCode,
  getProviderCategoriesForRegion,
  getProviderByIdAllRegions,
  type CallForwardingProvider,
} from "@/lib/content/call-forwarding";

interface CallForwardingStepProps {
  voicefleetNumber: string;
  onProviderSelect: (providerId: string) => void;
  onNext: () => void;
  onBack: () => void;
  region?: string;
}

type ViewState = "categories" | "providers" | "instructions";

const categoryIcons = {
  mobile: Smartphone,
  mvno: Smartphone,
  landline: Home,
  business: Building2,
};

export function CallForwardingStep({
  voicefleetNumber,
  onProviderSelect,
  onNext,
  onBack,
  region = 'IE',
}: CallForwardingStepProps) {
  const regionCategories = getProviderCategoriesForRegion(region);
  const [view, setView] = useState<ViewState>("categories");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<CallForwardingProvider | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = async (code: string) => {
    const formattedCode = generateActivationCode(code, voicefleetNumber);
    try {
      await navigator.clipboard.writeText(formattedCode);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setView("providers");
  };

  const handleProviderSelect = (provider: CallForwardingProvider) => {
    setSelectedProvider(provider);
    onProviderSelect(provider.id);
    setView("instructions");
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setView("categories");
  };

  const handleBackToProviders = () => {
    setSelectedProvider(null);
    setView("providers");
  };

  // Categories view
  if (view === "categories") {
    return (
      <div className="py-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Phone className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-heading font-bold text-foreground mb-2">
            Set Up Call Forwarding
          </h2>
          <p className="text-muted-foreground text-sm">
            What type of phone will you forward calls from?
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {regionCategories.map((category) => {
            const Icon = categoryIcons[category.id as keyof typeof categoryIcons] || Phone;
            return (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
              >
                <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{category.title}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            );
          })}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button variant="ghost" onClick={onNext} className="flex-1">
            Skip for Now
          </Button>
        </div>
      </div>
    );
  }

  // Providers view
  if (view === "providers" && selectedCategory) {
    const category = regionCategories.find((c) => c.id === selectedCategory);
    const providers = category?.providers
      .map((id) => getProviderByIdAllRegions(id))
      .filter(Boolean) as CallForwardingProvider[];

    return (
      <div className="py-4">
        <button
          onClick={handleBackToCategories}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Back to categories
        </button>

        <div className="text-center mb-6">
          <h2 className="text-xl font-heading font-bold text-foreground mb-2">
            Select Your Provider
          </h2>
          <p className="text-muted-foreground text-sm">
            Choose your phone provider to see setup instructions
          </p>
        </div>

        <div className="space-y-2 mb-6 max-h-[300px] overflow-y-auto">
          {providers.map((provider) => (
            <button
              key={provider.id}
              onClick={() => handleProviderSelect(provider)}
              className="w-full flex items-center gap-3 p-3 bg-card border border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
            >
              <div className="flex-1">
                <h3 className="font-medium text-foreground">{provider.name}</h3>
                {provider.network && (
                  <p className="text-xs text-muted-foreground">
                    Uses {provider.network} network
                  </p>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          ))}
        </div>

        <div className="bg-muted/50 rounded-xl p-4 text-center">
          <HelpCircle className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Don&apos;t see your provider?{" "}
            <a href="mailto:support@voicefleet.ai" className="text-primary hover:underline">
              Contact support
            </a>
          </p>
        </div>
      </div>
    );
  }

  // Instructions view
  if (view === "instructions" && selectedProvider) {
    const allCallsOption = selectedProvider.options.find((o) => o.type === "all");

    return (
      <div className="py-4">
        <button
          onClick={handleBackToProviders}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Back to providers
        </button>

        <div className="text-center mb-6">
          <h2 className="text-xl font-heading font-bold text-foreground mb-1">
            {selectedProvider.name}
          </h2>
          <p className="text-muted-foreground text-sm">
            Follow these steps to forward your calls
          </p>
        </div>

        {/* Main forwarding option */}
        {allCallsOption && (
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3">
              {allCallsOption.label}
            </h3>
            <div className="bg-muted/50 rounded-xl p-4 border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Activation Code
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyCode(allCallsOption.activateCode)}
                >
                  {copiedCode === allCallsOption.activateCode ? (
                    <>
                      <Check className="w-4 h-4 mr-1 text-accent" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <code className="text-lg font-mono font-bold text-foreground block mb-3">
                {generateActivationCode(allCallsOption.activateCode, voicefleetNumber)}
              </code>
              <p className="text-sm text-muted-foreground">
                {allCallsOption.description}
              </p>
            </div>

            <div className="mt-3 bg-accent/10 rounded-xl p-4 border border-accent/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  To Disable Forwarding
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyCode(allCallsOption.deactivateCode)}
                >
                  {copiedCode === allCallsOption.deactivateCode ? (
                    <>
                      <Check className="w-4 h-4 mr-1 text-accent" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <code className="text-base font-mono text-foreground">
                {allCallsOption.deactivateCode}
              </code>
            </div>
          </div>
        )}

        {/* Notes */}
        {selectedProvider.notes && selectedProvider.notes.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium text-foreground text-sm mb-2">Notes:</h4>
            <ul className="space-y-1">
              {selectedProvider.notes.map((note, i) => (
                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-primary">•</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Support links */}
        {(selectedProvider.supportUrl || selectedProvider.supportPhone) && (
          <div className="bg-muted/50 rounded-xl p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-2">Need help from {selectedProvider.name}?</p>
            <div className="flex flex-wrap gap-2">
              {selectedProvider.supportUrl && (
                <a
                  href={selectedProvider.supportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  Visit Support
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {selectedProvider.supportPhone && (
                <span className="text-sm text-muted-foreground">
                  Call: {selectedProvider.supportPhone}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleBackToProviders} className="flex-1">
            Different Provider
          </Button>
          <Button variant="hero" onClick={onNext} className="flex-1">
            I&apos;ve Set Up Forwarding
          </Button>
        </div>
      </div>
    );
  }

  return null;
}

export default CallForwardingStep;
