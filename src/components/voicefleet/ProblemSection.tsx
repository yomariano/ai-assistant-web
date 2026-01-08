import { PhoneMissed, Clock, Wallet } from "lucide-react";

const ProblemSection = () => {
  const problems = [
    {
      icon: PhoneMissed,
      title: "Missed Calls = Lost Business",
      description:
        "Phone rings while you're with a customer. You can't answer. That caller moves on to your competitor. Every missed call is money walking out the door.",
      stat: "67%",
      statLabel: "of callers won't leave a voicemail",
    },
    {
      icon: Clock,
      title: "After-Hours Hang-Ups",
      description:
        "Customers call at 6pm, 8pm, weekends. Your phone goes to voicemail. They hang up and try someone else. You never even knew they called.",
      stat: "40%",
      statLabel: "of calls come outside business hours",
    },
    {
      icon: Wallet,
      title: "Receptionist Costs",
      description:
        "Hiring someone just to answer phones costs €30,000+ per year. And they still can't work nights, weekends, or bank holidays.",
      stat: "€30k+",
      statLabel: "annual receptionist salary",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
            Every Missed Call Is{" "}
            <span className="text-gradient-primary">A Missed Opportunity</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Small businesses lose thousands in revenue each year from unanswered calls
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="group relative bg-card rounded-2xl border border-border p-8 shadow-elegant hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-destructive/50 to-destructive rounded-t-2xl" />

              <div className="w-14 h-14 bg-destructive/10 rounded-xl flex items-center justify-center mb-6">
                <problem.icon className="w-7 h-7 text-destructive" />
              </div>

              <h3 className="text-xl font-heading font-bold text-foreground mb-3">
                {problem.title}
              </h3>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                {problem.description}
              </p>

              <div className="pt-6 border-t border-border">
                <div className="text-3xl font-heading font-bold text-destructive">
                  {problem.stat}
                </div>
                <div className="text-sm text-muted-foreground">{problem.statLabel}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
