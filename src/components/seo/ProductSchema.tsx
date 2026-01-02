import { JsonLd } from "./JsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://validatecall.com";

export function ProductSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ValidateCall",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: siteUrl,
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "19",
      highPrice: "149",
      priceCurrency: "USD",
      offerCount: 3,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "150",
    },
    description:
      "AI Voice Agents that make phone calls on your behalf. Automate appointment scheduling, customer service calls, and more.",
    featureList: [
      "AI-powered voice calls",
      "Call scheduling",
      "Multiple languages",
      "Call history tracking",
      "Custom call scripts",
    ],
  };

  return <JsonLd data={schema} />;
}
