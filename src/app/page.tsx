import dynamic from "next/dynamic";
import { Metadata } from "next";
import { FAQSchema, OrganizationSchema, ProductSchema } from "@/components/seo";
import { HOMEPAGE_FAQS } from "@/lib/marketing/faqs";

export const metadata: Metadata = {
  alternates: {
    languages: {
      "es-AR": "/es/",
      en: "/",
    },
  },
};

// Above-fold components: load immediately for fast LCP
import Header from "@/components/voicefleet/Header";
import HeroSection from "@/components/voicefleet/HeroSection";
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
      <OrganizationSchema />
      <ProductSchema />
      <FAQSchema items={[...HOMEPAGE_FAQS]} />
      <Header />
      <main>
        <HeroSection />
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
    </div>
  );
}
