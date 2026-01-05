import { ArrowRight, Building2, ShoppingBag, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";

const CaseStudiesSection = () => {
  const caseStudies = [
    {
      icon: Building2,
      industry: "Insurance Company",
      headline: "Reduced average handle time by 40%",
      stats: [
        { value: "50,000", label: "calls/month automated" },
        { value: "€180k", label: "annual savings" },
        { value: "4.2/5", label: "customer satisfaction" },
      ],
      color: "primary",
    },
    {
      icon: ShoppingBag,
      industry: "E-Commerce Retailer",
      headline: "Handled Black Friday with zero additional staff",
      stats: [
        { value: "300%", label: "call volume spike managed" },
        { value: "92%", label: "first-call resolution" },
        { value: "2 min", label: "average handle time" },
      ],
      color: "accent",
    },
    {
      icon: Stethoscope,
      industry: "Healthcare Provider",
      headline: "Appointment no-shows dropped 35%",
      stats: [
        { value: "35%", label: "fewer no-shows" },
        { value: "Auto", label: "rescheduling handled" },
        { value: "100%", label: "staff freed for care" },
      ],
      color: "primary",
    },
  ];

  return (
    <section id="case-studies" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
            Results That <span className="text-gradient-accent">Speak for Themselves</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            See how leading enterprises transform their contact centers
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {caseStudies.map((study, index) => (
            <div
              key={index}
              className="group bg-card rounded-2xl border border-border overflow-hidden shadow-elegant hover:shadow-xl transition-all duration-300"
            >
              {/* Header */}
              <div className={`p-6 ${study.color === 'accent' ? 'bg-gradient-accent' : 'bg-gradient-hero'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                    <study.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-medium text-primary-foreground/80 uppercase tracking-wide">
                    {study.industry}
                  </span>
                </div>
                <h3 className="text-xl font-heading font-bold text-primary-foreground">
                  &quot;{study.headline}&quot;
                </h3>
              </div>

              {/* Stats */}
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {study.stats.map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="text-xl font-heading font-bold text-foreground">
                        {stat.value}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="ghost" className="w-full group-hover:text-primary">
                  Read Case Study
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudiesSection;
