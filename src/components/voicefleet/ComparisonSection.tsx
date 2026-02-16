import { Check, X } from "lucide-react";
import Link from "next/link";

const ComparisonSection = () => {
  const options = [
    { key: "voicefleet", name: "VoiceFleet", highlight: true },
    { key: "humanFrontDesk", name: "Human-only Front Desk" },
    { key: "basicIvr", name: "Basic IVR Menu" },
  ];

  const features = [
    {
      name: "24/7 call handling",
      voicefleet: true,
      humanFrontDesk: "Depends on staffing",
      basicIvr: true,
    },
    {
      name: "Natural conversation",
      voicefleet: true,
      humanFrontDesk: true,
      basicIvr: false,
    },
    {
      name: "Appointment/reservation booking",
      voicefleet: true,
      humanFrontDesk: true,
      basicIvr: "Limited",
    },
    {
      name: "After-hours lead capture",
      voicefleet: true,
      humanFrontDesk: "Depends on staffing",
      basicIvr: "Limited",
    },
    {
      name: "Urgent escalation rules",
      voicefleet: true,
      humanFrontDesk: true,
      basicIvr: "Limited",
    },
    {
      name: "Multilingual handling",
      voicefleet: true,
      humanFrontDesk: "Depends on team",
      basicIvr: "Limited",
    },
    {
      name: "Setup time",
      voicefleet: "Hours",
      humanFrontDesk: "Hiring + training",
      basicIvr: "Days",
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
            How VoiceFleet <span className="text-gradient-primary">Fits Your Stack</span>
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground">
            Compare common call-handling approaches for SMB teams
          </p>
        </div>

        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="py-4 px-4 text-left text-sm font-semibold text-muted-foreground">
                  Capability
                </th>
                {options.map((option) => (
                  <th key={option.key} className="py-4 px-4 text-center">
                    {option.highlight ? (
                      <div className="inline-flex flex-col items-center">
                        <span className="text-lg font-heading font-bold text-primary">{option.name}</span>
                        <span className="text-xs text-accent">Recommended</span>
                      </div>
                    ) : (
                      <span className="text-sm font-semibold text-muted-foreground">{option.name}</span>
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
                  {options.map((option) => (
                    <td
                      key={option.key}
                      className={`py-4 px-4 text-center ${option.highlight ? "bg-primary/5" : ""}`}
                    >
                      {renderCell(feature[option.key as keyof typeof feature] as boolean | string)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:hidden space-y-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card rounded-xl border border-border p-4"
            >
              <h3 className="font-semibold text-foreground mb-3">{feature.name}</h3>
              <div className="grid grid-cols-1 gap-2">
                {options.map((option) => (
                  <div
                    key={option.key}
                    className={`flex items-center justify-between rounded-lg p-2 ${
                      option.highlight ? "bg-primary/5" : "bg-muted/50"
                    }`}
                  >
                    <span className={`text-xs font-medium ${option.highlight ? "text-primary" : "text-muted-foreground"}`}>
                      {option.name}
                    </span>
                    {renderMobileCell(feature[option.key as keyof typeof feature] as boolean | string)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Need deeper alternatives analysis for your use case?
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/compare"
              className="text-sm text-primary hover:underline"
            >
              See all comparison pages
            </Link>
            <Link
              href="/blog"
              className="text-sm text-primary hover:underline"
            >
              Read comparison guides
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
