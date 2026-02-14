import { Phone, MessageSquare, Calendar, CheckCircle2, Headphones } from "lucide-react";

const SolutionSectionES = () => {
  const capabilities = [
    {
      icon: Phone,
      title: "Atiende Cada Llamada",
      description:
        "Tu recepcionista IA atiende rápido, siempre. Sin música de espera, sin buzón de voz, sin oportunidades perdidas.",
      features: ["Disponible 24/7", "Atención inmediata", "Voz natural y humana"],
    },
    {
      icon: MessageSquare,
      title: "Toma Mensajes",
      description:
        "Captura datos del llamador, motivo de la llamada y urgencia. Te envía una notificación instantánea por SMS o email.",
      features: ["Nombre y número del llamador", "Transcripción del mensaje", "Notificaciones instantáneas"],
    },
    {
      icon: Calendar,
      title: "Agenda Turnos",
      description:
        "Verifica tu disponibilidad, agenda turnos y envía confirmación tanto a vos como al llamador.",
      features: ["Integración con calendario", "Confirmaciones automáticas", "Gestión de reprogramaciones"],
    },
  ];

  return (
    <section id="solutions" className="py-20 lg:py-28 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6">
            <Headphones className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Cómo Funciona</span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-6">
            Tus Llamadas Atendidas{" "}
            <span className="text-gradient-accent">Profesionalmente</span>
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed">
            Redirigí tu número comercial a VoiceFleet. Nuestra recepcionista IA atiende,
            gestiona la llamada y te mantiene informado —{" "}
            <span className="font-semibold text-foreground">como tener tu propia recepción.</span>
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

export default SolutionSectionES;
