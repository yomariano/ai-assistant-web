/**
 * VoiceFleet SEO - AI Receptionist Page Handler
 * Renders pages like /ai-receptionist-dental-dublin (EN)
 * and /es/asistente-ia-odontologos-buenos-aires (ES)
 *
 * These target "ai receptionist [industry] [city]" keywords,
 * distinct from the existing "voice agent in" pages.
 */

import { Context } from 'hono';
import { Bindings, GeneratedContent } from '../types';
import { INDUSTRIES, getIndustry, getRelatedIndustries } from '../data/industries';
import { findCityBySlug, COUNTRIES } from '../data/locations';
import { getContent } from '../utils/claude';
import {
  generateBaseHtml,
  generateHeroSection,
  generateStatsSection,
  generateDefinitionSection,
  generateIntroductionSection,
  generateBenefitsSection,
  generateHowItWorksSection,
  generatePainPointsSection,
  generateUseCasesSection,
  generateFAQSection,
  generateCTASection,
  generateBreadcrumbs,
  generateRelatedIndustriesSection,
  escapeHtml
} from '../utils/html';
import {
  generateOrganizationSchema,
  generateServiceSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateLocalBusinessSchema
} from '../utils/seo';

// Maps short industry names in EN URLs to canonical industry slugs
const EN_INDUSTRY_MAP: Record<string, string> = {
  'dental': 'dental-clinics',
  'restaurant': 'restaurants',
  'restaurants': 'restaurants',
  'medical': 'medical-clinics',
  'plumber': 'plumbers',
  'plumbers': 'plumbers',
  'salon': 'hair-salons',
  'salons': 'hair-salons',
  'gym': 'fitness-centers',
  'hotel': 'hotels',
  'hotels': 'hotels',
  'lawyer': 'law-firms',
  'insurance': 'insurance-agencies',
};

// Maps Spanish industry names in ES URLs to canonical industry slugs
const ES_INDUSTRY_MAP: Record<string, string> = {
  'odontologos': 'dental-clinics',
  'restaurantes': 'restaurants',
  'clinicas': 'medical-clinics',
  'plomeros': 'plumbers',
  'peluquerias': 'hair-salons',
  'gimnasios': 'fitness-centers',
  'hoteles': 'hotels',
  'abogados': 'law-firms',
  'seguros': 'insurance-agencies',
};

// Spanish display names for industries
const ES_INDUSTRY_NAMES: Record<string, string> = {
  'dental-clinics': 'Clínicas Dentales',
  'restaurants': 'Restaurantes',
  'medical-clinics': 'Clínicas Médicas',
  'plumbers': 'Plomeros',
  'hair-salons': 'Peluquerías',
  'fitness-centers': 'Gimnasios',
  'hotels': 'Hoteles',
  'law-firms': 'Estudios Jurídicos',
  'insurance-agencies': 'Aseguradoras',
};

/**
 * Parse "ai-receptionist-{industry}-{city}" format.
 * Tries each known industry slug; remainder is the city.
 */
function parseEnSlug(slug: string): { industrySlug: string; citySlug: string } | null {
  for (const [key, canonical] of Object.entries(EN_INDUSTRY_MAP)) {
    if (slug.startsWith(key + '-')) {
      const citySlug = slug.slice(key.length + 1);
      if (citySlug) return { industrySlug: canonical, citySlug };
    }
  }
  return null;
}

/**
 * Parse "asistente-ia-{industry}-{city}" format.
 */
function parseEsSlug(slug: string): { industrySlug: string; citySlug: string } | null {
  for (const [key, canonical] of Object.entries(ES_INDUSTRY_MAP)) {
    if (slug.startsWith(key + '-')) {
      const citySlug = slug.slice(key.length + 1);
      if (citySlug) return { industrySlug: canonical, citySlug };
    }
  }
  return null;
}

/**
 * Handler for EN pages: /ai-receptionist-dental-dublin
 */
