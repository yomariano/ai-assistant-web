import { Metadata } from 'next';
import Link from 'next/link';
import HeaderES from '@/components/voicefleet/HeaderES';
import FooterES from '@/components/voicefleet/FooterES';
import BusinessCard from '@/components/directory/BusinessCard';
import { getBusinessesByCity, verticalLabelsES, esSlugToVertical, capitalize, getLocalizedDescription } from '@/lib/directory-data';
import { generateItemListSchema } from '@/lib/schema-generators';
import { notFound } from 'next/navigation';

interface Props { params: Promise<{ vertical: string; city: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { vertical, city } = await params;
  const enV = esSlugToVertical[vertical];
  const label = enV ? verticalLabelsES[enV] : null;
  if (!label) return {};
  return {
    title: `Mejores ${label} en ${capitalize(city)} 2026`,
    description: `Encontrá los mejores ${label.toLowerCase()} en ${capitalize(city)}. Reseñas, datos de contacto y reservas con IA.`,
  };
}

export default async function CityPageES({ params }: Props) {
  const { vertical, city } = await params;
  const enV = esSlugToVertical[vertical];
  const label = enV ? verticalLabelsES[enV] : null;
  if (!label || !enV) notFound();

  const businesses = getBusinessesByCity(enV, city);
  if (!businesses.length) notFound();

  const cityName = businesses[0].city;
  const schema = generateItemListSchema(businesses, `Mejores ${label} en ${cityName}`);

  return (
    <>
      <HeaderES />
      <div className="min-h-screen bg-slate-950 text-white pt-20">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <div className="max-w-6xl mx-auto px-4 py-16">
          <nav className="text-sm text-slate-400 mb-8">
            <Link href="/es/directorio" className="hover:text-blue-400">Directorio</Link>
            <span className="mx-2">/</span>
            <Link href={`/es/directorio/${vertical}`} className="hover:text-blue-400">{label}</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{cityName}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Mejores {label} en {cityName}</h1>
          <p className="text-xl text-slate-400 mb-12">{businesses.length} {businesses.length === 1 ? label.toLowerCase().replace(/s$/, '') : label.toLowerCase()} en {cityName}</p>
          <div className="grid md:grid-cols-2 gap-4">
            {businesses.map(b => (
              <BusinessCard
                key={b.slug}
                name={b.name}
                address={b.address}
                description={getLocalizedDescription(b, 'es')}
                phone={b.phone}
                href={`/es/directorio/${vertical}/${city}/${b.slug}`}
                locale="es"
              />
            ))}
          </div>
        </div>
      </div>
      <FooterES />
    </>
  );
}
