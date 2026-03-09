import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/voicefleet/Header";
import Footer from "@/components/voicefleet/Footer";
import {
  capitalize,
  getCitiesForVerticalForMarket,
  getVerticalLabel,
  verticalIcons,
} from "@/lib/directory-data";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ vertical: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { vertical } = await params;
  const cities = await getCitiesForVerticalForMarket(vertical, "AU");
  if (!cities.length) return {};

  const label = getVerticalLabel(vertical);
  return {
    title: `${label} Directory - Australia 2026`,
    description: `Find the best ${label.toLowerCase()} across Australia. Browse by city.`,
    openGraph: {
      title: `${label} Directory - Australia`,
      description: `Browse ${label.toLowerCase()} by city across Australia.`,
      url: `https://voicefleet.ai/au/directory/${vertical}`,
    },
  };
}

export default async function AustraliaVerticalPage({ params }: Props) {
  const { vertical } = await params;
  const cities = await getCitiesForVerticalForMarket(vertical, "AU");
  if (!cities.length) notFound();

  const label = getVerticalLabel(vertical);
  const icon = verticalIcons[vertical] || "o";

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-950 text-white pt-20">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <nav className="text-sm text-slate-400 mb-8">
            <Link href="/au/directory" className="hover:text-blue-400">
              Directory
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">{label}</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {icon} {label} in Australia
          </h1>
          <p className="text-xl text-slate-400 mb-12">
            Browse {label.toLowerCase()} by city across Australia.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cities.map((city) => (
              <Link key={city.citySlug} href={`/au/directory/${vertical}/${city.citySlug}`} className="group">
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/50 hover:bg-slate-800/80 transition-all">
                  <h2 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {capitalize(city.city)}
                  </h2>
                  <p className="text-slate-400 mt-1">
                    {city.count} {city.count === 1 ? "business" : "businesses"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
