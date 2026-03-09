import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/voicefleet/Header";
import Footer from "@/components/voicefleet/Footer";
import BusinessProfile from "@/components/directory/BusinessProfile";
import { capitalize, getBusinessBySlugForMarket, getVerticalLabel } from "@/lib/directory-data";
import { generateBusinessSchema, generateFAQSchema } from "@/lib/schema-generators";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ vertical: string; city: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { vertical, city, slug } = await params;
  const business = await getBusinessBySlugForMarket(vertical, city, slug, "AU");
  if (!business) return {};

  const label = getVerticalLabel(vertical);
  return {
    title: `${business.name} - ${capitalize(business.city)} ${label}`,
    description: `${business.name} in ${business.city}, Australia. ${business.description.slice(0, 140)}`,
    openGraph: {
      title: `${business.name} - ${capitalize(business.city)}`,
      description: business.description.slice(0, 200),
      url: `https://voicefleet.ai/au/directory/${vertical}/${city}/${slug}`,
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

export default async function AustraliaBusinessPage({ params }: Props) {
  const { vertical, city, slug } = await params;
  const business = await getBusinessBySlugForMarket(vertical, city, slug, "AU");
  if (!business) notFound();

  const label = getVerticalLabel(vertical);
  const schema = generateBusinessSchema(business, "https://voicefleet.ai", "/au/directory");
  const faqSchema = generateFAQSchema(business.faqs);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-950 text-white pt-20">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
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
            <Link href={`/au/directory/${vertical}/${city}`} className="hover:text-blue-400">
              {capitalize(business.city)}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">{business.name}</span>
          </nav>

          <BusinessProfile
            business={business}
            demoHref="/au#demo"
            trialHref="/register?region=AU"
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
