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
      "SMS and email notifications",
      "Smart call routing and escalation",
      "Calendar and booking integrations",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      bestRating: "5",
      ratingCount: "47",
      reviewCount: "32",
    },
    review: [
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Dental Practice Manager" },
        datePublished: "2025-11-15",
        reviewBody:
          "During appointments the phone used to ring nonstop. Now VoiceFleet answers, captures the reason for the visit, and books or routes the call so we can focus on the patient in front of us.",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Professional Services Firm Owner" },
        datePublished: "2025-12-02",
        reviewBody:
          "VoiceFleet handles first-contact calls, captures key details, and routes urgent items to the right person. We respond faster without interrupting billable work.",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Home Services Owner-Operator" },
        datePublished: "2026-01-10",
        reviewBody:
          "When I'm on-site I can't answer the phone. VoiceFleet collects address, issue, urgency, and a callback number, then sends a clean summary so I can triage quickly.",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
      },
    ],
  };

  return <JsonLd data={schema} />;
}
