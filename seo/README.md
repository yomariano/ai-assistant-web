# VoiceFleet Programmatic SEO System

A Cloudflare Worker-based programmatic SEO system that generates AI-optimized landing pages for VoiceFleet.ai - an AI voice agent SaaS platform.

## Overview

This SEO system creates dynamically generated, AI-optimized landing pages for:
- **18 B2B industry verticals** (restaurants, dental clinics, plumbers, etc.)
- **34 geographic locations** across Ireland, UK, and USA
- **Industry + Location combinations** (e.g., "Restaurant Voice Agent in Dublin")

### Key Features

- **Edge-rendered pages** via Cloudflare Workers for ultra-fast TTFB
- **AI-generated content** using Claude API for unique, high-quality copy
- **Google News integration** for timely, fresh content
- **GEO (Generative Engine Optimization)** best practices for AI Overview ranking
- **Comprehensive XML sitemaps** for search engine discovery
- **Schema.org markup** for rich snippets (FAQ, SoftwareApplication, Service)
- **Daily automated content refresh** via cron job

## Architecture

```
                    ┌─────────────────────────────────────┐
                    │         Cloudflare Edge             │
                    │    ┌───────────────────────┐        │
   User Request ───►│    │   VoiceFleet SEO      │        │
                    │    │   Cloudflare Worker   │        │
                    │    └───────────┬───────────┘        │
                    │                │                    │
                    │    ┌───────────▼───────────┐        │
                    │    │    Cloudflare KV      │        │
                    │    │  (Content Cache)      │        │
                    │    └───────────┬───────────┘        │
                    └────────────────┼────────────────────┘
                                     │
                    ┌────────────────▼────────────────────┐
                    │        api.voicefleet.ai            │
                    │   ┌───────────────────────┐         │
                    │   │  Claude API Proxy     │         │
                    │   │  /api/seo/proxy-claude│         │
                    │   └───────────┬───────────┘         │
                    └───────────────┼─────────────────────┘
                                    │
                    ┌───────────────▼─────────────────────┐
                    │         LLM Proxy Server            │
                    │     (Self-signed SSL handled)       │
                    │        Claude Haiku Model           │
                    └─────────────────────────────────────┘
```

## Project Structure

```
seo/
├── wrangler.toml              # Cloudflare Worker configuration
├── package.json               # Dependencies (hono, typescript)
├── tsconfig.json              # TypeScript configuration
├── README.md                  # This file
└── src/
    ├── index.ts               # Main Hono router + admin endpoints
    ├── types.ts               # TypeScript interfaces
    │
    ├── data/
    │   ├── industries.ts      # 18 B2B industry definitions
    │   └── locations.ts       # IE/UK/US city data
    │
    ├── handlers/
    │   ├── industry.ts        # /industries/:slug handler
    │   ├── industries-index.ts# /industries listing page
    │   ├── location.ts        # /locations/:country/:city handler
    │   ├── industry-location.ts# /{industry}-voice-agent-in-{city}
    │   ├── sitemap.ts         # XML sitemap generation
    │   ├── robots.ts          # robots.txt handler
    │   └── scheduled.ts       # Daily content generation
    │
    └── utils/
        ├── claude.ts          # Claude API integration + prompts
        ├── seo.ts             # Schema.org markup generators
        ├── news.ts            # Google News RSS integration
        └── html.ts            # HTML template utilities
```

## URL Patterns

| Page Type | URL Pattern | Example |
|-----------|-------------|---------|
| Industry | `/industries/:slug` | `/industries/restaurants` |
| Location | `/locations/:country/:city` | `/locations/ireland/dublin` |
| Industry + Location | `/:industry-voice-agent-in-:city` | `/restaurant-voice-agent-in-dublin` |
| Industries Index | `/industries` | Lists all industries |
| Sitemap Index | `/sitemap.xml` | Main sitemap |
| Industry Sitemap | `/sitemaps/industries.xml` | All industry pages |
| Location Sitemaps | `/sitemaps/locations-ireland.xml` | Country-specific |

## Industries Covered (18 Total)

| Category | Industries |
|----------|------------|
| **Food & Hospitality** | Restaurants, Hotels |
| **Healthcare** | Dental Clinics, Medical Clinics |
| **Home Services** | Plumbers, Electricians, HVAC |
| **Professional Services** | Law Firms, Accounting Firms |
| **Automotive** | Car Dealerships, Auto Repair |
| **Beauty & Wellness** | Hair Salons, Spas, Fitness Centers |
| **Real Estate** | Real Estate Agencies, Property Management |
| **Insurance & Finance** | Insurance Agencies |

