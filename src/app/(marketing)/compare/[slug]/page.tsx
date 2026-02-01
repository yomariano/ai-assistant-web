import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/voicefleet/Header";
import Footer from "@/components/voicefleet/Footer";
import Breadcrumbs from "@/components/marketing/Breadcrumbs";
import CTASection from "@/components/marketing/CTASection";
import { FAQSchema, BreadcrumbSchema } from "@/components/seo";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { getComparisonPageFull, getComparisonSlugs, type ComparisonPageResponse } from "@/lib/content/comparisons";
import { RichComparisonContent } from "@/components/content";
import { Check, X } from "lucide-react";

// Helper to check if page has rich content
function hasRichContent(page: ComparisonPageResponse | null): boolean {
  if (!page) return false;
  return !!(
    (page.chart_data && page.chart_data.length > 0) ||
    (page.statistics && page.statistics.length > 0) ||
    (page.sources && page.sources.length > 0) ||
    (page.pricing_data)
  );
}

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getComparisonSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getComparisonPageFull(slug);
  if (!page) return {};

  return generatePageMetadata({
    title: page.title,
    description: page.description || '',
    path: `/compare/${page.slug}`,
  });
}

export default async function ComparePage({ params }: Props) {
  const { slug } = await params;
  const page = await getComparisonPageFull(slug);
  if (!page) notFound();

  // Transform to the expected format for RichComparisonContent
  const richPage = {
    id: page.id,
    slug: page.slug,
    alternative_name: page.alternative_name,
    title: page.title,
    hero_title: page.hero_title,
    hero_subtitle: page.hero_subtitle,
    who_this_is_for: page.who_this_is_for || [],
    quick_take: page.quick_take || [],
    when_voicefleet_wins: page.when_voicefleet_wins || [],
    when_alternative_wins: page.when_alternative_wins || [],
    feature_comparison: (page.feature_comparison || []).map(fc => ({
      feature: fc.feature,
      voicefleet: fc.voicefleet,
      alternative: fc.alternative,
      winner: fc.winner as 'voicefleet' | 'alternative' | 'tie',
      sourceId: fc.sourceId,
    })),
    faq: page.faq || [],
    detailed_comparison: page.detailed_comparison,
    chart_data: page.chart_data,
    statistics: page.statistics,
    sources: page.sources,
    pricing_data: page.pricing_data,
  };

  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Compare", href: "/compare" },
    { name: page.title, href: `/compare/${page.slug}` },
  ];

  const showRichContent = hasRichContent(page);

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema items={page.faq || []} />

      <Header />
      <div className="min-h-screen bg-white">
        <Breadcrumbs items={breadcrumbs} />

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-3xl text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {page.hero_title}
              </h1>
              <p className="text-xl text-slate-200 mb-8">
                {page.hero_subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
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

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          {showRichContent ? (
            <RichComparisonContent page={richPage} />
          ) : (
            <>
              {/* Quick Take Section */}
              <section className="mb-16">
                <div className="grid lg:grid-cols-3 gap-6">
                  {(page.quick_take || []).map((item) => (
                    <div key={item.label} className="rounded-2xl border border-gray-200 p-6 bg-white">
                      <div className="text-sm font-semibold text-gray-500">{item.label}</div>
                      <div className="mt-2 text-xl font-bold text-gray-900">{item.value}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* When Each Wins Section */}
              <section className="bg-gray-50 -mx-6 px-6 py-16 mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  When VoiceFleet is a better fit
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <ul className="space-y-3">
                      {(page.when_voicefleet_wins || []).map((item) => (
                        <li key={item} className="flex items-start gap-2 text-gray-700">
                          <Check className="h-5 w-5 text-emerald-600 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      When the alternative may be better
                    </h3>
                    <ul className="space-y-3">
                      {(page.when_alternative_wins || []).map((item) => (
                        <li key={item} className="flex items-start gap-2 text-gray-700">
                          <X className="h-5 w-5 text-slate-500 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* FAQ Section */}
              <section className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  FAQ
                </h2>
                <div className="space-y-6">
                  {(page.faq || []).map((item) => (
                    <div key={item.question} className="bg-white rounded-2xl p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {item.question}
                      </h3>
                      <p className="text-gray-600">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>

        <CTASection />
      </div>
      <Footer />
    </>
  );
}
