/**
 * VoiceFleet SEO - Location Data
 * Ireland, UK, and US markets for geo-targeted pages
 */

import { City, Country } from '../types';

export const COUNTRIES: Record<string, Country> = {
  ireland: {
    slug: "ireland",
    name: "Ireland",
    code: "IE",
    language: "English",
    currency: "EUR",
    phoneFormat: "+353",
    cities: [
      { slug: "dublin", name: "Dublin", country: "Ireland", countryCode: "IE", population: 1400000, region: "Leinster" },
      { slug: "cork", name: "Cork", country: "Ireland", countryCode: "IE", population: 210000, region: "Munster" },
      { slug: "galway", name: "Galway", country: "Ireland", countryCode: "IE", population: 80000, region: "Connacht" },
      { slug: "limerick", name: "Limerick", country: "Ireland", countryCode: "IE", population: 95000, region: "Munster" },
      { slug: "waterford", name: "Waterford", country: "Ireland", countryCode: "IE", population: 54000, region: "Munster" },
      { slug: "drogheda", name: "Drogheda", country: "Ireland", countryCode: "IE", population: 41000, region: "Leinster" },
      { slug: "kilkenny", name: "Kilkenny", country: "Ireland", countryCode: "IE", population: 26000, region: "Leinster" },
      { slug: "sligo", name: "Sligo", country: "Ireland", countryCode: "IE", population: 20000, region: "Connacht" },
      { slug: "bray", name: "Bray", country: "Ireland", countryCode: "IE", population: 33000, region: "Leinster" },
      { slug: "carlow", name: "Carlow", country: "Ireland", countryCode: "IE", population: 24000, region: "Leinster" },
      { slug: "navan", name: "Navan", country: "Ireland", countryCode: "IE", population: 30000, region: "Leinster" },
      { slug: "athlone", name: "Athlone", country: "Ireland", countryCode: "IE", population: 21000, region: "Leinster" },
      { slug: "clonmel", name: "Clonmel", country: "Ireland", countryCode: "IE", population: 18000, region: "Munster" },
      { slug: "dundalk", name: "Dundalk", country: "Ireland", countryCode: "IE", population: 39000, region: "Leinster" }
    ]
  },

  uk: {
    slug: "uk",
    name: "United Kingdom",
    code: "GB",
    language: "English",
    currency: "GBP",
    phoneFormat: "+44",
    cities: [
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
      { slug: "nottingham", name: "Nottingham", country: "United Kingdom", countryCode: "GB", population: 330000, region: "England" }
    ]
  },

  usa: {
    slug: "usa",
    name: "United States",
    code: "US",
    language: "English",
    currency: "USD",
    phoneFormat: "+1",
    cities: [
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
      { slug: "las-vegas", name: "Las Vegas", country: "United States", countryCode: "US", population: 640000, region: "Nevada" }
    ]
  },

  argentina: {
    slug: "argentina",
    name: "Argentina",
    code: "AR",
    language: "Spanish",
    currency: "USD",
    phoneFormat: "+54",
    cities: [
      { slug: "buenos-aires", name: "Buenos Aires", country: "Argentina", countryCode: "AR", population: 3100000, region: "Buenos Aires" },
      { slug: "mar-del-plata", name: "Mar del Plata", country: "Argentina", countryCode: "AR", population: 614000, region: "Buenos Aires" },
      { slug: "formosa", name: "Formosa", country: "Argentina", countryCode: "AR", population: 270000, region: "Formosa" },
      { slug: "tucuman", name: "Tucumán", country: "Argentina", countryCode: "AR", population: 550000, region: "Tucumán" },
      { slug: "el-calafate", name: "El Calafate", country: "Argentina", countryCode: "AR", population: 22000, region: "Santa Cruz" },
      { slug: "san-martin-de-los-andes", name: "San Martín de los Andes", country: "Argentina", countryCode: "AR", population: 28000, region: "Neuquén" },
      { slug: "villa-gesell", name: "Villa Gesell", country: "Argentina", countryCode: "AR", population: 42000, region: "Buenos Aires" }
    ]
  }
};

// Get all country slugs
export const getCountrySlugs = (): string[] => Object.keys(COUNTRIES);

// Get country by slug
export const getCountry = (slug: string): Country | null => COUNTRIES[slug] || null;

// Get all cities for a country
export const getCitiesByCountry = (countrySlug: string): City[] => {
  const country = COUNTRIES[countrySlug];
  return country ? country.cities : [];
};

// Get city by slug and country
export const getCity = (countrySlug: string, citySlug: string): City | null => {
  const country = COUNTRIES[countrySlug];
  if (!country) return null;
  return country.cities.find(c => c.slug === citySlug) || null;
};

// Find city by slug across all countries
export const findCityBySlug = (citySlug: string): { city: City; country: Country } | null => {
  for (const country of Object.values(COUNTRIES)) {
    const city = country.cities.find(c => c.slug === citySlug);
    if (city) {
      return { city, country };
    }
  }
  return null;
};

// Get all cities across all countries
export const getAllCities = (): City[] => {
  return Object.values(COUNTRIES).flatMap(c => c.cities);
};

// Get total city count
export const getTotalCityCount = (): number => getAllCities().length;

// Get top cities by population
export const getTopCities = (limit: number = 10): City[] => {
  return getAllCities()
    .sort((a, b) => b.population - a.population)
    .slice(0, limit);
};

// Get cities by region
export const getCitiesByRegion = (region: string): City[] => {
  return getAllCities().filter(c => c.region === region);
};
