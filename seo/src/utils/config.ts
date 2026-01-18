export function isConfiguredSecret(secret: string | undefined): secret is string {
  if (!secret) return false;
  const trimmed = secret.trim();
  if (!trimmed) return false;

  // Common placeholder/default values that should never ship to production.
  const blocked = new Set([
    'REPLACE_ME',
    'CHANGE_ME',
    'YOUR_SECRET_HERE',
    'voicefleet-seo-admin',
  ]);

  if (blocked.has(trimmed)) return false;
  return trimmed.length >= 16;
}

