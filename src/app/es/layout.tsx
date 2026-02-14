import type { Metadata } from "next";
import WhatsAppButton from "@/components/voicefleet/WhatsAppButton";

export const metadata: Metadata = {
  title: {
    default: "VoiceFleet - Recepcionista IA para Llamadas Telefónicas",
    template: "%s | VoiceFleet",
  },
  description:
    "Agentes de voz IA que atienden llamadas a un 80% menos de costo. Escalá tu atención sin contratar más personal.",
  keywords: [
    "recepcionista IA",
    "asistente de voz IA",
    "recepcionista virtual",
    "llamadas automatizadas",
    "agente IA telefónico",
    "atención telefónica automática",
    "reserva de turnos IA",
    "voz IA",
    "asistente virtual telefónico",
    "automatización de llamadas",
  ],
  openGraph: {
    locale: "es_AR",
  },
  alternates: {
    languages: {
      "es-AR": "/es/",
      en: "/",
    },
  },
};

export default function SpanishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div lang="es">
      {children}
      <WhatsAppButton />
    </div>
  );
}
