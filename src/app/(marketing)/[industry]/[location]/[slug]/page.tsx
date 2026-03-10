import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/voicefleet/Header";
import Footer from "@/components/voicefleet/Footer";
import BusinessProfile from "@/components/directory/BusinessProfile";
import { getAllBusinesses, getBusinessBySlug, getVerticalLabel, capitalize } from "@/lib/directory-data";
import { generateBusinessSchema, generateFAQSchema } from "@/lib/schema-generators";

interface Props {
  params: Promise<{ industry: string; location: string; slug: string }>;
}

export async function generateStaticParams() {
  const businesses = await getAllBusinesses();
  return businesses.map((business) => ({
    industry: business.vertical,
    location: business.citySlug,
    slug: business.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry, location, slug } = await params;
  const business = await getBusinessBySlug(industry, location, slug);

  if (!business) {
    return {};
  }

  const label = getVerticalLabel(industry);
  return {
    title: `${business.name} — ${capitalize(business.city)} ${label}`,
    description: `${business.name} in ${business.city}. ${business.description.slice(0, 140)}`,
    openGraph: {
      title: `${business.name} — ${capitalize(business.city)}`,
      description: business.description.slice(0, 200),
      url: `https://voicefleet.ai/${industry}/${location}/${slug}`,
      type: "website",
      ...(business.image_url
        ? {
            images: [
              {
                url: business.image_url.startsWith("http")
                  ? business.image_url
                  : `https://voicefleet.ai${business.image_url}`,
              },
            ],
          }
        : {}),
    },
  };
}

export default async function DirectoryBusinessPage({ params }: Props) {
  const { industry, location, slug } = await params;
  const business = await getBusinessBySlug(industry, location, slug);

  if (!business) {
    notFound();
  }

  const label = getVerticalLabel(industry);
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
            <Link href={`/${industry}`} className="hover:text-blue-400">{label}</Link>
            <span className="mx-2">/</span>
            <Link href={`/${industry}/${location}`} className="hover:text-blue-400">{capitalize(business.city)}</Link>
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
