import { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo/metadata";
import Header from "@/components/voicefleet/Header";
import Footer from "@/components/voicefleet/Footer";
import Breadcrumbs from "@/components/marketing/Breadcrumbs";
import CTASection from "@/components/marketing/CTASection";
import { getComparisonPages } from "@/lib/content/comparisons";
import { Scale } from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = generatePageMetadata({
  title: "Compare - VoiceFleet Alternatives",
  description:
    "Compare VoiceFleet with voicemail, answering services, and call centers. See which option fits your phone workflow and booking needs.",
  path: "/compare",
});

export default async function CompareIndexPage() {
  const comparisons = await getComparisonPages();

  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Compare", href: "/compare" },
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
                VoiceFleet vs common alternatives
              </h1>
              <p className="text-xl text-slate-200">
                Pick the approach that matches your call volume, booking workflow, and customer experience goals.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/login?plan=starter"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-50 transition-colors shadow-lg"
                >
                  Start Free Trial
                </Link>
                <Link
                  href="/#demo"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
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
                {comparisons.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/compare/${p.slug}`}
                    className="group rounded-2xl border border-gray-200 p-6 hover:border-slate-300 hover:shadow-lg transition-all bg-white"
                  >
                    <h2 className="text-xl font-semibold text-gray-900">
                      {p.title}
                    </h2>
                    <p className="mt-3 text-gray-600">{p.description}</p>
                    <p className="mt-4 text-slate-900 font-semibold">
                      Read comparison
                    </p>
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

        <CTASection />
      </div>
      <Footer />
    </>
  );
}
