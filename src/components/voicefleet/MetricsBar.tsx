import { ShieldCheck, PhoneCall, Route, CalendarClock } from "lucide-react";

const MetricsBar = () => {
  const metrics = [
    {
      icon: PhoneCall,
      value: "24/7",
      label: "Call Coverage",
      description: "Answers during business and after-hours windows",
    },
    {
      icon: CalendarClock,
      value: "Fast",
      label: "First Response",
      description: "Callers reach an assistant immediately",
    },
    {
      icon: Route,
      value: "Smart",
      label: "Routing",
      description: "Urgent calls can be escalated to staff",
    },
    {
      icon: ShieldCheck,
      value: "Clear",
      label: "Call Summaries",
      description: "Teams get structured details after each call",
    },
  ];

  return (
    <section className="py-12 bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="text-center animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-foreground/10 rounded-xl mb-4">
                <metric.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="text-3xl lg:text-4xl font-heading font-extrabold text-primary-foreground mb-1">
                {metric.value}
              </div>
              <div className="text-sm font-semibold text-primary-foreground/90 mb-1">
                {metric.label}
              </div>
              <div className="text-xs text-primary-foreground/70">
                {metric.description}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-primary-foreground/70">
          Outcomes depend on call flow, configuration, and business process.
        </p>
      </div>
    </section>
  );
};

export default MetricsBar;