Each industry includes:
- VoiceFleet-specific metrics (automation rate, cost savings, avg response time)
- Primary use cases for voice agents
- Voice capabilities relevant to the industry
- Pain points the AI addresses
- Related industries for internal linking
- Target keywords for SEO

## Locations Covered (34 Cities)

### Ireland (8 cities)
Dublin, Cork, Galway, Limerick, Waterford, Drogheda, Kilkenny, Sligo

### United Kingdom (12 cities)
London, Manchester, Birmingham, Leeds, Liverpool, Bristol, Edinburgh, Glasgow, Cardiff, Belfast, Newcastle, Nottingham

### United States (14 cities)
New York, Los Angeles, Chicago, Houston, Phoenix, Dallas, San Francisco, Miami, Boston, Atlanta, Denver, Seattle, Austin, Las Vegas

## AI Content Generation

### Generated Content Structure

Each page receives unique AI-generated content with:

```typescript
{
  title: string;              // SEO title (60-70 chars)
  metaDescription: string;    // Meta description (150-160 chars)
  heroTitle: string;          // Main H1 headline
  heroSubtitle: string;       // Supporting subtitle
  definition: string;         // Clear definition for AI extraction
  quickAnswer: string;        // Inverted pyramid answer
  introduction: string;       // Opening paragraph with E-E-A-T
  keyStats: Array<{           // Statistics for credibility
    stat: string;
    context: string;
  }>;
  benefits: string[];         // 4 key benefits
  howItWorks: string[];       // 3 setup steps
  painPointsContent: Array<{  // Industry-specific pain points
    title: string;
    description: string;
  }>;
  useCasesContent: Array<{    // Use case examples
    title: string;
    description: string;
  }>;
  faqItems: Array<{           // 5 FAQ items for schema
    question: string;
    answer: string;
  }>;
  ctaText: string;            // Call-to-action text
  trendInsight?: string;      // Current news-based insight
  generatedAt: string;        // ISO timestamp
}
```

### GEO (Generative Engine Optimization) Guidelines

Content is optimized for AI Overview ranking with:

1. **Inverted Pyramid** - Answer the main question immediately
2. **Clear Definitions** - "An AI voice agent for [industry] is..."
3. **Statistics** - Specific numbers for automation rates, cost savings
4. **Question-Based Headings** - FAQ questions mirror user searches
5. **Direct Answers** - Start FAQs with direct statements
6. **E-E-A-T Signals** - First-hand experience language ("Based on our data...")

### Google News Integration

The system fetches recent industry news from Google News RSS to:
- Reference current trends in content
- Make introductions feel timely and relevant
- Generate trend insights connecting news to VoiceFleet benefits
- Keep content fresh and up-to-date

News is cached in KV for 6 hours to avoid rate limiting.

## Cloudflare Configuration

### KV Namespaces

| Namespace | Purpose |
|-----------|---------|
| `SEO_CACHE` | News articles, metadata caching |
| `CONTENT_CACHE` | AI-generated content (7-day TTL) |

### Environment Variables

```toml
[vars]
SITE_URL = "https://voicefleet.ai"
APP_URL = "https://app.voicefleet.ai"
API_URL = "https://api.voicefleet.ai"
ENVIRONMENT = "production"
ADMIN_SECRET = "your-admin-secret"
SEO_WORKER_SECRET = "your-worker-secret"
```

### Routes

The worker handles routes on `voicefleet.ai`:
- `/industries/*` - All industry pages
- `/locations/*` - All location pages
- `/*-voice-agent-in-*` - Industry + location combos
- `/sitemap.xml`, `/sitemaps/*` - Sitemaps
- `/robots.txt` - Robots file
- `/health` - Health check
- `/admin/*` - Admin endpoints

## API Proxy Setup

Due to the LLM proxy using a self-signed SSL certificate (which Cloudflare Workers cannot bypass), content generation requests are proxied through `api.voicefleet.ai`:

```
Cloudflare Worker
      │
      ▼
POST /api/seo/proxy-claude (api.voicefleet.ai)
      │
      │ (axios with rejectUnauthorized: false)
      ▼
LLM Proxy (self-signed SSL)
      │
      ▼
Claude Haiku Model
```

The API proxy endpoint in `ai-assistant-api/src/routes/seoGeneration.js` handles SSL certificate validation bypass using Node.js https agent.

## Admin Endpoints

### Generate Single Page
```bash
POST /admin/generate
Content-Type: application/json

{
  "secret": "your-admin-secret",
  "type": "industry",
  "industry": "restaurants"
}
```

### Generate All Content (Bulk)
```bash
POST /admin/generate-all
Content-Type: application/json

{
  "secret": "your-admin-secret",
  "limit": 50,
  "maxAgeDays": 1,
  "maxWallTimeMs": 60000,
  "runSync": true
}
```

