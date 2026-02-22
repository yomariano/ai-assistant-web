/**
 * City data for /ai-receptionist/[city] landing pages.
 * Source: seo/src/data/locations.ts — 34 cities across Ireland, UK, USA.
 */

export interface ReceptionistCity {
  slug: string;
  name: string;
  country: string;
  countryCode: string;
  population: number;
  region: string;
}

export const RECEPTIONIST_CITIES: ReceptionistCity[] = [
  // Ireland (8)
  { slug: "dublin", name: "Dublin", country: "Ireland", countryCode: "IE", population: 1400000, region: "Leinster" },
  { slug: "cork", name: "Cork", country: "Ireland", countryCode: "IE", population: 210000, region: "Munster" },
  { slug: "galway", name: "Galway", country: "Ireland", countryCode: "IE", population: 80000, region: "Connacht" },
  { slug: "limerick", name: "Limerick", country: "Ireland", countryCode: "IE", population: 95000, region: "Munster" },
  { slug: "waterford", name: "Waterford", country: "Ireland", countryCode: "IE", population: 54000, region: "Munster" },
  { slug: "drogheda", name: "Drogheda", country: "Ireland", countryCode: "IE", population: 41000, region: "Leinster" },
  { slug: "kilkenny", name: "Kilkenny", country: "Ireland", countryCode: "IE", population: 26000, region: "Leinster" },
  { slug: "sligo", name: "Sligo", country: "Ireland", countryCode: "IE", population: 20000, region: "Connacht" },

  // UK (12)
  { slug: "london", name: "London", country: "United Kingdom", countryCode: "GB", population: 8900000, region: "England" },
  { slug: "manchester", name: "Manchester", country: "United Kingdom", countryCode: "GB", population: 550000, region: "England" },
  { slug: "birmingham", name: "Birmingham", country: "United Kingdom", countryCode: "GB", population: 1140000, region: "England" },
  { slug: "leeds", name: "Leeds", country: "United Kingdom", countryCode: "GB", population: 790000, region: "England" },
  { slug: "liverpool", name: "Liverpool", country: "United Kingdom", countryCode: "GB", population: 500000, region: "England" },
  { slug: "bristol", name: "Bristol", country: "United Kingdom", countryCode: "GB", population: 460000, region: "England" },
  { slug: "edinburgh", name: "Edinburgh", country: "United Kingdom", countryCode: "GB", population: 520000, region: "Scotland" },
  { slug: "glasgow", name: "Glasgow", country: "United Kingdom", countryCode: "GB", population: 630000, region: "Scotland" },
  { slug: "cardiff", name: "Cardiff", country: "United Kingdom", countryCode: "GB", population: 365000, region: "Wales" },
  { slug: "belfast", name: "Belfast", country: "United Kingdom", countryCode: "GB", population: 340000, region: "Northern Ireland" },
  { slug: "newcastle", name: "Newcastle", country: "United Kingdom", countryCode: "GB", population: 300000, region: "England" },
  { slug: "nottingham", name: "Nottingham", country: "United Kingdom", countryCode: "GB", population: 330000, region: "England" },

  // USA (14)
  { slug: "new-york", name: "New York", country: "United States", countryCode: "US", population: 8300000, region: "New York" },
  { slug: "los-angeles", name: "Los Angeles", country: "United States", countryCode: "US", population: 3900000, region: "California" },
  { slug: "chicago", name: "Chicago", country: "United States", countryCode: "US", population: 2700000, region: "Illinois" },
  { slug: "houston", name: "Houston", country: "United States", countryCode: "US", population: 2300000, region: "Texas" },
  { slug: "phoenix", name: "Phoenix", country: "United States", countryCode: "US", population: 1600000, region: "Arizona" },
  { slug: "dallas", name: "Dallas", country: "United States", countryCode: "US", population: 1300000, region: "Texas" },
  { slug: "san-francisco", name: "San Francisco", country: "United States", countryCode: "US", population: 870000, region: "California" },
  { slug: "miami", name: "Miami", country: "United States", countryCode: "US", population: 450000, region: "Florida" },
  { slug: "boston", name: "Boston", country: "United States", countryCode: "US", population: 680000, region: "Massachusetts" },
  { slug: "atlanta", name: "Atlanta", country: "United States", countryCode: "US", population: 500000, region: "Georgia" },
  { slug: "denver", name: "Denver", country: "United States", countryCode: "US", population: 720000, region: "Colorado" },
  { slug: "seattle", name: "Seattle", country: "United States", countryCode: "US", population: 750000, region: "Washington" },
  { slug: "austin", name: "Austin", country: "United States", countryCode: "US", population: 980000, region: "Texas" },
  { slug: "las-vegas", name: "Las Vegas", country: "United States", countryCode: "US", population: 640000, region: "Nevada" },
];

export function getReceptionistCity(slug: string): ReceptionistCity | undefined {
  return RECEPTIONIST_CITIES.find((c) => c.slug === slug);
}

export function getReceptionistCitySlugs(): string[] {
  return RECEPTIONIST_CITIES.map((c) => c.slug);
}

export interface CityFAQ {
  question: string;
  answer: string;
}

export function getCityFAQs(city: ReceptionistCity): CityFAQ[] {
  return [
    {
      question: `How does an AI receptionist work for ${city.name} businesses?`,
      answer: `VoiceFleet\u2019s AI receptionist answers your business phone calls 24/7 using natural-sounding AI. When a customer in ${city.name} calls, the AI greets them, handles enquiries, books appointments, and takes messages \u2014 just like a human receptionist, but available around the clock with no sick days.`,
    },
    {
      question: `How much does an AI receptionist cost in ${city.name}?`,
      answer: `VoiceFleet plans start at \u20ac99/month (Starter) with 500 minutes included. Growth (\u20ac299/mo) includes 1,000 minutes, and Pro (\u20ac599/mo) includes 2,000 minutes. Every plan includes a 30-day free trial. That\u2019s over 95% cheaper than hiring a full-time receptionist in ${city.name}.`,
    },
    {
      question: `Does VoiceFleet understand local ${city.name} accents?`,
      answer: `Yes. VoiceFleet uses advanced speech recognition trained on diverse English accents, including regional ${city.country} dialects. Our AI accurately understands callers from ${city.name} and the surrounding ${city.region} area, ensuring smooth conversations and correct message-taking.`,
    },
    {
      question: `How quickly can I set up VoiceFleet in ${city.name}?`,
      answer: `Setup takes under 5 minutes. Sign up, choose your plan, and forward your existing ${city.name} business number to your new VoiceFleet number. Your AI receptionist starts answering calls immediately \u2014 no hardware, no contracts, no technical skills required.`,
    },
    {
      question: `What integrations does VoiceFleet support for ${city.name} businesses?`,
      answer: `VoiceFleet integrates with popular tools used by ${city.name} businesses: Google Calendar, Outlook, Calendly for appointment booking; Slack and email for message notifications; and CRM systems for lead capture. All call recordings and transcripts are available in your dashboard.`,
    },
  ];
}
