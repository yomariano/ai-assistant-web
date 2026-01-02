import { JsonLd } from "./JsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://validatecall.com";

interface LocalBusinessSchemaProps {
  name: string;
  city: string;
  state: string;
  latitude?: number;
  longitude?: number;
}

export function LocalBusinessSchema({
  name,
  city,
  state,
  latitude,
  longitude,
}: LocalBusinessSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: name,
    image: `${siteUrl}/logo.png`,
    url: siteUrl,
    description: `AI Voice Assistant services in ${city}, ${state}. Automated phone calls for businesses.`,
    address: {
      "@type": "PostalAddress",
      addressLocality: city,
      addressRegion: state,
      addressCountry: "US",
    },
    ...(latitude &&
      longitude && {
        geo: {
          "@type": "GeoCoordinates",
          latitude: latitude,
          longitude: longitude,
        },
      }),
    priceRange: "$$",
    openingHours: "Mo-Fr 09:00-17:00",
    areaServed: {
      "@type": "City",
      name: city,
    },
  };

  return <JsonLd data={schema} />;
}
