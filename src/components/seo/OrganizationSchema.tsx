import { JsonLd } from "./JsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://voicefleet.ai";

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "VoiceFleet",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description:
      "AI Voice Agents that handle calls at 80% lower cost. Scale support without scaling headcount.",
    sameAs: [
      "https://twitter.com/voicefleetai",
      "https://linkedin.com/company/voicefleet",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@voicefleet.ai",
      contactType: "customer service",
    },
  };

  return <JsonLd data={schema} />;
}
