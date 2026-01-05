import {
  Phone,
  Clock,
  Globe,
  MessageSquare,
  Calendar,
  BarChart3,
  Shield,
  Zap,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

const FeaturesSection = () => {
  const features = [
    {
      icon: Phone,
      name: "AI Call Handling",
      description: "Natural conversations for orders, reservations, and inquiries",
      badge: "All plans",
    },
    {
      icon: Clock,
      name: "24/7 Availability",
      description: "Never miss a call, even on holidays and weekends",
      badge: "All plans",
    },
    {
      icon: Globe,
      name: "Irish Phone Numbers",
      description: "Local Dublin & regional numbers included",
      badge: "All plans",
    },
    {
      icon: MessageSquare,
      name: "SMS Notifications",
      description: "Instant alerts for every call and order",
      badge: "All plans",
    },
    {
      icon: Calendar,
      name: "Calendar Integration",
      description: "Sync with Google Calendar & Outlook",
      badge: "Growth+",
      highlighted: true,
    },
    {
      icon: BarChart3,
      name: "Analytics Dashboard",
      description: "Track calls, peak hours, and trends",
      badge: "Growth+",
      highlighted: true,
    },
    {
      icon: Shield,
      name: "GDPR Compliant",
      description: "EU data centres & full compliance",
      badge: "All plans",
    },
    {
      icon: Zap,
      name: "Instant Setup",
      description: "Go live in under an hour, free setup",
      badge: "All plans",
    },
  ];

  return (
    <section id="features" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Features</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
            Everything You Need to <span className="text-gradient-primary">Automate Calls</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features included in every plan, with advanced tools as you grow
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-card rounded-xl border border-border p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    feature.highlighted
                      ? "bg-blue-100 text-blue-700"
                      : "bg-accent/10 text-accent"
                  }`}>
                    {feature.badge}
                  </span>
                </div>
                <h3 className="text-base font-heading font-bold text-foreground mb-1">
                  {feature.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            href="/features"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            See all features & plan comparison
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

// Keep the export name for backwards compatibility with the index
export default FeaturesSection;
