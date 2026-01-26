/**
 * VoiceFleet SEO - Industry Page Handler
 * Renders landing pages for each industry vertical
 */

import { Context } from 'hono';
import { Bindings, GeneratedContent } from '../types';
import { INDUSTRIES, getIndustry, getRelatedIndustries } from '../data/industries';
import { getContent } from '../utils/claude';
import { generateIndustryPageSchemas } from '../utils/seo';
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
  generateRelatedIndustriesSection
} from '../utils/html';

export async function industryHandler(c: Context<{ Bindings: Bindings }>) {
  const industrySlug = c.req.param('industry');
  const industry = getIndustry(industrySlug);

  if (!industry) {
    return c.notFound();
  }

  const siteUrl = c.env.SITE_URL || 'https://voicefleet.ai';
  const appUrl = c.env.APP_URL || 'https://app.voicefleet.ai';

  // Try to get AI-generated content from cache
  const cacheKey = `content:industry:${industrySlug}`;
  const content = await getContent(c.env.CONTENT_CACHE, cacheKey);

  c.header('X-VoiceFleet-SEO', '1');
  c.header('X-VoiceFleet-SEO-Content', content ? 'ai' : 'fallback');
  c.header('X-VoiceFleet-SEO-Cache-Key', cacheKey);
  if (content?.generatedAt) {
    c.header('X-VoiceFleet-SEO-Generated-At', content.generatedAt);
  }

  // Generate page content
  const pageContent = content
    ? renderWithAIContent(industry, content, siteUrl, appUrl)
    : renderFallbackContent(industry, siteUrl, appUrl);

  // Generate schemas
  const schemas = generateIndustryPageSchemas(industry, content, siteUrl);

  // Build full HTML
  const html = generateBaseHtml({
    title: content?.title || `AI Voice Agent for ${industry.name} | VoiceFleet`,
    description: content?.metaDescription || industry.metaDescription,
    canonicalUrl: `${siteUrl}/industries/${industrySlug}`,
    content: pageContent,
    schemas,
    siteUrl
  });

  return c.html(html);
}

/**
 * Render page with AI-generated content
 */
function renderWithAIContent(
  industry: typeof INDUSTRIES[string],
  content: GeneratedContent,
  siteUrl: string,
  appUrl: string
): string {
  const relatedIndustries = getRelatedIndustries(industry.slug);

  const sections = [
    // Breadcrumbs
    generateBreadcrumbs([
      { name: 'Home', url: siteUrl },
      { name: 'Industries', url: `${siteUrl}/industries` },
      { name: industry.name, url: `${siteUrl}/industries/${industry.slug}` }
    ]),

    // Hero
    generateHeroSection({
      title: content.heroTitle,
      subtitle: content.heroSubtitle,
      ctaText: content.ctaText || 'Try VoiceFleet Free',
      ctaUrl: `${appUrl}/signup?industry=${industry.slug}`
    }),

    // Definition & Quick Answer (GEO)
    generateDefinitionSection({
      definition: content.definition,
      quickAnswer: content.quickAnswer
    }),

    generateIntroductionSection({
      introduction: content.introduction,
      generatedAt: content.generatedAt
    }),

    // Key Stats
    generateStatsSection(content.keyStats),

    // Benefits
    generateBenefitsSection(content.benefits),

    // How It Works
    generateHowItWorksSection(content.howItWorks),

    // Pain Points
    generatePainPointsSection(content.painPointsContent),

    // Use Cases
    generateUseCasesSection(content.useCasesContent),

    // Related Industries
    relatedIndustries.length > 0
      ? generateRelatedIndustriesSection(relatedIndustries, siteUrl)
      : '',

    // FAQ
    generateFAQSection(content.faqItems),

    // CTA
    generateCTASection({
      text: `Ready to automate your ${industry.name.toLowerCase()} phone calls?`,
      buttonText: content.ctaText || 'Start Free Trial',
      buttonUrl: `${appUrl}/signup?industry=${industry.slug}`
    })
  ];

  // Add trend insight if available
  if (content.trendInsight) {
    const trendSection = `
      <section class="trend-insight">
        <div class="container">
          <div class="trend-box">
            <span class="trend-label">📈 Industry Trend</span>
            <p>${content.trendInsight}</p>
          </div>
        </div>
      </section>
    `;
    // Insert after definition section
    sections.splice(3, 0, trendSection);
  }

  return sections.join('\n');
}

/**
 * Render fallback content when AI content not available
 */
