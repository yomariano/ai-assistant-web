import { JsonLd } from "./JsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://voicefleet.ai";

export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "VoiceFleet",
    url: siteUrl,
    inLanguage: ["en", "es-AR"],
    publisher: {
      "@type": "Organization",
      name: "VoiceFleet",
      url: siteUrl,
    },
  };

  return <JsonLd data={schema} />;
}
