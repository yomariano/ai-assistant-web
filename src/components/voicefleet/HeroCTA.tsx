"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { signInWithGoogle } from "@/lib/supabase";
import dynamic from "next/dynamic";

const LiveDemoCall = dynamic(
  () => import("@/components/voicefleet/LiveDemoCall"),
  { ssr: false }
);

const HeroCTA = () => {
  const { isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartTrial = async () => {
    setIsLoading(true);
    try {
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
