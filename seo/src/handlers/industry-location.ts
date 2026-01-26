/**
 * VoiceFleet SEO - Industry + Location Combo Page Handler
 * Renders pages like /restaurant-voice-agent-in-dublin
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

export async function industryLocationHandler(
  c: Context<{ Bindings: Bindings }>,
  industrySlug: string,
  locationSlug: string
) {
  // Handle singular/plural forms (e.g., "restaurant" -> "restaurants", or "restaurants" -> "restaurant")
  let industry = getIndustry(industrySlug);

  // Try adding 's' for plural form
  if (!industry && !industrySlug.endsWith('s')) {
    industry = getIndustry(industrySlug + 's');
  }

  // Try removing 's' for singular form
  if (!industry && industrySlug.endsWith('s')) {
    industry = getIndustry(industrySlug.slice(0, -1));
  }
  const locationData = findCityBySlug(locationSlug);

  if (!industry || !locationData) {
    return c.notFound();
  }

  const { city, country } = locationData;
  const siteUrl = c.env.SITE_URL || 'https://voicefleet.ai';
  const appUrl = c.env.APP_URL || 'https://app.voicefleet.ai';

  // Try to get AI-generated content from cache
  const cacheKey = `content:combo:${industry.slug}:${city.slug}`;
  const content = await getContent(c.env.CONTENT_CACHE, cacheKey);

  c.header('X-VoiceFleet-SEO', '1');
  c.header('X-VoiceFleet-SEO-Content', content ? 'ai' : 'fallback');
  c.header('X-VoiceFleet-SEO-Cache-Key', cacheKey);
  if (content?.generatedAt) {
    c.header('X-VoiceFleet-SEO-Generated-At', content.generatedAt);
  }

  // Generate page content
  const pageContent = content
    ? renderWithAIContent(industry, city, country, content, siteUrl, appUrl)
    : renderFallbackContent(industry, city, country, siteUrl, appUrl);

  // Generate schemas
  const pageUrl = `${siteUrl}/${industry.slug}-voice-agent-in-${city.slug}`;
  const schemas = [
    JSON.stringify(generateOrganizationSchema()),
    JSON.stringify(generateServiceSchema({
      name: `AI Voice Agent for ${industry.name} in ${city.name}`,
      description: content?.metaDescription || `VoiceFleet AI voice agents for ${industry.name.toLowerCase()} in ${city.name}, ${country.name}. Automate phone calls 24/7.`,
      areaServed: city.name,
      industry
    })),
    JSON.stringify(generateLocalBusinessSchema({
      name: `VoiceFleet for ${industry.name} in ${city.name}`,
      description: `AI voice agents for ${industry.name.toLowerCase()} businesses in ${city.name}`,
      city,
      country
    })),
    JSON.stringify(generateBreadcrumbSchema([
      { name: 'Home', url: siteUrl },
      { name: 'Industries', url: `${siteUrl}/industries` },
      { name: industry.name, url: `${siteUrl}/industries/${industry.slug}` },
      { name: `${industry.name} in ${city.name}`, url: pageUrl }
    ]))
  ];

  if (content?.faqItems) {
    schemas.push(JSON.stringify(generateFAQSchema(content.faqItems)));
  }

  const html = generateBaseHtml({
    title: content?.title || `AI Voice Agent for ${industry.name} in ${city.name} | VoiceFleet`,
    description: content?.metaDescription || `VoiceFleet provides AI voice agents for ${industry.name.toLowerCase()} in ${city.name}, ${country.name}. Automate phone orders, appointments, and inquiries 24/7.`,
    canonicalUrl: pageUrl,
    content: pageContent,
    schemas,
    siteUrl
  });

  return c.html(html);
}

function renderWithAIContent(
  industry: typeof INDUSTRIES[string],
  city: typeof COUNTRIES[string]['cities'][number],
  country: typeof COUNTRIES[string],
  content: GeneratedContent,
  siteUrl: string,
  appUrl: string
): string {
  const relatedIndustries = getRelatedIndustries(industry.slug);
  const pageUrl = `${siteUrl}/${industry.slug}-voice-agent-in-${city.slug}`;

  const sections = [
    generateBreadcrumbs([
      { name: 'Home', url: siteUrl },
      { name: 'Industries', url: `${siteUrl}/industries` },
      { name: industry.name, url: `${siteUrl}/industries/${industry.slug}` },
      { name: `${industry.name} in ${city.name}`, url: pageUrl }
    ]),

    generateHeroSection({
      title: content.heroTitle,
      subtitle: content.heroSubtitle,
      ctaText: content.ctaText || 'Try VoiceFleet Free',
      ctaUrl: `${appUrl}/signup?industry=${industry.slug}&location=${city.slug}`
    }),

    generateDefinitionSection({
      definition: content.definition,
      quickAnswer: content.quickAnswer
    }),

    generateIntroductionSection({
      introduction: content.introduction,
      generatedAt: content.generatedAt
    }),

    generateStatsSection(content.keyStats),

    generateBenefitsSection(content.benefits),

    generateHowItWorksSection(content.howItWorks),

    generatePainPointsSection(content.painPointsContent),

    generateUseCasesSection(content.useCasesContent),

    // Other cities for this industry
    generateOtherCitiesSection(industry, city, country, siteUrl),

    // Related industries in this city
    relatedIndustries.length > 0
      ? generateRelatedIndustriesInCity(relatedIndustries, city, siteUrl)
      : '',

    generateFAQSection(content.faqItems),

    generateCTASection({
      text: `Ready to automate your ${industry.name.toLowerCase()} phone calls in ${city.name}?`,
      buttonText: content.ctaText || 'Start Free Trial',
      buttonUrl: `${appUrl}/signup?industry=${industry.slug}&location=${city.slug}`
    })
  ];

  return sections.join('\n');
}

function renderFallbackContent(
  industry: typeof INDUSTRIES[string],
  city: typeof COUNTRIES[string]['cities'][number],
  country: typeof COUNTRIES[string],
  siteUrl: string,
  appUrl: string
): string {
  const relatedIndustries = getRelatedIndustries(industry.slug);
  const pageUrl = `${siteUrl}/${industry.slug}-voice-agent-in-${city.slug}`;

  const sections = [
    generateBreadcrumbs([
      { name: 'Home', url: siteUrl },
      { name: 'Industries', url: `${siteUrl}/industries` },
      { name: industry.name, url: `${siteUrl}/industries/${industry.slug}` },
      { name: `${industry.name} in ${city.name}`, url: pageUrl }
    ]),

    generateHeroSection({
      title: `AI Voice Agent for ${industry.name} in ${city.name}`,
      subtitle: `Automate your ${industry.name.toLowerCase()} phone calls in ${city.name}, ${country.name}. Answer ${industry.automationRate}% of calls automatically with VoiceFleet.`,
      ctaText: 'Try VoiceFleet Free',
      ctaUrl: `${appUrl}/signup?industry=${industry.slug}&location=${city.slug}`
    }),

    generateDefinitionSection({
      definition: `An AI voice agent for ${industry.name.toLowerCase()} in ${city.name} is VoiceFleet's automated phone answering solution designed specifically for ${industry.namePlural.toLowerCase()} in ${city.name}, ${country.name}.`,
      quickAnswer: `VoiceFleet helps ${industry.namePlural.toLowerCase()} in ${city.name} automate up to ${industry.automationRate}% of phone calls. Get a local ${country.phoneFormat} number and provide 24/7 service without hiring extra staff.`
    }),

    generateStatsSection([
      { stat: `${industry.automationRate}%`, context: 'of calls automated' },
      { stat: `${industry.costSavingsPercent}%`, context: 'cost savings' },
      { stat: industry.avgResponseTime, context: 'response time' },
      { stat: country.phoneFormat, context: 'local numbers' }
    ]),

    generateBenefitsSection([
      `24/7 availability for ${city.name} customers`,
      `Local ${country.phoneFormat} phone numbers`,
      `Built for ${industry.name.toLowerCase()} businesses`,
      'Natural-sounding AI conversations'
    ]),

    generateHowItWorksSection([
      `Get a local ${city.name} phone number`,
      `Train the AI on your ${industry.name.toLowerCase()} services`,
      'Go live and automate your phone calls 24/7'
    ]),

    generatePainPointsSection(
      industry.painPoints.slice(0, 3).map(pp => ({
        title: pp,
        description: `VoiceFleet solves this for ${industry.name.toLowerCase()} in ${city.name} by providing instant, 24/7 AI-powered phone answering.`
      }))
    ),

    generateUseCasesSection(
      industry.primaryUseCases.slice(0, 3).map(uc => ({
        title: `${uc} for ${industry.name} in ${city.name}`,
        description: `Our AI voice agent handles ${uc.toLowerCase()} for ${industry.namePlural.toLowerCase()} in ${city.name} automatically, 24 hours a day.`
      }))
    ),

    generateOtherCitiesSection(industry, city, country, siteUrl),

    relatedIndustries.length > 0
      ? generateRelatedIndustriesInCity(relatedIndustries, city, siteUrl)
      : '',

    generateFAQSection([
      {
        question: `How much does VoiceFleet cost for ${industry.name.toLowerCase()} in ${city.name}?`,
        answer: `VoiceFleet starts at ${country.currency === 'EUR' ? '€49' : country.currency === 'GBP' ? '£49' : '$49'}/month for ${industry.name.toLowerCase()} in ${city.name}. All plans include a free trial.`
      },
      {
        question: `Can I get a local ${city.name} phone number?`,
        answer: `Yes, VoiceFleet provides local ${country.phoneFormat} phone numbers in ${city.name}. Your customers will see a familiar local number.`
      },
      {
        question: `How does VoiceFleet handle ${industry.primaryUseCases[0]?.toLowerCase() || 'calls'}?`,
        answer: `VoiceFleet is trained specifically for ${industry.name.toLowerCase()} ${industry.primaryUseCases[0]?.toLowerCase() || 'calls'}. It understands industry terminology and handles common requests automatically.`
      },
      {
        question: 'How natural does the AI sound?',
        answer: 'VoiceFleet uses advanced voice synthesis that sounds natural and professional. Most callers cannot tell they are speaking with an AI.'
      },
      {
        question: 'How long does setup take?',
        answer: `Most ${industry.name.toLowerCase()} in ${city.name} go live within 15 minutes. Our AI learns from your FAQs and can be customized to match your brand.`
      }
    ]),

    generateCTASection({
      text: `Ready to automate your ${industry.name.toLowerCase()} phone calls in ${city.name}?`,
      buttonText: 'Start Free Trial',
      buttonUrl: `${appUrl}/signup?industry=${industry.slug}&location=${city.slug}`
    })
  ];

  return sections.join('\n');
}

function generateOtherCitiesSection(
  industry: typeof INDUSTRIES[string],
  currentCity: typeof COUNTRIES[string]['cities'][number],
  currentCountry: typeof COUNTRIES[string],
  siteUrl: string
): string {
  // Get other cities in the same country
  const otherCities = currentCountry.cities
    .filter(c => c.slug !== currentCity.slug)
    .slice(0, 5);

  if (otherCities.length === 0) return '';

  const cityLinks = otherCities.map(city => `
    <a href="${siteUrl}/${industry.slug}-voice-agent-in-${city.slug}" class="city-link">
      ${escapeHtml(industry.name)} in ${city.name}
    </a>
  `).join('');

  return `
    <section class="other-cities">
      <div class="container">
        <h2>${industry.name} Voice Agents in Other Cities</h2>
        <div class="cities-grid">
          ${cityLinks}
        </div>
      </div>
    </section>

    <style>
      .other-cities { padding: 60px 0; background: #f8fafc; }
      .other-cities h2 { text-align: center; margin-bottom: 30px; }
      .cities-grid { display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; }
      .city-link {
        padding: 12px 20px;
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        text-decoration: none;
        color: #3b82f6;
        transition: all 0.2s;
      }
      .city-link:hover { border-color: #3b82f6; background: #eff6ff; }
    </style>
  `;
}

function generateRelatedIndustriesInCity(
  industries: typeof INDUSTRIES[string][],
  city: typeof COUNTRIES[string]['cities'][number],
  siteUrl: string
): string {
  const industryLinks = industries.slice(0, 4).map(ind => `
    <a href="${siteUrl}/${ind.slug}-voice-agent-in-${city.slug}" class="related-link">
      ${escapeHtml(ind.name)} in ${city.name}
    </a>
  `).join('');

  return `
    <section class="related-in-city">
      <div class="container">
        <h2>Other Industries in ${city.name}</h2>
        <div class="related-grid">
          ${industryLinks}
        </div>
      </div>
    </section>

    <style>
      .related-in-city { padding: 60px 0; }
      .related-in-city h2 { text-align: center; margin-bottom: 30px; }
      .related-grid { display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; }
      .related-link {
        padding: 12px 20px;
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        text-decoration: none;
        color: #1a1a2e;
        transition: all 0.2s;
      }
      .related-link:hover { border-color: #3b82f6; color: #3b82f6; }
    </style>
  `;
}
