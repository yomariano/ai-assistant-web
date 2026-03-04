"use client";

import { useState } from "react";
import { Shield, Clock, Phone, Link2, Globe2, Star, Mic, Play } from "lucide-react";
import dynamic from "next/dynamic";
import HeroCTA from "@/components/voicefleet/HeroCTA";

const LiveDemoCall = dynamic(
  () => import("@/components/voicefleet/LiveDemoCall"),
  { ssr: false }
);

const VIDEO_ID = "XrPhV1WfluI";
const THUMBNAIL = `https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`;

const trustBadges = [
  { icon: Shield, label: "EU data residency options" },
  { icon: Clock, label: "Setup support included" },
  { icon: Link2, label: "Calendar + booking integrations" },
  { icon: Globe2, label: "Multilingual agents" },
];

const industries = ["Restaurants", "Dentists", "Gyms", "Plumbers", "Clinics", "Salons"];
const integrations = [
  "Google Calendar",
  "Outlook",
  "Calendly",
  "Cal.com",
  "Square Appointments",
  "SimplyBook.me",
  "Mindbody (beta)",
  "TheFork (beta)",
  "OpenTable (beta)",
  "Resy (beta)",
];

const HeroSection = () => {
  const [videoPlaying, setVideoPlaying] = useState(false);

  return (
    <>
      <section className="relative pt-20 lg:pt-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-subtle" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-hero opacity-5 blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Two-column: headline + demo card */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Content */}
            <div className="py-12 lg:py-0">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6 animate-fade-up">
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse-subtle" />
                <span className="text-sm font-medium text-accent">24/7 AI voice receptionist for SMBs</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-foreground leading-tight mb-6">
                Answer Every Call.{" "}
                <span className="text-gradient-primary">Book More Appointments.</span>{" "}
                With an AI Voice Receptionist.
              </h1>

              <p className="text-sm sm:text-base text-foreground/80 mb-4 leading-relaxed font-medium">
                VoiceFleet is an AI voice receptionist for small businesses, starting at &euro;99/mo with a 30-day free trial. It answers calls 24/7, books appointments, takes messages, and routes urgent calls — with no-code setup in under 1 hour and EU data residency.
              </p>

              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed">
                Forward your existing number to VoiceFleet. We answer calls, capture intent + details, and book appointments or reservations into your calendar/booking system.
                We also escalate urgent calls to your team and send instant summaries.
              </p>

              <HeroCTA />
            </div>

            {/* Right Content - Demo Trigger Card */}
            <div className="relative animate-fade-up stagger-3 pt-12 lg:pt-0">
              <div className="relative bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-hero p-5 text-center">
                  <p className="text-sm font-medium text-primary-foreground/80">Hear it for yourself</p>
                  <h2 className="text-xl sm:text-2xl font-heading font-bold text-primary-foreground mt-1">
                    Talk to an AI Receptionist Now
                  </h2>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  {/* Animated waveform visual */}
                  <div className="flex items-center justify-center gap-1">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <Phone className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex items-end gap-[3px] h-10 ml-3">
                      {[40, 70, 50, 85, 60, 90, 45, 75, 55, 80, 50, 65].map((h, i) => (
                        <div
                          key={i}
                          className="w-1.5 bg-accent/60 rounded-full animate-pulse"
                          style={{
                            height: `${h}%`,
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: `${0.8 + (i % 3) * 0.2}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Industry quick picks */}
                  <div>
                    <p className="text-xs text-muted-foreground text-center mb-3">Pick an industry scenario</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {["Restaurant", "Dentist", "Gym", "Plumber", "Beauty Salon"].map((industry) => (
                        <span
                          key={industry}
                          className="px-3 py-1.5 bg-muted rounded-full text-xs font-medium text-foreground/80 border border-border"
                        >
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Demo CTA Button */}
                  <HeroDemoCTA />

                  {/* Supporting text */}
                  <p className="text-xs text-muted-foreground text-center">
                    <Mic className="w-3 h-3 inline mr-1" />
                    No signup. Uses your microphone. 90 seconds.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Full-width video row — centered below the two columns */}
          <div className="py-12 lg:py-16 animate-fade-up stagger-4">
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
                    onClick={() => setVideoPlaying(true)}
                    className="group absolute inset-0 w-full h-full cursor-pointer"
                    aria-label="Play video"
                  >
                    <div className="absolute inset-0 overflow-hidden">
                      <img
                        src={THUMBNAIL}
                        alt="VoiceFleet walkthrough video thumbnail"
                        className="w-full h-full object-cover scale-[2] object-center"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50 group-hover:from-black/30 group-hover:via-black/10 group-hover:to-black/40 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-white/90 group-hover:bg-white group-hover:scale-110 transition-all flex items-center justify-center shadow-2xl">
                        <Play className="w-9 h-9 text-primary ml-1" fill="currentColor" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-white text-base font-semibold">
                        Set Up Your AI Receptionist in 5 Minutes
                      </p>
                      <p className="text-white/70 text-sm mt-1">Click to play</p>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
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

          {/* Inline Testimonial */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex items-start gap-3 bg-card/60 border border-border/50 rounded-xl px-4 py-3 justify-center">
              <div className="flex items-center gap-0.5 flex-shrink-0 mt-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">
                &ldquo;We no longer miss booking calls while the team is busy with patients.&rdquo;
                <span className="text-xs text-muted-foreground ml-1">— Practice Manager, Dental Clinic</span>
              </p>
            </div>
          </div>

          {/* Social Proof */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">Built for teams that rely on phone calls</p>
            <div className="flex flex-wrap justify-center gap-2 mb-5">
              {industries.map((industry) => (
                <div
                  key={industry}
                  className="h-7 px-3 bg-card border border-border rounded flex items-center justify-center text-xs font-medium text-foreground/80"
                >
                  {industry}
                </div>
              ))}
            </div>

            <p className="text-sm text-muted-foreground mb-3">Integrates with</p>
            <div className="flex flex-wrap justify-center gap-2">
              {integrations.map((integration) => (
                <div
                  key={integration}
                  className="h-7 px-3 bg-card border border-border rounded flex items-center justify-center text-xs font-medium text-foreground/80"
                >
                  {integration}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

function HeroDemoCTA() {
  return (
    <LiveDemoCall
      trigger={
        <button className="w-full py-4 rounded-xl bg-gradient-hero text-primary-foreground font-semibold text-lg shadow-lg shadow-primary/25 hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer">
          <Phone className="w-5 h-5" />
          Start Demo Call
        </button>
      }
    />
  );
}

export default HeroSection;
