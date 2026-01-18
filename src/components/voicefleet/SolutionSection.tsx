import { Phone, MessageSquare, Calendar, CheckCircle2, Headphones } from "lucide-react";

const SolutionSection = () => {
  const capabilities = [
    {
      icon: Phone,
      title: "Answers Every Call",
      description:
        "Your AI receptionist answers quickly, every time. No hold music, no voicemail, no missed opportunities.",
      features: ["24/7 availability", "Fast pickup", "Natural, human-like voice"],
    },
    {
      icon: MessageSquare,
      title: "Takes Messages",
      description:
        "Captures caller details, reason for calling, and urgency. Sends you an instant notification by SMS or email.",
      features: ["Caller name & number", "Message transcription", "Instant notifications"],
    },
    {
      icon: Calendar,
      title: "Books Appointments",
      description:
        "Checks your availability, books appointments, and sends confirmation to both you and the caller.",
      features: ["Calendar integration", "Booking confirmations", "Reschedule handling"],
    },
  ];

  return (
    <section id="solutions" className="py-20 lg:py-28 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6">
            <Headphones className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">How It Works</span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-6">
            Your Calls Handled{" "}
            <span className="text-gradient-accent">Professionally</span>
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed">
            Forward your business number to VoiceFleet. Our AI receptionist answers,
            handles the call, and keeps you informed —{" "}
            <span className="font-semibold text-foreground">just like having your own front desk.</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {capabilities.map((capability, index) => (
            <div
              key={index}
              className="group relative bg-card rounded-2xl border border-border p-8 shadow-elegant hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-accent rounded-t-2xl" />

              <div className="w-14 h-14 bg-gradient-accent rounded-xl flex items-center justify-center mb-6 shadow-glow-accent">
                <capability.icon className="w-7 h-7 text-accent-foreground" />
              </div>

              <h3 className="text-xl font-heading font-bold text-foreground mb-3">
                {capability.title}
              </h3>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                {capability.description}
              </p>

              <ul className="space-y-2">
                {capability.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
