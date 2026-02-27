import { Business } from './directory-data';

export function generateBusinessSchema(b: Business, baseUrl = 'https://voicefleet.ai') {
  const path = b.locale === 'es'
    ? `/es/directorio/${b.vertical}/${b.citySlug}/${b.slug}`
    : `/directory/${b.vertical}/${b.citySlug}/${b.slug}`;

  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': b.schema_type,
    name: b.name,
    url: `${baseUrl}${path}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: b.city,
      addressCountry: b.country === 'argentina' ? 'AR' : 'IE',
      streetAddress: b.address,
    },
    areaServed: { '@type': 'City', name: b.city },
  };

  if (b.phone) schema.telephone = b.phone;
  if (b.website) schema.sameAs = b.website;
  if (b.openingHours) schema.openingHours = b.openingHours;

  // Vertical-specific
  if (b.vertical === 'restaurants') {
    schema.servesCuisine = 'Local & International';
    schema.acceptsReservations = true;
    schema.potentialAction = { '@type': 'ReserveAction', target: `${baseUrl}${path}` };
  } else {
    schema.potentialAction = { '@type': 'ScheduleAction', target: `${baseUrl}${path}` };
  }

  return schema;
}

export function generateItemListSchema(items: Business[], title: string, baseUrl = 'https://voicefleet.ai') {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    numberOfItems: items.length,
    itemListElement: items.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.name,
      url: `${baseUrl}/directory/${b.vertical}/${b.citySlug}/${b.slug}`,
    })),
  };
}

export function generateFAQSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
