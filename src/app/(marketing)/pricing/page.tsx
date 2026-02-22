import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { FAQSchema, BreadcrumbSchema } from "@/components/seo";
import Breadcrumbs from "@/components/marketing/Breadcrumbs";
import CTASection from "@/components/marketing/CTASection";
import Header from "@/components/voicefleet/Header";
import Footer from "@/components/voicefleet/Footer";
import PricingSection from "@/components/voicefleet/PricingSection";
import FAQSection from "@/components/voicefleet/FAQSection";
import ROICalculator from "@/components/voicefleet/ROICalculator";
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
        <div className="container mx-auto px-4 pt-24 pb-4 max-w-3xl text-center">
          <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
            VoiceFleet offers three AI voice receptionist plans: Starter at &euro;99/mo (500 minutes), Growth at &euro;299/mo (1,000 minutes), and Pro at &euro;599/mo (2,000 minutes). Annual billing saves 16%. Every plan includes a 30-day free trial, a local phone number, and 24/7 AI call answering. No setup fees, no contracts.
          </p>
        </div>
        <PricingSection />
        <ROICalculator />
        <FAQSection variant="pricing" />
        <CTASection />
      </div>
      <Footer />
    </>
  );
}
