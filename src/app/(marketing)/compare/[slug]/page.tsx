import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/voicefleet/Header";
import Footer from "@/components/voicefleet/Footer";
import Breadcrumbs from "@/components/marketing/Breadcrumbs";
import CTASection from "@/components/marketing/CTASection";
import { FAQSchema, BreadcrumbSchema } from "@/components/seo";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { COMPARISONS, getComparison } from "@/lib/marketing/comparisons";
import { Check, X } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  return COMPARISONS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getComparison(slug);
  if (!page) return {};

  return generatePageMetadata({
    title: page.title,
    description: page.description,
    path: `/compare/${page.slug}`,
  });
}

export default async function ComparePage({ params }: Props) {
  const { slug } = await params;
  const page = getComparison(slug);
  if (!page) notFound();

  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Compare", href: "/compare" },
    { name: page.title, href: `/compare/${page.slug}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema items={page.faq} />

      <Header />
      <div className="min-h-screen bg-white">
        <Breadcrumbs items={breadcrumbs} />

        <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-3xl text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {page.heroTitle}
              </h1>
              <p className="text-xl text-slate-200 mb-8">
                {page.heroSubtitle}
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

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {page.quickTake.map((item) => (
                <div key={item.label} className="rounded-2xl border border-gray-200 p-6 bg-white">
                  <div className="text-sm font-semibold text-gray-500">{item.label}</div>
                  <div className="mt-2 text-xl font-bold text-gray-900">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              When VoiceFleet is a better fit
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <ul className="space-y-3">
                  {page.whenVoiceFleetWins.map((item) => (
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
                  {page.whenAlternativeWins.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-gray-700">
                      <X className="h-5 w-5 text-slate-500 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              FAQ
            </h2>
            <div className="space-y-6">
              {page.faq.map((item) => (
                <div key={item.question} className="bg-white rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.question}
                  </h3>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTASection />
      </div>
      <Footer />
    </>
  );
}

