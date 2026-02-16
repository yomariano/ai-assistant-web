import { JsonLd } from "./JsonLd";

interface HowToStep {
  name: string;
  text: string;
  url?: string;
}

interface HowToSchemaProps {
  name: string;
  description: string;
  totalTime?: string;
  steps: HowToStep[];
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://voicefleet.ai";

export function HowToSchema({ name, description, totalTime, steps }: HowToSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    ...(totalTime && { totalTime }),
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.url && { url: `${siteUrl}${step.url}` }),
    })),
  };

  return <JsonLd data={schema} />;
}
