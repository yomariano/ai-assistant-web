import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  getFeaturePage,
  getFeatureSlugs,
  getRelatedFeatures,
} from "@/lib/content/features";
import { generateFeatureMetadata } from "@/lib/seo/metadata";
import { BreadcrumbSchema, FAQSchema } from "@/components/seo";
import Breadcrumbs from "@/components/marketing/Breadcrumbs";
import CTASection from "@/components/marketing/CTASection";
import InternalLinks from "@/components/marketing/InternalLinks";
import { Check, ArrowRight } from "lucide-react";

interface Props {
  params: Promise<{ feature: string }>;
}

export async function generateStaticParams() {
  const slugs = await getFeatureSlugs();
  return slugs.map((feature) => ({ feature }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { feature } = await params;
  const page = await getFeaturePage(feature);

  if (!page) {
    return {};
  }

  return generateFeatureMetadata(page);
}

export default async function FeaturePage({ params }: Props) {
  const { feature } = await params;
  const page = await getFeaturePage(feature);

  if (!page) {
    notFound();
  }

  const relatedFeatures = page.related_features?.length
    ? await getRelatedFeatures(page.related_features)
    : [];

  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
    { name: page.feature_name, href: `/features/${feature}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      {page.faq && page.faq.length > 0 && <FAQSchema items={page.faq} />}

      <div className="min-h-screen bg-white">
        <Breadcrumbs items={breadcrumbs} />

        {/* Hero */}
        <section className="bg-gradient-to-br from-purple-600 to-indigo-700 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <span className="inline-block px-3 py-1 text-sm font-medium bg-white/20 rounded-full mb-4">
                  Feature
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  {page.headline}
                </h1>
                <p className="text-xl text-purple-100 mb-8">
                  {page.subheadline}
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors shadow-lg"
                >
                  Try {page.feature_name}
                </Link>
              </div>
              {page.hero_image_url && (
                <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={page.hero_image_url}
                    alt={page.hero_image_alt || page.feature_name}
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

        {/* Overview */}
        {page.overview && (
          <section className="py-16 max-w-4xl mx-auto px-6">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-600 leading-relaxed">
                {page.overview}
              </p>
            </div>
          </section>
        )}

        {/* How It Works */}
        {page.how_it_works && page.how_it_works.length > 0 && (
          <section className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                How It Works
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {page.how_it_works.map((step, i) => (
                  <div key={i} className="text-center">
                    <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-indigo-600">
                        {step.step || i + 1}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Benefits */}
        {page.benefits && page.benefits.length > 0 && (
          <section className="py-16 max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Key Benefits
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {page.benefits.map((benefit, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Comparison */}
        {page.comparison && page.comparison.length > 0 && (
          <section className="bg-gray-50 py-16">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                How We Compare
              </h2>
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">
                        Feature
                      </th>
                      <th className="text-center py-4 px-6 font-semibold text-indigo-600">
                        VoiceFleet
                      </th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-500">
                        Others
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {page.comparison.map((row, i) => (
                      <tr key={i}>
                        <td className="py-4 px-6 text-gray-900">
                          {row.feature}
                        </td>
                        <td className="py-4 px-6 text-center text-indigo-600 font-medium">
                          {row.us}
                        </td>
                        <td className="py-4 px-6 text-center text-gray-500">
                          {row.competitors}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        {page.faq && page.faq.length > 0 && (
          <section className="py-16 max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {page.faq.map((item, i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded-xl p-6 hover:border-indigo-200 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.question}
                  </h3>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Features */}
        {relatedFeatures.length > 0 && (
          <section className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
                Related Features
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedFeatures.map((feat) => (
                  <Link
                    key={feat.slug}
                    href={`/features/${feat.slug}`}
                    className="group flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 transition-colors"
                  >
                    <span className="font-medium text-gray-900 group-hover:text-indigo-600">
                      {feat.feature_name}
                    </span>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Internal Links */}
        <InternalLinks relatedUseCases={page.related_use_cases} />

        <CTASection
          title={`Ready to use ${page.feature_name}?`}
          description="Start your free trial and experience the power of AI voice assistants."
        />
      </div>
    </>
  );
}
