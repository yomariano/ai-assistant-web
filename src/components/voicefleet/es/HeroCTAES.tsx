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

const HeroCTAES = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    import("@/lib/store").then(({ useAuthStore }) => {
      setIsAuthenticated(useAuthStore.getState().isAuthenticated);
      return useAuthStore.subscribe((state) => {
        setIsAuthenticated(state.isAuthenticated);
      });
    });
  }, []);

  const handleStartTrial = async () => {
    setIsLoading(true);
    trackEvent("cta_click", { location: "hero_es", label: "start_free_trial" });
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
              Ir al Panel
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        ) : (
          <Button variant="hero" size="xl" onClick={handleStartTrial} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Conectando...
              </>
            ) : (
              <>
                Probá Gratis
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        )}
        <LiveDemoCall />
      </div>
      <p className="text-xs text-muted-foreground -mt-6 mb-8">
        Demo en vivo: elegí una industria + voz + idioma (español, inglés, francés, alemán, italiano). Las llamadas terminan automáticamente a los 90 segundos.
      </p>
      <p className="text-sm text-muted-foreground -mt-4 mb-10">
        ¿Preferís una presentación guiada?{" "}
        <a
          href="https://calendly.com/voicefleet"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground font-semibold hover:underline"
        >
          Reservá una demo
        </a>
        .
      </p>
    </>
  );
};

export default HeroCTAES;
