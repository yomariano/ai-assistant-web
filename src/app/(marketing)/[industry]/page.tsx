import { Metadata } from "next";
import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import Header from "@/components/voicefleet/Header";
import Footer from "@/components/voicefleet/Footer";
import {
  capitalize,
  getCitiesForVertical,
  getVerticalLabel,
  getVerticals,
  verticalIcons,
} from "@/lib/directory-data";

interface Props {
  params: Promise<{ industry: string }>;
}

/**
 * Render bare directory vertical URLs like /restaurants and /dentists.
 * Non-directory industry slugs still redirect to /for/{industry}.
 */
export async function generateStaticParams() {
  const verticals = await getVerticals();
  return verticals.map(({ vertical }) => ({ industry: vertical }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry } = await params;
  const cities = await getCitiesForVertical(industry);
  if (!cities.length) return {};

  const label = getVerticalLabel(industry);
  return {
    title: `${label} Directory — Ireland & Argentina 2026`,
    description: `Find the best ${label.toLowerCase()} across Ireland and Argentina. Browse by city.`,
    openGraph: {
      title: `${label} Directory`,
      description: `Browse ${label.toLowerCase()} by city across Ireland and Argentina.`,
    },
  };
}

export default async function IndustryPage({ params }: Props) {
  const { industry } = await params;
  const cities = await getCitiesForVertical(industry);

  if (cities.length) {
    const label = getVerticalLabel(industry);
    const icon = verticalIcons[industry] || "📌";

    return (
      <>
        <Header />
        <div className="min-h-screen bg-slate-950 text-white pt-20">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <nav className="text-sm text-slate-400 mb-8">
              <Link href="/directory" className="hover:text-blue-400">Directory</Link>
              <span className="mx-2">/</span>
              <span className="text-white">{label}</span>
            </nav>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {icon} {label}
            </h1>
            <p className="text-xl text-slate-400 mb-12">
              Browse {label.toLowerCase()} by city across Ireland and Argentina
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cities.map((city) => (
                <Link key={city.citySlug} href={`/${industry}/${city.citySlug}`} className="group">
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

  permanentRedirect(`/for/${industry}`);
}
