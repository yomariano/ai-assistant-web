import dynamic from "next/dynamic";
import { Metadata } from "next";
import { FAQSchema, OrganizationSchema, ProductSchema, WebSiteSchema, HowToSchema } from "@/components/seo";
import { HOMEPAGE_FAQS } from "@/lib/marketing/faqs";
import { generatePageMetadata } from "@/lib/seo/metadata";
import CROWidgets from "@/components/marketing/CROWidgets";

const homepageMetadata = generatePageMetadata({
  title: "AI Voice Receptionist for Small Businesses | VoiceFleet",
  description:
    "VoiceFleet is an AI voice receptionist starting at \u20ac99/mo with a 5-day free trial. Answers calls 24/7, books appointments, takes messages, and routes urgent calls. EU data residency, setup in under 1 hour.",
  path: "/",
  keywords: [
    "ai voice receptionist",
    "ai phone answering service",
    "virtual receptionist for small business",
    "appointment booking ai",
    "after hours call answering",
  ],
});

export const metadata: Metadata = {
  ...homepageMetadata,
  alternates: {
    ...homepageMetadata.alternates,
    languages: {
      "es-AR": "/es/",
      en: "/",
    },
  },
};

// Above-fold components: load immediately for fast LCP
import Header from "@/components/voicefleet/Header";
import HeroSection from "@/components/voicefleet/HeroSection";
import IntegrationBrandsCarousel from "@/components/voicefleet/IntegrationBrandsCarousel";
import MetricsBar from "@/components/voicefleet/MetricsBar";

// Below-fold components: lazy load for smaller initial bundle
const ProblemSection = dynamic(() => import("@/components/voicefleet/ProblemSection"));
const SolutionSection = dynamic(() => import("@/components/voicefleet/SolutionSection"));
const UseCasesSection = dynamic(() => import("@/components/voicefleet/UseCasesSection"));
const ComparisonSection = dynamic(() => import("@/components/voicefleet/ComparisonSection"));
const TechnologySection = dynamic(() => import("@/components/voicefleet/TechnologySection"));
const CaseStudiesSection = dynamic(() => import("@/components/voicefleet/CaseStudiesSection"));
const ROICalculator = dynamic(() => import("@/components/voicefleet/ROICalculator"));
const FeaturesSection = dynamic(() => import("@/components/voicefleet/IntegrationsSection"));
const SecuritySection = dynamic(() => import("@/components/voicefleet/SecuritySection"));
const PricingSection = dynamic(() => import("@/components/voicefleet/PricingSection"));
const DemoSection = dynamic(() => import("@/components/voicefleet/DemoSection"));
const FAQSection = dynamic(() => import("@/components/voicefleet/FAQSection"));
const Footer = dynamic(() => import("@/components/voicefleet/Footer"));

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <WebSiteSchema />
      <OrganizationSchema />
      <ProductSchema />
      <FAQSchema items={[...HOMEPAGE_FAQS]} />
      <HowToSchema
        name="How to Set Up VoiceFleet AI Voice Receptionist"
        description="Get your AI voice receptionist live in under 1 hour with these 3 simple steps. No technical skills required."
        totalTime="PT1H"
        steps={[
          {
            name: "Sign Up & Configure",
            text: "Create your VoiceFleet account, choose a plan starting at \u20ac99/mo, and configure your AI receptionist with your business name, greeting, and call-handling rules.",
            url: "/login?plan=starter",
          },
          {
            name: "Forward Your Number",
            text: "Enable call forwarding from your existing business phone number to your new VoiceFleet number. Most providers support this in a few minutes.",
          },
          {
            name: "Go Live",
            text: "Your AI receptionist is now answering calls 24/7 \u2014 booking appointments, taking messages, and routing urgent calls to your team with instant notifications.",
          },
        ]}
      />
      <Header />
      <main>
        <HeroSection />
        <IntegrationBrandsCarousel />
        <MetricsBar />
        <ProblemSection />
        <SolutionSection />
        <UseCasesSection />
        <ComparisonSection />
        <TechnologySection />
        <CaseStudiesSection />
        <ROICalculator />
        <FeaturesSection />
        <SecuritySection />
        <PricingSection />
        <DemoSection />
        <FAQSection />
      </main>
      <Footer />
      <CROWidgets />
    </div>
  );
}
