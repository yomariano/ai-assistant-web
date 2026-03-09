import { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo/metadata";
import Header from "@/components/voicefleet/Header";
import Footer from "@/components/voicefleet/Footer";
import Breadcrumbs from "@/components/marketing/Breadcrumbs";
import CTASection from "@/components/marketing/CTASection";
import { getComparisonPages } from "@/lib/content/comparisons";
import { Scale } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = generatePageMetadata({
  title: "Compare - VoiceFleet Alternatives for Australia",
  description:
    "Compare VoiceFleet with voicemail, answering services, and call centres for Australian businesses. See which option fits your call workflow and booking needs.",
  path: "/au/compare",
});

export default async function AustraliaCompareIndexPage() {
  const comparisons = await getComparisonPages();

  const breadcrumbs = [
    { name: "Home", href: "/au" },
    { name: "Compare", href: "/au/compare" },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        <Breadcrumbs items={breadcrumbs} />

        <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-3xl text-white">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-6">
                <Scale className="h-4 w-4" />
                Compare options
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                VoiceFleet vs common alternatives in Australia
              </h1>
              <p className="text-xl text-slate-200">
                Compare AI reception, call centres, voicemail, and hybrid answering setups for Australian service businesses.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register?region=AU"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-50 transition-colors shadow-lg"
                  data-umami-event="cta_click"
                  data-umami-event-location="compare_index_au"
                >
                  Start Free Trial
                </Link>
                <Link
                  href="/au#demo"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
                  data-umami-event="cta_click"
                  data-umami-event-location="compare_index_demo_au"
                >
                  Try the Live Demo
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            {comparisons.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {comparisons.map((page) => (
                  <Link
                    key={page.slug}
                    href={`/au/compare/${page.slug}`}
                    className="group rounded-2xl border border-gray-200 p-6 hover:border-slate-300 hover:shadow-lg transition-all bg-white"
                  >
                    <h2 className="text-xl font-semibold text-gray-900">{page.title}</h2>
                    <p className="mt-3 text-gray-600">{page.description}</p>
                    <p className="mt-4 text-slate-900 font-semibold">Read comparison</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No comparisons available yet.</p>
              </div>
            )}
          </div>
        </section>

        <CTASection
          title="Want local numbers and AI call handling in Australia?"
          description="See how VoiceFleet compares when you care about local provisioning, 24/7 coverage, and AUD pricing."
          primaryButtonText="Start Free Trial"
          primaryButtonHref="/register?region=AU"
          secondaryButtonText="See AU Pricing"
          secondaryButtonHref="/au#pricing"
        />
      </div>
      <Footer />
    </>
  );
}
