/**
 * VoiceFleet SEO - Location Page Handler
 * Renders landing pages for each city/location
 */

import { Context } from 'hono';
import { Bindings, GeneratedContent } from '../types';
import { getCity, getCountry, COUNTRIES } from '../data/locations';
import { INDUSTRIES } from '../data/industries';
import { getContent } from '../utils/claude';
import {
  generateBaseHtml,
  generateHeroSection,
  generateStatsSection,
  generateDefinitionSection,
  generateIntroductionSection,
  generateBenefitsSection,
  generateHowItWorksSection,
  generateFAQSection,
  generateCTASection,
  generateBreadcrumbs,
  escapeHtml
} from '../utils/html';
import {
  generateOrganizationSchema,
  generateLocalBusinessSchema,
  generateBreadcrumbSchema,
  generateFAQSchema
} from '../utils/seo';

export async function locationHandler(c: Context<{ Bindings: Bindings }>) {
  const countrySlug = c.req.param('country');
  const citySlug = c.req.param('city');

  const country = getCountry(countrySlug);
  const city = getCity(countrySlug, citySlug);

  if (!country || !city) {
    return c.notFound();
  }

  const siteUrl = c.env.SITE_URL || 'https://voicefleet.ai';
  const appUrl = c.env.APP_URL || 'https://app.voicefleet.ai';

  // Try to get AI-generated content from cache
  const cacheKey = `content:location:${citySlug}`;
  const content = await getContent(c.env.CONTENT_CACHE, cacheKey);

  c.header('X-VoiceFleet-SEO', '1');
  c.header('X-VoiceFleet-SEO-Content', content ? 'ai' : 'fallback');
  c.header('X-VoiceFleet-SEO-Cache-Key', cacheKey);
  if (content?.generatedAt) {
    c.header('X-VoiceFleet-SEO-Generated-At', content.generatedAt);
  }

  // Generate page content
  const pageContent = content
    ? renderWithAIContent(city, country, content, siteUrl, appUrl)
    : renderFallbackContent(city, country, siteUrl, appUrl);

  // Generate schemas
  const schemas = [
    JSON.stringify(generateOrganizationSchema()),
    JSON.stringify(generateLocalBusinessSchema({
      name: `VoiceFleet AI Voice Agents in ${city.name}`,
      description: `AI voice agents for businesses in ${city.name}, ${country.name}. Automate your phone calls 24/7.`,
      city,
      country
    })),
    JSON.stringify(generateBreadcrumbSchema([
      { name: 'Home', url: siteUrl },
      { name: 'Locations', url: `${siteUrl}/locations` },
      { name: country.name, url: `${siteUrl}/locations/${countrySlug}` },
      { name: city.name, url: `${siteUrl}/locations/${countrySlug}/${citySlug}` }
    ]))
  ];

  if (content?.faqItems) {
    schemas.push(JSON.stringify(generateFAQSchema(content.faqItems)));
  }

  const html = generateBaseHtml({
    title: content?.title || `AI Voice Agent in ${city.name}, ${country.name} | VoiceFleet`,
    description: content?.metaDescription || `VoiceFleet provides AI voice agents for businesses in ${city.name}. Get a local ${country.phoneFormat} phone number and automate your calls 24/7.`,
    canonicalUrl: `${siteUrl}/locations/${countrySlug}/${citySlug}`,
    content: pageContent,
    schemas,
    siteUrl
  });

  return c.html(html);
}

