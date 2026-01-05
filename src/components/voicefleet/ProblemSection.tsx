import { TrendingUp, Users, AlertCircle } from "lucide-react";

const ProblemSection = () => {
  const problems = [
    {
      icon: TrendingUp,
      title: "Rising Costs",
      description:
        "Agent salaries up 15% YoY. Training costs €5k per hire. Turnover at 30-40%. The numbers don't add up.",
      stat: "€5k",
      statLabel: "per hire training",
    },
    {
      icon: Users,
      title: "Scaling Challenges",
      description:
        "Peak season means overtime or dropped calls. Hiring takes months. By the time you're staffed, the rush is over.",
      stat: "3-6",
      statLabel: "months to hire",
    },
    {
      icon: AlertCircle,
      title: "Quality Inconsistency",
      description:
        "Your best agent handles 80 calls perfectly. Your worst creates complaints. AI delivers the same quality every time.",
      stat: "40%",
      statLabel: "quality variance",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
            The Contact Center Math{" "}
            <span className="text-gradient-primary">Doesn&apos;t Work</span> Anymore
          </h2>
          <p className="text-lg text-muted-foreground">
            Legacy approaches are breaking under modern demands
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
