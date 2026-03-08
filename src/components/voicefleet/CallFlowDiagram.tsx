import { Phone, Bot, Smartphone, ArrowRight, ArrowDown } from "lucide-react";

const flowSteps = [
  {
    icon: Phone,
    title: "Business Line",
    subtitle: "Your existing number",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: Bot,
    title: "VoiceFleet AI",
    subtitle: "Answers & handles the call",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Smartphone,
    title: "Your Mobile",
    subtitle: "Only if needed",
    color: "bg-green-500/10 text-green-600",
  },
];

const CallFlowDiagram = () => {
  return (
    <section className="py-16 lg:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-3">
            No Call Loops. One-Way Flow.
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Calls go in one direction only. Your business line forwards to VoiceFleet, and VoiceFleet escalates to your mobile when needed. Never backwards.
          </p>
        </div>

        {/* Desktop: horizontal */}
        <div className="hidden md:flex items-center justify-center gap-4 max-w-3xl mx-auto">
          {flowSteps.map((step, index) => (
            <div key={step.title} className="contents">
              <div className="flex-1 bg-card border border-border rounded-xl p-6 text-center shadow-sm">
                <div className={`w-14 h-14 rounded-full ${step.color} flex items-center justify-center mx-auto mb-3`}>
                  <step.icon className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-bold text-foreground text-lg">{step.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{step.subtitle}</p>
              </div>
              {index < flowSteps.length - 1 && (
                <ArrowRight className="w-8 h-8 text-muted-foreground/50 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>

        {/* Mobile: vertical */}
        <div className="md:hidden flex flex-col items-center gap-3 max-w-xs mx-auto">
          {flowSteps.map((step, index) => (
            <div key={step.title} className="contents">
              <div className="w-full bg-card border border-border rounded-xl p-5 text-center shadow-sm">
                <div className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center mx-auto mb-3`}>
                  <step.icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{step.subtitle}</p>
              </div>
              {index < flowSteps.length - 1 && (
                <ArrowDown className="w-6 h-6 text-muted-foreground/50" />
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8 max-w-md mx-auto">
          Your customers call your existing number. VoiceFleet handles the conversation. Staff are only contacted when the AI determines human attention is needed.
        </p>
      </div>
    </section>
  );
};

export default CallFlowDiagram;
