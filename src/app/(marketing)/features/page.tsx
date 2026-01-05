import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getFeaturePages } from "@/lib/content/features";
import { generatePageMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/marketing/Breadcrumbs";
import CTASection from "@/components/marketing/CTASection";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Features - AI Voice Assistant Capabilities",
  description:
    "Explore VoiceFleet's powerful AI voice agent features: 24/7 availability, multi-language support, call history, and more.",
  path: "/features",
});

export default async function FeaturesPage() {
  const pages = await getFeaturePages();

  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Breadcrumbs items={breadcrumbs} />

      <section className="py-16 bg-gradient-to-br from-purple-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Powerful AI Voice Features
          </h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Everything you need to automate phone calls and save hours every
            week.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-6">
        {pages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Feature pages coming soon. Check back later!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {pages.map((page) => (
              <Link
                key={page.id}
                href={`/features/${page.slug}`}
                className="group block"
              >
                <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 h-full flex flex-col">
                  {page.hero_image_url && (
                    <div className="relative h-48 bg-gray-100">
                      <Image
                        src={page.hero_image_url}
                        alt={page.feature_name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">
                      {page.feature_name}
                    </h2>
                    <p className="text-gray-600 flex-1">
                      {page.subheadline || page.headline}
                    </p>
                    <div className="mt-4 flex items-center text-indigo-600 font-medium">
                      <span>Learn more</span>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>

      <CTASection
        title="Ready to experience these features?"
        description="Start your free trial and see the power of AI voice assistants."
      />
    </div>
  );
}
