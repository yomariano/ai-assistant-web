/**
 * VoiceFleet SEO - Locations Index Handlers
 * Lists supported countries and cities for geo pages
 */

import { Context } from 'hono';
import { Bindings } from '../types';
import { COUNTRIES } from '../data/locations';
import { generateBaseHtml, escapeHtml } from '../utils/html';
import { generateBreadcrumbSchema, generateOrganizationSchema } from '../utils/seo';

export async function locationsIndexHandler(c: Context<{ Bindings: Bindings }>) {
  const siteUrl = c.env.SITE_URL || 'https://voicefleet.ai';

  const countryCards = Object.values(COUNTRIES).map((country) => {
    const cityLinks = country.cities.map((city) => `
      <a class="city-pill" href="${siteUrl}/locations/${country.slug}/${city.slug}">
        ${escapeHtml(city.name)}
      </a>
    `).join('');

    return `
      <section class="country-section">
        <div class="country-header">
          <h2><a href="${siteUrl}/locations/${country.slug}">${escapeHtml(country.name)}</a></h2>
          <p>${escapeHtml(country.phoneFormat)} local numbers &middot; ${country.cities.length} cities</p>
        </div>
        <div class="city-pills">${cityLinks}</div>
      </section>
    `;
  }).join('');

  const content = `
    <nav class="breadcrumbs">
      <div class="container">
        <a href="${siteUrl}" class="breadcrumb-link">Home</a>
        <span class="breadcrumb-sep">/</span>
        <span class="breadcrumb-current">Locations</span>
      </div>
    </nav>

    <section class="hero hero-small">
      <div class="container">
        <h1>AI Voice Agents by Location</h1>
        <p>Explore location pages to see how VoiceFleet helps local businesses answer calls and book appointments 24/7.</p>
      </div>
    </section>

    <section class="locations-list">
      <div class="container">
        ${countryCards}
      </div>
    </section>

    <style>
      .hero-small { padding: 56px 0 44px; border-bottom: 0; }
      .hero-small h1 { margin-bottom: 12px; }
      .hero-small p { max-width: 760px; }
      .locations-list { padding: 44px 0 64px; }
      .country-section {
        padding: 24px;
        border: 1px solid var(--border);
        border-radius: 18px;
        background: var(--card);
        box-shadow: var(--shadow-sm);
        margin-bottom: 16px;
      }
      .country-header {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
        margin-bottom: 16px;
      }
      .country-header h2 { margin: 0; font-size: 1.3rem; }
      .country-header a {
        color: var(--foreground);
        text-decoration: none;
        font-weight: 700;
      }
      .country-header a:hover { color: var(--primary); }
      .country-header p {
        margin: 0;
        color: var(--muted-foreground);
        font-size: 0.9rem;
        font-weight: 600;
      }
      .city-pills { display: flex; flex-wrap: wrap; gap: 10px; }
      .city-pill {
        display: inline-flex;
        align-items: center;
        padding: 8px 14px;
        border: 1px solid var(--border);
        border-radius: 999px;
        color: var(--foreground);
        background: #f8faff;
        text-decoration: none;
        font-size: 0.9rem;
        font-weight: 600;
      }
      .city-pill:hover {
        border-color: #b8c9ee;
        background: #eef4ff;
        box-shadow: var(--shadow-sm);
        transform: translateY(-1px);
      }
      @media (max-width: 768px) {
        .hero-small { padding: 48px 0 38px; }
        .country-section { padding: 20px; border-radius: 16px; }
      }
    </style>
  `;

  const schemas = [
    JSON.stringify(generateOrganizationSchema()),
    JSON.stringify(generateBreadcrumbSchema([
      { name: 'Home', url: siteUrl },
      { name: 'Locations', url: `${siteUrl}/locations` }
    ])),
  ];

  const html = generateBaseHtml({
    title: 'AI Voice Agents by Location | VoiceFleet',
    description: 'Browse VoiceFleet AI voice agent pages by location. See how local businesses use an AI receptionist to answer calls, capture leads, and book appointments 24/7.',
    canonicalUrl: `${siteUrl}/locations`,
    content,
    schemas,
    siteUrl,
  });

  return c.html(html);
}

export async function locationsCountryHandler(
  c: Context<{ Bindings: Bindings }>,
  countrySlug: string
) {
  const siteUrl = c.env.SITE_URL || 'https://voicefleet.ai';
  const country = COUNTRIES[countrySlug];
  if (!country) {
    return c.notFound();
  }

  const cityCards = country.cities.map((city) => `
    <a class="city-card" href="${siteUrl}/locations/${country.slug}/${city.slug}">
      <div class="city-name">${escapeHtml(city.name)}</div>
      <div class="city-meta">${escapeHtml(city.region || country.name)} &middot; pop. ${city.population.toLocaleString()}</div>
    </a>
  `).join('');

  const content = `
    <nav class="breadcrumbs">
      <div class="container">
        <a href="${siteUrl}" class="breadcrumb-link">Home</a>
        <span class="breadcrumb-sep">/</span>
        <a href="${siteUrl}/locations" class="breadcrumb-link">Locations</a>
        <span class="breadcrumb-sep">/</span>
        <span class="breadcrumb-current">${escapeHtml(country.name)}</span>
      </div>
    </nav>

    <section class="hero hero-small">
      <div class="container">
        <h1>AI Voice Agents in ${escapeHtml(country.name)}</h1>
        <p>Choose a city to see a VoiceFleet AI receptionist page tailored to local search intent.</p>
      </div>
    </section>

    <section class="country-cities">
      <div class="container">
        <div class="city-grid">
          ${cityCards}
        </div>
      </div>
    </section>

    <style>
      .hero-small { padding: 56px 0 44px; border-bottom: 0; }
      .hero-small p { max-width: 720px; }
      .country-cities { padding: 44px 0 64px; }
      .city-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; }
      .city-card {
        display: block;
        padding: 18px;
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 14px;
        box-shadow: var(--shadow-sm);
        text-decoration: none;
      }
      .city-card:hover {
        border-color: #b8c9ee;
        box-shadow: var(--shadow-md);
        transform: translateY(-1px);
      }
      .city-name { color: var(--foreground); font-weight: 700; margin-bottom: 4px; font-size: 1rem; }
      .city-meta { color: var(--muted-foreground); font-size: 0.88rem; }
      @media (max-width: 768px) {
        .hero-small { padding: 48px 0 38px; }
        .city-grid { grid-template-columns: 1fr; }
      }
    </style>
  `;

  const schemas = [
    JSON.stringify(generateOrganizationSchema()),
    JSON.stringify(generateBreadcrumbSchema([
      { name: 'Home', url: siteUrl },
      { name: 'Locations', url: `${siteUrl}/locations` },
      { name: country.name, url: `${siteUrl}/locations/${country.slug}` },
    ])),
  ];

  const html = generateBaseHtml({
    title: `AI Voice Agents in ${country.name} | VoiceFleet`,
    description: `Browse VoiceFleet AI voice agent pages for cities in ${country.name}. See how an AI receptionist helps local businesses answer calls and book appointments 24/7.`,
    canonicalUrl: `${siteUrl}/locations/${country.slug}`,
    content,
    schemas,
    siteUrl,
  });

  return c.html(html);
}

