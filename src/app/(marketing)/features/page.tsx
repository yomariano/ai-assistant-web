import { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo/metadata";
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

export const metadata: Metadata = generatePageMetadata({
  title: "Features - AI Voice Assistant Capabilities",
  description:
    "Explore VoiceFleet's powerful AI voice agent features: 24/7 availability, multi-language support, call scheduling, analytics, and more.",
  path: "/features",
});

const features = [
  {
    icon: Phone,
    name: "AI Call Handling",
    slug: "ai-call-handling",
    description:
      "Natural conversations powered by advanced AI. Handle inquiries, take orders, and book appointments automatically.",
    highlights: ["Natural language understanding", "Context-aware responses", "Seamless handoff to humans"],
  },
  {
    icon: Clock,
    name: "24/7 Availability",
    slug: "24-7-availability",
    description:
      "Never miss a call again. Your AI assistant works around the clock, even on holidays and weekends.",
    highlights: ["No overtime costs", "Global time zone coverage", "Instant response every time"],
  },
  {
    icon: Calendar,
    name: "Smart Scheduling",
    slug: "smart-scheduling",
    description:
      "Automatically book appointments based on your availability. Integrates with Google Calendar, Outlook, and more.",
    highlights: ["Calendar sync", "Conflict detection", "Automated reminders"],
  },
  {
    icon: MessageSquare,
    name: "SMS & Email Notifications",
    slug: "notifications",
    description:
      "Get instant alerts for every call. Receive summaries, transcripts, and follow-up actions via SMS or email.",
    highlights: ["Real-time alerts", "Call summaries", "Custom notification rules"],
  },
  {
    icon: Globe,
    name: "Multi-Language Support",
    slug: "multi-language",
    description:
      "Serve customers in their preferred language. Support for English, Irish, and major European languages.",
    highlights: ["Automatic language detection", "Native-quality speech", "Cultural awareness"],
  },
  {
    icon: BarChart3,
    name: "Analytics Dashboard",
    slug: "analytics",
    description:
      "Track call volumes, resolution rates, peak hours, and more. Data-driven insights to optimize your operations.",
    highlights: ["Real-time metrics", "Custom reports", "Trend analysis"],
  },
  {
    icon: Shield,
    name: "Enterprise Security",
    slug: "security",
    description:
      "GDPR compliant with EU data residency. SOC 2 certified infrastructure keeps your data safe.",
    highlights: ["EU data centres", "End-to-end encryption", "GDPR compliant"],
  },
  {
    icon: Zap,
    name: "Instant Setup",
    slug: "instant-setup",
    description:
      "Go live in under an hour. No complex integrations or IT support required. Simple configuration wizard.",
    highlights: ["No-code setup", "Pre-built templates", "Guided onboarding"],
  },
  {
    icon: Users,
    name: "CRM Integration",
    slug: "crm-integration",
    description:
      "Connect with your existing tools. Sync call data with Salesforce, HubSpot, and popular CRMs.",
    highlights: ["Two-way sync", "Custom field mapping", "Automated workflows"],
  },
  {
    icon: Settings,
    name: "Custom Call Flows",
    slug: "custom-call-flows",
    description:
      "Design conversation flows that match your business. Easy drag-and-drop editor for non-technical users.",
    highlights: ["Visual flow builder", "Conditional logic", "A/B testing"],
  },
  {
    icon: Headphones,
    name: "Call Recording & Transcription",
    slug: "call-recording",
    description:
      "Every call recorded and transcribed automatically. Search through past conversations instantly.",
    highlights: ["Searchable transcripts", "Keyword tagging", "Compliance storage"],
  },
  {
    icon: Bell,
    name: "Smart Escalation",
    slug: "smart-escalation",
    description:
      "AI knows when to escalate to a human. Set custom rules for urgent matters or VIP customers.",
    highlights: ["Priority detection", "Staff routing", "Callback scheduling"],
  },
];

export default function FeaturesPage() {
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        <Breadcrumbs items={breadcrumbs} />

        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-primary-foreground mb-4">
              Powerful AI Voice Features
            </h1>
            <p className="text-lg lg:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Everything you need to automate phone calls and save hours every week.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article
                    key={feature.slug}
                    className="group bg-card rounded-2xl border border-border p-6 hover:shadow-xl hover:border-primary/20 transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
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

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-card rounded-xl border border-border p-6 text-center">
                <div className="text-4xl font-heading font-bold text-primary mb-2">80%</div>
                <p className="text-muted-foreground">Lower cost vs human agents</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6 text-center">
                <div className="text-4xl font-heading font-bold text-accent mb-2">24/7</div>
                <p className="text-muted-foreground">Availability without overtime</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6 text-center">
                <div className="text-4xl font-heading font-bold text-primary mb-2">&lt;1hr</div>
                <p className="text-muted-foreground">Setup time to go live</p>
              </div>
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
