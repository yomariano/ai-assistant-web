/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    // Strip console.* calls from production bundles to keep the browser console clean.
    // Keep console.error for diagnosing real issues.
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
};

module.exports = nextConfig;

