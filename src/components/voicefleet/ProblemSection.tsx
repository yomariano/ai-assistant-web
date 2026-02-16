import { PhoneMissed, Clock, Wallet } from "lucide-react";

const ProblemSection = () => {
  const problems = [
    {
      icon: PhoneMissed,
      title: "Missed Calls Lead to Lost Revenue",
      description:
        "When calls arrive during appointments or on-site work, many prospects move to the next business instead of waiting for a callback.",
      stat: "62%",
      statLabel: "of callers won't leave a voicemail",
    },
    {
      icon: Clock,
      title: "After-Hours Demand",
      description:
        "Evening and weekend callers still expect answers. If the line goes to voicemail, those bookings are often delayed or lost.",
      stat: "40%+",
      statLabel: "of calls arrive outside business hours",
    },
    {
      icon: Wallet,
      title: "Front-Desk Overhead",
      description:
        "Hiring and scheduling phone coverage adds fixed overhead, while call volume changes throughout the week.",
      stat: "\u20ac30K+",
      statLabel: "annual receptionist cost vs \u20ac99/mo",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
            Stop Losing Revenue to{" "}
            <span className="text-gradient-primary">Missed Calls</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Small businesses lose thousands in revenue each year from calls that go unanswered or hit voicemail
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

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Typical phone-workflow challenges for SMB teams. Impact varies by industry and call volume.
        </p>
      </div>
    </section>
  );
};

export default ProblemSection;
