import { JsonLd } from "./JsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://voicefleet.ai";

export function ProductSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "VoiceFleet",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: siteUrl,
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "19",
      highPrice: "249",
      priceCurrency: "EUR",
      offerCount: 3,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "150",
    },
    description:
      "AI Voice Agents that handle calls at 80% lower cost. Scale support without scaling headcount.",
    featureList: [
      "AI-powered voice calls",
      "24/7 availability",
      "Multiple languages",
      "Call history tracking",
      "Custom call scripts",
    ],
  };

  return <JsonLd data={schema} />;
}
