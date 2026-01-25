"use client";

import { useState, useEffect } from "react";
import { Check, Loader2, ExternalLink, ArrowRight, Key, CheckCircle2, Calendar, BookOpen, UtensilsCrossed, Dumbbell, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { providersApi } from "@/lib/api";
import type { BookingProvider, ProviderConnection } from "@/types";

// Map icon names from database to actual Lucide icons or emojis
const PROVIDER_ICONS: Record<string, string> = {
  // Calendar providers
  google_calendar: "📅",
  calendly: "📆",
  calcom: "📅",
  // Square
  square: "🟦",
  // Restaurant providers
  thefork: "🍴",
  opentable: "🍽️",
  resy: "🍷",
  // Other providers
  simplybook: "📋",
  mindbody: "💪",
  // Fallback based on icon name in database
  Calendar: "📅",
  CalendarCheck: "📆",
  BookOpen: "📋",
  UtensilsCrossed: "🍴",
  Dumbbell: "💪",
  Square: "🟦",
};

function getProviderIcon(provider: BookingProvider): string {
  // First check by provider ID
  if (PROVIDER_ICONS[provider.id]) {
    return PROVIDER_ICONS[provider.id];
  }
  // Then check by icon name from database
  if (provider.icon && PROVIDER_ICONS[provider.icon]) {
    return PROVIDER_ICONS[provider.icon];
  }
  // Fallback to the icon field if it's already an emoji
  if (provider.icon && /\p{Emoji}/u.test(provider.icon)) {
    return provider.icon;
  }
  // Default calendar icon
  return "📅";
}

interface IntegrationStepProps {
  onNext: () => void;
  onBack: () => void;
  onIntegrationConnected?: (connectionId: string) => void;
  canGoBack?: boolean;
}

type ViewState = "select" | "connect" | "success";

export function IntegrationStep({
  onNext,
  onBack,
  onIntegrationConnected,
  canGoBack = true,
}: IntegrationStepProps) {
  const [providers, setProviders] = useState<BookingProvider[]>([]);
  const [existingConnections, setExistingConnections] = useState<ProviderConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewState, setViewState] = useState<ViewState>("select");
  const [selectedProvider, setSelectedProvider] = useState<BookingProvider | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [connectedAccount, setConnectedAccount] = useState<{ name: string; email?: string } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [providersRes, connectionsRes] = await Promise.all([
          providersApi.getProviders(),
          providersApi.getConnections(),
        ]);

        // Filter to only active providers
        const activeProviders = providersRes.providers.filter(p => p.isActive);
        setProviders(activeProviders);
        setExistingConnections(connectionsRes.connections);

        // If user already has a connection, show success state
        if (connectionsRes.connections.length > 0) {
          const conn = connectionsRes.connections[0];
          const provider = providersRes.providers.find(p => p.id === conn.providerId);
          if (provider && conn.status === "connected") {
            setSelectedProvider(provider);
            setConnectedAccount({
              name: conn.externalAccountName || provider.name,
              email: undefined,
            });
            setViewState("success");
          }
        }
      } catch (err) {
        console.error("Failed to load providers:", err);
        setError("Failed to load integrations");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSelectProvider = (provider: BookingProvider) => {
    setSelectedProvider(provider);
    setApiKey("");
    setConnectionError(null);

    if (provider.authType === "oauth2") {
      // For OAuth, redirect to OAuth flow
      handleOAuthConnect(provider);
    } else {
      // For API key, show input form
      setViewState("connect");
    }
  };

  const handleOAuthConnect = async (provider: BookingProvider) => {
    try {
      setConnecting(true);
      const redirectUri = `${window.location.origin}/integrations/providers/oauth/callback`;
      const { url } = await providersApi.getOAuthUrl(provider.id, redirectUri);

      // Store state to return to onboarding after OAuth
      sessionStorage.setItem("oauth_return_to", "onboarding");

      // Redirect to OAuth provider
      window.location.href = url;
    } catch (err) {
      console.error("OAuth error:", err);
      setConnectionError("Failed to start authentication. Please try again.");
      setConnecting(false);
    }
  };

  const handleApiKeyConnect = async () => {
    if (!selectedProvider || !apiKey.trim()) return;

    setConnecting(true);
    setConnectionError(null);

    try {
      const result = await providersApi.createConnection({
        providerId: selectedProvider.id,
        apiKey: apiKey.trim(),
      });

      if (result.success && result.connection) {
        // Test the connection to get account info
        try {
          const testResult = await providersApi.testConnection(result.connection.id);
          if (testResult.success && testResult.accountInfo) {
            setConnectedAccount({
              name: testResult.accountInfo.name,
              email: testResult.accountInfo.email,
            });
          }
        } catch {
          // Test failed but connection was created
          setConnectedAccount({ name: selectedProvider.name });
        }

        onIntegrationConnected?.(result.connection.id);
        setViewState("success");
      }
    } catch (err: unknown) {
      console.error("Connection error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to connect";
      const axiosError = err as { response?: { data?: { error?: string } } };
      setConnectionError(axiosError.response?.data?.error || errorMessage);
    } finally {
      setConnecting(false);
    }
  };

  const handleSkip = () => {
    onNext();
  };

  const handleContinueAfterConnect = () => {
    onNext();
  };

  if (loading) {
    return (
      <div className="py-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  // Success view after connection
  if (viewState === "success" && selectedProvider) {
    return (
      <div className="py-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-heading font-bold text-foreground mb-2">
            Integration Connected!
          </h2>
          <p className="text-muted-foreground text-sm">
            Your {selectedProvider.name} account is now linked to your AI assistant
          </p>
        </div>

        <div className="p-4 bg-accent/10 rounded-lg border border-accent/20 mb-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{getProviderIcon(selectedProvider)}</div>
            <div>
              <p className="font-medium text-foreground">{selectedProvider.name}</p>
              {connectedAccount && (
                <p className="text-sm text-muted-foreground">
                  {connectedAccount.name}
                  {connectedAccount.email && ` (${connectedAccount.email})`}
                </p>
              )}
            </div>
            <div className="ml-auto">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
                <Check className="w-3 h-3" />
                Connected
              </span>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground text-center mb-6">
          Your AI assistant can now check availability and create bookings in {selectedProvider.name}.
          You can manage this integration in Settings later.
        </p>

        <Button variant="hero" onClick={handleContinueAfterConnect} className="w-full">
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  // API Key connection form
  if (viewState === "connect" && selectedProvider) {
    return (
      <div className="py-4">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">{getProviderIcon(selectedProvider)}</div>
          <h2 className="text-xl font-heading font-bold text-foreground mb-2">
            Connect {selectedProvider.name}
          </h2>
          <p className="text-muted-foreground text-sm">
            Enter your API key to link your account
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <Label htmlFor="apiKey" className="text-sm font-medium">
              API Key
            </Label>
            <div className="relative mt-1">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="pl-10"
                disabled={connecting}
              />
            </div>
          </div>

          {connectionError && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{connectionError}</p>
            </div>
          )}

          <a
            href={selectedProvider.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            How to get your API key
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setViewState("select");
              setSelectedProvider(null);
            }}
            className="flex-1"
            disabled={connecting}
          >
            Back
          </Button>
          <Button
            variant="hero"
            onClick={handleApiKeyConnect}
            disabled={!apiKey.trim() || connecting}
            className="flex-1"
          >
            {connecting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect"
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Provider selection view (default)
  return (
    <div className="py-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-heading font-bold text-foreground mb-2">
          Connect a booking system
        </h2>
        <p className="text-muted-foreground text-sm">
          Link your scheduling tool so your AI can check availability and book appointments
        </p>
      </div>

      {/* Provider grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {providers.map((provider) => {
          const isConnected = existingConnections.some(
            c => c.providerId === provider.id && c.status === "connected"
          );

          return (
            <button
              key={provider.id}
              onClick={() => !isConnected && handleSelectProvider(provider)}
              disabled={isConnected || connecting}
              className={cn(
                "relative p-4 rounded-xl border-2 text-left transition-all",
                "hover:border-primary/50 hover:bg-primary/5",
                "disabled:opacity-60 disabled:cursor-not-allowed",
                isConnected
                  ? "border-green-500/50 bg-green-500/5"
                  : "border-border bg-card"
              )}
            >
              {isConnected && (
                <div className="absolute top-2 right-2">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
              {provider.isBeta && !isConnected && (
                <div className="absolute top-2 right-2">
                  <span className="px-1.5 py-0.5 text-[10px] font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded">
                    BETA
                  </span>
                </div>
              )}
              <div className="text-2xl mb-2">{getProviderIcon(provider)}</div>
              <h3 className="font-semibold text-foreground text-sm mb-1">
                {provider.name}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {provider.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Info text */}
      <div className="p-3 bg-muted/50 rounded-lg border border-border mb-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Optional:</span>{" "}
          You can skip this step and connect an integration later from Settings.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {canGoBack && (
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
        )}
        <Button variant="ghost" onClick={handleSkip} className={canGoBack ? "flex-1" : "w-full"}>
          Skip for now
        </Button>
      </div>
    </div>
  );
}

export default IntegrationStep;
