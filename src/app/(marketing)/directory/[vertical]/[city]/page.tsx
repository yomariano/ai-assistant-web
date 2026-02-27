import { Metadata } from 'next';
import Link from 'next/link';
import BusinessCard from '@/components/directory/BusinessCard';
import { getBusinessesByCity, verticalLabels, capitalize } from '@/lib/directory-data';
import { generateItemListSchema } from '@/lib/schema-generators';
import { notFound } from 'next/navigation';

interface Props { params: Promise<{ vertical: string; city: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { vertical, city } = await params;
  const label = verticalLabels[vertical];
  if (!label) return {};
  const cityName = capitalize(city);
  return {
    title: `Best ${label} in ${cityName} 2026 | VoiceFleet`,
    description: `Find the best ${label.toLowerCase()} in ${cityName}. Reviews, contact info, and AI-powered booking.`,
    openGraph: {
      title: `Best ${label} in ${cityName} | VoiceFleet`,
      description: `Top ${label.toLowerCase()} in ${cityName} with AI-powered call handling.`,
    },
  };
}

export default async function CityPage({ params }: Props) {
  const { vertical, city } = await params;
  const label = verticalLabels[vertical];
  if (!label) notFound();

  const businesses = getBusinessesByCity(vertical, city);
  if (!businesses.length) notFound();

  const cityName = businesses[0].city;
  const schema = generateItemListSchema(businesses, `Best ${label} in ${cityName}`);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="max-w-6xl mx-auto px-4 py-16">
        <nav className="text-sm text-slate-400 mb-8">
          <Link href="/directory" className="hover:text-blue-400">Directory</Link>
          <span className="mx-2">/</span>
          <Link href={`/directory/${vertical}`} className="hover:text-blue-400">{label}</Link>
          <span className="mx-2">/</span>
          <span className="text-white">{cityName}</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Best {label} in {cityName}
        </h1>
        <p className="text-xl text-slate-400 mb-12">
          {businesses.length} {label.toLowerCase()} found in {cityName}
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {businesses.map(b => (
            <BusinessCard
              key={b.slug}
              name={b.name}
              address={b.address}
              description={b.description}
              phone={b.phone}
              href={`/directory/${vertical}/${city}/${b.slug}`}
            />
          ))}
        </div>

        <div className="text-center mt-16 pt-12 border-t border-slate-800">
          <h2 className="text-2xl font-semibold mb-4">Are you a {label.toLowerCase().replace(/s$/, '')} in {cityName}?</h2>
          <p className="text-slate-400 mb-6">Let AI answer your calls 24/7 and never miss a customer</p>
          <a href="/demo" className="inline-flex items-center bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-500 transition-all">
            Try VoiceFleet Free →
          </a>
        </div>
      </div>
    </div>
  );
}
