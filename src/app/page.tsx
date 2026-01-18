import {
  Header,
  HeroSection,
  MetricsBar,
  ProblemSection,
  SolutionSection,
  UseCasesSection,
  ComparisonSection,
  TechnologySection,
  CaseStudiesSection,
  ROICalculator,
  FeaturesSection,
  SecuritySection,
  PricingSection,
  DemoSection,
  FAQSection,
  Footer,
} from "@/components/voicefleet";
import { FAQSchema } from "@/components/seo";
import { HOMEPAGE_FAQS } from "@/lib/marketing/faqs";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
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