export async function aiReceptionistHandler(
  c: Context<{ Bindings: Bindings }>,
  remainder: string
) {
  const parsed = parseEnSlug(remainder);
  if (!parsed) return c.notFound();

  const industry = INDUSTRIES[parsed.industrySlug];
  const locationData = findCityBySlug(parsed.citySlug);

  if (!industry || !locationData) return c.notFound();

  const { city, country } = locationData;
  const siteUrl = c.env.SITE_URL || 'https://voicefleet.ai';
  const appUrl = c.env.APP_URL || 'https://app.voicefleet.ai';

  // Find the short industry key used in the URL
  const shortKey = Object.entries(EN_INDUSTRY_MAP).find(([, v]) => v === industry.slug)?.[0] || industry.slug;
  const pageUrl = `${siteUrl}/ai-receptionist-${shortKey}-${city.slug}`;

  // Reuse content cache from the main industry+location combo
  const cacheKey = `content:combo:${industry.slug}:${city.slug}`;
  let content: GeneratedContent | null = null;
  try {
    content = await getContent(c.env.CONTENT_CACHE, cacheKey);
  } catch (e) {
    console.error(`[SEO] Failed to parse cached content for ${cacheKey}:`, e);
  }

  c.header('X-VoiceFleet-SEO', '1');
  c.header('X-VoiceFleet-SEO-Page-Type', 'ai-receptionist-en');

  const relatedIndustries = getRelatedIndustries(industry.slug);

  const title = `AI Receptionist for ${industry.name} in ${city.name} | VoiceFleet`;
  const description = `AI receptionist for ${industry.name.toLowerCase()} in ${city.name}, ${country.name}. Answer every call 24/7, book appointments, and handle inquiries automatically.`;

  const pageContent = renderAiReceptionistContent(
    industry, city, country, content, relatedIndustries, siteUrl, appUrl, pageUrl
  );

  const schemas = [
    JSON.stringify(generateOrganizationSchema()),
    JSON.stringify(generateServiceSchema({
      name: `AI Receptionist for ${industry.name} in ${city.name}`,
      description: content?.metaDescription || description,
      areaServed: city.name,
      industry
    })),
    JSON.stringify(generateLocalBusinessSchema({
      name: `VoiceFleet AI Receptionist - ${industry.name} in ${city.name}`,
      description: `AI receptionist for ${industry.name.toLowerCase()} businesses in ${city.name}`,
      city,
      country
    })),
    JSON.stringify(generateBreadcrumbSchema([
      { name: 'Home', url: siteUrl },
      { name: 'Industries', url: `${siteUrl}/industries` },
      { name: industry.name, url: `${siteUrl}/industries/${industry.slug}` },
      { name: `AI Receptionist in ${city.name}`, url: pageUrl }
    ]))
  ];

  if (content?.faqItems) {
    schemas.push(JSON.stringify(generateFAQSchema(content.faqItems)));
  }

  return c.html(generateBaseHtml({
    title: content?.title?.replace('Voice Agent', 'AI Receptionist') || title,
    description: content?.metaDescription || description,
    canonicalUrl: pageUrl,
    content: pageContent,
    schemas,
    siteUrl
  }));
}

/**
 * Handler for ES pages: /es/asistente-ia-odontologos-buenos-aires
 */
