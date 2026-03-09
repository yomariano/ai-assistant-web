const SUPPORTED_COUNTRIES = ['IE', 'GB', 'US', 'AR', 'AU'] as const;

export type SupportedCountryCode = (typeof SUPPORTED_COUNTRIES)[number];

const COUNTRY_LABELS: Record<SupportedCountryCode, string> = {
  IE: 'Ireland',
  GB: 'United Kingdom',
  US: 'United States',
  AR: 'Argentina',
  AU: 'Australia',
};

export function normalizeCountryCode(value?: string | null): string | null {
  if (!value) return null;

  const normalized = value.trim().toUpperCase();
  return normalized.length === 2 ? normalized : null;
}

export function isSupportedCountryCode(value?: string | null): value is SupportedCountryCode {
  return SUPPORTED_COUNTRIES.includes(value as SupportedCountryCode);
}

export function getSupportedCountryCodes(): readonly SupportedCountryCode[] {
  return SUPPORTED_COUNTRIES;
}

export function getSupportedCountryNames(): string[] {
  return SUPPORTED_COUNTRIES.map((code) => COUNTRY_LABELS[code]);
}

export function getCountryLabel(countryCode?: string | null): string {
  const normalized = normalizeCountryCode(countryCode);
  if (!normalized) return 'your country';

  return isSupportedCountryCode(normalized)
    ? COUNTRY_LABELS[normalized]
    : normalized;
}

export function buildWaitlistPath(countryCode?: string | null, from?: string | null): string {
  const params = new URLSearchParams();
  const normalizedCountryCode = normalizeCountryCode(countryCode);

  if (normalizedCountryCode) {
    params.set('country', normalizedCountryCode);
  }

  if (from) {
    params.set('from', from);
  }

  const query = params.toString();
  return query ? `/waitlist?${query}` : '/waitlist';
}
