/**
 * VoiceFleet SEO - Robots.txt Handler
 * Optimized for 2026 GEO - explicitly allows AI bots
 */

import { Context } from 'hono';
import { Bindings } from '../types';

export async function robotsHandler(c: Context<{ Bindings: Bindings }>) {
  const siteUrl = c.env.SITE_URL || 'https://voicefleet.ai';

  const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard/
Disallow: /call/
Disallow: /agenda/
Disallow: /scheduled/
Disallow: /history/
Disallow: /settings/
Disallow: /auth/

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

Sitemap: ${siteUrl}/sitemap.xml
`;

  return c.text(robots, 200, {
    'Content-Type': 'text/plain',
    'Cache-Control': 'max-age=86400'
  });
}