export async function asistenteIaHandler(
  c: Context<{ Bindings: Bindings }>,
  remainder: string
) {
  const parsed = parseEsSlug(remainder);
  if (!parsed) return c.notFound();

  const industry = INDUSTRIES[parsed.industrySlug];
  const locationData = findCityBySlug(parsed.citySlug);

  if (!industry || !locationData) return c.notFound();

  const { city, country } = locationData;
  const siteUrl = c.env.SITE_URL || 'https://voicefleet.ai';
  const appUrl = c.env.APP_URL || 'https://app.voicefleet.ai';

  const esIndustryName = ES_INDUSTRY_NAMES[industry.slug] || industry.name;
  const shortKey = Object.entries(ES_INDUSTRY_MAP).find(([, v]) => v === industry.slug)?.[0] || industry.slug;
  const pageUrl = `${siteUrl}/es/asistente-ia-${shortKey}-${city.slug}`;

  // Reuse content cache
  const cacheKey = `content:combo:${industry.slug}:${city.slug}`;
  let content: GeneratedContent | null = null;
  try {
    content = await getContent(c.env.CONTENT_CACHE, cacheKey);
  } catch (e) {
    console.error(`[SEO] Failed to parse cached content for ${cacheKey}:`, e);
  }

  c.header('X-VoiceFleet-SEO', '1');
  c.header('X-VoiceFleet-SEO-Page-Type', 'asistente-ia-es');

  const title = `Asistente IA para ${esIndustryName} en ${city.name} | VoiceFleet`;
  const description = `Recepcionista IA para ${esIndustryName.toLowerCase()} en ${city.name}, ${country.name}. Atendé cada llamada 24/7, agendá turnos y respondé consultas automáticamente.`;

  const priceStr = country.currency === 'USD' ? '$49' : country.currency === 'EUR' ? '€99' : '$49';

  const faqItems = [
    {
      question: `¿Cuánto cuesta VoiceFleet para ${esIndustryName.toLowerCase()} en ${city.name}?`,
      answer: `VoiceFleet arranca desde ${priceStr}/mes para ${esIndustryName.toLowerCase()} en ${city.name}. Todos los planes incluyen prueba gratuita.`
    },
    {
      question: `¿Puedo obtener un número local de ${city.name}?`,
      answer: `Sí, VoiceFleet provee números locales ${country.phoneFormat} en ${city.name}. Tus clientes verán un número familiar.`
    },
    {
      question: '¿Qué tan natural suena la voz IA?',
      answer: 'VoiceFleet usa síntesis de voz avanzada que suena natural y profesional. La mayoría de los llamadores no notan que hablan con una IA.'
    },
    {
      question: '¿Qué pasa si la IA no puede manejar una llamada?',
      answer: 'Vos controlás la escalación: transferir al personal, tomar un mensaje detallado o marcar llamadas urgentes para atención inmediata.'
    }
  ];

  const pageContent = renderEsContent(
    industry, esIndustryName, city, country, content, faqItems, siteUrl, appUrl, pageUrl, priceStr
  );

  const schemas = [
    JSON.stringify(generateOrganizationSchema()),
    JSON.stringify(generateServiceSchema({
      name: `Asistente IA para ${esIndustryName} en ${city.name}`,
      description,
      areaServed: city.name,
      industry
    })),
    JSON.stringify(generateLocalBusinessSchema({
      name: `VoiceFleet - ${esIndustryName} en ${city.name}`,
      description: `Recepcionista IA para ${esIndustryName.toLowerCase()} en ${city.name}`,
      city,
      country
    })),
    JSON.stringify(generateBreadcrumbSchema([
      { name: 'Inicio', url: `${siteUrl}/es` },
      { name: esIndustryName, url: pageUrl }
    ])),
    JSON.stringify(generateFAQSchema(faqItems))
  ];

  return c.html(generateBaseHtml({
    title,
    description,
    canonicalUrl: pageUrl,
    content: pageContent,
    schemas,
    siteUrl,
    lang: 'es'
  }));
}

// ── Render helpers ──────────────────────────────────────────────────────

