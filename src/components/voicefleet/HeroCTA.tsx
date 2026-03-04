"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
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
      <div className="flex flex-col gap-3 mb-10 animate-fade-up stagger-3">
        {isAuthenticated ? (
          <Link href="/dashboard">
            <Button variant="hero" size="xl">
              Go to Dashboard
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        ) : (
          <LiveDemoCall
            trigger={
              <Button variant="hero" size="xl" className="cursor-pointer">
                <Phone className="w-5 h-5" />
                Try Your AI Receptionist
              </Button>
            }
          />
        )}
        <p className="text-xs text-muted-foreground">
          No signup needed. Pick an industry, hear your AI receptionist. 90 seconds.
        </p>
        {!isAuthenticated && (
          <p className="text-xs text-muted-foreground">
            or{" "}
            <button
              onClick={handleStartTrial}
              disabled={isLoading}
              className="text-foreground font-semibold hover:underline cursor-pointer"
            >
              {isLoading ? "Connecting..." : "Start 30-Day Free Trial"}
            </button>
          </p>
        )}
      </div>
    </>
  );
};

export default HeroCTA;
