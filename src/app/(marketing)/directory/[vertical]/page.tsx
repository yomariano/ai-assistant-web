import { Metadata } from 'next';
import Link from 'next/link';
import { getCitiesForVertical, verticalLabels, verticalIcons, capitalize } from '@/lib/directory-data';
import { notFound } from 'next/navigation';

interface Props { params: Promise<{ vertical: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { vertical } = await params;
  const label = verticalLabels[vertical];
  if (!label) return {};
  return {
    title: `${label} Directory Ireland & Argentina 2026 | VoiceFleet`,
    description: `Find the best ${label.toLowerCase()} across Ireland and Argentina. Browse by city.`,
    openGraph: {
      title: `${label} Directory | VoiceFleet`,
      description: `Browse ${label.toLowerCase()} by city across Ireland and Argentina.`,
    },
  };
}

export default async function VerticalPage({ params }: Props) {
  const { vertical } = await params;
  const label = verticalLabels[vertical];
  if (!label) notFound();

  const cities = getCitiesForVertical(vertical);
  const icon = verticalIcons[vertical] || '📌';

  return (
    <div className="min-h-screen bg-slate-950 text-white">
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
          {cities.map(c => (
            <Link key={c.citySlug} href={`/directory/${vertical}/${c.citySlug}`} className="group">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/50 hover:bg-slate-800/80 transition-all">
                <h2 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {capitalize(c.city)}
                </h2>
                <p className="text-slate-400 mt-1">{c.count} {c.count === 1 ? 'business' : 'businesses'}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
