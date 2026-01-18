import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/voicefleet/Header";
import Footer from "@/components/voicefleet/Footer";
import Breadcrumbs from "@/components/marketing/Breadcrumbs";
import CTASection from "@/components/marketing/CTASection";
import { FAQSchema, BreadcrumbSchema } from "@/components/seo";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { getIntegration, INTEGRATIONS } from "@/lib/marketing/integrations";
import { Check, ChevronRight } from "lucide-react";

interface Props {
  params: Promise<{ provider: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  return INTEGRATIONS.map((i) => ({ provider: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { provider } = await params;
  const integration = getIntegration(provider);
  if (!integration) return {};

  return generatePageMetadata({
    title: `${integration.name} Integration - Book from Phone Calls`,
    description: `Connect VoiceFleet with ${integration.name} so your AI receptionist can check availability, capture caller details, and book appointments automatically.`,
    path: `/connect/${integration.slug}`,
  });
}

export default async function IntegrationPage({ params }: Props) {
  const { provider } = await params;
  const integration = getIntegration(provider);
  if (!integration) notFound();

  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Integrations", href: "/connect" },
    { name: integration.name, href: `/connect/${integration.slug}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema items={integration.faq} />

      <Header />
      <div className="min-h-screen bg-white">
        <Breadcrumbs items={breadcrumbs} />

        <section className="bg-gradient-to-br from-indigo-600 to-purple-700 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  VoiceFleet + {integration.name}
                </h1>
                <p className="text-xl text-indigo-100 mb-8">
                  {integration.shortDescription}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/login?plan=starter"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors shadow-lg"
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
                <p className="mt-4 text-sm text-indigo-100/90">
                  Already using VoiceFleet?{" "}
                  <a
                    href="https://app.voicefleet.ai/integrations/providers"
                    className="underline underline-offset-2"
                  >
                    Connect it in your dashboard
                  </a>
                  .
                </p>
              </div>

              <div className="bg-white/10 border border-white/15 rounded-2xl p-6">
                <h2 className="text-white font-semibold text-lg">
                  What this integration unlocks
                </h2>
                <ul className="mt-4 space-y-3">
                  {integration.whatItUnlocks.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-indigo-100">
                      <Check className="h-5 w-5 text-white mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Setup in minutes
            </h2>
            <div className="grid md:grid-cols-2 gap-10 items-start">
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <ol className="space-y-4">
                  {integration.setupSteps.map((step, idx) => (
                    <li key={step} className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                        {idx + 1}
                      </div>
                      <p className="text-gray-700">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Recommended for
                </h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {integration.recommendedFor.map((slug) => (
                    <Link
                      key={slug}
                      href={`/for/${slug}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium hover:bg-indigo-100 transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                      {slug.replace(/-/g, " ")}
                    </Link>
                  ))}
                </div>

                <div className="rounded-2xl border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Want to see it live?
                  </h3>
                  <p className="text-gray-600">
                    Try a browser-based demo call and hear how the AI receptionist books and captures details.
                  </p>
                  <div className="mt-4">
                    <Link
                      href="/#demo"
                      className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                    >
                      Start demo call
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-16">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              FAQ
            </h2>
            <div className="space-y-6">
              {integration.faq.map((item) => (
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

