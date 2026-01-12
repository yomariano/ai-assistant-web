/**
 * VoiceFleet SEO - Claude API Integration
 * Generates dynamic SEO content for voice agent landing pages
 */

import { GeneratedContent, ContentRequest, NewsArticle } from '../types';
import { formatNewsForPrompt } from './news';

/**
 * Generate SEO content using Claude API (via api.voicefleet.ai proxy)
 * Routes through the API to handle self-signed SSL cert on LLM proxy
 */
export async function generateContent(
  workerSecret: string,
  request: ContentRequest,
  apiUrl?: string
): Promise<GeneratedContent> {
  const prompt = buildPrompt(request);

  // Use api.voicefleet.ai proxy endpoint (handles self-signed SSL cert internally)
  // The API server can call the LLM proxy with proper SSL handling
  const baseUrl = apiUrl || 'https://api.voicefleet.ai';
  const endpoint = `${baseUrl}/api/seo/proxy-claude`;

  console.log(`[Claude] Calling API proxy at ${endpoint}`);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Worker-Secret': workerSecret,
    },
    body: JSON.stringify({
      prompt,
      model: 'haiku',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${response.status} - ${error}`);
  }

  const data = await response.json() as {
    success?: boolean;
    result?: string;
    response?: string;
    content?: string;
    error?: string;
  };

  if (data.error) {
    throw new Error(`Claude API error: ${data.error}`);
  }

  // Handle various response formats from the proxy
  const textContent = data.response || data.result || data.content || (typeof data === 'string' ? data : null);
  if (!textContent) {
    throw new Error('No text content in Claude response');
  }

  // Clean up the response (remove markdown code blocks if present)
  const cleanJson = typeof textContent === 'string'
    ? textContent.trim().replace(/^```json\n?|\n?```$/g, '')
    : JSON.stringify(textContent);

  // Parse the JSON response
  const parsed = JSON.parse(cleanJson) as Omit<GeneratedContent, 'generatedAt'>;

  return {
    ...parsed,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Build the prompt for VoiceFleet content generation
 */
function buildPrompt(request: ContentRequest): string {
  const context = buildContext(request);
  const newsContext = request.newsArticles && request.newsArticles.length > 0
    ? formatNewsForPrompt(request.newsArticles)
    : '';

  const newsInstructions = newsContext
    ? `
CURRENT INDUSTRY NEWS & TRENDS:
${newsContext}

Use these recent news items to:
- Reference current trends or challenges in the industry in your content
- Make the introduction and pain points feel timely and relevant
- Generate a "trendInsight" that connects current news to how VoiceFleet can help
- Ensure the content feels fresh and up-to-date with what's happening in the industry
`
    : '';

  return `Generate SEO landing page content for VoiceFleet.ai, an AI voice agent platform that automates business phone calls.

VoiceFleet helps businesses automate their phone lines with AI voice agents that can:
- Answer calls 24/7 in natural-sounding voices
- Schedule appointments and take bookings
- Handle customer inquiries and FAQs
- Take orders (restaurants, retail)
- Dispatch emergencies (home services)
- Qualify leads and route calls
- Integrate with CRMs, calendars, and POS systems

${context}
${newsInstructions}

=== GEO (Generative Engine Optimization) GUIDELINES ===
Follow these 2026 SEO best practices for AI Overview optimization:
1. INVERTED PYRAMID: Answer the user's main question immediately
2. CLEAR DEFINITIONS: Define "AI voice agent for [industry]" for AI extraction
3. STATISTICS: Include specific numbers (automation rate, cost savings, response time)
4. QUESTION-BASED HEADINGS: FAQ questions should mirror how users search
5. DIRECT ANSWERS: Start FAQ answers with a direct statement before elaborating
6. E-E-A-T: Show first-hand experience ("Based on our data...", "We've automated...")

Generate a JSON response with EXACTLY this structure (no markdown, just valid JSON):
{
  "title": "SEO page title (60-70 chars) - include 'AI Voice Agent'",
  "metaDescription": "Meta description (150-160 chars) - mention automation benefits",
  "heroTitle": "Main H1 headline emphasizing voice agent benefits (8-12 words)",
  "heroSubtitle": "Supporting subtitle with specific benefit, e.g., 'Answer 85% of calls automatically' (15-25 words)",
  "definition": "Clear 1-2 sentence definition: 'An AI voice agent for [industry] is...' This helps AI models extract and cite your content.",
  "quickAnswer": "Direct answer to the main user intent (2-3 sentences). Start with a bold statement that directly answers what the user is looking for. This is the 'inverted pyramid' - most important info first.",
  "introduction": "Opening paragraph (50-80 words) that demonstrates first-hand experience. Use phrases like 'Based on our data...' or 'We've automated over X calls...'${newsContext ? ' Reference current industry trends.' : ''}",
  "keyStats": [
    {"stat": "85%", "context": "of routine calls can be automated with VoiceFleet"},
    {"stat": "60%", "context": "cost reduction compared to traditional answering services"},
    {"stat": "<1s", "context": "average response time - no caller ever waits on hold"}
  ],
  "benefits": ["24/7 availability without staffing costs", "Natural-sounding conversations in multiple languages", "Seamless integration with your existing tools", "Instant setup - go live in minutes"],
  "howItWorks": ["Connect your business phone number to VoiceFleet", "Train the AI on your FAQs, menu, or services", "Go live and let AI handle your calls 24/7"],
  "painPointsContent": [
    {"title": "Question-format pain point (e.g., 'Missing calls during rush hours?')", "description": "Start with direct answer showing how VoiceFleet solves it. 2-3 sentences."},
    {"title": "Pain point 2 as question", "description": "..."},
    {"title": "Pain point 3 as question", "description": "..."}
  ],
  "useCasesContent": [
    {"title": "Use case as question (e.g., 'How do [industry professionals] use VoiceFleet?')", "description": "Direct answer first, then details. 2-3 sentences showing first-hand experience."},
    {"title": "Use case 2", "description": "..."},
    {"title": "Use case 3", "description": "..."}
  ],
  "faqItems": [
    {"question": "How much does VoiceFleet cost for [industry]?", "answer": "VoiceFleet starts at $X/month. Direct price first, then explain what's included."},
    {"question": "Can VoiceFleet integrate with [common industry tool]?", "answer": "Yes, VoiceFleet integrates with... Direct yes/no first."},
    {"question": "How natural does the VoiceFleet AI sound?", "answer": "Our AI uses advanced voice synthesis... Direct statement first."},
    {"question": "What happens when the AI can't handle a call?", "answer": "VoiceFleet seamlessly transfers to... Direct answer first."},
    {"question": "How long does it take to set up VoiceFleet?", "answer": "Most businesses go live within... Specific timeframe first."}
  ],
  "ctaText": "Try VoiceFleet Free"${newsContext ? `,
  "trendInsight": "2-3 sentences connecting current news to why businesses need VoiceFleet NOW. Include a specific stat or trend."` : ''}
}

Requirements:
- Content must be unique and provide INFORMATION GAIN
- Focus on the specific industry/location mentioned
- Be informative and helpful, demonstrate expertise
- Use natural language that reads well
- Include relevant keywords naturally
- VoiceFleet is an AI voice agent that answers business phone calls
- Use first-person plural ("we've automated", "our data shows") to demonstrate E-E-A-T
- Make statistics realistic and industry-appropriate${newsContext ? `
- Incorporate current news to make content timely
- The trendInsight should feel current and actionable` : ''}

Return ONLY valid JSON, no markdown code blocks or explanations.`;
}

/**
 * Build context string based on request type
 */
function buildContext(request: ContentRequest): string {
  switch (request.type) {
    case 'industry':
      return `Create content for the ${request.industry?.name} industry page.
Target audience: ${request.industry?.namePlural}
Focus: AI voice agents that automate phone calls for ${request.industry?.name?.toLowerCase()} businesses
Emphasize: 24/7 availability, cost savings, seamless customer experience`;

    case 'location':
      return `Create content for the ${request.location?.city}, ${request.location?.country} location page.
Focus: AI voice agents for local businesses in ${request.location?.city}
Highlight: Local phone number availability and accent/dialect support`;

    case 'industry-location':
      return `Create content for ${request.industry?.name} voice agents in ${request.location?.city}, ${request.location?.country}.
Target audience: Local ${request.industry?.namePlural?.toLowerCase()} looking to automate their phone lines
Focus: Industry-specific voice agent capabilities + local business relevance`;

    default:
      return '';
  }
}

/**
 * Store generated content in KV
 */
export async function storeContent(
  kv: KVNamespace,
  key: string,
  content: GeneratedContent,
  expirationTtl = 86400 * 7 // 7 days
): Promise<void> {
  await kv.put(key, JSON.stringify(content), { expirationTtl });
}

/**
 * Retrieve content from KV
 */
export async function getContent(
  kv: KVNamespace,
  key: string
): Promise<GeneratedContent | null> {
  const data = await kv.get(key);
  if (!data) return null;
  return JSON.parse(data) as GeneratedContent;
}

/**
 * Build cache key for content
 */
export function buildCacheKey(request: ContentRequest): string {
  switch (request.type) {
    case 'industry':
      return `content:industry:${request.industry?.slug}`;
    case 'location':
      return `content:location:${request.location?.city?.toLowerCase().replace(/\s+/g, '-')}`;
    case 'industry-location':
      return `content:combo:${request.industry?.slug}:${request.location?.city?.toLowerCase().replace(/\s+/g, '-')}`;
    default:
      return 'content:unknown';
  }
}

/**
 * Check if content is fresh (less than X days old)
 */
export function isContentFresh(content: GeneratedContent, maxAgeDays = 3): boolean {
  const generatedAt = new Date(content.generatedAt);
  const now = new Date();
  const ageMs = now.getTime() - generatedAt.getTime();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);
  return ageDays < maxAgeDays;
}
