import { Server, Shield, Zap } from "lucide-react";

const TechnologySection = () => {
  const techSpecs = [
    { icon: Zap, label: "Sub-500ms response latency" },
    { icon: Server, label: "99.9% uptime SLA" },
    { icon: Shield, label: "SOC 2 Type II certified" },
    { icon: Shield, label: "GDPR & CCPA compliant" },
    { icon: Shield, label: "PCI DSS ready" },
  ];

  const capabilities = [
    { category: "Voice", items: ["Natural language AI", "Multi-accent support", "Real-time processing"] },
    { category: "Telephony", items: ["Irish numbers", "Call forwarding", "Voicemail"] },
    { category: "Notifications", items: ["SMS alerts", "Email summaries", "Webhooks (Pro)"] },
  ];

  return (
    <section className="py-20 lg:py-28 bg-gradient-dark text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(16,185,129,0.1),transparent)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
            Enterprise-Grade <span className="text-accent">Infrastructure</span>
          </h2>
          <p className="text-lg text-primary-foreground/80">
            Built for scale, security, and seamless integration
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Architecture Visual */}
          <div className="relative">
            <div className="bg-primary-foreground/5 rounded-2xl border border-primary-foreground/10 p-8 backdrop-blur-sm">
              <div className="text-center mb-8">
                <span className="text-sm font-medium text-accent">Multi-Region Architecture</span>
              </div>

              {/* EU Data Centers */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-primary-foreground/5 rounded-xl p-4 border border-primary-foreground/10">
                  <Server className="w-8 h-8 text-accent mb-3" />
                  <p className="text-sm font-semibold">Ireland (eu-west-1)</p>
                  <p className="text-xs text-primary-foreground/60">Primary EU Region</p>
                </div>
                <div className="bg-primary-foreground/5 rounded-xl p-4 border border-primary-foreground/10">
                  <Server className="w-8 h-8 text-accent mb-3" />
                  <p className="text-sm font-semibold">Frankfurt (eu-central-1)</p>
                  <p className="text-xs text-primary-foreground/60">Failover Region</p>
                </div>
              </div>

              {/* Capabilities */}
              <div className="space-y-4">
                {capabilities.map((group, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-20 text-xs font-medium text-primary-foreground/60">
                      {group.category}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item, j) => (
                        <span
                          key={j}
                          className="px-3 py-1 bg-primary-foreground/10 rounded-full text-xs font-medium"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tech Specs */}
          <div>
            <h3 className="text-2xl font-heading font-bold mb-8">
              Technical Specifications
            </h3>
            <div className="space-y-4">
              {techSpecs.map((spec, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-primary-foreground/5 rounded-xl border border-primary-foreground/10"
                >
                  <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                    <spec.icon className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-base font-medium">{spec.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnologySection;
