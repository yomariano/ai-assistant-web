/**
 * VoiceFleet SEO - Schema Markup and Meta Tag Utilities
 */

import { Industry, City, Country, GeneratedContent } from '../types';

/**
 * Generate Organization schema for VoiceFleet
 */
export function generateOrganizationSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'VoiceFleet',
    url: 'https://voicefleet.ai',
    logo: 'https://voicefleet.ai/logo.png',
    description: 'AI voice agents that automate business phone calls 24/7',
    sameAs: [
      'https://twitter.com/voicefleet',
      'https://linkedin.com/company/voicefleet'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-800-VOICEFLEET',
      contactType: 'sales',
      availableLanguage: ['English']
    }
  };
}

/**
 * Generate SoftwareApplication schema for VoiceFleet
 */
export function generateSoftwareSchema(industry?: Industry): object {
  const base = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: industry ? `VoiceFleet AI Voice Agent for ${industry.name}` : 'VoiceFleet AI Voice Agent',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Cloud-based',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free trial available'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150'
    },
    featureList: [
      '24/7 AI Phone Answering',
      'Natural Voice Conversations',
      'Appointment Scheduling',
      'Order Taking',
      'Lead Qualification',
      'CRM Integration'
    ]
  };

  if (industry) {
    return {
      ...base,
      featureList: [...industry.voiceCapabilities, ...industry.primaryUseCases]
    };
  }

  return base;
}

/**
 * Generate Service schema
 */
export function generateServiceSchema(options: {
  name: string;
  description: string;
  areaServed?: string;
  industry?: Industry;
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: options.name,
    description: options.description,
    provider: {
      '@type': 'Organization',
      name: 'VoiceFleet',
      url: 'https://voicefleet.ai'
    },
    serviceType: 'AI Voice Agent Service',
    areaServed: options.areaServed || 'Worldwide',
    ...(options.industry && {
      audience: {
        '@type': 'BusinessAudience',
        audienceType: options.industry.namePlural
      }
    })
  };
}

/**
 * Generate FAQ schema from generated content
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate Article schema for SEO pages
 */
export function generateArticleSchema(options: {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: options.title,
    description: options.description,
    url: options.url,
    datePublished: options.datePublished || new Date().toISOString(),
    dateModified: options.dateModified || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: 'VoiceFleet'
    },
    publisher: {
      '@type': 'Organization',
      name: 'VoiceFleet',
      logo: {
        '@type': 'ImageObject',
        url: 'https://voicefleet.ai/logo.png'
      }
    }
  };
}

/**
 * Generate Breadcrumb schema
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate LocalBusiness schema for location pages
 */
export function generateLocalBusinessSchema(options: {
  name: string;
  description: string;
  city: City;
  country: Country;
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: options.name,
    description: options.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: options.city.name,
      addressRegion: options.city.region,
      addressCountry: options.country.code
    },
    areaServed: {
      '@type': 'City',
      name: options.city.name
    }
  };
}

/**
 * Combine multiple schema objects for a page
 */
export function combineSchemas(...schemas: object[]): string {
  if (schemas.length === 1) {
    return JSON.stringify(schemas[0]);
  }
  return JSON.stringify(schemas);
}

/**
 * Generate all schemas for an industry page
 */
export function generateIndustryPageSchemas(
  industry: Industry,
  content: GeneratedContent | null,
  siteUrl: string
): string[] {
  const schemas: object[] = [
    generateOrganizationSchema(),
    generateSoftwareSchema(industry),
    generateServiceSchema({
      name: `AI Voice Agent for ${industry.name}`,
      description: industry.metaDescription,
      industry
    }),
    generateArticleSchema({
      title: content?.title || `AI Voice Agent for ${industry.name}`,
      description: content?.metaDescription || industry.metaDescription,
      url: `${siteUrl}/industries/${industry.slug}`,
      datePublished: content?.generatedAt,
      dateModified: content?.generatedAt
    }),
    generateBreadcrumbSchema([
      { name: 'Home', url: siteUrl },
      { name: 'Industries', url: `${siteUrl}/industries` },
      { name: industry.name, url: `${siteUrl}/industries/${industry.slug}` }
    ])
  ];

  if (content?.faqItems) {
    schemas.push(generateFAQSchema(content.faqItems));
  }

  return schemas.map(s => JSON.stringify(s));
}

/**
 * Utility functions
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function capitalize(text: string): string {
  return text
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toString();
}
