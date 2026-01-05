import { Shield, Lock, FileCheck, CreditCard } from "lucide-react";

const SecuritySection = () => {
  const certifications = [
    {
      icon: Shield,
      title: "SOC 2 Type II",
      description: "Annual audits verify our security controls",
    },
    {
      icon: Lock,
      title: "GDPR Compliant",
      description: "EU data residency, DPA available",
    },
    {
      icon: FileCheck,
      title: "ISO 27001",
      description: "Information security management certified",
    },
    {
      icon: CreditCard,
      title: "PCI DSS",
      description: "Safe for payment card data",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
            Security You Can <span className="text-gradient-accent">Trust</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Enterprise-grade security that meets the highest standards
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="bg-card rounded-xl border border-border p-6 text-center shadow-elegant"
            >
              <div className="w-14 h-14 bg-accent/10 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <cert.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-lg font-heading font-bold text-foreground mb-2">
                {cert.title}
              </h3>
              <p className="text-sm text-muted-foreground">{cert.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-2xl border border-border p-8 text-center max-w-2xl mx-auto">
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">All calls encrypted</span> in transit and at rest.{" "}
            <span className="font-semibold text-foreground">Data never leaves the EU</span>.{" "}
            Full audit logging for compliance.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
