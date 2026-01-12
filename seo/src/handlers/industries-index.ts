/**
 * VoiceFleet SEO - Industries Index Page Handler
 * Lists all supported industries
 */

import { Context } from 'hono';
import { Bindings } from '../types';
import { INDUSTRIES, getIndustryCategories } from '../data/industries';
import { generateBaseHtml, escapeHtml } from '../utils/html';
import { generateBreadcrumbSchema, generateOrganizationSchema } from '../utils/seo';

export async function industriesIndexHandler(c: Context<{ Bindings: Bindings }>) {
  const siteUrl = c.env.SITE_URL || 'https://voicefleet.ai';

  const categories = getIndustryCategories();
  const industryCount = Object.keys(INDUSTRIES).length;

  // Generate category sections
  const categorySections = Object.entries(categories).map(([categoryName, industries]) => {
    const industryCards = industries.filter(Boolean).map(ind => `
      <a href="${siteUrl}/industries/${ind.slug}" class="industry-card">
        <span class="industry-icon">${getIndustryIcon(ind.icon)}</span>
        <div class="industry-info">
          <h3>${escapeHtml(ind.name)}</h3>
          <p>${ind.automationRate}% automation rate</p>
        </div>
      </a>
    `).join('');

    return `
      <div class="category-section">
        <h2>${escapeHtml(categoryName)}</h2>
        <div class="industry-grid">
          ${industryCards}
        </div>
      </div>
    `;
  }).join('');

  const content = `
    <nav class="breadcrumbs">
      <div class="container">
        <a href="${siteUrl}" class="breadcrumb-link">Home</a>
        <span class="breadcrumb-sep">/</span>
        <span class="breadcrumb-current">Industries</span>
      </div>
    </nav>

    <section class="hero hero-small">
      <div class="container">
        <h1>AI Voice Agents by Industry</h1>
        <p>VoiceFleet powers phone automation for ${industryCount}+ industries. Find your industry below.</p>
      </div>
    </section>

    <section class="industries-list">
      <div class="container">
        ${categorySections}
      </div>
    </section>

    <section class="cta">
      <div class="container">
        <h2>Don't see your industry?</h2>
        <p>VoiceFleet works with any business that receives phone calls.</p>
        <a href="${siteUrl}/#demo" class="btn btn-primary btn-lg">Get a Demo</a>
      </div>
    </section>

    <style>
      .hero-small { padding: 50px 0; }
      .industries-list { padding: 60px 0; }
      .category-section { margin-bottom: 50px; }
      .category-section h2 { margin-bottom: 25px; color: #1a1a2e; font-size: 1.5rem; }
      .industry-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
      .industry-card {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 20px;
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        text-decoration: none;
        color: #1a1a2e;
        transition: all 0.2s;
      }
      .industry-card:hover {
        border-color: #3b82f6;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
      }
      .industry-icon { font-size: 2rem; }
      .industry-info h3 { margin: 0 0 5px; font-size: 1.1rem; }
      .industry-info p { margin: 0; color: #666; font-size: 0.9rem; }
    </style>
  `;

  // Generate schemas
  const schemas = [
    JSON.stringify(generateOrganizationSchema()),
    JSON.stringify(generateBreadcrumbSchema([
      { name: 'Home', url: siteUrl },
      { name: 'Industries', url: `${siteUrl}/industries` }
    ]))
  ];

  const html = generateBaseHtml({
    title: `AI Voice Agents by Industry | VoiceFleet`,
    description: `VoiceFleet provides AI voice agents for ${industryCount}+ industries including restaurants, dental clinics, plumbers, law firms, and more. Automate your phone calls 24/7.`,
    canonicalUrl: `${siteUrl}/industries`,
    content,
    schemas,
    siteUrl
  });

  return c.html(html);
}

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
