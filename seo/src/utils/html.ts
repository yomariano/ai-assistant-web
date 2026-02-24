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
  lang?: string;
}): string {
  const schemaScripts = options.schemas?.map(s =>
    `<script type="application/ld+json">${s}</script>`
  ).join('\n    ') || '';

  const ogImageUrl = `${options.siteUrl}/logo-mark.png`;

  return `<!DOCTYPE html>
<html lang="${options.lang || 'en'}">
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
  <meta name="theme-color" content="#1f3fc4">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap"
    rel="stylesheet"
  >

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
        <span class="logo-mark" aria-hidden="true">
          <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M166 172L256 318L346 172" stroke="white" stroke-width="52" stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="256" cy="356" r="14" fill="white" fill-opacity="0.9" />
          </svg>
        </span>
        <span class="logo-label">
          <span class="logo-text">VoiceFleet</span>
          <span class="logo-region">
            <span class="logo-region-dot" aria-hidden="true"></span>
            Ireland
          </span>
        </span>
      </a>
      <nav class="nav">
        <a href="${siteUrl}/features">Features</a>
        <a href="${siteUrl}/for">Industries</a>
        <a href="${siteUrl}/connect">Integrations</a>
        <a href="${siteUrl}/compare">Compare</a>
        <a href="${siteUrl}/blog">Blog</a>
        <a href="${siteUrl}/pricing">Pricing</a>
      </nav>
      <div class="header-cta">
        <a href="tel:+35312345678" class="header-phone">+353 1 234 5678</a>
        <a href="https://calendly.com/voicefleet" class="btn btn-primary" target="_blank" rel="noopener noreferrer">Book a Demo</a>
      </div>
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
          <a href="${siteUrl}" class="footer-brand-head">
            <span class="logo-mark" aria-hidden="true">
              <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M166 172L256 318L346 172" stroke="white" stroke-width="52" stroke-linecap="round" stroke-linejoin="round" />
                <circle cx="256" cy="356" r="14" fill="white" fill-opacity="0.9" />
              </svg>
            </span>
            <span class="logo-text">VoiceFleet</span>
          </a>
          <p>AI voice receptionist for small businesses. Answer calls, take messages, and book appointments.</p>
        </div>
        <div class="footer-links">
          <h4>Product</h4>
          <a href="${siteUrl}/features">Features</a>
          <a href="${siteUrl}/for">Industries</a>
          <a href="${siteUrl}/connect">Integrations</a>
          <a href="${siteUrl}/compare">Compare</a>
          <a href="${siteUrl}/pricing">Pricing</a>
        </div>
        <div class="footer-links">
          <h4>Company</h4>
          <a href="${siteUrl}/blog">Blog</a>
          <a href="${siteUrl}/locations">Locations</a>
          <a href="${siteUrl}/privacy">Privacy</a>
          <a href="${siteUrl}/terms">Terms</a>
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
  const icons = ['&#128336;', '&#128483;', '&#128279;', '&#9889;'];
  return icons[index % icons.length];
}

/**
 * Get industry icon emoji
 */
function getIndustryIcon(icon: string): string {
  const iconMap: Record<string, string> = {
    'utensils': '&#127869;',
    'tooth': '&#129463;',
    'stethoscope': '&#129658;',
    'wrench': '&#128295;',
    'bolt': '&#9889;',
    'thermometer': '&#127777;',
    'scale': '&#9878;',
    'calculator': '&#129518;',
    'car': '&#128663;',
    'scissors': '&#9986;',
    'flower': '&#127800;',
    'home': '&#127968;',
    'building': '&#127970;',
    'bed': '&#128719;',
    'dumbbell': '&#127947;',
    'shield': '&#128737;'
  };
  return iconMap[icon] || '&#128222;';
}

/**
 * Base CSS styles
 */
function getBaseStyles(): string {
  return `
    :root {
      --background: #f8fafc;
      --foreground: #0f172a;
      --card: #ffffff;
      --muted: #eef2f7;
      --muted-foreground: #5f6b82;
      --primary: #1f3fc4;
      --primary-hover: #1735a3;
      --accent: #0f8a5f;
      --border: #dce4f1;
      --radius: 14px;
      --shadow-sm: 0 1px 2px rgba(31, 63, 196, 0.05);
      --shadow-md: 0 8px 20px rgba(31, 63, 196, 0.12);
      --shadow-lg: 0 16px 36px rgba(31, 63, 196, 0.14);
      --gradient-subtle: linear-gradient(180deg, #f8fafc 0%, #eef3ff 100%);
      --gradient-dark: linear-gradient(135deg, #0f172a 0%, #1b2a4a 100%);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: var(--foreground);
      background: var(--background);
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
    }
    main { min-height: calc(100vh - 280px); padding-top: 78px; }
    .container { width: 100%; max-width: 1180px; margin: 0 auto; padding: 0 20px; }
    h1, h2, h3, h4, h5, h6 { font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; line-height: 1.15; letter-spacing: -0.01em; }
    p { color: var(--muted-foreground); }
    a { transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease; }

    /* Header */
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      background: rgba(255, 255, 255, 0.84);
      border-bottom: 1px solid var(--border);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
    }
    .header .container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 78px;
      gap: 16px;
    }
    .logo {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: var(--foreground);
      min-width: 0;
    }
    .logo-mark {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1f3fc4 0%, #14a36f 100%);
      box-shadow: var(--shadow-md);
      flex-shrink: 0;
    }
    .logo-mark svg {
      width: 23px;
      height: 23px;
      display: block;
    }
    .logo-label {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }
    .logo-text {
      font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
      font-size: 1.22rem;
      font-weight: 800;
      color: var(--foreground);
      white-space: nowrap;
    }
    .logo-region {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 999px;
      border: 1px solid #ccefdc;
      background: #ebfbf3;
      color: #0e8b5f;
      font-size: 0.66rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      white-space: nowrap;
    }
    .logo-region-dot {
      width: 6px;
      height: 6px;
      border-radius: 999px;
      background: #0e8b5f;
      flex-shrink: 0;
    }
    .nav {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-left: auto;
      margin-right: 8px;
    }
    .nav a {
      font-size: 0.92rem;
      font-weight: 600;
      text-decoration: none;
      color: var(--muted-foreground);
      white-space: nowrap;
    }
    .nav a:hover { color: var(--foreground); }
    .header-cta {
      display: flex;
      align-items: center;
      gap: 14px;
      flex-shrink: 0;
    }
    .header-phone {
      text-decoration: none;
      color: var(--muted-foreground);
      font-size: 0.92rem;
      font-weight: 600;
      white-space: nowrap;
    }
    .header-phone:hover { color: var(--foreground); }

    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      text-decoration: none;
      font-weight: 700;
      border-radius: 12px;
      border: 1px solid transparent;
      padding: 10px 18px;
      line-height: 1.1;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-primary {
      background: var(--primary);
      color: #ffffff;
      box-shadow: var(--shadow-sm);
    }
    .btn-primary:hover {
      background: var(--primary-hover);
      box-shadow: var(--shadow-md);
      transform: translateY(-1px);
    }
    .btn-primary:active { transform: translateY(0); }
    .btn-lg { padding: 14px 24px; border-radius: 14px; font-size: 1rem; }

    /* Hero */
    .hero {
      position: relative;
      overflow: hidden;
      background: var(--gradient-subtle);
      padding: 72px 0 56px;
      text-align: center;
      border-bottom: 1px solid var(--border);
    }
    .hero::before {
      content: '';
      position: absolute;
      width: 560px;
      height: 560px;
      border-radius: 999px;
      right: -180px;
      top: -260px;
      background: radial-gradient(circle, rgba(31, 63, 196, 0.18) 0%, rgba(31, 63, 196, 0) 65%);
      pointer-events: none;
    }
    .hero > .container { position: relative; z-index: 1; }
    .hero h1,
    .hero-title {
      font-size: clamp(2.1rem, 4vw, 3.4rem);
      margin-bottom: 16px;
      color: var(--foreground);
    }
    .hero p,
    .hero-subtitle {
      margin: 0 auto;
      max-width: 780px;
      color: var(--muted-foreground);
      font-size: clamp(1rem, 1.7vw, 1.18rem);
      line-height: 1.65;
    }
    .hero .btn { margin-top: 28px; }

    /* Stats */
    .stats { padding: 56px 0; background: transparent; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 16px; }
    .stat-item {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 20px 16px;
      text-align: center;
      box-shadow: var(--shadow-sm);
    }
    .stat-value { font-size: 2rem; font-weight: 800; color: var(--primary); line-height: 1.1; }
    .stat-label { margin-top: 8px; color: var(--muted-foreground); font-size: 0.95rem; }

    /* Definition */
    .definition { padding: 56px 0 16px; }
    .definition-box {
      background: #edf4ff;
      border: 1px solid #c7d8ff;
      border-radius: 14px;
      padding: 22px;
      margin-bottom: 16px;
    }
    .definition-text { color: #1e3a8a; font-weight: 600; }
    .quick-answer { font-size: 1.06rem; color: var(--muted-foreground); max-width: 860px; }

    /* Introduction */
    .introduction { padding: 0 0 56px; }
    .intro-box {
      max-width: 860px;
      margin: 0 auto;
      font-size: 1.03rem;
      color: var(--muted-foreground);
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 24px;
    }
    .last-updated {
      display: inline-flex;
      margin-bottom: 10px;
      font-size: 0.82rem;
      color: #3b82f6;
      font-weight: 600;
      letter-spacing: 0.03em;
      text-transform: uppercase;
    }

    /* Shared section spacing */
    .benefits,
    .how-it-works,
    .pain-points,
    .use-cases,
    .faq,
    .related-industries { padding: 56px 0; }
    .benefits h2,
    .how-it-works h2,
    .pain-points h2,
    .use-cases h2,
    .faq h2,
    .related-industries h2 {
      text-align: center;
      margin-bottom: 34px;
      font-size: clamp(1.6rem, 2.5vw, 2.25rem);
      color: var(--foreground);
    }

    /* Benefits */
    .benefits-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 16px; }
    .benefit-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 24px;
      text-align: center;
      box-shadow: var(--shadow-sm);
    }
    .benefit-icon { font-size: 1.9rem; margin-bottom: 12px; }
    .benefit-text { color: var(--muted-foreground); }

    /* How It Works */
    .how-it-works { background: rgba(238, 243, 255, 0.62); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
    .steps { display: flex; flex-direction: column; gap: 16px; max-width: 680px; margin: 0 auto; }
    .step {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 16px;
    }
    .step-number {
      width: 36px;
      height: 36px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--primary);
      color: #fff;
      font-weight: 800;
      flex-shrink: 0;
    }
    .step-text { color: var(--muted-foreground); }

    /* Pain Points / Use Cases */
    .pain-points-grid,
    .use-cases-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
    .pain-point,
    .use-case {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 22px;
      box-shadow: var(--shadow-sm);
    }
    .pain-point h3,
    .use-case h3 {
      margin-bottom: 8px;
      font-size: 1.1rem;
      color: var(--foreground);
    }

    /* FAQ */
    .faq-list { max-width: 860px; margin: 0 auto; }
    .faq-item {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 14px;
      margin-bottom: 10px;
      box-shadow: var(--shadow-sm);
      overflow: hidden;
    }
    .faq-item summary {
      list-style: none;
      cursor: pointer;
      padding: 16px 18px;
      font-weight: 700;
      color: var(--foreground);
    }
    .faq-item summary::-webkit-details-marker { display: none; }
    .faq-item p { padding: 0 18px 16px; color: var(--muted-foreground); }

    /* CTA */
    .cta {
      background: linear-gradient(135deg, #1f3fc4 0%, #1a2f87 100%);
      color: #fff;
      padding: 68px 0;
      text-align: center;
      margin-top: 24px;
    }
    .cta h2 {
      margin-bottom: 26px;
      font-size: clamp(1.7rem, 3vw, 2.45rem);
      color: #fff;
    }
    .cta p { color: rgba(255, 255, 255, 0.88); }
    .cta .btn-primary {
      background: #fff;
      border-color: #fff;
      color: #1f3fc4;
      box-shadow: none;
    }
    .cta .btn-primary:hover { background: #eff5ff; color: #1735a3; }

    /* Breadcrumbs */
    .breadcrumbs {
      background: transparent;
      border-bottom: 1px solid var(--border);
      padding: 12px 0;
      font-size: 0.87rem;
    }
    .breadcrumbs .container {
      display: flex;
      align-items: center;
      gap: 8px;
      overflow-x: auto;
      white-space: nowrap;
      scrollbar-width: none;
    }
    .breadcrumbs .container::-webkit-scrollbar { display: none; }
    .breadcrumb-link {
      color: var(--muted-foreground);
      text-decoration: none;
      font-weight: 600;
    }
    .breadcrumb-link:hover { color: var(--foreground); }
    .breadcrumb-sep { color: #97a4ba; }
    .breadcrumb-current { color: var(--foreground); font-weight: 700; }

    /* Related Industries */
    .related-industries { background: rgba(238, 243, 255, 0.62); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
    .related-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }
    .related-industry {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 16px;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      text-decoration: none;
      color: var(--foreground);
      font-weight: 600;
    }
    .related-industry:hover {
      border-color: #b8c9ee;
      box-shadow: var(--shadow-sm);
      transform: translateY(-1px);
    }
    .related-icon { font-size: 1.4rem; }

    /* Footer */
    .footer {
      background: var(--gradient-dark);
      color: #ffffff;
      padding: 64px 0 26px;
      margin-top: 40px;
    }
    .footer-grid {
      display: grid;
      grid-template-columns: 1.7fr 1fr 1fr;
      gap: 30px;
      margin-bottom: 34px;
    }
    .footer-brand-head {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      margin-bottom: 14px;
    }
    .footer-brand-head .logo-mark {
      width: 38px;
      height: 38px;
      background: rgba(255, 255, 255, 0.13);
      box-shadow: none;
    }
    .footer-brand-head .logo-text { color: #ffffff; font-size: 1.15rem; }
    .footer-brand p {
      max-width: 330px;
      color: rgba(225, 234, 255, 0.74);
      font-size: 0.96rem;
    }
    .footer-links h4 {
      margin-bottom: 14px;
      font-size: 0.95rem;
      color: #ffffff;
      letter-spacing: 0.03em;
      text-transform: uppercase;
      font-weight: 700;
    }
    .footer-links a {
      display: block;
      color: rgba(225, 234, 255, 0.74);
      text-decoration: none;
      margin-bottom: 8px;
      font-size: 0.95rem;
    }
    .footer-links a:hover { color: #ffffff; }
    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      padding-top: 18px;
      text-align: center;
      color: rgba(225, 234, 255, 0.62);
      font-size: 0.9rem;
    }

    @media (max-width: 1160px) {
      .nav { gap: 18px; }
      .header-phone { display: none; }
      .logo-region { display: none; }
    }

    @media (max-width: 960px) {
      main { padding-top: 70px; }
      .header .container { min-height: 70px; }
      .nav { display: none; }
      .header-cta .btn { padding: 9px 14px; font-size: 0.85rem; border-radius: 10px; }
    }

    @media (max-width: 768px) {
      .container { padding: 0 16px; }
      .logo-text { font-size: 1.06rem; }
      .hero { padding: 56px 0 44px; }
      .hero h1, .hero-title { font-size: 1.9rem; }
      .hero p, .hero-subtitle { font-size: 1rem; }
      .footer { padding-top: 52px; }
      .footer-grid { grid-template-columns: 1fr; gap: 20px; }
      .stats-grid,
      .benefits-grid,
      .pain-points-grid,
      .use-cases-grid,
      .related-grid { grid-template-columns: 1fr; }
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
