import { Metadata } from 'next';
import Link from 'next/link';
import HeaderES from '@/components/voicefleet/HeaderES';
import FooterES from '@/components/voicefleet/FooterES';
import { getCitiesForVertical, verticalLabelsES, esSlugToVertical, capitalize } from '@/lib/directory-data';
import { notFound } from 'next/navigation';

interface Props { params: Promise<{ vertical: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { vertical } = await params;
  const enV = esSlugToVertical[vertical];
  const label = enV ? verticalLabelsES[enV] : null;
  if (!label) return {};
  return {
    title: `${label} — Directorio Argentina e Irlanda 2026`,
    description: `Encontrá los mejores ${label.toLowerCase()} en Argentina e Irlanda.`,
  };
}

export default async function VerticalPageES({ params }: Props) {
  const { vertical } = await params;
  const enV = esSlugToVertical[vertical];
  const label = enV ? verticalLabelsES[enV] : null;
  if (!label || !enV) notFound();

  const cities = getCitiesForVertical(enV);

  return (
    <>
      <HeaderES />
      <div className="min-h-screen bg-slate-950 text-white pt-20">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <nav className="text-sm text-slate-400 mb-8">
            <Link href="/es/directorio" className="hover:text-blue-400">Directorio</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{label}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-12">{label}</h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cities.map(c => (
              <Link key={c.citySlug} href={`/es/directorio/${vertical}/${c.citySlug}`} className="group">
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
                  <h2 className="text-xl font-semibold text-white group-hover:text-blue-400">{capitalize(c.city)}</h2>
                  <p className="text-slate-400 mt-1">{c.count} {c.count === 1 ? 'negocio' : 'negocios'}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <FooterES />
    </>
  );
}
