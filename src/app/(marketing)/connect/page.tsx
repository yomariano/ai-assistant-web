import { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo/metadata";
import Header from "@/components/voicefleet/Header";
import Footer from "@/components/voicefleet/Footer";
import Breadcrumbs from "@/components/marketing/Breadcrumbs";
import CTASection from "@/components/marketing/CTASection";
import { INTEGRATIONS } from "@/lib/marketing/integrations";
import { Calendar, Link2 } from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = generatePageMetadata({
  title: "Integrations - Calendars & Booking Systems",
  description:
    "Connect VoiceFleet to your calendar or booking system to let the AI receptionist check availability, book appointments, and send confirmations.",
  path: "/connect",
});

export default function ConnectIndexPage() {
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Integrations", href: "/connect" },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        <Breadcrumbs items={breadcrumbs} />

        <section className="bg-gradient-to-br from-indigo-600 to-purple-700 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-3xl text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Connect your booking system
              </h1>
              <p className="text-xl text-indigo-100">
                VoiceFleet can sync with calendars and booking tools so callers can book during the call - not after a callback.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
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
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {INTEGRATIONS.map((integration) => (
                <Link
                  key={integration.slug}
                  href={`/connect/${integration.slug}`}
                  className="group rounded-2xl border border-gray-200 p-6 hover:border-indigo-300 hover:shadow-lg transition-all bg-white"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                        {integration.category === "calendar" ? (
                          <Calendar className="h-5 w-5 text-indigo-600" />
                        ) : (
                          <Link2 className="h-5 w-5 text-indigo-600" />
                        )}
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          {integration.name}
                        </h2>
                        <p className="text-sm text-gray-500 capitalize">
                          {integration.category}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600">
                    {integration.shortDescription}
                  </p>
                  <p className="mt-4 text-indigo-600 font-semibold">
                    View integration
                  </p>
                </Link>
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

