import { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/marketing/Breadcrumbs";
import CTASection from "@/components/marketing/CTASection";
import HeaderES from "@/components/voicefleet/HeaderES";
import FooterES from "@/components/voicefleet/FooterES";
import {
  Phone,
  Clock,
  Globe,
  Calendar,
  MessageSquare,
  BarChart3,
  Shield,
  Zap,
  Users,
  Settings,
  Headphones,
  Bell,
  ArrowRight,
} from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = {
  ...generatePageMetadata({
    title: "Funciones - Capacidades del Asistente de Voz IA",
    description:
      "Explorá las funciones de VoiceFleet: disponibilidad 24/7, soporte multilingüe, agenda de turnos, analíticas y más.",
    path: "/es/funciones",
  }),
  alternates: {
    canonical: "https://voicefleet.ai/es/funciones",
    languages: {
      "es-AR": "/es/funciones",
      en: "/features",
    },
  },
  openGraph: {
    locale: "es_AR",
  },
};

const features = [
  {
    icon: Phone,
    name: "Atención de Llamadas IA",
    slug: "ai-call-handling",
    description:
      "Conversaciones naturales con IA avanzada. Tomá pedidos, reservá turnos y respondé preguntas de clientes automáticamente.",
    highlights: ["Comprensión de lenguaje natural", "Toma de pedidos y reservas", "Saludo personalizado para tu negocio"],
    availableOn: "Todos los planes",
  },
  {
    icon: Clock,
    name: "Disponibilidad 24/7",
    slug: "24-7-availability",
    description:
      "Nunca más pierdas una llamada. Tu asistente IA trabaja las 24 horas, incluso feriados y fines de semana.",
    highlights: ["Sin costos de horas extra", "Cobertura fuera de horario", "Respuesta instantánea siempre"],
    availableOn: "Todos los planes",
  },
  {
    icon: Calendar,
    name: "Integración con Calendario",
    slug: "calendar-integration",
    description:
      "Agendá turnos automáticamente según tu disponibilidad. Sincronizá con Google Calendar, Outlook y más.",
    highlights: ["Disponibilidad en tiempo real", "Confirmaciones automáticas", "Recordatorios"],
    availableOn: "Growth y Pro",
  },
  {
    icon: MessageSquare,
    name: "Notificaciones SMS y Email",
    slug: "notifications",
    description:
      "Recibí alertas instantáneas por cada llamada. Detalles de pedidos, confirmaciones de turnos y resúmenes de llamadas.",
    highlights: ["Alertas SMS en tiempo real", "Resúmenes por email", "Detalles de pedidos/turnos"],
    availableOn: "Todos los planes (Email en Growth+)",
  },
  {
    icon: Globe,
    name: "Números Telefónicos Locales",
    slug: "local-numbers",
    description:
      "Obtené un número local incluido en cada plan. Números argentinos disponibles.",
    highlights: ["Números argentinos", "Portabilidad numérica disponible", "Infraestructura confiable"],
    availableOn: "Todos los planes",
  },
  {
    icon: BarChart3,
    name: "Panel de Analíticas",
    slug: "analytics",
    description:
      "Seguí volúmenes de llamadas, horarios pico, pedidos populares y más. Datos para optimizar tu negocio.",
    highlights: ["Seguimiento de volumen de llamadas", "Análisis de horarios pico", "Tendencias de pedidos"],
    availableOn: "Growth y Pro",
  },
  {
    icon: Shield,
    name: "Seguridad Empresarial",
    slug: "security",
    description:
      "Tus datos están protegidos con seguridad de nivel empresarial y encriptación de extremo a extremo.",
    highlights: ["Centros de datos seguros", "Encriptación de datos", "Cumplimiento normativo"],
    availableOn: "Todos los planes",
  },
  {
    icon: Zap,
    name: "Configuración Instantánea",
    slug: "instant-setup",
    description:
      "Activá en menos de una hora. Sin conocimientos técnicos. Solo contanos sobre tu negocio y nosotros nos encargamos.",
    highlights: ["Setup gratuito incluido", "Sin necesidad de IT", "Listo en menos de 1 hora"],
    availableOn: "Todos los planes",
  },
  {
    icon: Users,
    name: "Soporte Multi-Sucursal",
    slug: "multi-location",
    description:
      "Gestioná múltiples sucursales desde un solo panel. Cada sucursal tiene su propio número y configuración.",
    highlights: ["Hasta 5 números telefónicos", "Analíticas por sucursal", "Gestión centralizada"],
    availableOn: "Solo Pro",
  },
  {
    icon: Settings,
    name: "Gestión de Pedidos y Reservas",
    slug: "order-management",
    description:
      "La IA maneja pedidos y reservas sin problemas. Los clientes pueden hacer pedidos, reservar mesas o agendar turnos.",
    highlights: ["Toma de pedidos", "Reservas de mesas", "Agenda de turnos"],
    availableOn: "Todos los planes",
  },
  {
    icon: Headphones,
    name: "Soporte Prioritario",
    slug: "priority-support",
    description:
      "Obtené ayuda cuando la necesites. Soporte en horario laboral en todos los planes, con soporte 24/7 en Pro.",
    highlights: ["Soporte en horario laboral", "24/7 en plan Pro", "Account manager dedicado"],
    availableOn: "Todos los planes (24/7 en Pro)",
  },
  {
    icon: Bell,
    name: "Enrutamiento Inteligente",
    slug: "smart-routing",
    description:
      "La IA sabe cuándo atender llamadas y cuándo transferir al personal. Configurá reglas para urgencias o clientes VIP.",
    highlights: ["Escalación automática", "Opción de transferencia", "Buzón de respaldo"],
    availableOn: "Todos los planes",
  },
];

export default function FuncionesPage() {
  const breadcrumbs = [
    { name: "Inicio", href: "/es/" },
    { name: "Funciones", href: "/es/funciones" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <HeaderES />

      <main className="pt-20">
        <Breadcrumbs items={breadcrumbs} />

        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-primary-foreground mb-4">
              Funciones Potentes de Voz IA
            </h1>
            <p className="text-lg lg:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Todo lo que necesitás para automatizar llamadas telefónicas y ahorrar horas cada semana.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            {/* Plan Legend */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-accent/30" />
                <span className="text-sm text-muted-foreground">Todos los planes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-200" />
                <span className="text-sm text-muted-foreground">Growth y Pro</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-200" />
                <span className="text-sm text-muted-foreground">Solo Pro</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {features.map((feature) => {
                const Icon = feature.icon;
                const isPro = feature.availableOn.includes("Solo Pro");
                const isGrowth = feature.availableOn.includes("Growth");
                return (
                  <article
                    key={feature.slug}
                    className="group bg-card rounded-2xl border border-border p-6 hover:shadow-xl hover:border-primary/20 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        isPro
                          ? "bg-amber-100 text-amber-700"
                          : isGrowth
                          ? "bg-blue-100 text-blue-700"
                          : "bg-accent/10 text-accent"
                      }`}>
                        {feature.availableOn}
                      </span>
                    </div>

                    <h2 className="text-xl font-heading font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {feature.name}
                    </h2>

                    <p className="text-muted-foreground mb-4">
                      {feature.description}
                    </p>

                    <ul className="space-y-2">
                      {feature.highlights.map((highlight, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm text-foreground"
                        >
                          <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
                ¿Por Qué Elegir VoiceFleet?
              </h2>
              <p className="text-lg text-muted-foreground">
                Mirá cómo nuestros agentes de voz IA se comparan con soluciones tradicionales
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
              <div className="bg-card rounded-xl border border-border p-6 text-center">
                <div className="text-4xl font-heading font-bold text-primary mb-2">$49</div>
                <p className="text-muted-foreground">Precio inicial por mes</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6 text-center">
                <div className="text-4xl font-heading font-bold text-accent mb-2">24/7</div>
                <p className="text-muted-foreground">Disponibilidad sin horas extra</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6 text-center">
                <div className="text-4xl font-heading font-bold text-primary mb-2">&lt;1hr</div>
                <p className="text-muted-foreground">Tiempo de configuración</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6 text-center">
                <div className="text-4xl font-heading font-bold text-accent mb-2">100%</div>
                <p className="text-muted-foreground">Seguridad empresarial</p>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/es/precios"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors"
              >
                Comparar Planes y Precios
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <CTASection
          title="¿Listo para experimentar estas funciones?"
          description="Empezá tu prueba gratuita y descubrí el poder de los asistentes de voz IA."
          primaryButtonText="Reservá una Demo"
          secondaryButtonText="Ver Precios"
          secondaryButtonHref="/es/precios"
        />
      </main>

      <FooterES />
    </div>
  );
}
