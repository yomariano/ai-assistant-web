import { Brain, CheckCircle2, ArrowUpRight, Headphones } from "lucide-react";

const SolutionSection = () => {
  const capabilities = [
    {
      icon: Brain,
      title: "Understand",
      description:
        "Natural language processing handles accents, interruptions, and complex requests with human-like comprehension.",
      features: ["Multi-language support", "Context awareness", "Intent recognition"],
    },
    {
      icon: CheckCircle2,
      title: "Resolve",
      description:
        "Complete transactions, update accounts, answer questions — end-to-end resolution without human intervention.",
      features: ["Transaction processing", "Account management", "Knowledge base access"],
    },
    {
      icon: ArrowUpRight,
      title: "Escalate",
      description:
        "Seamlessly transfers to human agents when needed, with full context and conversation history.",
      features: ["Smart routing", "Context transfer", "Priority queuing"],
    },
  ];

  return (
    <section id="solutions" className="py-20 lg:py-28 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6">
            <Headphones className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">The Solution</span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-6">
            AI Agents That{" "}
            <span className="text-gradient-accent">Actually Work</span>
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed">
            VoiceFleet isn&apos;t a chatbot reading scripts. Our AI agents understand context,
            handle complex conversations, and know when to escalate. They&apos;re trained on
            <span className="font-semibold text-foreground"> YOUR processes, YOUR products, YOUR brand voice.</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {capabilities.map((capability, index) => (
            <div
              key={index}
              className="group relative bg-card rounded-2xl border border-border p-8 shadow-elegant hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-accent rounded-t-2xl" />

              <div className="w-14 h-14 bg-gradient-accent rounded-xl flex items-center justify-center mb-6 shadow-glow-accent">
                <capability.icon className="w-7 h-7 text-accent-foreground" />
              </div>

              <h3 className="text-xl font-heading font-bold text-foreground mb-3">
                {capability.title}
              </h3>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                {capability.description}
              </p>

              <ul className="space-y-2">
                {capability.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
