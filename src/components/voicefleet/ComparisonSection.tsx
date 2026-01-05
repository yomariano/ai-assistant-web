import { Check, X } from "lucide-react";

const ComparisonSection = () => {
  const features = [
    {
      name: "Natural conversation",
      voicefleet: true,
      ivr: "Press 1, Press 2",
      offshore: true,
      diy: "Varies",
    },
    {
      name: "24/7 availability",
      voicefleet: true,
      ivr: true,
      offshore: "Limited",
      diy: true,
    },
    {
      name: "Instant scalability",
      voicefleet: true,
      ivr: true,
      offshore: "Weeks to scale",
      diy: true,
    },
    {
      name: "Cost per interaction",
      voicefleet: "€0.25-0.50",
      ivr: "€0.10",
      offshore: "€1.50-3.00",
      diy: "€0.30-0.80",
    },
    {
      name: "Resolution rate",
      voicefleet: "85-95%",
      ivr: "20-30%",
      offshore: "70-85%",
      diy: "60-80%",
    },
    {
      name: "Setup time",
      voicefleet: "2-4 weeks",
      ivr: "1-2 months",
      offshore: "2-3 months",
      diy: "3-6 months",
    },
    {
      name: "Maintenance burden",
      voicefleet: "Managed",
      ivr: "High",
      offshore: "Medium",
      diy: "Very High",
    },
    {
      name: "European data residency",
      voicefleet: true,
      ivr: "Varies",
      offshore: false,
      diy: "Varies",
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

  return (
    <section className="py-20 lg:py-28 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
            How VoiceFleet <span className="text-gradient-primary">Compares</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            See why leading contact centers choose VoiceFleet
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-border">
                <th className="py-4 px-4 text-left text-sm font-semibold text-muted-foreground">
                  Capability
                </th>
                <th className="py-4 px-4 text-center">
                  <div className="inline-flex flex-col items-center">
                    <span className="text-lg font-heading font-bold text-primary">VoiceFleet</span>
                    <span className="text-xs text-accent">Recommended</span>
                  </div>
                </th>
                <th className="py-4 px-4 text-center text-sm font-semibold text-muted-foreground">
                  Traditional IVR
                </th>
                <th className="py-4 px-4 text-center text-sm font-semibold text-muted-foreground">
                  Offshore Agents
                </th>
                <th className="py-4 px-4 text-center text-sm font-semibold text-muted-foreground">
                  DIY AI Stack
                </th>
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
                  <td className="py-4 px-4 text-center bg-primary/5">
                    {renderCell(feature.voicefleet)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {renderCell(feature.ivr)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {renderCell(feature.offshore)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {renderCell(feature.diy)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
