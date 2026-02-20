import dynamic from "next/dynamic";
import { FAQSchema, OrganizationSchema, ProductSchema } from "@/components/seo";
import { HOMEPAGE_FAQS_ES } from "@/lib/marketing/faqs-es";

import HeaderES from "@/components/voicefleet/HeaderES";
import HeroSectionES from "@/components/voicefleet/es/HeroSectionES";
import IntegrationBrandsCarousel from "@/components/voicefleet/IntegrationBrandsCarousel";
import MetricsBar from "@/components/voicefleet/MetricsBar";

const ProblemSectionES = dynamic(() => import("@/components/voicefleet/es/ProblemSectionES"));
const SolutionSectionES = dynamic(() => import("@/components/voicefleet/es/SolutionSectionES"));
const UseCasesSection = dynamic(() => import("@/components/voicefleet/UseCasesSection"));
const ComparisonSection = dynamic(() => import("@/components/voicefleet/ComparisonSection"));
const TechnologySection = dynamic(() => import("@/components/voicefleet/TechnologySection"));
const CaseStudiesSection = dynamic(() => import("@/components/voicefleet/CaseStudiesSection"));
const ROICalculator = dynamic(() => import("@/components/voicefleet/ROICalculator"));
const FeaturesSection = dynamic(() => import("@/components/voicefleet/IntegrationsSection"));
const SecuritySection = dynamic(() => import("@/components/voicefleet/SecuritySection"));
const PricingSectionES = dynamic(() => import("@/components/voicefleet/es/PricingSectionES"));
const DemoSectionES = dynamic(() => import("@/components/voicefleet/es/DemoSectionES"));
const FAQSectionES = dynamic(() => import("@/components/voicefleet/es/FAQSectionES"));
const FooterES = dynamic(() => import("@/components/voicefleet/FooterES"));

export default function HomeES() {
  return (
    <div className="min-h-screen bg-background">
      <OrganizationSchema />
      <ProductSchema />
      <FAQSchema items={[...HOMEPAGE_FAQS_ES]} />
      <HeaderES />
      <main>
        <HeroSectionES />
        <IntegrationBrandsCarousel />
        <MetricsBar />
        <ProblemSectionES />
        <SolutionSectionES />
        <UseCasesSection />
        <ComparisonSection />
        <TechnologySection />
        <CaseStudiesSection />
        <ROICalculator />
        <FeaturesSection />
        <SecuritySection />
        <PricingSectionES />
        <DemoSectionES />
        <FAQSectionES />
      </main>
      <FooterES />
    </div>
  );
}
