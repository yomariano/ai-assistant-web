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
          <p>${escapeHtml(country.phoneFormat)} local numbers • ${country.cities.length} cities</p>
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
      .hero-small { padding: 50px 0; }
      .locations-list { padding: 60px 0; }
      .country-section { padding: 22px; border: 1px solid #e5e7eb; border-radius: 14px; background: #fff; margin-bottom: 18px; }
      .country-header { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 14px; }
      .country-header h2 { margin: 0; font-size: 1.25rem; }
      .country-header a { color: #1a1a2e; text-decoration: none; }
      .country-header a:hover { text-decoration: underline; }
      .country-header p { margin: 0; color: #666; font-size: 0.95rem; }
      .city-pills { display: flex; flex-wrap: wrap; gap: 10px; }
      .city-pill { display: inline-flex; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 999px; color: #1a1a2e; text-decoration: none; font-size: 0.95rem; }
      .city-pill:hover { border-color: #3b82f6; box-shadow: 0 2px 10px rgba(59, 130, 246, 0.08); }
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
      <div class="city-meta">${escapeHtml(city.region || country.name)} • pop. ${city.population.toLocaleString()}</div>
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
      .hero-small { padding: 50px 0; }
      .country-cities { padding: 60px 0; }
      .city-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; }
      .city-card {
        display: block;
        padding: 16px;
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        text-decoration: none;
      }
      .city-card:hover { border-color: #3b82f6; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08); }
      .city-name { color: #1a1a2e; font-weight: 700; margin-bottom: 4px; }
      .city-meta { color: #666; font-size: 0.9rem; }
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
