import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://voicefleet.ai';
const DISALLOWED_PATHS = [
  '/dashboard/',
  '/call/',
  '/agenda/',
  '/scheduled/',
  '/history/',
  '/settings/',
  '/auth/',
  '/api/',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: DISALLOWED_PATHS,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: DISALLOWED_PATHS,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: DISALLOWED_PATHS,
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: DISALLOWED_PATHS,
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow: DISALLOWED_PATHS,
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: DISALLOWED_PATHS,
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
