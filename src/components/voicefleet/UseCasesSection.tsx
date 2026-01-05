import {
  Headphones,
  Calendar,
  Package,
  CreditCard,
  UserCheck,
  Megaphone
} from "lucide-react";

const UseCasesSection = () => {
  const useCases = [
    {
      icon: Headphones,
      title: "Inbound Support",
      description: "First-line customer service, FAQs, account inquiries",
      volume: "High Volume",
    },
    {
      icon: Calendar,
      title: "Appointment Scheduling",
      description: "Healthcare, services, consultations",
      volume: "Time-Sensitive",
    },
    {
      icon: Package,
      title: "Order Status",
      description: "Tracking, modifications, cancellations",
      volume: "Peak Demand",
    },
    {
      icon: CreditCard,
      title: "Payment Processing",
      description: "Collections, billing inquiries, payment plans",
      volume: "Secure",
    },
    {
      icon: UserCheck,
      title: "Lead Qualification",
      description: "Inbound lead capture and qualification",
      volume: "24/7",
    },
    {
      icon: Megaphone,
      title: "Outbound Campaigns",
      description: "Surveys, reminders, confirmations",
      volume: "Scalable",
    },
  ];

  return (
    <section id="use-cases" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
            Built for{" "}
            <span className="text-gradient-primary">High-Volume</span> Operations
          </h2>
          <p className="text-lg text-muted-foreground">
            Deploy AI agents across your entire call operation
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="group relative bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <useCase.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-heading font-bold text-foreground">
                      {useCase.title}
                    </h3>
                    <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">
                      {useCase.volume}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {useCase.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
