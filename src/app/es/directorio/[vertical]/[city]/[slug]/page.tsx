import { Metadata } from 'next';
import Link from 'next/link';
import HeaderES from '@/components/voicefleet/HeaderES';
import FooterES from '@/components/voicefleet/FooterES';
import BusinessProfile from '@/components/directory/BusinessProfile';
import { getBusinessBySlug, verticalLabelsES, esSlugToVertical, capitalize } from '@/lib/directory-data';
import { generateBusinessSchema, generateFAQSchema } from '@/lib/schema-generators';
import { notFound } from 'next/navigation';

interface Props { params: Promise<{ vertical: string; city: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { vertical, city, slug } = await params;
  const enV = esSlugToVertical[vertical];
  if (!enV) return {};
  const b = getBusinessBySlug(enV, city, slug);
  if (!b) return {};
  return {
    title: `${b.name} — ${capitalize(b.city)}`,
    description: `${b.name} en ${b.city}. ${b.description.slice(0, 140)}`,
    openGraph: { title: `${b.name} — ${capitalize(b.city)}`, description: b.description.slice(0, 200) },
  };
}

export default async function BusinessPageES({ params }: Props) {
  const { vertical, city, slug } = await params;
  const enV = esSlugToVertical[vertical];
  if (!enV) notFound();
  const business = getBusinessBySlug(enV, city, slug);
  if (!business) notFound();

  const label = verticalLabelsES[enV] || enV;
  const schema = generateBusinessSchema(business);
  const faqSchema = generateFAQSchema(business.faqs);

  return (
    <>
      <HeaderES />
      <div className="min-h-screen bg-slate-950 text-white pt-20">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <div className="max-w-6xl mx-auto px-4 py-16">
          <nav className="text-sm text-slate-400 mb-8">
            <Link href="/es/directorio" className="hover:text-blue-400">Directorio</Link>
            <span className="mx-2">/</span>
            <Link href={`/es/directorio/${vertical}`} className="hover:text-blue-400">{label}</Link>
            <span className="mx-2">/</span>
            <Link href={`/es/directorio/${vertical}/${city}`} className="hover:text-blue-400">{capitalize(business.city)}</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{business.name}</span>
          </nav>
          <BusinessProfile business={business} locale="es" />
        </div>
      </div>
      <FooterES />
    </>
  );
}
