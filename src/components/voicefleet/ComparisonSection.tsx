import { Check, X } from "lucide-react";
import Link from "next/link";

const ComparisonSection = () => {
  const competitors = [
    { key: "voicefleet", name: "VoiceFleet", highlight: true },
    { key: "smithai", name: "Smith.ai" },
    { key: "ruby", name: "Ruby" },
    { key: "dialpad", name: "Dialpad" },
    { key: "aircall", name: "Aircall" },
  ];

  const features = [
    {
      name: "Starting price",
      voicefleet: "€99/mo",
      smithai: "$140/mo",
      ruby: "$230/mo",
      dialpad: "$15/user/mo",
      aircall: "€30/user/mo",
    },
    {
      name: "True AI (no humans)",
      voicefleet: true,
      smithai: false,
      ruby: false,
      dialpad: "Partial",
      aircall: "Add-on",
    },
    {
      name: "24/7 availability",
      voicefleet: true,
      smithai: "Extra cost",
      ruby: "Limited",
      dialpad: true,
      aircall: true,
    },
    {
      name: "Per-call fees",
      voicefleet: "None",
      smithai: "$6-12/call",
      ruby: "Per minute",
      dialpad: "None",
      aircall: "None",
    },
    {
      name: "Setup time",
      voicefleet: "< 1 hour",
      smithai: "3-5 days",
      ruby: "1-2 weeks",
      dialpad: "1-2 days",
      aircall: "1-2 days",
    },
    {
      name: "EUR pricing",
      voicefleet: true,
      smithai: false,
      ruby: false,
      dialpad: false,
      aircall: true,
    },
    {
      name: "Local phone numbers (Ireland)",
      voicefleet: true,
      smithai: false,
      ruby: false,
      dialpad: true,
      aircall: true,
    },
    {
      name: "GDPR compliant",
      voicefleet: true,
      smithai: "Varies",
      ruby: "Varies",
      dialpad: true,
      aircall: true,
    },
  ];

  const renderCell = (value: boolean | string) => {
    if (value === true) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 bg-accent/20 rounded-full">
          <Check className="w-4 h-4 text-accent" />
        </span>
      );
    }
    if (value === false) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 bg-destructive/20 rounded-full">
          <X className="w-4 h-4 text-destructive" />
        </span>
      );
    }
    return <span className="text-sm text-muted-foreground">{value}</span>;
  };

  const renderMobileCell = (value: boolean | string) => {
    if (value === true) {
      return (
        <span className="inline-flex items-center justify-center w-5 h-5 bg-accent/20 rounded-full">
          <Check className="w-3 h-3 text-accent" />
        </span>
      );
    }
    if (value === false) {
      return (
        <span className="inline-flex items-center justify-center w-5 h-5 bg-destructive/20 rounded-full">
          <X className="w-3 h-3 text-destructive" />
        </span>
      );
    }
    return <span className="text-xs text-muted-foreground">{value}</span>;
  };

  return (
    <section className="py-16 lg:py-28 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
            How VoiceFleet <span className="text-gradient-primary">Compares</span>
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground">
            See how we stack up against the leading alternatives
          </p>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="py-4 px-4 text-left text-sm font-semibold text-muted-foreground">
                  Feature
                </th>
                {competitors.map((comp) => (
                  <th key={comp.key} className="py-4 px-4 text-center">
                    {comp.highlight ? (
                      <div className="inline-flex flex-col items-center">
                        <span className="text-lg font-heading font-bold text-primary">{comp.name}</span>
                        <span className="text-xs text-accent">Recommended</span>
                      </div>
                    ) : (
                      <span className="text-sm font-semibold text-muted-foreground">{comp.name}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr
                  key={index}
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="py-4 px-4 text-sm font-medium text-foreground">
                    {feature.name}
                  </td>
                  {competitors.map((comp) => (
                    <td
                      key={comp.key}
                      className={`py-4 px-4 text-center ${comp.highlight ? "bg-primary/5" : ""}`}
                    >
                      {renderCell(feature[comp.key as keyof typeof feature] as boolean | string)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card rounded-xl border border-border p-4"
            >
              <h3 className="font-semibold text-foreground mb-3">{feature.name}</h3>
              <div className="grid grid-cols-2 gap-2">
                {competitors.map((comp) => (
                  <div
                    key={comp.key}
                    className={`flex items-center justify-between rounded-lg p-2 ${
                      comp.highlight ? "bg-primary/5" : "bg-muted/50"
                    }`}
                  >
                    <span className={`text-xs font-medium ${comp.highlight ? "text-primary" : "text-muted-foreground"}`}>
                      {comp.name}
                    </span>
                    {renderMobileCell(feature[comp.key as keyof typeof feature] as boolean | string)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Want a detailed comparison? Check out our blog posts
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/blog/voicefleet-vs-smith-ai-comparison"
              className="text-sm text-primary hover:underline"
            >
              VoiceFleet vs Smith.ai →
            </Link>
            <Link
              href="/blog/voicefleet-vs-ruby-receptionists"
              className="text-sm text-primary hover:underline"
            >
              VoiceFleet vs Ruby →
            </Link>
            <Link
              href="/blog/best-ai-phone-answering-service-ireland"
              className="text-sm text-primary hover:underline"
            >
              Full Comparison Guide →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
