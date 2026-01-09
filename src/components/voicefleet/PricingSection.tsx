"use client";

import { Button } from "@/components/ui/button";
import { Check, Zap, Rocket, Crown } from "lucide-react";

const PricingSection = () => {
  const handleGetStarted = (planId: string) => {
    // Redirect directly to checkout - dashboard layout will handle auth
    window.location.href = `/checkout?plan=${planId}`;
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
                >
                  {tier.cta}
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
