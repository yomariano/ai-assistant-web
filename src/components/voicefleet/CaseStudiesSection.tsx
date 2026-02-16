import { Stethoscope, Scale, Wrench } from "lucide-react";

const CaseStudiesSection = () => {
  const caseStudies = [
    {
      icon: Stethoscope,
      industry: "Dental clinic",
      name: "Practice manager",
      headline: "We can treat patients without missing new bookings",
      quote: "During appointments, the phone used to ring nonstop. Now VoiceFleet answers, captures the reason for the visit, and books or routes the call so we can focus on the patient in front of us.",
      stats: [
        { value: "0", label: "missed calls/day" },
        { value: "<30s", label: "booking flow" },
        { value: "2hrs", label: "admin saved/day" },
      ],
      color: "primary",
    },
    {
      icon: Scale,
      industry: "Professional services",
      name: "Small firm owner",
      headline: "Calls get qualified and routed consistently",
      quote: "VoiceFleet handles first-contact calls, captures key details, and routes urgent items to the right person. We respond faster without interrupting billable work.",
      stats: [
        { value: "100%", label: "structured notes" },
        { value: "24/7", label: "coverage" },
        { value: "<5min", label: "first response" },
      ],
      color: "accent",
    },
    {
      icon: Wrench,
      industry: "Home services",
      name: "Owner-operator",
      headline: "Emergency calls are captured with the right details",
      quote: "When I'm on-site, I can't answer the phone. VoiceFleet collects address, issue, urgency, and a callback number, then sends a clean summary so I can triage quickly.",
      stats: [
        { value: "3x", label: "jobs captured" },
        { value: "100%", label: "call summaries" },
        { value: "24/7", label: "coverage" },
      ],
      color: "primary",
    },
  ];

  return (
    <section id="case-studies" className="py-16 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
            Common <span className="text-gradient-accent">SMB Workflows</span>
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground">
            See practical call-handling patterns teams use with VoiceFleet
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            The examples below are illustrative call flows, not guaranteed performance claims.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {caseStudies.map((study, index) => (
            <div
              key={index}
              className="group bg-card rounded-2xl border border-border overflow-hidden shadow-elegant hover:shadow-xl transition-all duration-300"
            >
              {/* Header */}
              <div className={`p-4 sm:p-6 ${study.color === 'accent' ? 'bg-gradient-accent' : 'bg-gradient-hero'}`}>
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                    <study.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-medium text-primary-foreground/80 block">
                      {study.industry}
                    </span>
                    <span className="text-xs text-primary-foreground/60">
                      {study.name}
                    </span>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-heading font-bold text-primary-foreground">
                  &quot;{study.headline}&quot;
                </h3>
              </div>

              {/* Quote & Stats */}
              <div className="p-4 sm:p-6">
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed italic">
                  &quot;{study.quote}&quot;
                </p>

                <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-border">
                  {study.stats.map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="text-base sm:text-xl font-heading font-bold text-foreground">
                        {stat.value}
                      </div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground leading-tight">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudiesSection;