### Check Cache Status
```bash
GET /admin/cache-status?secret=your-admin-secret
```

### Check Cron Status (Last Run + Cursor)
```bash
GET /admin/run-status?secret=your-admin-secret
```

## Scheduled Content Generation

Content generation runs daily at **2:00 AM UTC** via cron-job.org:

| Setting | Value |
|---------|-------|
| URL | `https://voicefleet.ai/admin/generate-all` |
| Method | POST |
| Body | `{"secret":"<ADMIN_SECRET>"}` |
| Header | `Content-Type: application/json` |
| Schedule | Daily at 2:00 AM (Europe/Dublin) |

### Secrets Setup (Required)

Do not commit real secrets in `wrangler.toml`. Set these as Cloudflare Worker secrets:

```bash
wrangler secret put ADMIN_SECRET
wrangler secret put SEO_WORKER_SECRET
```

### Generation Priority

1. **Priority 1**: All 18 industry pages
2. **Priority 2**: Top 34 location pages (IE + UK + US)
3. **Priority 3**: Top industry-location combinations (10 industries x 6 cities = 60)

### Rate Limiting

- 500ms delay between API calls
- Max 100 requests per cron run
- Content skipped if less than 3 days old by default (`CONTENT_MAX_AGE_DAYS`, set to `1` for daily refresh)
- Tasks are rotated using a persisted cursor so all items get a chance to run over time (even when some are skipped as “fresh”)

## SEO Features

### Schema.org Markup

Each page includes:
- **FAQPage** schema for FAQ rich snippets
- **SoftwareApplication** schema for VoiceFleet product
- **Service** schema for voice agent services
- **Organization** schema for company info
- **BreadcrumbList** for navigation

### Robots.txt

```
User-agent: *
Allow: /

# AI bots explicitly allowed
User-agent: GPTBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Applebot-Extended
Allow: /

# Admin routes disallowed
Disallow: /admin/
Disallow: /api/

Sitemap: https://voicefleet.ai/sitemap.xml
```

### XML Sitemaps

- `/sitemap.xml` - Sitemap index
- `/sitemaps/indexes.xml` - Index pages (`/industries`, `/locations`, etc.)
- `/sitemaps/industries.xml` - All industry pages
- `/sitemaps/locations-ireland.xml` - Irish city pages
- `/sitemaps/locations-uk.xml` - UK city pages
- `/sitemaps/locations-usa.xml` - US city pages
- `/sitemaps/combos-*.xml` - Industry-location combinations

## Development

### Prerequisites

- Node.js 18+
- Wrangler CLI (`npm install -g wrangler`)
- Cloudflare account with Workers plan

### Local Development

```bash
cd seo
npm install
wrangler dev
```

### Deployment

```bash
wrangler deploy
```

### Creating KV Namespaces

```bash
wrangler kv:namespace create SEO_CACHE
wrangler kv:namespace create CONTENT_CACHE
```

Update `wrangler.toml` with the returned namespace IDs.

## Page Count Summary

| Type | Count |
|------|-------|
| Industry pages | 18 |
| Location pages | 34 |
| Industry-location combos | ~200 (top combos) |
| **Total** | **~250 pages** |

Expandable to 600+ pages by adding more industry-location combinations.

## Monitoring

### Health Check
```bash
curl https://voicefleet.ai/health
# Response: {"status":"ok","service":"voicefleet-seo"}
```

### Cache Status
```bash
curl "https://voicefleet.ai/admin/cache-status?secret=your-admin-secret"
```

### Last Run Status
```bash
curl "https://voicefleet.ai/admin/run-status?secret=your-admin-secret"
```

### Cron Job Monitoring
Monitor daily generation via cron-job.org dashboard.

## Troubleshooting

### Content Not Generating

1. Check API proxy is running: `curl https://api.voicefleet.ai/health`
2. Verify KV namespaces are bound in `wrangler.toml`
3. Check `SEO_WORKER_SECRET` matches in worker and API

### SSL Certificate Errors

The LLM proxy uses a self-signed certificate. All Claude API calls must go through the API proxy at `api.voicefleet.ai/api/seo/proxy-claude`.

### Build Errors (Next.js)

The `/seo` folder is excluded from Next.js compilation via `tsconfig.json`:
```json
{
  "exclude": ["node_modules", "seo"]
}
```

## Files Modified in Main Projects

### ai-assistant-api
- `src/routes/seoGeneration.js` - Added `/api/seo/proxy-claude` endpoint

### ai-assistant-web
- `tsconfig.json` - Added "seo" to exclude array

## License

Proprietary - VoiceFleet.ai
