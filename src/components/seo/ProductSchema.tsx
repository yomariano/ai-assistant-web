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
      lowPrice: "99",
      highPrice: "599",
      priceCurrency: "EUR",
      offerCount: 3,
      url: `${siteUrl}/pricing`,
    },
    description:
      "AI voice receptionist for small businesses. Answer calls, take messages, and book appointments 24/7.",
    image: [`${siteUrl}/logo-mark.svg`],
    inLanguage: ["en", "es-AR"],
    featureList: [
      "AI-powered voice calls",
      "24/7 availability",
      "Multiple languages",
      "Appointment booking",
      "Custom call workflows",
    ],
  };

  return <JsonLd data={schema} />;
}