function renderAiReceptionistContent(
  industry: typeof INDUSTRIES[string],
  city: typeof COUNTRIES[string]['cities'][number],
  country: typeof COUNTRIES[string],
  content: GeneratedContent | null,
  relatedIndustries: typeof INDUSTRIES[string][],
  siteUrl: string,
  appUrl: string,
  pageUrl: string
): string {
  const priceStr = country.currency === 'EUR' ? '€99' : country.currency === 'GBP' ? '£99' : '$49';

  const faqItems = [
    {
      question: `How much does an AI receptionist cost for ${industry.name.toLowerCase()} in ${city.name}?`,
      answer: `VoiceFleet AI receptionist starts at ${priceStr}/month for ${industry.name.toLowerCase()} in ${city.name}. All plans include a free trial.`
    },
    {
      question: `Can I get a local ${city.name} phone number?`,
      answer: `Yes, VoiceFleet provides local ${country.phoneFormat} phone numbers in ${city.name}. Your customers will see a familiar local number.`
    },
    {
      question: 'How natural does the AI receptionist sound?',
      answer: 'VoiceFleet uses advanced voice synthesis that sounds natural and professional. Most callers cannot tell they are speaking with an AI receptionist.'
    },
    {
      question: 'What happens if the AI cannot handle a call?',
      answer: 'You control escalation: transfer to staff, take a detailed message, or flag urgent calls for immediate attention.'
    }
  ];

  const sections = [
    generateBreadcrumbs([
      { name: 'Home', url: siteUrl },
      { name: 'Industries', url: `${siteUrl}/industries` },
      { name: industry.name, url: `${siteUrl}/industries/${industry.slug}` },
      { name: `AI Receptionist in ${city.name}`, url: pageUrl }
    ]),

    generateHeroSection({
      title: content?.heroTitle?.replace('Voice Agent', 'AI Receptionist')
        || `AI Receptionist for ${industry.name} in ${city.name}`,
      subtitle: content?.heroSubtitle
        || `Never miss a call again. VoiceFleet's AI receptionist answers every call for your ${industry.name.toLowerCase()} business in ${city.name}, 24/7.`,
      ctaText: 'Try VoiceFleet Free',
      ctaUrl: `${appUrl}/signup?industry=${industry.slug}&location=${city.slug}`
    }),

    content?.introduction
      ? generateIntroductionSection({ introduction: content.introduction, generatedAt: content.generatedAt })
      : `<section style="padding:3rem 1.5rem;max-width:800px;margin:0 auto">
          <p style="font-size:1.1rem;line-height:1.8;color:#475569">
            ${escapeHtml(industry.name)} businesses in ${escapeHtml(city.name)} handle hundreds of calls every month.
            With VoiceFleet's AI receptionist, every call is answered instantly — no hold times, no missed appointments,
            no lost customers. Starting at just ${priceStr}/month.
          </p>
        </section>`,

    content?.keyStats ? generateStatsSection(content.keyStats) : '',

    content?.benefits ? generateBenefitsSection(content.benefits)
      : generateBenefitsSection(industry.voiceCapabilities),

    content?.howItWorks ? generateHowItWorksSection(content.howItWorks) : '',

    generatePainPointsSection(industry.painPoints.map(pp => ({
      title: pp.replace('?', ''),
      description: pp
    }))),

    generateUseCasesSection(industry.primaryUseCases.map(uc => ({
      title: uc,
      description: `Automate ${uc.toLowerCase()} for your ${industry.name.toLowerCase()} business in ${city.name}.`
    }))),

    generateFAQSection(faqItems),

    relatedIndustries.length > 0
      ? generateRelatedIndustriesSection(relatedIndustries, siteUrl)
      : '',

    generateCTASection({
      text: `Ready to automate your ${industry.name.toLowerCase()} calls in ${city.name}? Join ${industry.namePlural.toLowerCase()} across ${country.name} already using VoiceFleet.`,
      buttonText: 'Start Free Trial',
      buttonUrl: `${appUrl}/signup?industry=${industry.slug}&location=${city.slug}`
    })
  ];

  return sections.filter(Boolean).join('\n');
}

function renderEsContent(
  industry: typeof INDUSTRIES[string],
  esIndustryName: string,
  city: typeof COUNTRIES[string]['cities'][number],
  country: typeof COUNTRIES[string],
  content: GeneratedContent | null,
  faqItems: Array<{ question: string; answer: string }>,
  siteUrl: string,
  appUrl: string,
  pageUrl: string,
  priceStr: string
): string {
  const sections = [
    generateBreadcrumbs([
      { name: 'Inicio', url: `${siteUrl}/es` },
      { name: esIndustryName, url: pageUrl }
    ]),

    generateHeroSection({
      title: `Asistente IA para ${esIndustryName} en ${city.name}`,
      subtitle: `No pierdas más llamadas. El asistente IA de VoiceFleet atiende cada llamada de tu negocio de ${esIndustryName.toLowerCase()} en ${city.name}, 24/7.`,
      ctaText: 'Probá VoiceFleet Gratis',
      ctaUrl: `${appUrl}/signup?industry=${industry.slug}&location=${city.slug}`
    }),

    `<section style="padding:3rem 1.5rem;max-width:800px;margin:0 auto">
      <p style="font-size:1.1rem;line-height:1.8;color:#475569">
        Los negocios de ${escapeHtml(esIndustryName.toLowerCase())} en ${escapeHtml(city.name)} manejan cientos de llamadas por mes.
        Con el asistente IA de VoiceFleet, cada llamada se atiende al instante — sin esperas, sin turnos perdidos,
        sin clientes que se van. Desde ${priceStr}/mes.
      </p>
    </section>`,

    generateBenefitsSection(industry.voiceCapabilities),

    generatePainPointsSection(industry.painPoints.map(pp => ({
      title: pp.replace('?', ''),
      description: pp
    }))),

    generateFAQSection(faqItems),

    generateCTASection({
      text: `¿Listo para automatizar las llamadas de tu ${esIndustryName.toLowerCase()} en ${city.name}? Sumate a los negocios de ${country.name} que ya usan VoiceFleet.`,
      buttonText: 'Empezar Prueba Gratuita',
      buttonUrl: `${appUrl}/signup?industry=${industry.slug}&location=${city.slug}`
    })
  ];

  return sections.filter(Boolean).join('\n');
}
