import { JsonLd } from "./JsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://voicefleet.ai";

interface ProductSchemaProps {
  lowPrice?: string;
  highPrice?: string;
  priceCurrency?: string;
  url?: string;
  inLanguage?: string[];
}

export function ProductSchema({
  lowPrice = "99",
  highPrice = "599",
  priceCurrency = "EUR",
  url = `${siteUrl}/pricing`,
  inLanguage = ["en", "es-AR"],
}: ProductSchemaProps = {}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "VoiceFleet",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: siteUrl,
    offers: {
      "@type": "AggregateOffer",
      lowPrice,
      highPrice,
      priceCurrency,
      offerCount: 3,
      url,
    },
    description:
      "AI voice receptionist for small businesses. Answer calls, take messages, and book appointments 24/7.",
    image: [`${siteUrl}/logo-mark.svg`],
    inLanguage,
    featureList: [
      "AI-powered voice calls",
      "24/7 availability",
      "Multiple languages",
      "Appointment booking",
      "Custom call workflows",
      "SMS and email notifications",
      "Smart call routing and escalation",
      "Calendar and booking integrations",
    ],
  };

  return <JsonLd data={schema} />;
}
