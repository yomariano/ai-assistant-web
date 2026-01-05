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

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
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
