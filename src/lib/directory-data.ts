import businessesData from '../data/businesses.json';

export interface Business {
  slug: string;
  name: string;
  vertical: string;
  city: string;
  citySlug: string;
  country: string;
  address: string;
  phone: string;
  website: string;
  email: string;
  description: string;
  faqs: { q: string; a: string }[];
  schema_type: string;
  locale: string;
  openingHours: string;
}

const businesses: Business[] = businessesData as Business[];

export function getAllBusinesses(): Business[] {
  return businesses;
}

export function getBusinessBySlug(vertical: string, citySlug: string, slug: string): Business | undefined {
  return businesses.find(b => b.vertical === vertical && b.citySlug === citySlug && b.slug === slug);
}

export function getBusinessesByCity(vertical: string, citySlug: string): Business[] {
  return businesses.filter(b => b.vertical === vertical && b.citySlug === citySlug);
}

export function getBusinessesByVertical(vertical: string): Business[] {
  return businesses.filter(b => b.vertical === vertical);
}

export function getCitiesForVertical(vertical: string): { city: string; citySlug: string; count: number }[] {
  const biz = getBusinessesByVertical(vertical);
  const map = new Map<string, { city: string; citySlug: string; count: number }>();
  for (const b of biz) {
    const existing = map.get(b.citySlug);
    if (existing) existing.count++;
    else map.set(b.citySlug, { city: b.city, citySlug: b.citySlug, count: 1 });
  }
  return [...map.values()].sort((a, z) => z.count - a.count);
}

export function getVerticals(): { vertical: string; count: number }[] {
  const map = new Map<string, number>();
  for (const b of businesses) map.set(b.vertical, (map.get(b.vertical) || 0) + 1);
  return [...map.entries()].map(([vertical, count]) => ({ vertical, count })).sort((a, z) => z.count - a.count);
}

export function getBusinessesByLocale(locale: 'en' | 'es'): Business[] {
  return businesses.filter(b => b.locale === locale);
}

export const verticalLabels: Record<string, string> = {
  restaurants: 'Restaurants', dentists: 'Dentists', vets: 'Veterinary Clinics',
  salons: 'Hair Salons', plumbers: 'Plumbers', gyms: 'Gyms',
  mechanics: 'Mechanics', accountants: 'Professional Services',
  physios: 'Physiotherapy', barbers: 'Barber Shops',
};

export const verticalLabelsES: Record<string, string> = {
  restaurants: 'Restaurantes', dentists: 'Dentistas', vets: 'Veterinarias',
  salons: 'Peluquerias', plumbers: 'Plomeros', gyms: 'Gimnasios',
  mechanics: 'Mecanicos', accountants: 'Servicios Profesionales',
  physios: 'Fisioterapia', barbers: 'Barberias',
};

export const verticalIcons: Record<string, string> = {
  restaurants: '🍽️', dentists: '🦷', vets: '🐾', salons: '💇', plumbers: '🔧',
  gyms: '💪', mechanics: '🔩', accountants: '📊', physios: '🏥', barbers: '✂️',
};

export const verticalSlugsES: Record<string, string> = {
  restaurants: 'restaurantes', dentists: 'dentistas', vets: 'veterinarias',
  salons: 'peluquerias', plumbers: 'plomeros', gyms: 'gimnasios',
  mechanics: 'mecanicos', accountants: 'servicios-profesionales',
  physios: 'fisioterapia', barbers: 'barberias',
};

// Reverse map: ES slug → EN vertical
export const esSlugToVertical: Record<string, string> = Object.fromEntries(
  Object.entries(verticalSlugsES).map(([en, es]) => [es, en])
);

export function capitalize(s: string): string {
  return s.split(/[\s-]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
