import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getUseCasePage, getUseCaseSlugs } from "@/lib/content/use-cases";
import { generateUseCaseMetadata } from "@/lib/seo/metadata";
import { BreadcrumbSchema, FAQSchema } from "@/components/seo";
import Breadcrumbs from "@/components/marketing/Breadcrumbs";
import CTASection from "@/components/marketing/CTASection";
import InternalLinks from "@/components/marketing/InternalLinks";
import { Check } from "lucide-react";

interface Props {
  params: Promise<{ industry: string }>;
}

export async function generateStaticParams() {
  const slugs = await getUseCaseSlugs();
  return slugs.map((industry) => ({ industry }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry } = await params;
  const page = await getUseCasePage(industry);

  if (!page) {
    return {};
  }

  return generateUseCaseMetadata(page);
}

export default async function UseCasePage({ params }: Props) {
  const { industry } = await params;
  const page = await getUseCasePage(industry);

  if (!page) {
    notFound();
  }

  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Industries", href: "/for" },
    { name: page.industry_name, href: `/for/${industry}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />

      <div className="min-h-screen bg-white">
        <Breadcrumbs items={breadcrumbs} />

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-indigo-600 to-purple-700 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  {page.headline}
                </h1>
                <p className="text-xl text-indigo-100 mb-8">
                  {page.subheadline}
                </p>
                <Link
                  href={page.cta_url}
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors shadow-lg"
                >
                  {page.cta_text}
                </Link>
              </div>
              {page.hero_image_url && (
                <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={page.hero_image_url}
                    alt={page.hero_image_alt || page.industry_name}
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

        {/* Problem/Solution */}
        {(page.problem_statement || page.solution_description) && (
          <section className="py-16 max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12">
              {page.problem_statement && (
                <div className="bg-red-50 p-8 rounded-2xl">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    The Challenge
                  </h2>
                  <p className="text-gray-700">{page.problem_statement}</p>
                </div>
              )}
              {page.solution_description && (
                <div className="bg-green-50 p-8 rounded-2xl">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    The Solution
                  </h2>
                  <p className="text-gray-700">{page.solution_description}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Benefits */}
        {page.benefits && page.benefits.length > 0 && (
          <section className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Why {page.industry_name} Professionals Choose ValidateCall
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {page.benefits.map((benefit, i) => (
                  <div
                    key={i}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                  >
                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                      <Check className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Use Cases */}
        {page.use_cases && page.use_cases.length > 0 && (
          <section className="py-16 max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Common Use Cases in {page.industry_name}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {page.use_cases.map((useCase, i) => (
                <div
                  key={i}
                  className="border border-gray-200 p-6 rounded-xl hover:border-indigo-200 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {useCase.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{useCase.description}</p>
                  {useCase.example && (
                    <p className="text-sm text-indigo-600 italic bg-indigo-50 p-3 rounded-lg">
                      &ldquo;{useCase.example}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Testimonial */}
        {page.testimonial && (
          <section className="bg-indigo-50 py-16">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <blockquote className="text-2xl text-gray-800 italic mb-6">
                &ldquo;{page.testimonial.quote}&rdquo;
              </blockquote>
              <p className="font-semibold text-gray-900">
                {page.testimonial.author}
              </p>
              <p className="text-gray-600">{page.testimonial.company}</p>
            </div>
          </section>
        )}

        {/* Internal Links */}
        <InternalLinks
          relatedFeatures={page.related_features}
          relatedLocations={page.related_locations}
        />

        <CTASection
          title={`Ready to transform your ${page.industry_name.toLowerCase()} operations?`}
          description="Start your free trial today and see how AI voice agents can help."
        />
      </div>
    </>
  );
}
