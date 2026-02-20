"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Check, Zap, Rocket, Crown, Gift, Clock, Shield, Phone, Sparkles, Globe, Star, X } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { signInWithGoogle } from "@/lib/supabase";
import { trackEvent } from "@/lib/umami";
import { useRegion } from "@/hooks/useRegion";
import { REVIEW_PLATFORMS } from "@/lib/marketing/review-platforms";

type Region = 'EU' | 'AR';
type ComparisonValue = boolean | string;

interface ComparisonRow {
  category: string;
  feature: string;
  starter: ComparisonValue;
  growth: ComparisonValue;
  pro: ComparisonValue;
}

// Get payment links based on stripe mode, billing period, and region
const getPaymentLinks = (isAnnual: boolean = false, region: Region = 'EU') => {
  const isLiveMode = process.env.NEXT_PUBLIC_STRIPE_MODE === "live";

  // Argentina (USD) links
  if (region === 'AR') {
    if (isAnnual) {
      return isLiveMode ? {
        starter: process.env.NEXT_PUBLIC_STRIPE_LIVE_LINK_STARTER_ANNUAL_AR,
        growth: process.env.NEXT_PUBLIC_STRIPE_LIVE_LINK_GROWTH_ANNUAL_AR,
        pro: process.env.NEXT_PUBLIC_STRIPE_LIVE_LINK_PRO_ANNUAL_AR,
      } : {
        starter: process.env.NEXT_PUBLIC_STRIPE_TEST_LINK_STARTER_ANNUAL_AR,
        growth: process.env.NEXT_PUBLIC_STRIPE_TEST_LINK_GROWTH_ANNUAL_AR,
        pro: process.env.NEXT_PUBLIC_STRIPE_TEST_LINK_PRO_ANNUAL_AR,
      };
    }
    return isLiveMode ? {
      starter: process.env.NEXT_PUBLIC_STRIPE_LIVE_LINK_STARTER_AR,
      growth: process.env.NEXT_PUBLIC_STRIPE_LIVE_LINK_GROWTH_AR,
      pro: process.env.NEXT_PUBLIC_STRIPE_LIVE_LINK_PRO_AR,
    } : {
      starter: process.env.NEXT_PUBLIC_STRIPE_TEST_LINK_STARTER_AR,
      growth: process.env.NEXT_PUBLIC_STRIPE_TEST_LINK_GROWTH_AR,
      pro: process.env.NEXT_PUBLIC_STRIPE_TEST_LINK_PRO_AR,
    };
  }

  // Ireland/Europe (EUR) links - default
  if (isAnnual) {
    return isLiveMode ? {
      starter: process.env.NEXT_PUBLIC_STRIPE_LIVE_LINK_STARTER_ANNUAL,
      growth: process.env.NEXT_PUBLIC_STRIPE_LIVE_LINK_GROWTH_ANNUAL,
      pro: process.env.NEXT_PUBLIC_STRIPE_LIVE_LINK_PRO_ANNUAL,
    } : {
      starter: process.env.NEXT_PUBLIC_STRIPE_TEST_LINK_STARTER_ANNUAL,
      growth: process.env.NEXT_PUBLIC_STRIPE_TEST_LINK_GROWTH_ANNUAL,
      pro: process.env.NEXT_PUBLIC_STRIPE_TEST_LINK_PRO_ANNUAL,
    };
  }

  return isLiveMode ? {
    starter: process.env.NEXT_PUBLIC_STRIPE_LIVE_LINK_STARTER_V3,
    growth: process.env.NEXT_PUBLIC_STRIPE_LIVE_LINK_GROWTH_V3,
    pro: process.env.NEXT_PUBLIC_STRIPE_LIVE_LINK_PRO_V3,
  } : {
    starter: process.env.NEXT_PUBLIC_STRIPE_TEST_LINK_STARTER_V3,
    growth: process.env.NEXT_PUBLIC_STRIPE_TEST_LINK_GROWTH_V3,
    pro: process.env.NEXT_PUBLIC_STRIPE_TEST_LINK_PRO_V3,
  };
};

