"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Check, Zap, Rocket, Crown, Gift, Clock, Shield, Phone, Sparkles } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { signInWithGoogle } from "@/lib/supabase";

// Get payment links based on stripe mode
const getPaymentLinks = () => {
  const isLiveMode = process.env.NEXT_PUBLIC_STRIPE_MODE === "live";

  if (isLiveMode) {
    return {
      starter: process.env.NEXT_PUBLIC_STRIPE_LIVE_LINK_STARTER,
      growth: process.env.NEXT_PUBLIC_STRIPE_LIVE_LINK_GROWTH,
      pro: process.env.NEXT_PUBLIC_STRIPE_LIVE_LINK_PRO,
    };
  }

  return {
    starter: process.env.NEXT_PUBLIC_STRIPE_TEST_LINK_STARTER,
    growth: process.env.NEXT_PUBLIC_STRIPE_TEST_LINK_GROWTH,
    pro: process.env.NEXT_PUBLIC_STRIPE_TEST_LINK_PRO,
  };
};

const PricingSection = () => {
  const paymentLinks = getPaymentLinks();
  const { isAuthenticated, token } = useAuthStore();
  // Get checkAuth with a stable reference to avoid infinite loops
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const [authChecked, setAuthChecked] = useState(false);
  const [redirectingPlan, setRedirectingPlan] = useState<string | null>(null);
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    // Only check auth once on mount
    if (!hasCheckedAuth.current) {
      hasCheckedAuth.current = true;
      checkAuth().then(() => setAuthChecked(true));
    }
  }, [checkAuth]);

  const handleGetStarted = async (planId: string) => {
    // If user is not authenticated, go directly to Google OAuth
    if (!isAuthenticated) {
      // Store the selected plan for after login
      sessionStorage.setItem('selectedPlan', planId);
      setRedirectingPlan(planId);
      try {
        await signInWithGoogle();
        // OAuth will redirect, so we don't need to handle success here
      } catch (error) {
        console.error("Failed to start Google OAuth:", error);
        setRedirectingPlan(null);
      }
      return;
    }

    // User is authenticated - check subscription status via API
    setRedirectingPlan(planId);

    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/billing/redirect?planId=${planId}`,
        {
          credentials: 'include',
          headers
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.url) {
          // Redirect to appropriate URL (payment link or portal)
          window.location.href = data.url;
          return;
        }
      }

      // Fallback to direct payment link if API fails
      const link = paymentLinks[planId as keyof typeof paymentLinks];
      if (link) {
        window.location.href = link;
      } else {
        window.location.href = `/checkout?plan=${planId}`;
      }
    } catch (error) {
      console.error('Failed to get redirect URL:', error);
      // Fallback to direct payment link
      const link = paymentLinks[planId as keyof typeof paymentLinks];
      if (link) {
        window.location.href = link;
      }
    } finally {
      setRedirectingPlan(null);
    }
  };

  const tiers = [
    {
      icon: Zap,
      name: "Starter",
      planId: "starter",
      price: 49,
      callsIncluded: 100,
      description: "Perfect for solo businesses",
      volume: "100 calls/month",
      highlight: null,
      features: [
        { text: "100 inbound calls/month", highlight: false },
        { text: "Google Calendar sync", highlight: false },
        { text: "24/7 AI call answering", highlight: true },
        { text: "Smart message taking", highlight: false },
        { text: "Custom voice greeting", highlight: false },
        { text: "Email notifications", highlight: false },
      ],
      cta: "Start 5-Day Free Trial",
      popular: false,
    },
    {
      icon: Rocket,
      name: "Growth",
      planId: "growth",
      price: 199,
      callsIncluded: 500,
      description: "For growing businesses",
      volume: "500 calls/month",
      highlight: "Best Value",
      features: [
        { text: "500 inbound calls/month", highlight: false },
        { text: "Google + Outlook Calendar", highlight: true },
        { text: "24/7 AI call answering", highlight: false },
        { text: "Email notifications", highlight: false },
        { text: "Smart message taking", highlight: false },
        { text: "Business hours support", highlight: false },
      ],
      cta: "Start 5-Day Free Trial",
      popular: true,
    },
    {
      icon: Crown,
      name: "Pro",
      planId: "pro",
      price: 599,
      callsIncluded: 1500,
      outboundCalls: 200,
      description: "For high-volume businesses",
      volume: "1500+ calls/month",
      highlight: "Full Power",
      features: [
        { text: "1,500 inbound calls/month", highlight: false },
        { text: "200 AI voice reminder calls", highlight: true },
        { text: "Multi-staff calendar", highlight: true },
        { text: "Webhook integrations", highlight: true },
        { text: "24/7 priority support", highlight: false },
        { text: "Dedicated account manager", highlight: false },
      ],
      cta: "Start 5-Day Free Trial",
      popular: false,
    },
  ];

  const trialBenefits = [
    { icon: Gift, text: "Full access to all features" },
    { icon: Shield, text: "No credit card required" },
    { icon: Clock, text: "Cancel anytime, no questions" },
    { icon: Phone, text: "Your own Irish phone number" },
  ];

  return (
    <section id="pricing" className="py-16 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Trial Banner */}
        <div className="max-w-4xl mx-auto mb-10 lg:mb-14">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary/90 to-accent p-6 sm:p-8">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex w-14 h-14 rounded-full bg-white/20 items-center justify-center">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Try Free for 5 Days
                  </h3>
                  <p className="text-white/90 text-sm sm:text-base">
                    Experience the full power of AI call handling - no credit card needed
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                {trialBenefits.slice(0, 2).map((benefit, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                    <benefit.icon className="w-3.5 h-3.5" />
                    {benefit.text}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto text-center mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
            Simple, <span className="text-gradient-primary">Transparent</span> Pricing
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground">
            No hidden fees. No contracts. Pay only for what you use.
            <span className="font-semibold text-foreground"> Cancel anytime.</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 mb-10">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`relative bg-card rounded-2xl border shadow-elegant overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                tier.popular
                  ? "border-primary ring-2 ring-primary/20 order-first lg:order-none lg:scale-105"
                  : "border-border"
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-hero py-2.5 text-center">
                  <span className="text-xs font-bold text-primary-foreground uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
              )}

              <div className={`p-5 sm:p-8 ${tier.popular ? "pt-12 sm:pt-14" : ""}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    tier.popular ? "bg-gradient-hero" : "bg-primary/10"
                  }`}>
                    <tier.icon className={`w-6 h-6 ${
                      tier.popular ? "text-primary-foreground" : "text-primary"
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-heading font-bold text-foreground">
                        {tier.name}
                      </h3>
                      {tier.highlight && (
                        <span className="text-[10px] font-bold uppercase tracking-wide bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                          {tier.highlight}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{tier.description}</p>
                  </div>
                </div>

                <div className="mb-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-heading font-bold text-foreground">
                      &euro;{tier.price}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-accent font-semibold mt-1">
                    {tier.callsIncluded} calls included
                    {tier.outboundCalls && ` + ${tier.outboundCalls} outbound`}
                  </p>
                </div>

                {/* Volume badge */}
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-xs font-semibold text-primary bg-primary/10 py-1.5 px-3 rounded-full">
                    {tier.volume}
                  </span>
                </div>

                {/* Features list */}
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, i) => (
                    <li key={i} className={`flex items-start gap-2.5 text-sm ${
                      feature.highlight ? "text-foreground font-medium" : "text-foreground/80"
                    }`}>
                      <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                        feature.highlight ? "text-accent" : "text-muted-foreground"
                      }`} />
                      <span>
                        {feature.text}
                        {feature.highlight && (
                          <span className="ml-1.5 inline-flex items-center text-[10px] font-bold uppercase text-accent">
                            <Sparkles className="w-3 h-3 mr-0.5" />
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Trial highlight */}
                <div className={`mb-5 p-3 rounded-lg border-2 border-dashed ${
                  tier.popular ? "border-primary/40 bg-primary/5" : "border-accent/30 bg-accent/5"
                }`}>
                  <div className="flex items-center justify-center gap-2 text-sm font-semibold">
                    <Gift className={`w-4 h-4 ${tier.popular ? "text-primary" : "text-accent"}`} />
                    <span className={tier.popular ? "text-primary" : "text-accent"}>
                      5 Days Free - No Card Required
                    </span>
                  </div>
                </div>

                <Button
                  variant={tier.popular ? "hero" : "outline"}
                  size="lg"
                  className={`w-full font-semibold ${
                    tier.popular ? "shadow-lg shadow-primary/25" : ""
                  }`}
                  onClick={() => handleGetStarted(tier.planId)}
                  disabled={redirectingPlan !== null}
                >
                  {redirectingPlan === tier.planId ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Loading...
                    </span>
                  ) : tier.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Trial benefits bar */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="bg-muted/60 rounded-xl p-4 sm:p-5 border border-border/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {trialBenefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-foreground/80 text-xs sm:text-sm font-medium">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* All plans include */}
        <div className="bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto border border-border/50">
          <div className="text-center mb-5">
            <h3 className="text-lg font-heading font-bold text-foreground mb-1">
              Included with Every Plan
            </h3>
            <p className="text-sm text-muted-foreground">
              All the essentials to get you started right away
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Phone, text: "Irish phone number" },
              { icon: Sparkles, text: "AI receptionist" },
              { icon: Clock, text: "24/7 availability" },
              { icon: Shield, text: "Free setup & support" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center p-3 rounded-xl bg-background/60 border border-border/30">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-foreground">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
