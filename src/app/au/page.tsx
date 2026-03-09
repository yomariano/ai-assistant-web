import dynamic from "next/dynamic";
import { Metadata } from "next";
import { FAQSchema, HowToSchema, OrganizationSchema, ProductSchema, WebSiteSchema } from "@/components/seo";
import { HOMEPAGE_FAQS } from "@/lib/marketing/faqs";
import { generatePageMetadata } from "@/lib/seo/metadata";
import CROWidgets from "@/components/marketing/CROWidgets";

const auHomepageMetadata = generatePageMetadata({
  title: "AI Voice Receptionist for Australian Businesses | VoiceFleet",
  description:
    "VoiceFleet is an AI voice receptionist for Australian businesses starting at A$140/mo with a 30-day free trial. Answer calls 24/7, book appointments, take messages, and route urgent calls with local Australian numbers.",
  path: "/au",
  keywords: [
    "ai voice receptionist australia",
    "ai phone answering service australia",
    "virtual receptionist for australian businesses",
    "appointment booking ai australia",
    "australian business phone answering",
  ],
});

export const metadata: Metadata = {
  ...auHomepageMetadata,
  alternates: {
    ...auHomepageMetadata.alternates,
    languages: {
      en: "/",
      "en-AU": "/au/",
      "es-AR": "/es/",
    },
  },
};

const AU_HOMEPAGE_FAQS = HOMEPAGE_FAQS.map((faq) => {
  if (faq.question === "Is my data safe and kept in the EU?") {
    return {
      ...faq,
      answer:
        "VoiceFleet supports regional deployment options and privacy-ready configurations. If you have specific Australian privacy or residency requirements, contact us and we'll confirm the right setup for your business.",
    };
  }

  if (faq.question === "How much does an AI receptionist cost?") {
    return {
      ...faq,
      answer:
        "VoiceFleet AI receptionist plans in Australia start at A$140/month (Starter, 500 minutes), A$424/month (Growth, 1,000 minutes), and A$851/month (Pro, 2,000 minutes). Annual billing saves 16%. Every plan includes a 30-day free trial, 24/7 AI call answering, and a local Australian business phone number.",
    };
  }

  if (faq.question === "How does VoiceFleet compare to Smith.ai?") {
    return {
      ...faq,
      answer:
        "VoiceFleet is an AI-first voice receptionist starting at A$140/month in Australia with minutes-based pricing, 24/7 coverage, and local business numbers. Smith.ai combines AI with human receptionists and starts at higher price points. VoiceFleet is a better fit when you want local number provisioning, always-on coverage, and automated booking workflows without human-receptionist overhead.",
    };
  }

  if (faq.question === "Is VoiceFleet available in Ireland?") {
    return {
      question: "Is VoiceFleet available in Australia?",
      answer:
        "Yes. VoiceFleet supports Australian businesses with local Australian phone numbers, AUD pricing, and Voximplant-based number provisioning. It is designed for local service businesses that need 24/7 call handling, appointment booking, message capture, and escalation workflows.",
    };
  }

  return faq;
});

import Header from "@/components/voicefleet/Header";
import HeroSection from "@/components/voicefleet/HeroSection";
import AsSeenOnSection from "@/components/voicefleet/AsSeenOnSection";
import IntegrationBrandsCarousel from "@/components/voicefleet/IntegrationBrandsCarousel";
import MetricsBar from "@/components/voicefleet/MetricsBar";
import CountdownBanner from "@/components/voicefleet/CountdownBanner";

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
const CallFlowDiagram = dynamic(() => import("@/components/voicefleet/CallFlowDiagram"));
const FAQSection = dynamic(() => import("@/components/voicefleet/FAQSection"));
const DirectoryCTASection = dynamic(() => import("@/components/voicefleet/DirectoryCTASection"));
const Footer = dynamic(() => import("@/components/voicefleet/Footer"));

export default function AustraliaHome() {
  return (
    <div className="min-h-screen bg-background">
      <WebSiteSchema />
      <OrganizationSchema />
      <ProductSchema
        lowPrice="140"
        highPrice="851"
        priceCurrency="AUD"
        url="https://voicefleet.ai/au"
        inLanguage={["en", "en-AU"]}
      />
      <FAQSchema items={[...AU_HOMEPAGE_FAQS]} />
      <HowToSchema
        name="How to Set Up VoiceFleet AI Voice Receptionist in Australia"
        description="Get your AI voice receptionist live in under 1 hour with a local Australian number and simple call forwarding setup."
        totalTime="PT1H"
        steps={[
          {
            name: "Sign Up & Configure",
            text: "Create your VoiceFleet account, choose a plan starting at A$140/mo, and configure your AI receptionist with your business name, greeting, and call-handling rules.",
            url: "/register?plan=starter&region=AU",
          },
          {
            name: "Forward Your Number",
            text: "Enable call forwarding from your existing business phone number to your new VoiceFleet Australian number. Most providers support this in a few minutes.",
          },
          {
            name: "Go Live",
            text: "Your AI receptionist is now answering calls 24/7, booking appointments, taking messages, and routing urgent calls to your team with instant notifications.",
          },
        ]}
      />
      <CountdownBanner />
      <Header />
      <main>
        <HeroSection />
        <AsSeenOnSection />
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
        <CallFlowDiagram />
        <FAQSection items={AU_HOMEPAGE_FAQS} />
        <DirectoryCTASection />
      </main>
      <Footer />
      <CROWidgets />
    </div>
  );
}
