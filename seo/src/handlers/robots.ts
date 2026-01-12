/**
 * VoiceFleet SEO - Robots.txt Handler
 * Optimized for 2026 GEO - explicitly allows AI bots
 */

import { Context } from 'hono';
import { Bindings } from '../types';

export async function robotsHandler(c: Context<{ Bindings: Bindings }>) {
  const siteUrl = c.env.SITE_URL || 'https://voicefleet.ai';

  const robots = `# VoiceFleet.ai SEO Pages
# Optimized for 2026 GEO - AI crawlers welcomed

User-agent: *
Allow: /

# AI Bots - EXPLICITLY ALLOWED for GEO
User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Anthropic-AI
Allow: /

# Disallow admin routes
Disallow: /admin/
Disallow: /api/

# Sitemaps
Sitemap: ${siteUrl}/sitemap.xml

# Crawl delay to be respectful
Crawl-delay: 1
`;

  return c.text(robots, 200, {
    'Content-Type': 'text/plain',
    'Cache-Control': 'max-age=86400'
  });
}
