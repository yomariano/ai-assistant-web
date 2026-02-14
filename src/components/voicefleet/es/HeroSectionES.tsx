import { Shield, Clock, Phone, MessageSquare, Calendar, Link2, Headphones, PhoneIncoming, Globe2 } from "lucide-react";
import HeroCTAES from "@/components/voicefleet/es/HeroCTAES";

const trustBadges = [
  { icon: Shield, label: "Seguridad empresarial" },
  { icon: Clock, label: "Activá en menos de 1 hora" },
  { icon: Link2, label: "Integración con calendarios" },
  { icon: Globe2, label: "Agentes multilingües" },
];

const industries = ["Restaurantes", "Dentistas", "Gimnasios", "Plomeros", "Clínicas", "Peluquerías"];
const integrations = [
  "Google Calendar",
  "Outlook",
  "Calendly",
  "Cal.com",
  "Square Appointments",
  "SimplyBook.me",
  "Mindbody (beta)",
  "TheFork (beta)",
  "OpenTable (beta)",
  "Resy (beta)",
];

const HeroSectionES = () => {
  return (
    <section className="relative min-h-screen pt-20 lg:pt-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-subtle" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-hero opacity-5 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-6rem)]">
          {/* Left Content */}
          <div className="py-12 lg:py-0">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6 animate-fade-up">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse-subtle" />
              <span className="text-sm font-medium text-accent">Recepcionista IA 24/7 para pymes</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-foreground leading-tight mb-6">
              Atendé Todas las Llamadas.{" "}
              <span className="text-gradient-primary">Agendá Más Turnos.</span>{" "}
              Con una Recepcionista IA.
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed">
              Redirigí tu número actual a VoiceFleet. Atendemos llamadas, capturamos la intención y los datos, y agendamos turnos o reservas en tu calendario.
              También escalamos llamadas urgentes a tu equipo y enviamos resúmenes al instante.
            </p>

            <HeroCTAES />

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 animate-fade-up stagger-4">
              {trustBadges.map((badge, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border shadow-sm"
                >
                  <badge.icon className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-foreground">{badge.label}</span>
                </div>
              ))}
            </div>

            {/* Social Proof */}
            <div className="mt-10 pt-10 border-t border-border animate-fade-up stagger-5">
              <p className="text-sm text-muted-foreground mb-3">Diseñado para equipos que dependen del teléfono</p>
              <div className="flex flex-wrap items-center gap-2 mb-5">
                {industries.map((industry) => (
                  <div
                    key={industry}
                    className="h-7 px-3 bg-card border border-border rounded flex items-center justify-center text-xs font-medium text-foreground/80"
                  >
                    {industry}
                  </div>
                ))}
              </div>

              <p className="text-sm text-muted-foreground mb-3">Se integra con</p>
              <div className="flex flex-wrap items-center gap-2">
                {integrations.map((integration) => (
                  <div
                    key={integration}
                    className="h-7 px-3 bg-card border border-border rounded flex items-center justify-center text-xs font-medium text-foreground/80"
                  >
                    {integration}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content - Receptionist Preview */}
          <div className="relative animate-fade-up stagger-3">
            <div className="relative bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
              {/* Dashboard Header */}
              <div className="bg-gradient-hero p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary-foreground/30" />
                  <div className="w-3 h-3 rounded-full bg-primary-foreground/30" />
                  <div className="w-3 h-3 rounded-full bg-primary-foreground/30" />
                </div>
                <div className="text-right">
                  <span className="block text-sm font-medium text-primary-foreground/80">Recepcionista VoiceFleet</span>
                  <span className="block text-[11px] text-primary-foreground/70">Panel de ejemplo (datos de muestra)</span>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  <DashboardStat icon={PhoneIncoming} label="Llamadas Atendidas" value="47" trend="Hoy" />
                  <DashboardStat icon={MessageSquare} label="Mensajes" value="12" trend="Nuevos" positive />
                  <DashboardStat icon={Calendar} label="Turnos" value="8" trend="Hoy" className="col-span-2 sm:col-span-1" />
                </div>

                {/* Live Activity */}
                <div className="bg-muted/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-foreground">Actividad Reciente</span>
                    <span className="flex items-center gap-1 text-xs text-accent">
                      <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                      En vivo
                    </span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { status: "Turno agendado", time: "Hace 2 min", caller: "Consulta de paciente nuevo" },
                      { status: "Mensaje tomado", time: "Hace 8 min", caller: "Solicitud de devolución de llamada" },
                      { status: "Consulta respondida", time: "Hace 15 min", caller: "Consulta de horarios" },
                    ].map((activity, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-accent rounded-full flex items-center justify-center">
                            <Headphones className="w-4 h-4 text-accent-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{activity.status}</p>
                            <p className="text-xs text-muted-foreground">{activity.caller}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-muted/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-foreground">Cobertura</span>
                    <span className="text-sm font-bold text-accent">24/7</span>
                  </div>
                  <div className="flex items-end gap-1 h-16">
                    {[70, 85, 80, 90, 75, 88, 82, 92, 78, 86, 84, 90].map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-accent rounded-t opacity-80 hover:opacity-100 transition-opacity"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">Cobertura telefónica continua, incluso fuera de horario</p>
                </div>
              </div>
            </div>

            {/* Floating Element */}
            <div className="hidden sm:block absolute -top-4 -right-4 bg-card rounded-xl shadow-lg border border-border p-4 animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-foreground/70">Llamadas Este Mes (ejemplo)</p>
                  <p className="text-lg font-bold text-foreground">1,247</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const DashboardStat = ({
  icon: Icon,
  label,
  value,
  trend,
  positive = true,
  className = ""
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  trend: string;
  positive?: boolean;
  className?: string;
}) => (
  <div className={`bg-muted/50 rounded-xl p-3 sm:p-4 ${className}`}>
    <div className="flex items-center gap-2 mb-2">
      <Icon className="w-4 h-4 text-foreground/60" />
      <span className="text-xs text-foreground/70">{label}</span>
    </div>
    <p className="text-2xl font-bold text-foreground">{value}</p>
    <p className={`text-xs font-medium ${positive ? 'text-accent' : 'text-foreground/70'}`}>
      {trend}
    </p>
  </div>
);

export default HeroSectionES;
