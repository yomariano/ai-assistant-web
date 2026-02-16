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
    title: "Features - AI Voice Assistant Capabilities",
    description:
      "VoiceFleet AI voice receptionist features: 24/7 call answering, calendar integration, SMS/email notifications, multilingual support, smart routing, and analytics. From \u20ac99/mo, setup in under 1 hour.",
    path: "/features",
  }),
  alternates: {
    canonical: "https://voicefleet.ai/features",
    languages: {
      "es-AR": "/es/funciones",
      en: "/features",
    },
  },
};

const features = [
  {
    icon: Phone,
    name: "AI Call Handling",
    slug: "ai-call-handling",
    description:
      "Natural conversations powered by advanced AI. Take orders, book reservations, and answer customer questions automatically.",
    highlights: ["Natural language understanding", "Order taking & reservations", "Custom greeting for your business"],
    availableOn: "All plans",
  },
  {
    icon: Clock,
    name: "24/7 Availability",
    slug: "24-7-availability",
    description:
      "Never miss a call again. Your AI assistant works around the clock, even on holidays and weekends.",
    highlights: ["No overtime costs", "After-hours coverage", "Instant response every time"],
    availableOn: "All plans",
  },
  {
    icon: Calendar,
    name: "Calendar Integration",
    slug: "calendar-integration",
    description:
      "Automatically book appointments based on your availability. Sync with Google Calendar, Outlook, and more.",
    highlights: ["Real-time availability", "Automated booking confirmations", "Reminder notifications"],
    availableOn: "Growth & Pro",
  },
  {
    icon: MessageSquare,
    name: "SMS & Email Notifications",
    slug: "notifications",
    description:
      "Get instant alerts for every call. Receive order details, booking confirmations, and call summaries.",
    highlights: ["Real-time SMS alerts", "Email summaries", "Order/booking details"],
    availableOn: "All plans (Email on Growth+)",
  },
  {
    icon: Globe,
    name: "Local Phone Numbers",
    slug: "irish-numbers",
    description:
      "Get a local phone number included with every plan. Irish numbers (Dublin & regional) are available.",
    highlights: ["Dublin & regional numbers", "Number porting available", "EU-based infrastructure"],
    availableOn: "All plans",
  },
  {
    icon: BarChart3,
    name: "Analytics Dashboard",
    slug: "analytics",
    description:
      "Track call volumes, peak hours, popular orders, and more. Data-driven insights to optimize your business.",
    highlights: ["Call volume tracking", "Peak hours analysis", "Order trends"],
    availableOn: "Growth & Pro",
  },
  {
    icon: Shield,
    name: "GDPR Compliant",
    slug: "security",
    description:
      "Your data stays in Europe. Fully GDPR compliant with EU data residency and enterprise-grade security.",
    highlights: ["EU data centres", "Data encryption", "GDPR compliant"],
    availableOn: "All plans",
  },
  {
    icon: Zap,
    name: "Instant Setup",
    slug: "instant-setup",
    description:
      "Go live in under an hour. No technical skills required. Just tell us about your business and we handle the rest.",
    highlights: ["Free setup included", "No IT required", "Ready in < 1 hour"],
    availableOn: "All plans",
  },
  {
    icon: Users,
    name: "Multi-Location Support",
    slug: "multi-location",
    description:
      "Manage multiple business locations from one dashboard. Each location gets its own phone number and settings.",
    highlights: ["Up to 5 phone numbers", "Per-location analytics", "Centralized management"],
    availableOn: "Pro only",
  },
  {
    icon: Settings,
    name: "Order & Reservation Management",
    slug: "order-management",
    description:
      "AI handles orders and reservations seamlessly. Customers can place orders, book tables, or schedule appointments.",
    highlights: ["Order taking", "Table reservations", "Appointment booking"],
    availableOn: "All plans",
  },
  {
    icon: Headphones,
    name: "Priority Support",
    slug: "priority-support",
    description:
      "Get help when you need it. Business hours support on all plans, with 24/7 priority support on Pro.",
    highlights: ["Business hours support", "24/7 on Pro plan", "Dedicated account manager"],
    availableOn: "All plans (24/7 on Pro)",
  },
  {
    icon: Bell,
    name: "Smart Call Routing",
    slug: "smart-routing",
    description:
      "AI knows when to handle calls and when to transfer to staff. Set rules for urgent matters or VIP customers.",
    highlights: ["Automatic escalation", "Staff transfer option", "Voicemail fallback"],
    availableOn: "All plans",
  },
];

export default function FeaturesPage() {
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbSchema items={breadcrumbs} />
      <Header />

      <main className="pt-20">
        <Breadcrumbs items={breadcrumbs} />

        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-primary-foreground mb-4">
              Powerful AI Voice Features
            </h1>
            <p className="text-sm sm:text-base text-primary-foreground/70 max-w-2xl mx-auto mb-4">
              VoiceFleet provides AI call handling, 24/7 availability, calendar and booking integrations, SMS and email notifications, multilingual support, and smart call routing. No-code setup in under 1 hour, starting at &euro;99/mo with a 5-day free trial.
            </p>
            <p className="text-lg lg:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Everything you need to automate phone calls and save hours every week.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            {/* Plan Legend */}
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
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        isPro
                          ? "bg-amber-100 text-amber-700"
                          : isGrowth
                          ? "bg-blue-100 text-blue-700"
                          : "bg-accent/10 text-accent"
                      }`}>
                        {feature.availableOn}
                      </span>
                    </div>

                    <h2 className="text-xl font-heading font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {feature.name}
                    </h2>

                    <p className="text-muted-foreground mb-4">
                      {feature.description}
                    </p>

                    <ul className="space-y-2">
                      {feature.highlights.map((highlight, i) => (
                        <li
                          key={i}
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

        {/* Comparison Section */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
                Why Choose VoiceFleet?
              </h2>
              <p className="text-lg text-muted-foreground">
                See how our AI voice agents compare to traditional solutions
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
              <div className="bg-card rounded-xl border border-border p-6 text-center">
                <div className="text-4xl font-heading font-bold text-primary mb-2">€99</div>
                <p className="text-muted-foreground">Starting price per month</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6 text-center">
                <div className="text-4xl font-heading font-bold text-accent mb-2">24/7</div>
                <p className="text-muted-foreground">Availability without overtime</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6 text-center">
                <div className="text-4xl font-heading font-bold text-primary mb-2">&lt;1hr</div>
                <p className="text-muted-foreground">Setup time to go live</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6 text-center">
                <div className="text-4xl font-heading font-bold text-accent mb-2">100%</div>
                <p className="text-muted-foreground">GDPR compliant</p>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors"
              >
                Compare Plans & Pricing
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <CTASection
          title="Ready to experience these features?"
          description="Start your free trial and see the power of AI voice assistants."
        />
      </main>

      <Footer />
    </div>
  );
}
