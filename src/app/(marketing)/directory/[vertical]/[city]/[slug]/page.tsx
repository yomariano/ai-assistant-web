import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/voicefleet/Header';
import Footer from '@/components/voicefleet/Footer';
import BusinessProfile from '@/components/directory/BusinessProfile';
import { getBusinessBySlug, verticalLabels, capitalize } from '@/lib/directory-data';
import { generateBusinessSchema, generateFAQSchema } from '@/lib/schema-generators';
import { notFound } from 'next/navigation';

interface Props { params: Promise<{ vertical: string; city: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { vertical, city, slug } = await params;
  const b = getBusinessBySlug(vertical, city, slug);
  if (!b) return {};
  const label = verticalLabels[vertical] || vertical;
  return {
    title: `${b.name} — ${capitalize(b.city)} ${label} | VoiceFleet`,
    description: `${b.name} in ${b.city}. ${b.description.slice(0, 140)}`,
    openGraph: {
      title: `${b.name} | VoiceFleet Directory`,
      description: b.description.slice(0, 200),
      url: `https://voicefleet.ai/directory/${vertical}/${city}/${slug}`,
      type: 'website',
    },
  };
}

export default async function BusinessPage({ params }: Props) {
  const { vertical, city, slug } = await params;
  const business = getBusinessBySlug(vertical, city, slug);
  if (!business) notFound();

  const label = verticalLabels[vertical] || vertical;
  const schema = generateBusinessSchema(business);
  const faqSchema = generateFAQSchema(business.faqs);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-950 text-white pt-20">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <div className="max-w-6xl mx-auto px-4 py-16">
          <nav className="text-sm text-slate-400 mb-8">
            <Link href="/directory" className="hover:text-blue-400">Directory</Link>
            <span className="mx-2">/</span>
            <Link href={`/directory/${vertical}`} className="hover:text-blue-400">{label}</Link>
            <span className="mx-2">/</span>
            <Link href={`/directory/${vertical}/${city}`} className="hover:text-blue-400">{capitalize(business.city)}</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{business.name}</span>
          </nav>

          <BusinessProfile business={business} />
        </div>
      </div>
      <Footer />
    </>
  );
}
