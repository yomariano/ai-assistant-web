import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { FAQSchema, BreadcrumbSchema } from "@/components/seo";
import Breadcrumbs from "@/components/marketing/Breadcrumbs";
import CTASection from "@/components/marketing/CTASection";
import Header from "@/components/voicefleet/Header";
import Footer from "@/components/voicefleet/Footer";
import PricingSection from "@/components/voicefleet/PricingSection";
import FAQSection from "@/components/voicefleet/FAQSection";
import { PRICING_FAQS } from "@/lib/marketing/faqs";

export const revalidate = 3600;

export const metadata: Metadata = {
  ...generatePageMetadata({
    title: "Pricing - AI Voice Receptionist Plans",
    description:
      "VoiceFleet AI receptionist plans from €99/month. 500 minutes included. 24/7 AI phone answering for dental practices, restaurants, and service businesses.",
    path: "/pricing",
  }),
  alternates: {
    canonical: "https://voicefleet.ai/pricing",
    languages: {
      "es-AR": "/es/precios",
      en: "/pricing",
    },
  },
};

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Pricing", href: "/pricing" },
];

export default function PricingPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema items={[...PRICING_FAQS]} />

      <Header />
      <div className="min-h-screen bg-background">
        <Breadcrumbs items={breadcrumbs} />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </div>
      <Footer />
    </>
  );
}
