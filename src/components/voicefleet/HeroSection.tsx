"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, Phone, MessageSquare, Calendar, Link2, Headphones, PhoneIncoming, Globe2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { signInWithGoogle } from "@/lib/supabase";
import LiveDemoCall from "@/components/voicefleet/LiveDemoCall";

const HeroSection = () => {
  const { isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartTrial = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      // OAuth will redirect, so we don't need to handle success here
    } catch (error) {
      console.error("Failed to start Google OAuth:", error);
      setIsLoading(false);
    }
  };

  const trustBadges = [
    { icon: Shield, label: "GDPR-ready" },
    { icon: Clock, label: "Go live in < 1 hour" },
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

  return (
    <section className="relative min-h-screen pt-20 lg:pt-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-subtle" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-hero opacity-5 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-6rem)]">
          {/* Left Content */}
          <div className="py-12 lg:py-0">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6 animate-fade-up">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse-subtle" />
              <span className="text-sm font-medium text-accent">24/7 AI voice receptionist for SMBs</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-foreground leading-tight mb-6 animate-fade-up stagger-1">
              Answer Every Call.{" "}
              <span className="text-gradient-primary">Book More Appointments.</span>{" "}
              With an AI Voice Receptionist.
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed animate-fade-up stagger-2">
              Forward your existing number to VoiceFleet. We answer calls, capture intent + details, and book appointments or reservations into your calendar/booking system.
              We also escalate urgent calls to your team and send instant summaries.
            </p>

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

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 animate-fade-up stagger-4">
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
            <div className="mt-10 pt-10 border-t border-border animate-fade-up stagger-5">
              <p className="text-sm text-muted-foreground mb-3">Built for teams that rely on phone calls</p>
              <div className="flex flex-wrap items-center gap-2 opacity-70 mb-5">
                {industries.map((industry) => (
                  <div
                    key={industry}
                    className="h-7 px-3 bg-muted rounded flex items-center justify-center text-xs font-medium text-muted-foreground"
                  >
                    {industry}
                  </div>
                ))}
              </div>

              <p className="text-sm text-muted-foreground mb-3">Integrates with</p>
              <div className="flex flex-wrap items-center gap-2 opacity-70">
                {integrations.map((integration) => (
                  <div
                    key={integration}
                    className="h-7 px-3 bg-muted rounded flex items-center justify-center text-xs font-medium text-muted-foreground"
                  >
                    {integration}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content - Receptionist Preview */}
          <div className="relative animate-fade-up stagger-3">
            <div className="relative bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
              {/* Dashboard Header */}
              <div className="bg-gradient-hero p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary-foreground/30" />
                  <div className="w-3 h-3 rounded-full bg-primary-foreground/30" />
                  <div className="w-3 h-3 rounded-full bg-primary-foreground/30" />
                </div>
                <div className="text-right">
                  <span className="block text-sm font-medium text-primary-foreground/80">VoiceFleet Receptionist</span>
                  <span className="block text-[11px] text-primary-foreground/70">Sample dashboard (example data)</span>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  <DashboardStat icon={PhoneIncoming} label="Calls Answered" value="47" trend="Today" />
                  <DashboardStat icon={MessageSquare} label="Messages" value="12" trend="New" positive />
                  <DashboardStat icon={Calendar} label="Bookings" value="8" trend="Today" className="col-span-2 sm:col-span-1" />
                </div>

                {/* Live Activity */}
                <div className="bg-muted/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-foreground">Recent Activity</span>
                    <span className="flex items-center gap-1 text-xs text-accent">
                      <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                      Live
                    </span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { status: "Appointment booked", time: "2 min ago", caller: "New patient enquiry" },
                      { status: "Message taken", time: "8 min ago", caller: "Callback requested" },
                      { status: "FAQ answered", time: "15 min ago", caller: "Opening hours query" },
                    ].map((activity, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-accent rounded-full flex items-center justify-center">
                            <Headphones className="w-4 h-4 text-accent-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{activity.status}</p>
                            <p className="text-xs text-muted-foreground">{activity.caller}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-muted/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-foreground">Coverage</span>
                    <span className="text-sm font-bold text-accent">24/7</span>
                  </div>
                  <div className="flex items-end gap-1 h-16">
                    {[70, 85, 80, 90, 75, 88, 82, 92, 78, 86, 84, 90].map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-accent rounded-t opacity-80 hover:opacity-100 transition-opacity"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">Always-on phone coverage, even after hours</p>
                </div>
              </div>
            </div>

            {/* Floating Element */}
            <div className="hidden sm:block absolute -top-4 -right-4 bg-card rounded-xl shadow-lg border border-border p-4 animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Calls This Month (example)</p>
                  <p className="text-lg font-bold text-foreground">1,247</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const DashboardStat = ({
  icon: Icon,
  label,
  value,
  trend,
  positive = true,
  className = ""
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  trend: string;
  positive?: boolean;
  className?: string;
}) => (
  <div className={`bg-muted/50 rounded-xl p-3 sm:p-4 ${className}`}>
    <div className="flex items-center gap-2 mb-2">
      <Icon className="w-4 h-4 text-muted-foreground" />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
    <p className="text-2xl font-bold text-foreground">{value}</p>
    <p className={`text-xs font-medium ${positive ? 'text-accent' : 'text-muted-foreground'}`}>
      {trend}
    </p>
  </div>
);

export default HeroSection;
