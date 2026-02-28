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

// --- Localization helpers ---

const dayMapES: Record<string, string> = {
  Mo: 'Lun', Tu: 'Mar', We: 'Mié', Th: 'Jue', Fr: 'Vie', Sa: 'Sáb', Su: 'Dom',
};

const verticalHours: Record<string, string> = {
  restaurants: 'Mo-Su 12:00-22:00',
  dentists: 'Mo-Fr 09:00-17:30',
  vets: 'Mo-Fr 08:30-18:00, Sa 09:00-13:00',
  salons: 'Tu-Sa 09:00-18:00',
  plumbers: 'Mo-Fr 08:00-18:00',
  gyms: 'Mo-Fr 06:00-22:00, Sa-Su 08:00-20:00',
  mechanics: 'Mo-Fr 08:30-17:30, Sa 09:00-13:00',
  accountants: 'Mo-Fr 09:00-17:00',
  physios: 'Mo-Fr 08:00-19:00',
  barbers: 'Tu-Sa 09:00-18:00',
};

const descTemplatesEN: Record<string, string> = {
  restaurants: '{name} is a popular restaurant in {city}, {country}, known for quality dining and excellent service.',
  dentists: '{name} is a trusted dental practice in {city}, {country}, offering professional oral healthcare.',
  vets: '{name} is a reliable veterinary clinic in {city}, {country}, providing compassionate animal care.',
  salons: '{name} is a professional hair salon in {city}, {country}, offering expert styling and hair care.',
  plumbers: '{name} is a dependable plumbing service in {city}, {country}, delivering reliable solutions.',
  gyms: '{name} is a well-equipped gym in {city}, {country}, with fitness programmes for all levels.',
  mechanics: '{name} is a skilled auto mechanic in {city}, {country}, providing reliable vehicle repair and maintenance.',
  accountants: '{name} is a professional services firm in {city}, {country}, providing expert business and financial advice.',
  physios: '{name} is a qualified physiotherapy practice in {city}, {country}, specialising in injury recovery and pain management.',
  barbers: '{name} is a quality barber shop in {city}, {country}, offering expert grooming services.',
};

const descTemplatesES: Record<string, string> = {
  restaurants: '{name} es un reconocido restaurante en {city}, {country}, conocido por su excelente gastronomía y atención.',
  dentists: '{name} es una clínica dental de confianza en {city}, {country}, que ofrece atención odontológica profesional.',
  vets: '{name} es una veterinaria comprometida en {city}, {country}, dedicada al cuidado y bienestar animal.',
  salons: '{name} es una peluquería profesional en {city}, {country}, con servicios de estilismo y cuidado capilar.',
  plumbers: '{name} es un servicio de plomería confiable en {city}, {country}, ofreciendo soluciones profesionales.',
  gyms: '{name} es un gimnasio completo en {city}, {country}, con programas de fitness para todos los niveles.',
  mechanics: '{name} es un taller mecánico de confianza en {city}, {country}, con servicios de mantenimiento y reparación.',
  accountants: '{name} es un estudio profesional en {city}, {country}, ofreciendo asesoramiento contable y financiero.',
  physios: '{name} es un centro de fisioterapia en {city}, {country}, especializado en recuperación y manejo del dolor.',
  barbers: '{name} es una barbería de calidad en {city}, {country}, con servicios profesionales de grooming.',
};

const countryNameES: Record<string, string> = {
  Ireland: 'Irlanda', ireland: 'Irlanda', Argentina: 'Argentina', argentina: 'Argentina',
};

function isTemplateDescription(desc: string): boolean {
  return desc.includes('is a trusted') && desc.includes('Providing quality service');
}

function fillTemplate(tpl: string, b: Business, locale: string): string {
  const country = locale === 'es'
    ? (countryNameES[b.country] || capitalize(b.country))
    : capitalize(b.country);
  return tpl.replace('{name}', b.name).replace('{city}', b.city).replace('{country}', country);
}

export function getLocalizedDescription(business: Business, locale: string): string {
  if (!isTemplateDescription(business.description)) return business.description;
  const templates = locale === 'es' ? descTemplatesES : descTemplatesEN;
  const tpl = templates[business.vertical];
  if (!tpl) return business.description;
  return fillTemplate(tpl, business, locale);
}

export function getLocalizedHours(business: Business, locale: string): string {
  // Use per-vertical hours instead of the generic hardcoded value
  const hours = business.openingHours === 'Mo-Fr 09:00-18:00'
    ? (verticalHours[business.vertical] || business.openingHours)
    : business.openingHours;
  if (locale !== 'es') return hours;
  return hours.replace(/\b(Mo|Tu|We|Th|Fr|Sa|Su)\b/g, (m) => dayMapES[m] || m);
}
