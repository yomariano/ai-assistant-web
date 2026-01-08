import {
  Stethoscope,
  Scale,
  Wrench,
  Home,
  Scissors,
  Store
} from "lucide-react";

const UseCasesSection = () => {
  const useCases = [
    {
      icon: Stethoscope,
      title: "Medical & Dental",
      description: "Appointment bookings, patient queries, prescription requests, after-hours triage",
      tag: "Healthcare",
    },
    {
      icon: Scale,
      title: "Legal & Accounting",
      description: "Client intake, consultation scheduling, case inquiries, document requests",
      tag: "Professional",
    },
    {
      icon: Wrench,
      title: "Trades & Services",
      description: "Job enquiries, quote requests, emergency call-outs, scheduling",
      tag: "Trade",
    },
    {
      icon: Home,
      title: "Property & Letting",
      description: "Viewing requests, tenant queries, maintenance reports, availability checks",
      tag: "Property",
    },
    {
      icon: Scissors,
      title: "Salons & Wellness",
      description: "Appointment bookings, service enquiries, cancellations, availability",
      tag: "Beauty",
    },
    {
      icon: Store,
      title: "Retail & Hospitality",
      description: "Opening hours, reservations, product queries, directions",
      tag: "Retail",
    },
  ];

  return (
    <section id="use-cases" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
            Perfect for{" "}
            <span className="text-gradient-primary">Every Industry</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Irish businesses of all types trust VoiceFleet to handle their calls
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
                      {useCase.tag}
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
