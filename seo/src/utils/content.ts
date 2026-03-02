import { GeneratedContent } from '../types';

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

function isStatArray(
  value: unknown
): value is GeneratedContent['keyStats'] {
  return Array.isArray(value) && value.every((item) =>
    typeof item === 'object'
    && item !== null
    && isString((item as { stat?: unknown }).stat)
    && isString((item as { context?: unknown }).context)
  );
}

function isBodyItemArray(
  value: unknown
): value is GeneratedContent['painPointsContent'] {
  return Array.isArray(value) && value.every((item) =>
    typeof item === 'object'
    && item !== null
    && isString((item as { title?: unknown }).title)
    && isString((item as { description?: unknown }).description)
  );
}

function isFaqArray(
  value: unknown
): value is GeneratedContent['faqItems'] {
  return Array.isArray(value) && value.every((item) =>
    typeof item === 'object'
    && item !== null
    && isString((item as { question?: unknown }).question)
    && isString((item as { answer?: unknown }).answer)
  );
}

export function sanitizeGeneratedContent(content: GeneratedContent | null): GeneratedContent | null {
  if (!content || typeof content !== 'object') {
    return null;
  }

  if (
    !isString(content.title)
    || !isString(content.metaDescription)
    || !isString(content.heroTitle)
    || !isString(content.heroSubtitle)
    || !isString(content.definition)
    || !isString(content.quickAnswer)
    || !isString(content.introduction)
    || !isStatArray(content.keyStats)
    || !isStringArray(content.benefits)
    || !isStringArray(content.howItWorks)
    || !isBodyItemArray(content.painPointsContent)
    || !isBodyItemArray(content.useCasesContent)
    || !isFaqArray(content.faqItems)
    || !isString(content.ctaText)
    || !isString(content.generatedAt)
  ) {
    return null;
  }

  if (content.trendInsight !== undefined && !isString(content.trendInsight)) {
    return null;
  }

  return content;
}

export function getSafeHeaderValue(value: unknown): string | null {
  if (!isString(value) || /[\r\n]/.test(value)) {
    return null;
  }

  return value;
}

export function getTextOrFallback(value: unknown, fallback: string): string {
  return isString(value) ? value : fallback;
}
