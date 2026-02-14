"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight, CheckCircle2 } from "lucide-react";

const DemoSectionES = () => {
  const [formData, setFormData] = useState({
    email: "",
    company: "",
    volume: "",
    useCase: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const emailInputId = "demo-email-es";
  const companyInputId = "demo-company-es";
  const volumeSelectId = "demo-volume-es";
  const useCaseSelectId = "demo-use-case-es";

  const volumeOptions = [
    "5.000 - 10.000",
    "10.000 - 25.000",
    "25.000 - 50.000",
    "50.000 - 100.000",
    "100.000+",
  ];

  const useCaseOptions = [
    "Atención al Cliente",
    "Agenda de Turnos",
    "Estado de Pedidos",
    "Procesamiento de Pagos",
    "Calificación de Leads",
    "Campañas Outbound",
    "Otro",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ email: "", company: "", volume: "", useCase: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  const benefits = [
    "Vé conversaciones reales con IA en acción",
    "Obtené un análisis de ROI personalizado",
    "Conocé los plazos de implementación",
    "Sin compromiso",
  ];

  return (
    <section id="demo" className="py-20 lg:py-28 bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.1),transparent)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-primary-foreground">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
              Vé VoiceFleet en Acción
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Demo de 30 minutos. Vé llamadas reales. Obtené un análisis de ROI personalizado.
            </p>

            <ul className="space-y-4 mb-8">
              {benefits.map((benefit, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-primary-foreground/90">{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3 p-4 bg-primary-foreground/10 rounded-xl backdrop-blur-sm">
              <Phone className="w-6 h-6 text-accent" />
              <div>
                <p className="text-sm text-primary-foreground/70">¿Preferís hablar ahora?</p>
                <a
                  href="https://wa.me/5491112345678?text=Hola,%20me%20interesa%20VoiceFleet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold hover:underline"
                >
                  Escribinos por WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-card rounded-2xl p-8 shadow-xl">
            <h3 className="text-xl font-heading font-bold text-foreground mb-6">
              Reservá Tu Demo
            </h3>

            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-foreground mb-2">¡Solicitud de demo recibida!</h4>
                <p className="text-muted-foreground">Nuestro equipo te contactará en las próximas 24 horas.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor={emailInputId} className="block text-sm font-medium text-foreground mb-2">
                    Email Laboral *
                  </label>
                  <input
                    id={emailInputId}
                    name="email"
                    aria-label="Email laboral"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="nombre@empresa.com"
                  />
                </div>

                <div>
                  <label htmlFor={companyInputId} className="block text-sm font-medium text-foreground mb-2">
                    Empresa *
                  </label>
                  <input
                    id={companyInputId}
                    name="company"
                    aria-label="Empresa"
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="Nombre de tu empresa"
                  />
                </div>

                <div>
                  <label htmlFor={volumeSelectId} className="block text-sm font-medium text-foreground mb-2">
                    Volumen Mensual de Llamadas
                  </label>
                  <select
                    id={volumeSelectId}
                    name="volume"
                    aria-label="Volumen mensual de llamadas"
                    value={formData.volume}
                    onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  >
                    <option value="">Seleccioná volumen</option>
                    {volumeOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor={useCaseSelectId} className="block text-sm font-medium text-foreground mb-2">
                    Caso de Uso Principal
                  </label>
                  <select
                    id={useCaseSelectId}
                    name="useCase"
                    aria-label="Caso de uso principal"
                    value={formData.useCase}
                    onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  >
                    <option value="">Seleccioná caso de uso</option>
                    {useCaseOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <Button type="submit" variant="hero" size="xl" className="w-full">
                  Reservá Tu Demo
                  <ArrowRight className="w-5 h-5" />
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Al enviar, aceptás nuestra Política de Privacidad y Términos de Servicio.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSectionES;
