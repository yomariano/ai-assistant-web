"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Check, Zap, Rocket, Crown, Gift, Clock, Shield, Phone, Sparkles, Globe } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { signInWithGoogle } from "@/lib/supabase";

type Region = 'EU' | 'AR';

const getPaymentLinks = (isAnnual: boolean = false, region: Region = 'EU') => {
  const isLiveMode = process.env.NEXT_PUBLIC_STRIPE_MODE === "live";

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

const REGIONAL_PRICING = {
  EU: {
    currency: '\u20ac',
    currencyCode: 'EUR',
    label: 'Irlanda / Europa',
    flag: '\ud83c\uddee\ud83c\uddea',
    starter: { monthly: 99, annual: 999, minutes: 500, calls: '~200', overage: '\u20ac0.20' },
    growth: { monthly: 299, annual: 2999, minutes: 1000, calls: '~400', overage: '\u20ac0.30' },
    pro: { monthly: 599, annual: 5999, minutes: 2000, calls: '~800', overage: '\u20ac0.30' },
    phoneNumber: 'Número irlandés',
  },
  AR: {
    currency: '$',
    currencyCode: 'USD',
    label: 'Argentina',
    flag: '\ud83c\udde6\ud83c\uddf7',
    starter: { monthly: 49, annual: 499, minutes: 250, calls: '~100', overage: '$0.20' },
    growth: { monthly: 149, annual: 1499, minutes: 500, calls: '~200', overage: '$0.30' },
    pro: { monthly: 299, annual: 2999, minutes: 1000, calls: '~400', overage: '$0.30' },
    phoneNumber: 'Número argentino',
  },
};

const PricingSectionES = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [region, setRegion] = useState<Region>('AR');
  const paymentLinks = getPaymentLinks(isAnnual, region);
  const pricing = REGIONAL_PRICING[region];
  const { isAuthenticated, token } = useAuthStore();
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const [authChecked, setAuthChecked] = useState(false);
  const [redirectingPlan, setRedirectingPlan] = useState<string | null>(null);
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    if (!hasCheckedAuth.current) {
      hasCheckedAuth.current = true;
      checkAuth().then(() => setAuthChecked(true));
    }
  }, [checkAuth]);

  const handleGetStarted = async (planId: string) => {
    if (!isAuthenticated) {
      sessionStorage.setItem('selectedPlan', planId);
      setRedirectingPlan(planId);
      try {
        await signInWithGoogle();
      } catch (error) {
        console.error("Failed to start Google OAuth:", error);
        setRedirectingPlan(null);
      }
      return;
    }

    setRedirectingPlan(planId);

    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/billing/redirect?planId=${planId}`,
        { credentials: 'include', headers }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        }
      }

      const link = paymentLinks[planId as keyof typeof paymentLinks];
      if (link) {
        window.location.href = link;
      } else {
        window.location.href = `/checkout?plan=${planId}`;
      }
    } catch (error) {
      console.error('Failed to get redirect URL:', error);
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
      monthlyPrice: pricing.starter.monthly,
      annualPrice: pricing.starter.annual,
      minutesIncluded: pricing.starter.minutes,
      estimatedCalls: pricing.starter.calls,
      parallelCalls: 1,
      perMinuteRate: pricing.starter.overage,
      description: "Ideal para negocios individuales",
      volume: `${pricing.starter.minutes.toLocaleString()} min/mes`,
      highlight: null,
      features: [
        { text: `${pricing.starter.minutes.toLocaleString()} minutos/mes (${pricing.starter.calls} llamadas)`, highlight: true },
        { text: "1 llamada simultánea", highlight: false },
        { text: "Recepcionista IA 24/7", highlight: false },
        { text: "Agenda de turnos", highlight: false },
        { text: "Marcado de urgencias", highlight: false },
        { text: "Integración con calendario", highlight: false },
        { text: "Grabaciones por 7 días", highlight: false },
        { text: "Soporte por email", highlight: false },
      ],
      cta: "Probá 5 Días Gratis",
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
      description: "Para negocios en crecimiento",
      volume: `${pricing.growth.minutes.toLocaleString()} min/mes`,
      highlight: "Mejor Valor",
      features: [
        { text: `${pricing.growth.minutes.toLocaleString()} minutos/mes (${pricing.growth.calls} llamadas)`, highlight: true },
        { text: "3 llamadas simultáneas", highlight: true },
        { text: "Recepcionista IA 24/7", highlight: false },
        { text: "Agenda de turnos", highlight: false },
        { text: "Voz y guiones personalizados", highlight: true },
        { text: "Transferencia a humano", highlight: true },
        { text: "Grabaciones por 30 días", highlight: false },
        { text: "Soporte prioritario", highlight: false },
      ],
      cta: "Probá 5 Días Gratis",
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
      description: "Para negocios de alto volumen",
      volume: `${pricing.pro.minutes.toLocaleString()} min/mes`,
      highlight: "Potencia Total",
      features: [
        { text: `${pricing.pro.minutes.toLocaleString()} minutos/mes (${pricing.pro.calls} llamadas)`, highlight: true },
        { text: "5 llamadas simultáneas", highlight: true },
        { text: "Recepcionista IA 24/7", highlight: false },
        { text: "Voz y guiones personalizados", highlight: false },
        { text: "Transferencia a humano", highlight: false },
        { text: "Grabaciones por 90 días", highlight: true },
        { text: "Acceso anticipado a funciones", highlight: true },
        { text: "Soporte dedicado", highlight: true },
      ],
      cta: "Probá 5 Días Gratis",
      popular: false,
    },
  ];

  const trialBenefits = [
    { icon: Gift, text: "Acceso completo a todas las funciones" },
    { icon: Shield, text: "Sin tarjeta de crédito" },
    { icon: Clock, text: "Cancelá cuando quieras" },
    { icon: Phone, text: `Tu propio ${pricing.phoneNumber}` },
  ];

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
                    Probá Gratis por 5 Días
                  </h3>
                  <p className="text-white/90 text-sm sm:text-base">
                    Experimentá todo el poder de la atención telefónica con IA - sin tarjeta de crédito
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
            Precios <span className="text-gradient-primary">Simples y Transparentes</span>
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground">
            Sin costos ocultos. Sin contratos. Pagá solo por lo que usás.
            <span className="font-semibold text-foreground"> Cancelá cuando quieras.</span>
          </p>

          {/* Billing Toggle */}
          <div className="flex justify-center mt-6">
            <div className="bg-muted rounded-full p-1 flex">
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  !isAnnual ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setIsAnnual(false)}
              >
                Mensual
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  isAnnual ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setIsAnnual(true)}
              >
                Anual <span className="text-accent font-semibold">(Ahorrá 16%)</span>
              </button>
            </div>
          </div>

          {/* Region Selector */}
          <div className="flex justify-center mt-4">
            <div className="flex items-center gap-2 text-sm">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Precios para:</span>
              <div className="bg-muted rounded-lg p-0.5 flex">
                <button
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 ${
                    region === 'EU' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setRegion('EU')}
                >
                  <span>{'\ud83c\uddee\ud83c\uddea'}</span> Irlanda
                </button>
                <button
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 ${
                    region === 'AR' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setRegion('AR')}
                >
                  <span>{'\ud83c\udde6\ud83c\uddf7'}</span> Argentina
                </button>
              </div>
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
                    Más Popular
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
                    <span className="text-muted-foreground">/{isAnnual ? 'año' : 'mes'}</span>
                  </div>
                  <p className="text-sm text-accent font-semibold mt-1">
                    {tier.minutesIncluded.toLocaleString()} minutos incluidos ({tier.estimatedCalls} llamadas)
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {tier.perMinuteRate}/min excedente
                  </p>
                </div>

                <div className="flex items-center gap-2 mb-5">
                  <span className="text-xs font-semibold text-primary bg-primary/10 py-1.5 px-3 rounded-full">
                    {tier.volume}
                  </span>
                </div>

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

                <div className={`mb-5 p-3 rounded-lg border-2 border-dashed ${
                  tier.popular ? "border-primary/40 bg-primary/5" : "border-accent/30 bg-accent/5"
                }`}>
                  <div className="flex items-center justify-center gap-2 text-sm font-semibold">
                    <Gift className={`w-4 h-4 ${tier.popular ? "text-primary" : "text-accent"}`} />
                    <span className={tier.popular ? "text-primary" : "text-accent"}>
                      5 Días Gratis - Sin Tarjeta
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
                      Cargando...
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
              Incluido en Todos los Planes
            </h3>
            <p className="text-sm text-muted-foreground">
              Todo lo esencial para empezar de inmediato
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Phone, text: pricing.phoneNumber },
              { icon: Sparkles, text: "Recepcionista IA" },
              { icon: Clock, text: "Disponibilidad 24/7" },
              { icon: Shield, text: "Setup y soporte gratis" },
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

export default PricingSectionES;
