import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getUseCasePages } from "@/lib/content/use-cases";
import { generatePageMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/marketing/Breadcrumbs";
import CTASection from "@/components/marketing/CTASection";

export const metadata: Metadata = generatePageMetadata({
  title: "AI Voice Assistant for Every Industry",
  description:
    "Discover how ValidateCall AI voice assistants help businesses across healthcare, real estate, finance, and more automate phone calls and save time.",
  path: "/for",
});

export default async function UseCasesPage() {
  const pages = await getUseCasePages();

  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Industries", href: "/for" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Breadcrumbs items={breadcrumbs} />

      <section className="py-16 bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            AI Voice Assistants for Every Industry
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            Discover how businesses in your industry are saving hours every week
            with automated phone calls.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-6">
        {pages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Industry pages coming soon. Check back later!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pages.map((page) => (
              <Link
                key={page.id}
                href={`/for/${page.slug}`}
                className="group block"
              >
                <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100 h-full">
                  {page.hero_image_url && (
                    <div className="relative h-48 bg-gray-100">
                      <Image
                        src={page.hero_image_url}
                        alt={page.industry_name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">
                      {page.industry_name}
                    </h2>
                    <p className="text-gray-600 line-clamp-3">
                      {page.subheadline || page.headline}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>

      <CTASection
        title="Don't see your industry?"
        description="ValidateCall works for any business that makes phone calls. Try it free today."
        primaryButtonText="Start Free Trial"
        secondaryButtonText="Contact Sales"
        secondaryButtonHref="mailto:sales@validatecall.com"
      />
    </div>
  );
}
