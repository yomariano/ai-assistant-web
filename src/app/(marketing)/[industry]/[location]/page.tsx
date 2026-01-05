import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getComboPage, getComboSlugs, getComboPages } from "@/lib/content/combo";
import { BreadcrumbSchema } from "@/components/seo";
import Breadcrumbs from "@/components/marketing/Breadcrumbs";
import CTASection from "@/components/marketing/CTASection";
import Footer from "@/components/landing/Footer";
import { MapPin, Building2, Check, ChevronRight, Quote } from "lucide-react";

interface Props {
  params: Promise<{ industry: string; location: string }>;
}

export async function generateStaticParams() {
  const slugs = await getComboSlugs();
  return slugs.map(({ industry, location }) => ({ industry, location }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry, location } = await params;
  const page = await getComboPage(industry, location);

  if (!page) {
    return {};
  }

  return {
    title: page.meta_title || `${page.industry_name} in ${page.city_name} | OrderBot`,
    description: page.meta_description || page.subheadline || `AI phone answering for ${page.industry_name.toLowerCase()} in ${page.city_name}, Ireland.`,
    openGraph: {
      title: page.meta_title || `${page.industry_name} in ${page.city_name} | OrderBot`,
      description: page.meta_description || page.subheadline || undefined,
      type: "website",
      url: `/${industry}/${location}`,
      images: page.og_image_url ? [{ url: page.og_image_url }] : undefined,
    },
    alternates: {
      canonical: page.canonical_url || `/${industry}/${location}`,
    },
  };
}

export default async function ComboPage({ params }: Props) {
  const { industry, location } = await params;
  const page = await getComboPage(industry, location);

  if (!page) {
    notFound();
  }

  // Get related combos (same industry in different locations)
  const sameIndustry = await getComboPages({ industry, limit: 4 });
  const relatedInSameIndustry = sameIndustry.filter(
    (p) => p.location_slug !== location
  ).slice(0, 4);

  // Get related combos (same location, different industries)
  const sameLocation = await getComboPages({ location, limit: 4 });
  const relatedInSameLocation = sameLocation.filter(
    (p) => p.industry_slug !== industry
  ).slice(0, 4);

  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: page.industry_name, href: `/for/${industry}` },
    { name: page.city_name, href: `/${industry}/${location}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />

      <div className="min-h-screen bg-white">
        <Breadcrumbs items={breadcrumbs} />

        {/* Hero */}
        <section className="bg-gradient-to-br from-orange-500 to-orange-600 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-sm">
                    <Building2 className="h-4 w-4" />
                    <span>{page.industry_name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{page.city_name}</span>
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  {page.headline}
                </h1>
                <p className="text-xl text-orange-100 mb-8">{page.subheadline}</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-colors shadow-lg"
                  >
                    Start Free Trial
                  </Link>
                  <Link
                    href="#how-it-works"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
                  >
                    See How It Works
                  </Link>
                </div>
              </div>
              {page.hero_image_url && (
                <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={page.hero_image_url}
                    alt={page.hero_image_alt || `${page.industry_name} in ${page.city_name}`}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Intro Section */}
        {page.content.intro && (
          <section className="py-16 max-w-7xl mx-auto px-6">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                AI Phone Answering for {page.industry_name} in {page.city_name}
              </h2>
              <p className="text-gray-600 whitespace-pre-line">{page.content.intro}</p>
            </div>
          </section>
        )}

        {/* Why They Need Section */}
        {page.content.why_need && (
          <section className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why {page.industry_name} in {page.city_name} Need OrderBot
              </h2>
              <p className="text-gray-600 whitespace-pre-line max-w-4xl">
                {page.content.why_need}
              </p>
            </div>
          </section>
        )}

        {/* Local Stats */}
        {page.content.local_stats && Object.keys(page.content.local_stats).length > 0 && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
                {page.industry_name} in {page.city_name} at a Glance
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
                {Object.entries(page.content.local_stats).map(([key, value]) => (
                  <div key={key} className="bg-orange-50 p-6 rounded-xl">
                    <div className="text-3xl font-bold text-orange-600">
                      {String(value)}
                    </div>
                    <div className="text-sm text-gray-600 capitalize mt-1">
                      {key.replace(/_/g, " ")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Benefits */}
        {page.content.benefits && page.content.benefits.length > 0 && (
          <section className="bg-gray-900 py-16">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-center text-white mb-12">
                Benefits for {page.city_name} {page.industry_name}
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {page.content.benefits.map((benefit, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-400">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Case Study */}
        {page.content.case_study && (
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Success Story
              </h2>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 md:p-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {page.content.case_study.business_name}
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">The Challenge</h4>
                    <p className="text-gray-600">{page.content.case_study.challenge}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">The Solution</h4>
                    <p className="text-gray-600">{page.content.case_study.solution}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">The Results</h4>
                    <ul className="space-y-2">
                      {page.content.case_study.results.map((result, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <ChevronRight className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600">{result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        {page.content.faq && page.content.faq.length > 0 && (
          <section className="bg-gray-50 py-16">
            <div className="max-w-3xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {page.content.faq.map((item, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.question}
                    </h3>
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related - Same Industry */}
        {relatedInSameIndustry.length > 0 && (
          <section className="py-16 max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {page.industry_name} in Other Locations
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedInSameIndustry.map((combo) => (
                <Link
                  key={combo.slug}
                  href={`/${combo.industry_slug}/${combo.location_slug}`}
                  className="p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors group"
                >
                  <div className="flex items-center gap-2 text-gray-600 group-hover:text-orange-600">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">{combo.city_name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related - Same Location */}
        {relatedInSameLocation.length > 0 && (
          <section className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Other Services in {page.city_name}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedInSameLocation.map((combo) => (
                  <Link
                    key={combo.slug}
                    href={`/${combo.industry_slug}/${combo.location_slug}`}
                    className="p-4 bg-white rounded-xl hover:bg-orange-50 transition-colors group shadow-sm"
                  >
                    <div className="flex items-center gap-2 text-gray-600 group-hover:text-orange-600">
                      <Building2 className="h-4 w-4" />
                      <span className="font-medium">{combo.industry_name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <CTASection
          title={page.content.cta_text || `Ready to automate calls for your ${page.city_name} ${page.industry_name.toLowerCase()}?`}
          description="Join local businesses already saving time and never missing orders."
        />

        <Footer />
      </div>
    </>
  );
}