// Regional pricing configuration
const REGIONAL_PRICING = {
  EU: {
    currency: '€',
    currencyCode: 'EUR',
    label: 'Ireland / Europe',
    flag: '🇮🇪',
    starter: { monthly: 99, annual: 999, minutes: 500, calls: '~200', overage: '€0.20' },
    growth: { monthly: 299, annual: 2999, minutes: 1000, calls: '~400', overage: '€0.30' },
    pro: { monthly: 599, annual: 5999, minutes: 2000, calls: '~800', overage: '€0.30' },
    phoneNumber: 'Irish phone number',
  },
  AR: {
    currency: '$',
    currencyCode: 'USD',
    label: 'Argentina',
    flag: '🇦🇷',
    starter: { monthly: 49, annual: 499, minutes: 250, calls: '~100', overage: '$0.20' },
    growth: { monthly: 149, annual: 1499, minutes: 500, calls: '~200', overage: '$0.30' },
    pro: { monthly: 299, annual: 2999, minutes: 1000, calls: '~400', overage: '$0.30' },
    phoneNumber: 'Argentine phone number',
  },
};

const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const { region: detectedRegion } = useRegion();
  const region: Region = detectedRegion === 'AR' ? 'AR' : 'EU';
  const paymentLinks = getPaymentLinks(isAnnual, region);
  const pricing = REGIONAL_PRICING[region];
  const { isAuthenticated, token } = useAuthStore();
  // Get checkAuth with a stable reference to avoid infinite loops
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const [redirectingPlan, setRedirectingPlan] = useState<string | null>(null);
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    // Only check auth once on mount
    if (!hasCheckedAuth.current) {
      hasCheckedAuth.current = true;
      checkAuth();
    }
  }, [checkAuth]);

  const handleGetStarted = async (planId: string) => {
    trackEvent("plan_selected", { plan: planId, region, billing: isAnnual ? "annual" : "monthly" });

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

  // Generate tiers based on selected region
  const tiers = [
    {
      icon: Zap,
      name: "Starter",
      planId: "starter",
      monthlyPrice: pricing.starter.monthly,
      annualPrice: pricing.starter.annual,
      minutesIncluded: pricing.starter.minutes,
      estimatedCalls: pricing.starter.calls,
      parallelCalls: 1,
      perMinuteRate: pricing.starter.overage,
      description: "Perfect for solo businesses",
      volume: `${pricing.starter.minutes.toLocaleString()} min/month`,
      highlight: null,
      features: [
        { text: `${pricing.starter.minutes.toLocaleString()} minutes/month (${pricing.starter.calls} calls)`, highlight: true },
        { text: "1 parallel call", highlight: false },
        { text: "24/7 AI receptionist", highlight: false },
        { text: "Appointment booking", highlight: false },
        { text: "Emergency flagging", highlight: false },
        { text: "Calendar integration", highlight: false },
        { text: "7-day call recordings", highlight: false },
        { text: "Email support", highlight: false },
      ],
      cta: "Start 5-Day Free Trial",
      popular: false,
    },
    {
      icon: Rocket,
      name: "Growth",
      planId: "growth",
      monthlyPrice: pricing.growth.monthly,
      annualPrice: pricing.growth.annual,
      minutesIncluded: pricing.growth.minutes,
      estimatedCalls: pricing.growth.calls,
      parallelCalls: 3,
      perMinuteRate: pricing.growth.overage,
      description: "For growing businesses",
      volume: `${pricing.growth.minutes.toLocaleString()} min/month`,
      highlight: "Best Value",
      features: [
        { text: `${pricing.growth.minutes.toLocaleString()} minutes/month (${pricing.growth.calls} calls)`, highlight: true },
        { text: "3 parallel calls", highlight: true },
        { text: "24/7 AI receptionist", highlight: false },
        { text: "Appointment booking", highlight: false },
        { text: "Custom voice & scripts", highlight: true },
        { text: "Transfer to human", highlight: true },
        { text: "30-day call recordings", highlight: false },
        { text: "Priority support", highlight: false },
      ],
      cta: "Start 5-Day Free Trial",
      popular: true,
    },
    {
      icon: Crown,
      name: "Pro",
      planId: "pro",
      monthlyPrice: pricing.pro.monthly,
      annualPrice: pricing.pro.annual,
      minutesIncluded: pricing.pro.minutes,
      estimatedCalls: pricing.pro.calls,
      parallelCalls: 5,
      perMinuteRate: pricing.pro.overage,
      description: "For high-volume businesses",
      volume: `${pricing.pro.minutes.toLocaleString()} min/month`,
      highlight: "Full Power",
      features: [
        { text: `${pricing.pro.minutes.toLocaleString()} minutes/month (${pricing.pro.calls} calls)`, highlight: true },
        { text: "5 parallel calls", highlight: true },
        { text: "24/7 AI receptionist", highlight: false },
        { text: "Custom voice & scripts", highlight: false },
        { text: "Transfer to human", highlight: false },
        { text: "90-day call recordings", highlight: true },
        { text: "Early access to features", highlight: true },
        { text: "Dedicated support", highlight: true },
      ],
      cta: "Start 5-Day Free Trial",
      popular: false,
    },
  ];

  const trialBenefits = [
    { icon: Gift, text: "Full access to all features" },
    { icon: Shield, text: "No credit card required" },
    { icon: Clock, text: "Cancel anytime, no questions" },
    { icon: Phone, text: `Your own ${pricing.phoneNumber}` },
  ];

  const testimonials = [
    {
      quote: "We no longer miss booking calls while the team is busy with patients.",
      source: "Practice manager",
      segment: "Dental clinic",
      impact: "Fewer dropped opportunities during peak hours",
    },
    {
      quote: "Evening and weekend callers now get a real answer instead of voicemail.",
      source: "Restaurant owner",
      segment: "Hospitality",
      impact: "Improved reservation capture after hours",
    },
    {
      quote: "Urgent calls are routed fast, while routine questions are handled automatically.",
      source: "Operations lead",
      segment: "Home services",
      impact: "Faster triage with cleaner call notes",
    },
  ];

  const comparisonRows: ComparisonRow[] = [
    {
      category: "Volume & Billing",
      feature: "Included minutes / month",
      starter: pricing.starter.minutes.toLocaleString(),
      growth: pricing.growth.minutes.toLocaleString(),
      pro: pricing.pro.minutes.toLocaleString(),
    },
    {
      category: "Volume & Billing",
      feature: "Approx. calls / month",
      starter: pricing.starter.calls,
      growth: pricing.growth.calls,
      pro: pricing.pro.calls,
    },
    {
      category: "Volume & Billing",
      feature: "Parallel call capacity",
      starter: "1",
      growth: "3",
      pro: "5",
    },
    {
      category: "Volume & Billing",
      feature: "Overage rate",
      starter: `${pricing.starter.overage}/min`,
      growth: `${pricing.growth.overage}/min`,
      pro: `${pricing.pro.overage}/min`,
    },
    {
      category: "Volume & Billing",
      feature: "Pricing model",
      starter: "Minutes based",
      growth: "Minutes based",
      pro: "Minutes based",
    },
    {
      category: "Volume & Billing",
      feature: "No per-call charges",
      starter: true,
      growth: true,
      pro: true,
    },
    {
      category: "Volume & Billing",
      feature: "Monthly billing",
      starter: true,
      growth: true,
      pro: true,
    },
    {
      category: "Volume & Billing",
      feature: "Annual billing option",
      starter: true,
      growth: true,
      pro: true,
    },
    {
      category: "Volume & Billing",
      feature: "Annual discount",
      starter: "Save 16%",
      growth: "Save 16%",
      pro: "Save 16%",
    },
    {
      category: "Volume & Billing",
      feature: "Free trial length",
      starter: "5 days",
      growth: "5 days",
      pro: "5 days",
    },
    {
      category: "Volume & Billing",
      feature: "Credit card required for trial",
      starter: false,
      growth: false,
      pro: false,
    },
    {
      category: "Volume & Billing",
      feature: "Setup fee",
      starter: false,
      growth: false,
      pro: false,
    },
    {
      category: "Volume & Billing",
      feature: "Contract lock-in",
      starter: false,
      growth: false,
      pro: false,
    },
    {
      category: "Volume & Billing",
      feature: "Cancel anytime",
      starter: true,
      growth: true,
      pro: true,
    },
    {
      category: "Volume & Billing",
      feature: "Local business number included",
      starter: true,
      growth: true,
      pro: true,
    },
    {
      category: "Call Handling & Automation",
      feature: "24/7 AI call answering",
      starter: true,
      growth: true,
      pro: true,
    },
    {
      category: "Call Handling & Automation",
      feature: "Appointment booking",
      starter: true,
      growth: true,
      pro: true,
    },
    {
      category: "Call Handling & Automation",
      feature: "Calendar integrations",
      starter: true,
      growth: true,
      pro: true,
    },
    {
      category: "Call Handling & Automation",
      feature: "Emergency flagging",
      starter: true,
      growth: true,
      pro: true,
    },
    {
      category: "Call Handling & Automation",
      feature: "Message capture",
      starter: true,
      growth: true,
      pro: true,
    },
    {
      category: "Call Handling & Automation",
      feature: "FAQ and service question handling",
      starter: true,
      growth: true,
      pro: true,
    },
    {
      category: "Call Handling & Automation",
      feature: "After-hours coverage",
      starter: true,
      growth: true,
      pro: true,
    },
    {
      category: "Call Handling & Automation",
      feature: "Call summaries and notes",
      starter: true,
      growth: true,
      pro: true,
    },
    {
      category: "Call Handling & Automation",
      feature: "Transfer to human staff",
      starter: false,
      growth: true,
      pro: true,
    },
    {
      category: "Call Handling & Automation",
      feature: "Custom scripts and workflows",
      starter: false,
      growth: true,
      pro: true,
    },
    {
      category: "Call Handling & Automation",
      feature: "Voice personalization",
      starter: false,
      growth: true,
      pro: true,
    },
    {
      category: "Call Handling & Automation",
      feature: "Call recording retention",
      starter: "7 days",
      growth: "30 days",
      pro: "90 days",
    },
    {
      category: "Support & Compliance",
      feature: "Support tier",
      starter: "Email",
      growth: "Priority",
      pro: "Dedicated",
    },
    {
      category: "Support & Compliance",
      feature: "Priority support",
      starter: false,
      growth: true,
      pro: true,
    },
    {
      category: "Support & Compliance",
      feature: "Dedicated support manager",
      starter: false,
      growth: false,
      pro: true,
    },
    {
      category: "Support & Compliance",
      feature: "Free setup and onboarding support",
      starter: true,
      growth: true,
      pro: true,
    },
    {
      category: "Support & Compliance",
      feature: "EU data residency options",
      starter: true,
      growth: true,
      pro: true,
    },
    {
      category: "Support & Compliance",
      feature: "GDPR-ready deployment",
      starter: true,
      growth: true,
      pro: true,
    },
    {
      category: "Support & Compliance",
      feature: "EU AI Act-aligned workflows",
      starter: true,
      growth: true,
      pro: true,
    },
    {
      category: "Support & Compliance",
      feature: "Presence on Trustpilot, G2, and Capterra",
      starter: true,
      growth: true,
      pro: true,
    },
  ];

  const renderComparisonValue = (value: ComparisonValue) => {
    if (value === true) {
      return (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent/15">
          <Check className="h-3.5 w-3.5 text-accent" />
        </span>
      );
    }

    if (value === false) {
      return (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted">
          <X className="h-3.5 w-3.5 text-muted-foreground" />
        </span>
      );
    }

    return <span className="text-xs sm:text-sm font-medium text-foreground/85">{value}</span>;
  };

  return (
    <section id="pricing" className="py-16 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Trial Banner */}
        <div className="max-w-4xl mx-auto mb-10 lg:mb-14">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary/90 to-accent p-6 sm:p-8">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%22120%22%20height%3D%22120%22%20viewBox%3D%220%200%20120%20120%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cdefs%3E%3Cpattern%20id%3D%22g%22%20width%3D%2220%22%20height%3D%2220%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Cpath%20d%3D%22M20%200H0V20%22%20stroke%3D%22white%22%20stroke-opacity%3D%220.28%22%20stroke-width%3D%221%22%20fill%3D%22none%22%2F%3E%3C%2Fpattern%3E%3C%2Fdefs%3E%3Crect%20width%3D%22120%22%20height%3D%22120%22%20fill%3D%22url(%23g)%22%2F%3E%3C%2Fsvg%3E')] opacity-10" />
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

          {/* Billing Toggle */}
          <div className="flex justify-center mt-6">
            <div className="bg-muted rounded-full p-1 flex">
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  !isAnnual ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => { setIsAnnual(false); trackEvent("billing_toggle", { period: "monthly" }); }}
              >
                Monthly
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  isAnnual ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => { setIsAnnual(true); trackEvent("billing_toggle", { period: "annual" }); }}
              >
                Annual <span className="text-accent font-semibold">(Save 16%)</span>
              </button>
            </div>
          </div>

          {/* Region indicator */}
          <div className="flex justify-center mt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="w-4 h-4" />
              <span>Pricing for {pricing.label}</span>
            </div>
          </div>
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
                      {pricing.currency}{isAnnual ? tier.annualPrice.toLocaleString() : tier.monthlyPrice}
                    </span>
                    <span className="text-muted-foreground">/{isAnnual ? 'year' : 'month'}</span>
                  </div>
                  <p className="text-sm text-accent font-semibold mt-1">
                    {tier.minutesIncluded.toLocaleString()} minutes included ({tier.estimatedCalls} calls)
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {tier.perMinuteRate}/min overage
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

        <div className="max-w-6xl mx-auto mb-10 lg:mb-12">
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-elegant">
            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-heading font-bold text-foreground mb-2">
                Social Proof Buyers Expect
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Public review-platform presence plus real workflow feedback from teams evaluating VoiceFleet.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 mb-6">
              {REVIEW_PLATFORMS.map((platform) => (
                <a
                  key={platform.id}
                  href={platform.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3 hover:border-primary/40 transition-colors"
                >
                  <span className="inline-flex items-center gap-2.5">
                    <Image
                      src={platform.logo}
                      alt={platform.name}
                      width={20}
                      height={20}
                      className="h-5 w-5 object-contain"
                    />
                    <span className="text-sm font-semibold text-foreground">{platform.name}</span>
                  </span>
                  <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
                    {platform.status}
                  </span>
                </a>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {testimonials.map((testimonial) => (
                <div key={testimonial.quote} className="rounded-xl border border-border bg-background p-4">
                  <div className="mb-3 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={`${testimonial.source}-${index}`} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/85 leading-relaxed mb-3">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <p className="text-xs font-semibold text-foreground">{testimonial.source} · {testimonial.segment}</p>
                  <p className="text-xs text-muted-foreground mt-1">{testimonial.impact}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mb-12 lg:mb-14">
          <div className="text-center mb-6">
            <h3 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-2">
              Full Plan Comparison
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Compare 30+ line items across Starter, Growth, and Pro before you choose a plan.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-elegant">
            <table className="w-full min-w-[880px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Capability
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-foreground">Starter</th>
                  <th className="px-4 py-4 text-center">
                    <span className="inline-flex flex-col items-center">
                      <span className="text-sm font-semibold text-primary">Growth</span>
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-accent">Most Popular</span>
                    </span>
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-foreground">Pro</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, index) => {
                  const showCategory = index === 0 || comparisonRows[index - 1].category !== row.category;

                  return (
                    <Fragment key={`${row.category}-${row.feature}`}>
                      {showCategory && (
                        <tr className="border-y border-border bg-muted/40">
                          <td colSpan={4} className="px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                            {row.category}
                          </td>
                        </tr>
                      )}
                      <tr className="border-b border-border/70">
                        <td className="px-4 py-3.5 text-sm font-medium text-foreground">{row.feature}</td>
                        <td className="px-4 py-3.5 text-center">{renderComparisonValue(row.starter)}</td>
                        <td className="px-4 py-3.5 text-center bg-primary/5">{renderComparisonValue(row.growth)}</td>
                        <td className="px-4 py-3.5 text-center">{renderComparisonValue(row.pro)}</td>
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
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
              { icon: Phone, text: pricing.phoneNumber },
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
