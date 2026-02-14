import { JsonLd } from "./JsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://voicefleet.ai";

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "VoiceFleet",
    url: siteUrl,
    logo: `${siteUrl}/logo-mark.svg`,
    description:
      "AI voice receptionist for small businesses. Answer calls, take messages, and book appointments 24/7.",
    email: "support@voicefleet.ai",
    foundingDate: "2025",
    sameAs: [
      "https://twitter.com/voicefleetai",
      "https://linkedin.com/company/voicefleet",
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "IE",
    },
    areaServed: [
      { "@type": "Country", name: "Ireland" },
      { "@type": "Country", name: "Argentina" },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      url: `${siteUrl}/#demo`,
      contactType: "customer service",
    },
  };

  return <JsonLd data={schema} />;
}
