/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    // Strip console.* calls from production bundles to keep the browser console clean.
    // Keep console.error for diagnosing real issues.
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },

  // Redirect bare industry slugs to /for/[industry] pages
  // Users expect /restaurants/ and /dental/ to work
  async redirects() {
    return [
      // Common industry shortcuts
      {
        source: '/restaurants',
        destination: '/for/restaurants',
        permanent: true,
      },
      {
        source: '/dental',
        destination: '/for/dental-practices',
        permanent: true,
      },
      {
        source: '/dental-clinics',
        destination: '/for/dental-practices',
        permanent: true,
      },
      {
        source: '/dental-practices',
        destination: '/for/dental-practices',
        permanent: true,
      },
      // Other popular industries
      {
        source: '/plumbers',
        destination: '/for/plumbers',
        permanent: true,
      },
      {
        source: '/electricians',
        destination: '/for/electricians',
        permanent: true,
      },
      // Fix old /for/ URLs that used wrong slugs
      {
        source: '/for/dental-clinics',
        destination: '/for/dental-practices',
        permanent: true,
      },
      {
        source: '/for/real-estate',
        destination: '/for/real-estate-agencies',
        permanent: true,
      },
      {
        source: '/for/hvac',
        destination: '/for/hvac-services',
        permanent: true,
      },
      {
        source: '/salons',
        destination: '/for/hair-salons',
        permanent: true,
      },
      {
        source: '/hair-salons',
        destination: '/for/hair-salons',
        permanent: true,
      },
      {
        source: '/spas',
        destination: '/for/spas',
        permanent: true,
      },
      {
        source: '/real-estate',
        destination: '/for/real-estate-agencies',
        permanent: true,
      },
      {
        source: '/real-estate-agencies',
        destination: '/for/real-estate-agencies',
        permanent: true,
      },
      {
        source: '/hvac',
        destination: '/for/hvac-services',
        permanent: true,
      },
      {
        source: '/hvac-services',
        destination: '/for/hvac-services',
        permanent: true,
      },
      {
        source: '/medical-clinics',
        destination: '/for/medical-clinics',
        permanent: true,
      },
      {
        source: '/law-firms',
        destination: '/for/law-firms',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;