function renderWithAIContent(
  city: typeof COUNTRIES[string]['cities'][number],
  country: typeof COUNTRIES[string],
  content: GeneratedContent,
  siteUrl: string,
  appUrl: string
): string {
  const sections = [
    generateBreadcrumbs([
      { name: 'Home', url: siteUrl },
      { name: 'Locations', url: `${siteUrl}/locations` },
      { name: country.name, url: `${siteUrl}/locations/${country.slug}` },
      { name: city.name, url: `${siteUrl}/locations/${country.slug}/${city.slug}` }
    ]),

    generateHeroSection({
      title: content.heroTitle,
      subtitle: content.heroSubtitle,
      ctaText: content.ctaText || 'Try VoiceFleet Free',
      ctaUrl: `${appUrl}/signup?location=${city.slug}`
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

    // Popular industries in this location
    generatePopularIndustriesSection(city, siteUrl),

    generateFAQSection(content.faqItems),

    generateCTASection({
      text: `Ready to automate your phone calls in ${city.name}?`,
      buttonText: content.ctaText || 'Start Free Trial',
      buttonUrl: `${appUrl}/signup?location=${city.slug}`
    })
  ];

  return sections.join('\n');
}

function renderFallbackContent(
  city: typeof COUNTRIES[string]['cities'][number],
  country: typeof COUNTRIES[string],
  siteUrl: string,
  appUrl: string
): string {
  const sections = [
    generateBreadcrumbs([
      { name: 'Home', url: siteUrl },
      { name: 'Locations', url: `${siteUrl}/locations` },
      { name: country.name, url: `${siteUrl}/locations/${country.slug}` },
      { name: city.name, url: `${siteUrl}/locations/${country.slug}/${city.slug}` }
    ]),

    generateHeroSection({
      title: `AI Voice Agent in ${city.name}`,
      subtitle: `Automate your business phone calls in ${city.name}, ${country.name}. Get a local ${country.phoneFormat} number and 24/7 AI phone answering.`,
      ctaText: 'Try VoiceFleet Free',
      ctaUrl: `${appUrl}/signup?location=${city.slug}`
    }),

    generateDefinitionSection({
      definition: `VoiceFleet in ${city.name} provides local businesses with AI-powered phone answering that sounds natural, works 24/7, and integrates with your existing tools.`,
      quickAnswer: `Whether you run a restaurant, dental clinic, plumbing service, or law firm in ${city.name} - VoiceFleet can automate your phone calls, saving you time and money while never missing a customer.`
    }),

    generateStatsSection([
      { stat: '85%', context: 'of calls automated' },
      { stat: '60%', context: 'cost savings vs staff' },
      { stat: '<1s', context: 'response time' },
      { stat: country.phoneFormat, context: 'local numbers' }
    ]),

    generateBenefitsSection([
      `Local ${country.phoneFormat} phone numbers in ${city.name}`,
      '24/7 availability - never miss a call',
      'Natural-sounding AI voice conversations',
      `Perfect for ${city.name} businesses`
    ]),

    generateHowItWorksSection([
      `Get a local ${city.name} phone number`,
      'Connect your existing number or use a new one',
      'Train the AI on your business and go live in minutes'
    ]),

    generatePopularIndustriesSection(city, siteUrl),

    generateFAQSection([
      {
        question: `Can I get a local phone number in ${city.name}?`,
        answer: `Yes, VoiceFleet provides local ${country.phoneFormat} phone numbers in ${city.name}. You can use a new number or forward your existing number to VoiceFleet.`
      },
      {
        question: `How does VoiceFleet work in ${country.name}?`,
        answer: `VoiceFleet works seamlessly in ${country.name}. Our AI voice agents handle calls in local accents and understand regional terminology.`
      },
      {
        question: `What businesses in ${city.name} use VoiceFleet?`,
        answer: `Restaurants, dental clinics, plumbers, electricians, law firms, salons, and many other ${city.name} businesses use VoiceFleet to automate their phone calls.`
      },
      {
        question: 'How much does VoiceFleet cost?',
        answer: `VoiceFleet starts at ${country.currency === 'EUR' ? '€49' : country.currency === 'GBP' ? '£49' : '$49'}/month. Pricing scales based on call volume. All plans include a free trial.`
      },
      {
        question: 'How long does setup take?',
        answer: `Most businesses in ${city.name} go live within 15 minutes. Our AI learns from your FAQs and can be customized to match your brand.`
      }
    ]),

    generateCTASection({
      text: `Ready to automate your phone calls in ${city.name}?`,
      buttonText: 'Start Free Trial',
      buttonUrl: `${appUrl}/signup?location=${city.slug}`
    })
  ];

  return sections.join('\n');
}

function generatePopularIndustriesSection(
  city: typeof COUNTRIES[string]['cities'][number],
  siteUrl: string
): string {
  // Get top industries that mention this city in their top locations
  const popularIndustries = Object.values(INDUSTRIES)
    .filter(ind => ind.topLocations.includes(city.slug))
    .slice(0, 6);

  if (popularIndustries.length === 0) {
    // Fallback to first 6 industries
    popularIndustries.push(...Object.values(INDUSTRIES).slice(0, 6));
  }

  const industryLinks = popularIndustries.map(ind => `
    <a href="${siteUrl}/${ind.slug}-voice-agent-in-${city.slug}" class="industry-link">
      ${escapeHtml(ind.name)} in ${city.name}
    </a>
  `).join('');

  return `
    <section class="popular-industries">
      <div class="container">
        <h2>Popular Industries in ${city.name}</h2>
        <div class="industries-grid">
          ${industryLinks}
        </div>
      </div>
    </section>

    <style>
      .popular-industries { padding: 60px 0; background: #f8fafc; }
      .popular-industries h2 { text-align: center; margin-bottom: 30px; }
      .industries-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; max-width: 800px; margin: 0 auto; }
      .industry-link {
        display: block;
        padding: 15px 20px;
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        text-decoration: none;
        color: #3b82f6;
        text-align: center;
        transition: all 0.2s;
      }
      .industry-link:hover { border-color: #3b82f6; background: #eff6ff; }
    </style>
  `;
}
