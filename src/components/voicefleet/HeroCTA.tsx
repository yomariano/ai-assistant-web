"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { trackEvent } from "@/lib/umami";

const HeroCTA = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  return (
    <div className="flex flex-col gap-3 mb-6 sm:mb-10 animate-fade-up stagger-3">
      {isAuthenticated ? (
        <Link href="/dashboard" className="w-full sm:w-auto">
          <Button variant="hero" size="xl" className="w-full sm:w-auto">
            Go to Dashboard
          </Button>
        </Link>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/register?plan=starter" className="w-full sm:w-auto">
            <Button
              variant="hero"
              size="xl"
              className="w-full sm:w-auto cursor-pointer"
              onClick={() => trackEvent("cta_click", { location: "hero", label: "start_trial" })}
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="xl"
            className="w-full sm:w-auto cursor-pointer border-border/60 hover:bg-accent/5"
            onClick={() => {
              trackEvent("cta_click", { location: "hero", label: "watch_product_tour" });
              document.getElementById("product-tour")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <Play className="w-5 h-5" />
            Watch Product Tour
          </Button>
        </div>
      )}
      {!isAuthenticated && (
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
          No credit card required
        </p>
      )}
    </div>
  );
};

export default HeroCTA;
