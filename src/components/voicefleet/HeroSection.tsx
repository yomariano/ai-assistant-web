"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, CheckCircle2, Phone, Users, TrendingUp, Headphones } from "lucide-react";

const HeroSection = () => {
  const trustBadges = [
    { icon: Shield, label: "SOC 2 Compliant" },
    { icon: Shield, label: "GDPR Ready" },
    { icon: Clock, label: "99.9% Uptime SLA" },
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
              <span className="text-sm font-medium text-accent">AI-Powered Voice Agents</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-foreground leading-tight mb-6 animate-fade-up stagger-1">
              What If You Could Handle{" "}
              <span className="text-gradient-primary">10x the Calls</span>{" "}
              Without Hiring Anyone?
            </h1>

            <p className="text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed animate-fade-up stagger-2">
              VoiceFleet AI agents handle routine calls at{" "}
              <span className="font-semibold text-foreground">80% lower cost</span> than human agents.
              Same quality. Infinite scale.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10 animate-fade-up stagger-3">
              <Button variant="hero" size="xl">
                Book a Demo
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="xl">
                See Case Studies
              </Button>
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

            {/* Enterprise Logos */}
            <div className="mt-10 pt-10 border-t border-border animate-fade-up stagger-5">
              <p className="text-sm text-muted-foreground mb-4">Trusted by leading European contact centers</p>
              <div className="flex items-center gap-8 opacity-60">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-8 w-24 bg-muted rounded" />
                ))}
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="relative animate-fade-up stagger-3">
            <div className="relative bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
              {/* Dashboard Header */}
              <div className="bg-gradient-hero p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary-foreground/30" />
                  <div className="w-3 h-3 rounded-full bg-primary-foreground/30" />
                  <div className="w-3 h-3 rounded-full bg-primary-foreground/30" />
                </div>
                <span className="text-sm font-medium text-primary-foreground/80">VoiceFleet Dashboard</span>
              </div>

              {/* Dashboard Content */}
              <div className="p-6 space-y-6">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4">
                  <DashboardStat icon={Phone} label="Active Calls" value="127" trend="+12%" />
                  <DashboardStat icon={Users} label="AI Agents" value="24" trend="Online" positive />
                  <DashboardStat icon={CheckCircle2} label="Resolved" value="1,842" trend="Today" />
                </div>

                {/* Live Calls */}
                <div className="bg-muted/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-foreground">Live Conversations</span>
                    <span className="flex items-center gap-1 text-xs text-accent">
                      <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                      Real-time
                    </span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { status: "Handling inquiry", duration: "2:34", type: "Billing" },
                      { status: "Processing request", duration: "1:12", type: "Support" },
                      { status: "Scheduling", duration: "0:45", type: "Appointment" },
                    ].map((call, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-accent rounded-full flex items-center justify-center">
                            <Headphones className="w-4 h-4 text-accent-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{call.status}</p>
                            <p className="text-xs text-muted-foreground">{call.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-mono text-foreground">{call.duration}</p>
                          <div className="flex gap-1 mt-1">
                            {[1, 2, 3, 4].map((bar) => (
                              <div
                                key={bar}
                                className="w-1 bg-accent rounded-full animate-pulse-subtle"
                                style={{
                                  height: `${Math.random() * 12 + 4}px`,
                                  animationDelay: `${bar * 0.1}s`
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance Chart Placeholder */}
                <div className="bg-muted/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-foreground">Resolution Rate</span>
                    <span className="text-sm font-bold text-accent">94.2%</span>
                  </div>
                  <div className="flex items-end gap-1 h-16">
                    {[65, 72, 68, 85, 78, 92, 88, 94, 91, 89, 95, 94].map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-accent rounded-t opacity-80 hover:opacity-100 transition-opacity"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-card rounded-xl shadow-lg border border-border p-4 animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Cost Savings</p>
                  <p className="text-lg font-bold text-foreground">€180k/yr</p>
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
  positive = true
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  trend: string;
  positive?: boolean;
}) => (
  <div className="bg-muted/50 rounded-xl p-4">
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
