import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { FAQSchema, BreadcrumbSchema } from "@/components/seo";
import Breadcrumbs from "@/components/marketing/Breadcrumbs";
import HeaderES from "@/components/voicefleet/HeaderES";
import FooterES from "@/components/voicefleet/FooterES";
import PricingSectionES from "@/components/voicefleet/es/PricingSectionES";
import FAQSectionES from "@/components/voicefleet/es/FAQSectionES";
import { PRICING_FAQS_ES } from "@/lib/marketing/faqs-es";
import CTASection from "@/components/marketing/CTASection";

export const revalidate = 3600;

export const metadata: Metadata = {
  ...generatePageMetadata({
    title: "Precios - Planes de Recepcionista IA",
    description:
      "Planes de recepcionista IA VoiceFleet desde $49/mes. 250 minutos incluidos. Atención telefónica IA 24/7 para clínicas dentales, restaurantes y negocios.",
    path: "/es/precios",
  }),
  alternates: {
    canonical: "https://voicefleet.ai/es/precios",
    languages: {
      "es-AR": "/es/precios",
      en: "/pricing",
    },
  },
  openGraph: {
    locale: "es_AR",
  },
};

const breadcrumbs = [
  { name: "Inicio", href: "/es/" },
  { name: "Precios", href: "/es/precios" },
];

export default function PreciosPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema items={[...PRICING_FAQS_ES]} />

      <HeaderES />
      <div className="min-h-screen bg-background">
        <Breadcrumbs items={breadcrumbs} />
        <PricingSectionES />
        <FAQSectionES variant="pricing" />
        <CTASection
          title="¿Listo para automatizar tus llamadas?"
          description="Sumate a los negocios que ahorran horas cada semana con agentes de voz IA."
          primaryButtonText="Reservá una Demo"
          secondaryButtonText="Ver Cómo Funciona"
          secondaryButtonHref="/es/#solutions"
        />
      </div>
      <FooterES />
    </>
  );
}