function renderFallbackContent(
  industry: typeof INDUSTRIES[string],
  siteUrl: string,
  appUrl: string
): string {
  const relatedIndustries = getRelatedIndustries(industry.slug);

  const sections = [
    // Breadcrumbs
    generateBreadcrumbs([
      { name: 'Home', url: siteUrl },
      { name: 'Industries', url: `${siteUrl}/industries` },
      { name: industry.name, url: `${siteUrl}/industries/${industry.slug}` }
    ]),

    // Hero
    generateHeroSection({
      title: `AI Voice Agent for ${industry.name}`,
      subtitle: `Automate your ${industry.name.toLowerCase()} phone calls with VoiceFleet. Answer ${industry.automationRate}% of calls automatically, 24/7.`,
      ctaText: 'Try VoiceFleet Free',
      ctaUrl: `${appUrl}/signup?industry=${industry.slug}`
    }),

    // Definition
    generateDefinitionSection({
      definition: `An AI voice agent for ${industry.name.toLowerCase()} is an automated phone answering system that uses artificial intelligence to handle customer calls, schedule appointments, take orders, and answer questions - just like a human receptionist, but available 24/7.`,
      quickAnswer: `VoiceFleet helps ${industry.namePlural.toLowerCase()} automate up to ${industry.automationRate}% of their phone calls, saving ${industry.costSavingsPercent}% on staffing costs while providing instant, professional service to every caller.`
    }),

    // Stats
    generateStatsSection([
      { stat: `${industry.automationRate}%`, context: 'of calls automated' },
      { stat: `${industry.costSavingsPercent}%`, context: 'cost savings' },
      { stat: industry.avgResponseTime, context: 'response time' },
      { stat: `${Math.floor(industry.avgCallsPerMonth / 30)}/day`, context: 'avg calls handled' }
    ]),

    // Benefits
    generateBenefitsSection([
      '24/7 availability - never miss a call again',
      'Natural-sounding AI conversations',
      `Built specifically for ${industry.name.toLowerCase()}`,
      'Integrates with your existing tools'
    ]),

    // How It Works
    generateHowItWorksSection([
      'Connect your business phone number to VoiceFleet',
      `Train the AI on your ${industry.name.toLowerCase()} FAQs and services`,
      'Go live and let AI handle your calls 24/7'
    ]),

    // Pain Points
    generatePainPointsSection(
      industry.painPoints.slice(0, 3).map(pp => ({
        title: pp,
        description: `VoiceFleet solves this by providing instant, 24/7 AI-powered phone answering that never misses a call and always provides professional service.`
      }))
    ),

    // Use Cases
    generateUseCasesSection(
      industry.primaryUseCases.slice(0, 3).map(uc => ({
        title: `How does VoiceFleet handle ${uc.toLowerCase()}?`,
        description: `Our AI voice agent is specifically trained for ${industry.name.toLowerCase()} ${uc.toLowerCase()}. It understands industry terminology and can handle common requests automatically.`
      }))
    ),

    // Related Industries
    relatedIndustries.length > 0
      ? generateRelatedIndustriesSection(relatedIndustries, siteUrl)
      : '',

    // FAQ
    generateFAQSection([
      {
        question: `How much does VoiceFleet cost for ${industry.name.toLowerCase()}?`,
        answer: `VoiceFleet starts at $49/month for small ${industry.name.toLowerCase()} businesses. Pricing scales based on call volume and features needed. All plans include a free trial.`
      },
      {
        question: `Can VoiceFleet integrate with my ${industry.name.toLowerCase()} software?`,
        answer: `Yes, VoiceFleet integrates with popular ${industry.name.toLowerCase()} tools including CRMs, calendars, and point-of-sale systems. We also offer custom integrations.`
      },
      {
        question: 'How natural does the AI voice sound?',
        answer: 'VoiceFleet uses advanced voice synthesis that sounds natural and professional. Most callers cannot tell they are speaking with an AI.'
      },
      {
        question: 'What happens if the AI cannot handle a call?',
        answer: 'VoiceFleet seamlessly transfers complex calls to your team. You can set up escalation rules based on caller needs or keywords.'
      },
      {
        question: 'How long does setup take?',
        answer: `Most ${industry.name.toLowerCase()} businesses go live within 15 minutes. Our AI learns from your FAQs and can be customized to match your brand voice.`
      }
    ]),

    // CTA
    generateCTASection({
      text: `Ready to automate your ${industry.name.toLowerCase()} phone calls?`,
      buttonText: 'Start Free Trial',
      buttonUrl: `${appUrl}/signup?industry=${industry.slug}`
    })
  ];

  return sections.join('\n');
}
