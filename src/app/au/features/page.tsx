import { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { BreadcrumbSchema } from "@/components/seo";
import Breadcrumbs from "@/components/marketing/Breadcrumbs";
import CTASection from "@/components/marketing/CTASection";
import Header from "@/components/voicefleet/Header";
import Footer from "@/components/voicefleet/Footer";
import {
  Phone,
  Clock,
  Globe,
  Calendar,
  MessageSquare,
  BarChart3,
  Shield,
  Zap,
  Users,
  Settings,
  Headphones,
  Bell,
  ArrowRight,
} from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = {
  ...generatePageMetadata({
    title: "Features - AI Voice Receptionist for Australia",
    description:
      "VoiceFleet's AI voice receptionist features for Australian businesses: 24/7 call answering, calendar booking, SMS and email alerts, smart routing, analytics, and local Australian numbers from A$140/mo.",
    path: "/au/features",
  }),
  alternates: {
    canonical: "https://voicefleet.ai/au/features",
    languages: {
      en: "/features",
      "en-AU": "/au/features",
      "es-AR": "/es/funciones",
    },
  },
};

const features = [
  {
    icon: Phone,
    name: "AI Call Handling",
    slug: "ai-call-handling",
    description:
      "Natural conversations powered by advanced AI. Take bookings, qualify leads, and answer caller questions automatically.",
    highlights: ["Natural language understanding", "Bookings and enquiries", "Custom greeting for your business"],
    availableOn: "All plans",
  },
  {
    icon: Clock,
    name: "24/7 Availability",
    slug: "24-7-availability",
    description:
      "Never miss an after-hours lead again. Your AI receptionist answers day and night, weekends included.",
    highlights: ["After-hours coverage", "No overtime costs", "Instant response every time"],
    availableOn: "All plans",
  },
  {
    icon: Calendar,
    name: "Calendar Integration",
    slug: "calendar-integration",
    description:
      "Automatically book appointments into Google Calendar, Outlook, Calendly, and more based on live availability.",
    highlights: ["Real-time availability", "Booking confirmations", "Reminder workflows"],
    availableOn: "Growth & Pro",
  },
  {
    icon: MessageSquare,
    name: "SMS & Email Notifications",
    slug: "notifications",
    description:
      "Get instant summaries for every call so your team can follow up fast on missed enquiries and new leads.",
    highlights: ["Real-time SMS alerts", "Email summaries", "Lead and booking details"],
    availableOn: "All plans (Email on Growth+)",
  },
  {
    icon: Globe,
    name: "Local Australian Numbers",
    slug: "australian-numbers",
    description:
      "Every Australian plan includes a local business number provisioned for the AU market through Voximplant.",
    highlights: ["Australian business numbers", "Call forwarding ready", "Voximplant provisioning"],
    availableOn: "All plans",
  },
  {
    icon: BarChart3,
    name: "Analytics Dashboard",
    slug: "analytics",
    description:
      "Track call volumes, busy periods, booking conversions, and routing outcomes in one dashboard.",
    highlights: ["Call volume tracking", "Peak-hour analysis", "Lead and booking visibility"],
    availableOn: "Growth & Pro",
  },
  {
    icon: Shield,
    name: "Privacy-Ready Workflows",
    slug: "security",
    description:
      "VoiceFleet supports privacy-conscious deployments and enterprise-grade security controls for Australian businesses.",
    highlights: ["Encrypted data handling", "Secure access controls", "Regional setup guidance"],
    availableOn: "All plans",
  },
  {
    icon: Zap,
    name: "Fast Setup",
    slug: "instant-setup",
    description:
      "Go live quickly with AI call flows, local number provisioning, and a straightforward forwarding setup.",
    highlights: ["Free setup included", "No IT team required", "Ready quickly"],
    availableOn: "All plans",
  },
  {
    icon: Users,
    name: "Multi-Location Support",
    slug: "multi-location",
    description:
      "Manage multiple branches from one dashboard, with separate numbers and routing rules where needed.",
    highlights: ["Up to 5 phone numbers", "Per-location reporting", "Centralized management"],
    availableOn: "Pro only",
  },
  {
    icon: Settings,
    name: "Booking & Lead Capture",
    slug: "order-management",
    description:
      "Handle bookings, appointment requests, and new-customer intake without sending callers to voicemail.",
    highlights: ["Appointment booking", "Lead qualification", "Message capture"],
    availableOn: "All plans",
  },
  {
    icon: Headphones,
    name: "Priority Support",
    slug: "priority-support",
    description:
      "Business-hours support on every plan, plus faster priority response for teams on Pro.",
    highlights: ["Business-hours support", "Priority support on Pro", "Fast troubleshooting"],
    availableOn: "All plans (Priority on Pro)",
  },
  {
    icon: Bell,
    name: "Smart Call Routing",
    slug: "smart-routing",
    description:
      "Escalate urgent calls, route VIP enquiries, or transfer to staff based on rules you control.",
    highlights: ["Automatic escalation", "Staff transfer options", "Voicemail fallback"],
    availableOn: "All plans",
  },
];

export default function AustraliaFeaturesPage() {
  const breadcrumbs = [
    { name: "Home", href: "/au" },
    { name: "Features", href: "/au/features" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbSchema items={breadcrumbs} />
      <Header />

      <main className="pt-20">
        <Breadcrumbs items={breadcrumbs} />

        <section className="py-16 lg:py-24 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-primary-foreground mb-4">
              AI Voice Features for Australian Businesses
            </h1>
            <p className="text-sm sm:text-base text-primary-foreground/70 max-w-3xl mx-auto mb-4">
              VoiceFleet combines 24/7 AI call answering, booking automation, SMS and email alerts, smart routing, and local Australian number provisioning in one system. Plans start at A$140/mo with a 30-day free trial.
            </p>
            <p className="text-lg lg:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Built for busy service businesses that need to answer every call without hiring more front-desk staff.
            </p>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-accent/30" />
                <span className="text-sm text-muted-foreground">All plans</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-200" />
                <span className="text-sm text-muted-foreground">Growth & Pro</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-200" />
                <span className="text-sm text-muted-foreground">Pro only</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {features.map((feature) => {
                const Icon = feature.icon;
                const isPro = feature.availableOn.includes("Pro only");
                const isGrowth = feature.availableOn.includes("Growth");
                return (
                  <article
                    key={feature.slug}
                    className="group bg-card rounded-2xl border border-border p-6 hover:shadow-xl hover:border-primary/20 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          isPro
                            ? "bg-amber-100 text-amber-700"
                            : isGrowth
                              ? "bg-blue-100 text-blue-700"
                              : "bg-accent/10 text-accent"
                        }`}
                      >
                        {feature.availableOn}
                      </span>
                    </div>

                    <h2 className="text-xl font-heading font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {feature.name}
                    </h2>

                    <p className="text-muted-foreground mb-4">{feature.description}</p>

                    <ul className="space-y-2">
                      {feature.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-center gap-2 text-sm text-foreground"
                        >
                          <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
                Why Australian Teams Choose VoiceFleet
              </h2>
              <p className="text-lg text-muted-foreground">
                Local numbers, 24/7 coverage, and pricing built for Australian SMBs.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
              <div className="bg-card rounded-xl border border-border p-6 text-center">
                <div className="text-4xl font-heading font-bold text-primary mb-2">A$140</div>
                <p className="text-muted-foreground">Starting monthly price</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6 text-center">
                <div className="text-4xl font-heading font-bold text-accent mb-2">24/7</div>
                <p className="text-muted-foreground">Call coverage without overtime</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6 text-center">
                <div className="text-4xl font-heading font-bold text-primary mb-2">&lt;1hr</div>
                <p className="text-muted-foreground">Typical setup time</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6 text-center">
                <div className="text-4xl font-heading font-bold text-accent mb-2">AU</div>
                <p className="text-muted-foreground">Local number provisioning</p>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/au#pricing"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors"
              >
                Compare AU Plans & Pricing
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        <CTASection
          title="Ready to launch in Australia?"
          description="Start your free trial with local Australian pricing and number provisioning."
          primaryButtonText="Start Free Trial"
          primaryButtonHref="/register?plan=starter&region=AU"
          secondaryButtonText="See AU Pricing"
          secondaryButtonHref="/au#pricing"
        />
      </main>

      <Footer />
    </div>
  );
}
