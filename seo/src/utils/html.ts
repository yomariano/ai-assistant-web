/**
 * VoiceFleet SEO - HTML Template Utilities
 */

import { Industry, City, Country, GeneratedContent } from '../types';
import { formatNumber } from './seo';

/**
 * Base HTML template with VoiceFleet branding
 */
export function generateBaseHtml(options: {
  title: string;
  description: string;
  canonicalUrl: string;
  content: string;
  schemas?: string[];
  siteUrl: string;
}): string {
  const schemaScripts = options.schemas?.map(s =>
    `<script type="application/ld+json">${s}</script>`
  ).join('\n    ') || '';

  const ogImageUrl = `${options.siteUrl}/logo-mark.png`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(options.title)}</title>
  <meta name="description" content="${escapeHtml(options.description)}">
  <meta name="robots" content="index, follow">
  <meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1">
  <link rel="canonical" href="${options.canonicalUrl}">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(options.title)}">
  <meta property="og:description" content="${escapeHtml(options.description)}">
  <meta property="og:url" content="${options.canonicalUrl}">
  <meta property="og:site_name" content="VoiceFleet">
  <meta property="og:locale" content="en_US">
  <meta property="og:image" content="${ogImageUrl}">
  <meta property="og:image:alt" content="VoiceFleet">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@voicefleetai">
  <meta name="twitter:creator" content="@voicefleetai">
  <meta name="twitter:title" content="${escapeHtml(options.title)}">
  <meta name="twitter:description" content="${escapeHtml(options.description)}">
  <meta name="twitter:image" content="${ogImageUrl}">
  <meta name="twitter:image:alt" content="VoiceFleet">

  <!-- Favicon -->
  <link rel="icon" href="${options.siteUrl}/favicon.ico">

  <!-- Structured Data -->
  ${schemaScripts}

  <style>
    ${getBaseStyles()}
  </style>
</head>
<body>
  ${generateHeader(options.siteUrl)}
  <main>
    ${options.content}
  </main>
  ${generateFooter(options.siteUrl)}
