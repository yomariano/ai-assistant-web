"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { trackEvent } from "@/lib/umami";

const LiveDemoCall = dynamic(
  () => import("@/components/voicefleet/LiveDemoCall"),
  { ssr: false }
);

const HeroCTA = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Lazy-check auth after hydration to avoid pulling Supabase into the initial bundle
  useEffect(() => {
    import("@/lib/store").then(({ useAuthStore }) => {
      setIsAuthenticated(useAuthStore.getState().isAuthenticated);
      // Subscribe to future changes
      return useAuthStore.subscribe((state) => {
        setIsAuthenticated(state.isAuthenticated);
      });
    });
  }, []);

  const handleStartTrial = async () => {
    setIsLoading(true);
    trackEvent("cta_click", { location: "hero", label: "start_free_trial" });
    try {
      const { signInWithGoogle } = await import("@/lib/supabase");
      await signInWithGoogle();
    } catch (error) {
      console.error("Failed to start Google OAuth:", error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mb-10 animate-fade-up stagger-3">
        {isAuthenticated ? (
          <Link href="/dashboard">
            <Button variant="hero" size="xl">
              Go to Dashboard
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        ) : (
          <Button variant="hero" size="xl" onClick={handleStartTrial} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        )}
        <LiveDemoCall />
      </div>
      <p className="text-xs text-muted-foreground -mt-6 mb-8">
        Live demo: choose an industry + voice + language (English, Spanish, French, German, Italian). Calls end automatically after 90 seconds.
        {" "}Or <Link href="/demo" className="text-foreground font-semibold hover:underline">try the interactive booking demo</Link>.
      </p>
      <p className="text-xs text-muted-foreground -mt-4 mb-6">
        Free trial includes setup support and no credit card is required to get started.
      </p>
      <p className="text-sm text-muted-foreground -mt-4 mb-10">
        Prefer a guided walkthrough?{" "}
        <a
          href="https://calendly.com/voicefleet"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground font-semibold hover:underline"
        >
          Book a demo
        </a>
        .
      </p>
    </>
  );
};

export default HeroCTA;
