import type { NextConfig } from "next";
import { execSync } from "child_process";

const nextConfig: NextConfig = {
  // Force unique build IDs so Coolify/Nixpacks never serves stale JS chunks
  generateBuildId: async () => {
    try {
      return execSync("git rev-parse --short HEAD").toString().trim();
    } catch {
      return `build-${Date.now()}`;
    }
  },

  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "voicefleet.ai",
      },
    ],
    // Modern image formats for better compression
    formats: ["image/avif", "image/webp"],
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Experimental optimizations
  experimental: {
    // Optimize package imports for smaller bundles
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
      "date-fns",
    ],
  },

  // Enable compression
  compress: true,

  // Strip console.* calls from production bundles (keep console.error)
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },

  // Strict mode for better development experience
  reactStrictMode: true,

  // Redirect bare industry slugs to /for/[industry] pages
  async redirects() {
    return [
      // /industries/:slug → /for/:slug (old URL format)
      { source: "/industries/:slug", destination: "/for/:slug", permanent: true },
      // /blog/es/ → /es/blog/ (Spanish blog canonical URL)
      { source: "/blog/es", destination: "/es/blog", permanent: true },
      { source: "/blog/es/:path*", destination: "/es/blog/:path*", permanent: true },
      { source: "/restaurants", destination: "/for/restaurants", permanent: true },
      { source: "/dental", destination: "/for/dental-practices", permanent: true },
      { source: "/dental-clinics", destination: "/for/dental-practices", permanent: true },
      { source: "/dental-practices", destination: "/for/dental-practices", permanent: true },
      { source: "/plumbers", destination: "/for/plumbers", permanent: true },
      { source: "/electricians", destination: "/for/electricians", permanent: true },
      { source: "/for/dental-clinics", destination: "/for/dental-practices", permanent: true },
      { source: "/for/real-estate", destination: "/for/real-estate-agencies", permanent: true },
      { source: "/for/hvac", destination: "/for/hvac-services", permanent: true },
      { source: "/salons", destination: "/for/hair-salons", permanent: true },
      { source: "/hair-salons", destination: "/for/hair-salons", permanent: true },
      { source: "/spas", destination: "/for/spas", permanent: true },
      { source: "/real-estate", destination: "/for/real-estate-agencies", permanent: true },
      { source: "/real-estate-agencies", destination: "/for/real-estate-agencies", permanent: true },
      { source: "/hvac", destination: "/for/hvac-services", permanent: true },
      { source: "/hvac-services", destination: "/for/hvac-services", permanent: true },
      { source: "/medical-clinics", destination: "/for/medical-clinics", permanent: true },
      { source: "/law-firms", destination: "/for/law-firms", permanent: true },
    ];
  },

  // Headers for security and caching
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
      {
        // Cache static image assets
        source: "/(.*).(jpg|jpeg|png|gif|ico|svg|webp|avif)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache fonts
        source: "/(.*).(woff|woff2|ttf|eot)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

};

export default nextConfig;