</body>
</html>`;
}

/**
 * Generate page header
 */
function generateHeader(siteUrl: string): string {
  return `
  <header class="header">
    <div class="container">
      <a href="${siteUrl}" class="logo">
        <span class="logo-icon">📞</span>
        <span class="logo-text">VoiceFleet</span>
      </a>
      <nav class="nav">
        <a href="${siteUrl}/industries">Industries</a>
        <a href="${siteUrl}/locations">Locations</a>
        <a href="${siteUrl}/#pricing">Pricing</a>
        <a href="${siteUrl}/#demo" class="btn btn-primary">Get Demo</a>
      </nav>
    </div>
  </header>`;
}

/**
 * Generate page footer
 */
function generateFooter(siteUrl: string): string {
  return `
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <span class="logo-icon">📞</span>
          <span class="logo-text">VoiceFleet</span>
          <p>AI voice agents that answer your business calls 24/7.</p>
        </div>
        <div class="footer-links">
          <h4>Industries</h4>
          <a href="${siteUrl}/industries/restaurants">Restaurants</a>
          <a href="${siteUrl}/industries/dental-clinics">Dental Clinics</a>
          <a href="${siteUrl}/industries/plumbers">Plumbers</a>
          <a href="${siteUrl}/industries/law-firms">Law Firms</a>
        </div>
        <div class="footer-links">
          <h4>Company</h4>
          <a href="${siteUrl}/#about">About</a>
          <a href="${siteUrl}/#pricing">Pricing</a>
          <a href="${siteUrl}/#contact">Contact</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} VoiceFleet. All rights reserved.</p>
      </div>
    </div>
  </footer>`;
}

/**
 * Generate hero section
 */
export function generateHeroSection(options: {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
}): string {
  return `
  <section class="hero">
    <div class="container">
      <h1 class="hero-title">${escapeHtml(options.title)}</h1>
      <p class="hero-subtitle">${escapeHtml(options.subtitle)}</p>
      <a href="${options.ctaUrl}" class="btn btn-primary btn-lg">${escapeHtml(options.ctaText)}</a>
    </div>
  </section>`;
}

/**
 * Generate stats section
 */
export function generateStatsSection(stats: Array<{ stat: string; context: string }>): string {
  const statItems = stats.map(s => `
    <div class="stat-item">
      <div class="stat-value">${escapeHtml(s.stat)}</div>
      <div class="stat-label">${escapeHtml(s.context)}</div>
    </div>
  `).join('');

  return `
  <section class="stats">
    <div class="container">
      <div class="stats-grid">
        ${statItems}
      </div>
    </div>
  </section>`;
}

/**
 * Generate definition/quick answer section (for GEO)
 */
export function generateDefinitionSection(options: {
  definition: string;
  quickAnswer: string;
}): string {
  return `
  <section class="definition">
    <div class="container">
      <div class="definition-box">
        <p class="definition-text">${escapeHtml(options.definition)}</p>
      </div>
      <div class="quick-answer">
        <p>${escapeHtml(options.quickAnswer)}</p>
      </div>
    </div>
  </section>`;
}

/**
 * Generate introduction section (for E-E-A-T / information gain)
 */
export function generateIntroductionSection(options: {
  introduction: string;
  generatedAt?: string;
}): string {
  const formatted = options.generatedAt ? formatHumanDate(options.generatedAt) : null;
  const lastUpdated = formatted && options.generatedAt
    ? `<p class="last-updated">Last updated <time datetime="${escapeHtml(options.generatedAt)}">${escapeHtml(formatted)}</time></p>`
    : '';

  return `
  <section class="introduction">
    <div class="container">
      <div class="intro-box">
        ${lastUpdated}
        <p>${escapeHtml(options.introduction)}</p>
      </div>
    </div>
  </section>`;
}

/**
 * Generate benefits section
 */
export function generateBenefitsSection(benefits: string[]): string {
  const benefitItems = benefits.map((b, i) => `
    <div class="benefit-card">
      <div class="benefit-icon">${getBenefitIcon(i)}</div>
      <p class="benefit-text">${escapeHtml(b)}</p>
    </div>
  `).join('');

  return `
  <section class="benefits">
    <div class="container">
      <h2>Why VoiceFleet?</h2>
      <div class="benefits-grid">
        ${benefitItems}
      </div>
    </div>
  </section>`;
}

/**
 * Generate how it works section
 */
export function generateHowItWorksSection(steps: string[]): string {
  const stepItems = steps.map((s, i) => `
    <div class="step">
      <div class="step-number">${i + 1}</div>
      <p class="step-text">${escapeHtml(s)}</p>
    </div>
  `).join('');

  return `
  <section class="how-it-works">
    <div class="container">
      <h2>How It Works</h2>
      <div class="steps">
        ${stepItems}
      </div>
    </div>
  </section>`;
}

/**
 * Generate pain points section
 */
export function generatePainPointsSection(painPoints: Array<{ title: string; description: string }>): string {
  const items = painPoints.map(p => `
    <div class="pain-point">
      <h3>${escapeHtml(p.title)}</h3>
      <p>${escapeHtml(p.description)}</p>
    </div>
  `).join('');

  return `
  <section class="pain-points">
    <div class="container">
      <h2>Common Challenges We Solve</h2>
      <div class="pain-points-grid">
        ${items}
      </div>
    </div>
  </section>`;
}

/**
 * Generate use cases section
 */
export function generateUseCasesSection(useCases: Array<{ title: string; description: string }>): string {
  const items = useCases.map(u => `
    <div class="use-case">
      <h3>${escapeHtml(u.title)}</h3>
      <p>${escapeHtml(u.description)}</p>
    </div>
  `).join('');

  return `
  <section class="use-cases">
    <div class="container">
      <h2>Use Cases</h2>
      <div class="use-cases-grid">
        ${items}
      </div>
    </div>
  </section>`;
}

/**
 * Generate FAQ section
 */
export function generateFAQSection(faqs: Array<{ question: string; answer: string }>): string {
  const items = faqs.map(f => `
    <details class="faq-item">
      <summary>${escapeHtml(f.question)}</summary>
      <p>${escapeHtml(f.answer)}</p>
    </details>
  `).join('');

  return `
  <section class="faq">
    <div class="container">
      <h2>Frequently Asked Questions</h2>
      <div class="faq-list">
        ${items}
      </div>
    </div>
  </section>`;
}

/**
 * Generate CTA section
 */
export function generateCTASection(options: {
  text: string;
  buttonText: string;
  buttonUrl: string;
}): string {
  return `
  <section class="cta">
    <div class="container">
      <h2>${escapeHtml(options.text)}</h2>
      <a href="${options.buttonUrl}" class="btn btn-primary btn-lg">${escapeHtml(options.buttonText)}</a>
    </div>
  </section>`;
}

/**
 * Generate breadcrumbs
 */
export function generateBreadcrumbs(items: Array<{ name: string; url: string }>): string {
  const crumbs = items.map((item, i) => {
    const isLast = i === items.length - 1;
    if (isLast) {
      return `<span class="breadcrumb-current">${escapeHtml(item.name)}</span>`;
    }
    return `<a href="${item.url}" class="breadcrumb-link">${escapeHtml(item.name)}</a>`;
  }).join(' <span class="breadcrumb-sep">/</span> ');

  return `
  <nav class="breadcrumbs">
    <div class="container">
      ${crumbs}
    </div>
  </nav>`;
}

/**
 * Generate related industries section
 */
export function generateRelatedIndustriesSection(industries: Industry[], siteUrl: string): string {
  const items = industries.slice(0, 4).map(ind => `
    <a href="${siteUrl}/industries/${ind.slug}" class="related-industry">
      <span class="related-icon">${getIndustryIcon(ind.icon)}</span>
      <span class="related-name">${escapeHtml(ind.name)}</span>
    </a>
  `).join('');

  return `
  <section class="related-industries">
    <div class="container">
      <h2>Related Industries</h2>
      <div class="related-grid">
        ${items}
      </div>
    </div>
  </section>`;
}

/**
 * Utility: Escape HTML
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Get benefit icon by index
 */
function getBenefitIcon(index: number): string {
  const icons = ['🕐', '🗣️', '🔗', '⚡'];
  return icons[index % icons.length];
}

/**
 * Get industry icon emoji
 */
function getIndustryIcon(icon: string): string {
  const iconMap: Record<string, string> = {
    'utensils': '🍽️',
    'tooth': '🦷',
    'stethoscope': '🩺',
    'wrench': '🔧',
    'bolt': '⚡',
    'thermometer': '🌡️',
    'scale': '⚖️',
    'calculator': '🧮',
    'car': '🚗',
    'scissors': '✂️',
    'flower': '🌸',
    'home': '🏠',
    'building': '🏢',
    'bed': '🛏️',
    'dumbbell': '🏋️',
    'shield': '🛡️'
  };
  return iconMap[icon] || '📞';
}

/**
 * Base CSS styles
 */
function getBaseStyles(): string {
  return `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a2e; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

    /* Header */
    .header { background: #fff; border-bottom: 1px solid #eee; padding: 15px 0; position: sticky; top: 0; z-index: 100; }
    .header .container { display: flex; justify-content: space-between; align-items: center; }
    .logo { display: flex; align-items: center; gap: 8px; text-decoration: none; font-weight: 700; font-size: 1.25rem; color: #1a1a2e; }
    .logo-icon { font-size: 1.5rem; }
    .nav { display: flex; gap: 20px; align-items: center; }
    .nav a { text-decoration: none; color: #666; }
    .nav a:hover { color: #3b82f6; }

    /* Buttons */
    .btn { display: inline-block; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; transition: all 0.2s; }
    .btn-primary { background: #3b82f6; color: #fff; }
    .btn-primary:hover { background: #2563eb; }
    .btn-lg { padding: 14px 28px; font-size: 1.1rem; }

    /* Hero */
    .hero { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: #fff; padding: 80px 0; text-align: center; }
    .hero-title { font-size: 2.5rem; margin-bottom: 20px; }
    .hero-subtitle { font-size: 1.25rem; opacity: 0.9; margin-bottom: 30px; max-width: 600px; margin-left: auto; margin-right: auto; }

    /* Stats */
    .stats { background: #f8fafc; padding: 60px 0; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 30px; text-align: center; }
    .stat-value { font-size: 2.5rem; font-weight: 700; color: #3b82f6; }
    .stat-label { color: #666; }

    /* Definition */
    .definition { padding: 60px 0; }
    .definition-box { background: #e0f2fe; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .quick-answer { font-size: 1.1rem; color: #374151; }

    /* Introduction */
    .introduction { padding: 10px 0 60px; }
    .intro-box { max-width: 800px; margin: 0 auto; font-size: 1.05rem; color: #374151; }
    .last-updated { font-size: 0.9rem; color: #6b7280; margin-bottom: 10px; }

    /* Benefits */
    .benefits { padding: 60px 0; }
    .benefits h2 { text-align: center; margin-bottom: 40px; }
    .benefits-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; }
    .benefit-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 30px; text-align: center; }
    .benefit-icon { font-size: 2rem; margin-bottom: 15px; }

    /* How It Works */
    .how-it-works { background: #f8fafc; padding: 60px 0; }
    .how-it-works h2 { text-align: center; margin-bottom: 40px; }
    .steps { display: flex; flex-direction: column; gap: 20px; max-width: 600px; margin: 0 auto; }
    .step { display: flex; gap: 20px; align-items: flex-start; }
    .step-number { background: #3b82f6; color: #fff; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }

    /* Pain Points */
    .pain-points { padding: 60px 0; }
    .pain-points h2 { text-align: center; margin-bottom: 40px; }
    .pain-points-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
    .pain-point { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 30px; }
    .pain-point h3 { color: #3b82f6; margin-bottom: 10px; }

    /* Use Cases */
    .use-cases { background: #f8fafc; padding: 60px 0; }
    .use-cases h2 { text-align: center; margin-bottom: 40px; }
    .use-cases-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
    .use-case { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 30px; }
    .use-case h3 { margin-bottom: 10px; }

    /* FAQ */
    .faq { padding: 60px 0; }
    .faq h2 { text-align: center; margin-bottom: 40px; }
    .faq-list { max-width: 800px; margin: 0 auto; }
    .faq-item { border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 10px; }
    .faq-item summary { padding: 20px; cursor: pointer; font-weight: 600; }
    .faq-item p { padding: 0 20px 20px; color: #666; }

    /* CTA */
    .cta { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: #fff; padding: 80px 0; text-align: center; }
    .cta h2 { margin-bottom: 30px; font-size: 2rem; }
    .cta .btn-primary { background: #fff; color: #3b82f6; }

    /* Breadcrumbs */
    .breadcrumbs { background: #f8fafc; padding: 15px 0; font-size: 0.9rem; }
    .breadcrumb-link { color: #3b82f6; text-decoration: none; }
    .breadcrumb-sep { color: #9ca3af; margin: 0 8px; }
    .breadcrumb-current { color: #6b7280; }

    /* Related Industries */
    .related-industries { background: #f8fafc; padding: 60px 0; }
    .related-industries h2 { text-align: center; margin-bottom: 40px; }
    .related-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
    .related-industry { display: flex; align-items: center; gap: 10px; padding: 20px; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; text-decoration: none; color: #1a1a2e; transition: all 0.2s; }
    .related-industry:hover { border-color: #3b82f6; }
    .related-icon { font-size: 1.5rem; }

    /* Footer */
    .footer { background: #1a1a2e; color: #fff; padding: 60px 0 30px; }
    .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 40px; margin-bottom: 40px; }
    .footer-brand p { opacity: 0.7; margin-top: 10px; }
    .footer-links h4 { margin-bottom: 15px; }
    .footer-links a { display: block; color: #9ca3af; text-decoration: none; margin-bottom: 8px; }
    .footer-links a:hover { color: #fff; }
    .footer-bottom { border-top: 1px solid #374151; padding-top: 20px; text-align: center; opacity: 0.7; }

    @media (max-width: 768px) {
      .hero-title { font-size: 1.75rem; }
      .footer-grid { grid-template-columns: 1fr; }
      .nav { display: none; }
    }
  `;
}

function formatHumanDate(iso: string): string | null {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  try {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return iso.split('T')[0] || null;
  }
}
