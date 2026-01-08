import { Stethoscope, Scale, Wrench } from "lucide-react";

const CaseStudiesSection = () => {
  const caseStudies = [
    {
      icon: Stethoscope,
      industry: "Dental Clinic, Dublin",
      name: "Dr. Sarah Mitchell",
      headline: "We stopped missing calls during patient appointments",
      quote: "Before VoiceFleet, we'd miss 15-20 calls a day while treating patients. Now every call is answered, appointments are booked automatically, and patients get callbacks within minutes. Our receptionist can focus on the patients in front of her.",
      stats: [
        { value: "100%", label: "calls answered" },
        { value: "25+", label: "bookings/week via AI" },
        { value: "€0", label: "extra staff needed" },
      ],
      color: "primary",
    },
    {
      icon: Scale,
      industry: "Solicitors, Cork",
      name: "O'Brien & Partners",
      headline: "Client intake doubled without hiring",
      quote: "As a small firm, we couldn't afford a full-time receptionist. VoiceFleet handles our calls professionally, takes detailed messages, and even does basic client intake. New clients are impressed by our responsiveness.",
      stats: [
        { value: "2x", label: "client inquiries handled" },
        { value: "24/7", label: "availability" },
        { value: "€25k", label: "saved vs receptionist" },
      ],
      color: "accent",
    },
    {
      icon: Wrench,
      industry: "Plumbing Services, Galway",
      name: "Connacht Plumbing",
      headline: "Never miss an emergency call-out again",
      quote: "In plumbing, a missed call can mean losing a €500 job to a competitor. VoiceFleet answers every call, gets the job details, and texts me immediately. I've picked up so much extra work since switching.",
      stats: [
        { value: "30%", label: "more jobs booked" },
        { value: "<1 sec", label: "answer time" },
        { value: "Nights", label: "& weekends covered" },
      ],
      color: "primary",
    },
  ];

  return (
    <section id="case-studies" className="py-16 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
            Trusted by <span className="text-gradient-accent">Irish Businesses</span>
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground">
            See how businesses like yours are using VoiceFleet
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
