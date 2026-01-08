"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, Phone, MessageSquare, Calendar, Headphones, PhoneIncoming } from "lucide-react";
import { useAuthStore } from "@/lib/store";

const HeroSection = () => {
  const { loginWithGoogle, isAuthenticated } = useAuthStore();
  const trustBadges = [
    { icon: Shield, label: "Irish Company" },
    { icon: Shield, label: "GDPR Compliant" },
    { icon: Clock, label: "Setup in 24 Hours" },
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
              <span className="text-sm font-medium text-accent">AI Receptionist for Irish Businesses</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-foreground leading-tight mb-6 animate-fade-up stagger-1">
              Never Miss Another Call.{" "}
              <span className="text-gradient-primary">Your AI Receptionist</span>{" "}
              Answers 24/7.
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed animate-fade-up stagger-2">
              Forward your calls to VoiceFleet. We answer, take messages, book appointments,
              and handle FAQs —{" "}
              <span className="font-semibold text-foreground">even at 3am or on bank holidays</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10 animate-fade-up stagger-3">
              <a
                href="https://calendly.com/voicefleet"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="hero" size="xl">
                  Book a Demo
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
              {isAuthenticated ? (
                <a href="/dashboard">
                  <Button variant="outline" size="xl">
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </a>
              ) : (
                <Button variant="outline" size="xl" onClick={loginWithGoogle}>
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Button>
              )}
            </div>

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
              <p className="text-sm text-muted-foreground mb-4">Trusted by Irish businesses across all industries</p>
              <div className="flex items-center gap-6 sm:gap-8 opacity-60 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible">
                {["Dental", "Legal", "Trades", "Property", "Retail"].map((industry, i) => (
                  <div key={i} className="h-6 sm:h-8 px-4 bg-muted rounded flex-shrink-0 flex items-center justify-center text-xs font-medium text-muted-foreground">
                    {industry}
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
                <span className="text-sm font-medium text-primary-foreground/80">VoiceFleet Receptionist</span>
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
                    <span className="text-sm font-semibold text-foreground">Answer Rate</span>
                    <span className="text-sm font-bold text-accent">100%</span>
                  </div>
                  <div className="flex items-end gap-1 h-16">
                    {[100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100].map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-accent rounded-t opacity-80 hover:opacity-100 transition-opacity"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">Every call answered in under 1 second</p>
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
                  <p className="text-xs text-muted-foreground">Calls This Month</p>
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
