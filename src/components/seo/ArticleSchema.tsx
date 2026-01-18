import { JsonLd } from "./JsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://voicefleet.ai";

interface ArticleSchemaProps {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: string;
  url: string;
}

export function ArticleSchema({
  title,
  description,
  image,
  datePublished,
  dateModified,
  author,
  url,
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    image: image,
    datePublished: datePublished,
    dateModified: dateModified,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "VoiceFleet",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo-mark.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return <JsonLd data={schema} />;
}
