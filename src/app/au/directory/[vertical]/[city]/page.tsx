import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/voicefleet/Header";
import Footer from "@/components/voicefleet/Footer";
import BusinessCard from "@/components/directory/BusinessCard";
import {
  getBusinessesByCityForMarket,
  getLocalizedDescription,
  getVerticalLabel,
} from "@/lib/directory-data";
import { generateItemListSchema } from "@/lib/schema-generators";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ vertical: string; city: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { vertical, city } = await params;
  const businesses = await getBusinessesByCityForMarket(vertical, city, "AU");
  if (!businesses.length) return {};

  const label = getVerticalLabel(vertical);
  const cityName = businesses[0].city;
  return {
    title: `Best ${label} in ${cityName} 2026`,
    description: `Find the best ${label.toLowerCase()} in ${cityName}, Australia. Reviews, contact info, and AI-ready local landing pages.`,
    openGraph: {
      title: `Best ${label} in ${cityName}`,
      description: `Top ${label.toLowerCase()} in ${cityName} with AI-powered call handling.`,
      url: `https://voicefleet.ai/au/directory/${vertical}/${city}`,
    },
  };
}

export default async function AustraliaDirectoryCityPage({ params }: Props) {
  const { vertical, city } = await params;
  const businesses = await getBusinessesByCityForMarket(vertical, city, "AU");
  if (!businesses.length) notFound();

  const label = getVerticalLabel(vertical);
  const cityName = businesses[0].city;
  const schema = generateItemListSchema(
    businesses,
    `Best ${label} in ${cityName}`,
    "https://voicefleet.ai",
    "/au/directory",
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-950 text-white pt-20">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <div className="max-w-6xl mx-auto px-4 py-16">
          <nav className="text-sm text-slate-400 mb-8">
            <Link href="/au/directory" className="hover:text-blue-400">
              Directory
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/au/directory/${vertical}`} className="hover:text-blue-400">
              {label}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">{cityName}</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Best {label} in {cityName}
          </h1>
          <p className="text-xl text-slate-400 mb-12">
            {businesses.length} {label.toLowerCase()} found in {cityName}, Australia.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {businesses.map((business) => (
              <BusinessCard
                key={business.slug}
                name={business.name}
                address={business.address}
                description={getLocalizedDescription(business, "en")}
                phone={business.phone}
                href={`/au/directory/${vertical}/${city}/${business.slug}`}
                image_url={business.image_url}
              />
            ))}
          </div>

          <div className="text-center mt-16 pt-12 border-t border-slate-800">
            <h2 className="text-2xl font-semibold mb-4">
              Are you a {label.toLowerCase().replace(/s$/, "")} in {cityName}?
            </h2>
            <p className="text-slate-400 mb-6">
              Let VoiceFleet answer your calls 24/7 with an Australian number and local routing.
            </p>
            <Link
              href="/register?plan=starter&region=AU"
              className="inline-flex items-center bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-500 transition-all"
            >
              Try VoiceFleet Free {"->"}
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
