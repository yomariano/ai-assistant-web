import { JsonLd } from "./JsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://validatecall.com";

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ValidateCall",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description:
      "AI Voice Agents that make phone calls on your behalf. Save hours, avoid hold times, and get results.",
    sameAs: [
      "https://twitter.com/validatecall",
      "https://linkedin.com/company/validatecall",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@validatecall.com",
      contactType: "customer service",
    },
  };

  return <JsonLd data={schema} />;
}
