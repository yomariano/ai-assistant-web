"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Zap, Rocket, Crown } from "lucide-react";
import { useAuthStore } from "@/lib/store";

// Get payment links based on stripe mode
const getPaymentLinks = () => {
  const isLiveMode = process.env.NEXT_PUBLIC_STRIPE_MODE === "live";

  if (isLiveMode) {
    return {
      starter: process.env.NEXT_PUBLIC_STRIPE_LIVE_LINK_STARTER,
      growth: process.env.NEXT_PUBLIC_STRIPE_LIVE_LINK_GROWTH,
      scale: process.env.NEXT_PUBLIC_STRIPE_LIVE_LINK_SCALE,
    };
  }

  return {
    starter: process.env.NEXT_PUBLIC_STRIPE_TEST_LINK_STARTER,
    growth: process.env.NEXT_PUBLIC_STRIPE_TEST_LINK_GROWTH,
    scale: process.env.NEXT_PUBLIC_STRIPE_TEST_LINK_SCALE,
  };
};

const PricingSection = () => {
  const paymentLinks = getPaymentLinks();
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [authChecked, setAuthChecked] = useState(false);
  const [redirectingPlan, setRedirectingPlan] = useState<string | null>(null);

  useEffect(() => {
    checkAuth().then(() => setAuthChecked(true));
  }, [checkAuth]);

  const handleGetStarted = async (planId: string) => {
    // If user is not authenticated, redirect to login with plan
    if (!isAuthenticated) {
      // Store the selected plan for after login
      sessionStorage.setItem('selectedPlan', planId);
      window.location.href = `/login?plan=${planId}`;
      return;
    }

    // User is authenticated - check subscription status via API
    setRedirectingPlan(planId);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/billing/redirect?planId=${planId}`,
        { credentials: 'include' }
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
      name: "Lite",
      planId: "starter",
      price: 19,
      perCall: 0.95,
      description: "Perfect for solo practitioners",
      volume: "< 100 calls/month",
      features: [
        "1 phone number",
        "Pay per call",
        "24/7 call answering",
        "Message taking",
        "SMS notifications",
        "Custom greeting",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      icon: Rocket,
      name: "Growth",
      planId: "growth",
      price: 99,
      perCall: 0.45,
      description: "For busy small businesses",
      volume: "100-400 calls/month",
      features: [
        "2 phone numbers",
        "Lower per-call rate",
        "Appointment booking",
        "SMS + Email notifications",
        "Calendar integration",
        "Analytics dashboard",
        "FAQ handling",
      ],
      cta: "Get Started",
      popular: true,
    },
    {
      icon: Crown,
      name: "Pro",
      planId: "scale",
      price: 249,
      perCall: null,
      description: "For multi-location businesses",
      volume: "400+ calls/month",
      features: [
        "5 phone numbers",
        "Unlimited calls*",
        "Full feature set",
        "Multi-location support",
        "Priority 24/7 support",
        "Advanced analytics",
        "Custom integrations",
        "Dedicated account manager",
      ],
      cta: "Get Started",
      popular: false,
    },
  ];

  const includedFeatures = [
    "AI receptionist",
    "Irish phone number",
    "Message notifications",
    "Free setup & support",
  ];

  return (
    <section id="pricing" className="py-16 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
            Simple, <span className="text-gradient-primary">Transparent</span> Pricing
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground">
            No hidden fees. No contracts. Pay for what you use.
            <span className="font-semibold text-foreground"> Cancel anytime.</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`relative bg-card rounded-2xl border shadow-elegant overflow-hidden ${
                tier.popular
                  ? "border-primary ring-2 ring-primary/20 order-first lg:order-none"
                  : "border-border"
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-hero py-2 text-center">
                  <span className="text-xs font-semibold text-primary-foreground uppercase tracking-wide">
                    Most Popular
                  </span>
                </div>
              )}

              <div className={`p-5 sm:p-8 ${tier.popular ? "pt-10 sm:pt-12" : ""}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    tier.popular ? "bg-gradient-hero" : "bg-primary/10"
                  }`}>
                    <tier.icon className={`w-6 h-6 ${
                      tier.popular ? "text-primary-foreground" : "text-primary"
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold text-foreground">
                      {tier.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{tier.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-heading font-bold text-foreground">
                      &euro;{tier.price}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  {tier.perCall !== null ? (
                    <p className="text-sm text-muted-foreground mt-1">
                      + &euro;{tier.perCall.toFixed(2)} per call
                    </p>
                  ) : (
                    <p className="text-sm text-accent font-medium mt-1">
                      Unlimited calls included*
                    </p>
                  )}
                </div>

                <p className="text-xs font-medium text-primary mb-4 bg-primary/5 py-1 px-2 rounded inline-block">
                  {tier.volume}
                </p>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                      <Check className="w-4 h-4 text-accent flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={tier.popular ? "hero" : "outline"}
                  size="lg"
                  className="w-full"
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

        <div className="text-center mb-8">
          <p className="text-xs text-muted-foreground">
            * Fair use policy: 1,500 calls/month cap on Pro plan
          </p>
        </div>

        <div className="bg-muted/50 rounded-xl p-4 sm:p-6 max-w-2xl mx-auto">
          <p className="text-center text-sm text-muted-foreground mb-4">
            <span className="font-semibold text-foreground">All plans include:</span>
          </p>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-3 sm:gap-4">
            {includedFeatures.map((feature, i) => (
              <span key={i} className="flex items-center gap-2 text-xs sm:text-sm text-foreground">
                <Check className="w-4 h-4 text-accent flex-shrink-0" />
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
