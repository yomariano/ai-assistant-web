import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Orbitron } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500", "600"],
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "500", "700", "900"],
});

const siteConfig = {
  name: "VoiceFleet",
  description:
    "AI Voice Agents that handle calls at 80% lower cost. Scale support without scaling headcount.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://voicefleet.ai",
  twitterHandle: "@volocefleetai",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - AI Voice Agents for Phone Calls`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "AI voice assistant",
    "AI receptionist",
    "AI phone receptionist",
    "virtual receptionist",
    "automated phone calls",
    "AI agent",
    "phone automation",
    "phone answering service",
    "call scheduling",
    "appointment booking",
    "voice AI",
    "phone call AI",
    "virtual assistant",
    "AI caller",
    "automated calling",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} - AI Voice Agents for Phone Calls`,
    description: siteConfig.description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - AI Voice Receptionist`,
      },
      {
        url: "/og-16x9",
        width: 1600,
        height: 900,
        alt: `${siteConfig.name} - AI Voice Receptionist`,
      },
      {
        url: "/og-square",
        width: 1200,
        height: 1200,
        alt: `${siteConfig.name} - AI Voice Receptionist`,
      },
      {
        url: "/og-story",
        width: 1080,
        height: 1920,
        alt: `${siteConfig.name} - AI Voice Receptionist`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: `${siteConfig.name} - AI Voice Agents for Phone Calls`,
    description: siteConfig.description,
    images: [
      {
        url: "/twitter-image",
        width: 1200,
        height: 600,
        alt: `${siteConfig.name} - AI Voice Receptionist`,
      },
    ],
  },
  alternates: {
    canonical: siteConfig.url,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
  category: "technology",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0066ff" },
    { media: "(prefers-color-scheme: dark)", color: "#00ccff" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${orbitron.variable} antialiased`}
      >
        {children}
        {process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL && process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            src={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
