"use client";

import { useState, useEffect } from "react";
import { Shield, Clock, PhoneForwarded, Settings, Bot, Link2, Globe2, Star, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import HeroCTA from "@/components/voicefleet/HeroCTA";
import { trackEvent } from "@/lib/umami";
import { useRegion } from "@/hooks/useRegion";

const LiveDemoCall = dynamic(
  () => import("@/components/voicefleet/LiveDemoCall"),
  {
    ssr: false,
    loading: () => (
      <div className="relative bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
        <div className="bg-gradient-hero p-4 sm:p-5 text-center">
          <p className="text-sm font-medium text-primary-foreground/80">Hear it for yourself</p>
          <div className="text-lg sm:text-xl font-heading font-bold text-primary-foreground mt-1">
            Talk to an AI Receptionist Now
          </div>
        </div>
        <div className="p-4 sm:p-5 space-y-4 animate-pulse">
          <div className="h-8 bg-muted rounded-lg" />
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="h-16 bg-muted rounded-lg" />
            <div className="h-16 bg-muted rounded-lg" />
            <div className="h-16 bg-muted rounded-lg" />
          </div>
          <div className="h-24 bg-muted rounded-xl" />
          <div className="h-10 bg-muted rounded-lg" />
        </div>
      </div>
    ),
  }
);

const VIDEO_ID = "XrPhV1WfluI";
const THUMBNAIL = "https://cdn.voicefleet.ai/images/video-thumbnail.png";

const trustBadges = [
  { icon: Shield, label: "EU data residency options" },
  { icon: Clock, label: "Setup support included" },
  { icon: Link2, label: "Calendar + booking integrations" },
  { icon: Globe2, label: "Multilingual agents" },
];

const industries = ["Restaurants", "Dentists", "Gyms", "Plumbers", "Clinics", "Salons"];

const integrationLogos = [
  { src: "/integrations/google-calendar.png", alt: "Google Calendar" },
  { src: "/integrations/calendly.png", alt: "Calendly" },
  { src: "/integrations/cal-com.png", alt: "Cal.com" },
  { src: "/integrations/thefork.png", alt: "TheFork" },
  { src: "/integrations/opentable.png", alt: "OpenTable" },
];

const steps = [
  {
    number: 1,
    icon: Settings,
    title: "Subscribe & Configure",
    description: "Set up your AI receptionist in 5 minutes",
  },
  {
    number: 2,
    icon: PhoneForwarded,
    title: "Forward Your Calls",
    description: "Route your business calls to your VoiceFleet number",
  },
  {
    number: 3,
    icon: Bot,
    title: "AI Answers 24/7",
    description: "Get transcripts, bookings & call summaries",
  },
];

const avatarColors = [
  "bg-primary",
  "bg-accent",
  "bg-amber-500",
  "bg-emerald-500",
];

const avatarInitials = ["JM", "SK", "LP", "RO"];

const HeroSection = () => {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const { city, regionName, loading: regionLoading } = useRegion();
  const [geoReady, setGeoReady] = useState(false);

  // Fade in geo badge after load to avoid layout shift
  useEffect(() => {
    if (!regionLoading) {
      const timer = setTimeout(() => setGeoReady(true), 100);
      return () => clearTimeout(timer);
    }
  }, [regionLoading]);

  return (
    <>
      <section className="relative pt-16 sm:pt-20 lg:pt-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-subtle" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-hero opacity-5 blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Two-column: headline + demo card */}
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-start">
            {/* Left Content */}
            <div className="flex flex-col pt-6 pb-6 sm:pt-8 sm:pb-8 lg:py-0">
              {/* Geo badge */}
              <div
                className={`inline-flex w-fit items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-5 sm:mb-6 transition-opacity duration-500 ${
                  geoReady ? "opacity-100" : "opacity-0"
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  {city ? `Works great in ${city}` : "Works great for local businesses"}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-foreground leading-tight mb-5 sm:mb-6">
                The AI Receptionist That Answers Calls So You{" "}
                <span className="text-gradient-primary">Never Lose a Customer</span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                The all-in-one AI phone agent that helps local businesses
                capture every call, book appointments, and answer FAQs &mdash; 24/7, in any language.
              </p>

              <div className="order-1 lg:order-2">
                <HeroCTA />
              </div>

              {/* Social proof stack */}
              <div className="order-2 lg:order-1 flex flex-wrap items-center gap-3 mb-6 sm:mb-8">
                {/* Overlapping avatars */}
                <div className="flex -space-x-2">
                  {avatarInitials.map((initials, i) => (
                    <div
                      key={initials}
                      className={`w-8 h-8 rounded-full ${avatarColors[i]} flex items-center justify-center text-xs font-bold text-white ring-2 ring-background`}
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                {/* Stars */}
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Used by dental clinics, restaurants &amp; salons across {regionName || "Ireland"}
                </p>
              </div>
            </div>

            {/* Right Content - Inline Demo Panel */}
            <div className="relative animate-fade-up stagger-3 pt-1 sm:pt-2 lg:pt-0">
              <LiveDemoCall inline />
            </div>
          </div>

          {/* #1 — 3-Step "How It Works" Strip */}
          <div className="py-12 lg:py-16 animate-fade-up stagger-4">
            <div className="relative max-w-4xl mx-auto">
              {/* Desktop connector line */}
              <div className="hidden md:block absolute top-8 left-[16.67%] right-[16.67%] h-0.5 border-t-2 border-dashed border-border" />

              <div className="grid md:grid-cols-3 gap-8 md:gap-6">
                {steps.map((step) => (
                  <div key={step.number} className="flex flex-col items-center text-center relative">
                    {/* Number circle */}
                    <div className="w-16 h-16 rounded-full bg-gradient-hero flex items-center justify-center mb-4 relative z-10 shadow-lg shadow-primary/20">
                      <step.icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    {/* Mobile connector line */}
                    {step.number < 3 && (
                      <div className="md:hidden w-0.5 h-6 border-l-2 border-dashed border-border -mt-4 mb-0" />
                    )}
                    <span className="text-xs font-bold text-accent uppercase tracking-wider mb-1">Step {step.number}</span>
                    <h3 className="text-base font-heading font-bold text-foreground mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Video section with scroll target */}
          <div id="product-tour" className="pb-12 lg:pb-16 animate-fade-up stagger-4">
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground mb-2">
                See How It Works
              </h2>
              <p className="text-sm text-muted-foreground">
                Watch a quick walkthrough of VoiceFleet in action.
              </p>
            </div>

            <div className="mx-auto max-w-4xl">
              <div
                className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-border bg-card"
                style={{ aspectRatio: '16 / 9' }}
              >
                <div className="absolute -inset-2 bg-gradient-to-br from-primary/15 via-accent/10 to-primary/15 rounded-3xl blur-2xl -z-10" />

                {videoPlaying ? (
                  <div className="absolute inset-0 overflow-hidden bg-black">
                    <iframe
                      className="absolute top-1/2 left-1/2"
                      style={{
                        width: '200%',
                        height: '200%',
                        transform: 'translate(-50%, -50%)',
                      }}
                      src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
                      title="How VoiceFleet Works"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setVideoPlaying(true);
                      trackEvent("video_play", { location: "hero" });
                    }}
                    className="group absolute inset-0 w-full h-full cursor-pointer"
                    aria-label="Play video"
                  >
                    <div className="absolute inset-0 overflow-hidden">
                      <img
                        src={THUMBNAIL}
                        alt="VoiceFleet walkthrough video thumbnail"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Post-Video Pricing CTA with guarantee */}
          <div className="pb-12 lg:pb-16 text-center animate-fade-up">
            <h3 className="text-xl sm:text-2xl font-heading font-bold text-foreground mb-4">
              Ready to stop missing calls?
            </h3>
            <Button
              variant="hero"
              size="xl"
              onClick={() => {
                trackEvent("cta_click", { location: "post_video", label: "start_trial" });
                document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="cursor-pointer"
            >
              Start 30-Day Free Trial
              <ArrowRight className="w-5 h-5" />
            </Button>
            <div className="flex items-center justify-center gap-2 mt-3 text-sm text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>30-day free trial &middot; Cancel anytime &middot; No setup fees</span>
            </div>
          </div>

          {/* Clickable Phone Number */}
          {process.env.NEXT_PUBLIC_DEMO_PHONE_NUMBER && (
            <div className="pb-12 lg:pb-16 text-center animate-fade-up">
              <p className="text-sm text-muted-foreground">
                Or call{" "}
                <a
                  href={`tel:${process.env.NEXT_PUBLIC_DEMO_PHONE_NUMBER}`}
                  onClick={() => trackEvent("phone_click", { location: "hero" })}
                  className="text-foreground font-semibold hover:underline"
                >
                  {process.env.NEXT_PUBLIC_DEMO_PHONE_NUMBER}
                </a>{" "}
                to hear VoiceFleet live from your phone
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Trust & social proof — below the hero */}
      <section className="bg-background py-10 lg:py-14 border-t border-border/50">
        <div className="container mx-auto px-4">
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {trustBadges.map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border shadow-sm"
              >
                <badge.icon className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-foreground">{badge.label}</span>
              </div>
            ))}
          </div>

          {/* Social Proof */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Trusted by businesses in {regionName || "Ireland"}, UK, Argentina &amp; Egypt
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {industries.map((industry) => (
                <div
                  key={industry}
                  className="h-7 px-3 bg-card border border-border rounded flex items-center justify-center text-xs font-medium text-foreground/80"
                >
                  {industry}
                </div>
              ))}
            </div>

            <p className="text-sm text-muted-foreground mb-4">Integrates with</p>
            <div className="flex flex-wrap justify-center items-center gap-6">
              {integrationLogos.map((logo) => (
                <div key={logo.alt} className="flex items-center justify-center h-10">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={100}
                    height={40}
                    className="object-contain h-8 w-auto opacity-70 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
