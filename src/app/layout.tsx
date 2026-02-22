import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500", "600"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["500", "600", "700", "800"],
});

const siteConfig = {
  name: "VoiceFleet",
  description:
    "VoiceFleet is an AI voice receptionist starting at \u20ac99/mo. Answers calls 24/7, books appointments, takes messages, sends notifications. EU data residency, setup in under 1 hour, 30-day free trial.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://voicefleet.ai",
  twitterHandle: "@voicefleetai",
};
const umamiScriptUrl = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ?? "";
const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ?? "";
const shouldLoadUmami =
  process.env.NEXT_PUBLIC_UMAMI_ENABLED === "true" &&
  umamiScriptUrl.startsWith("https://") &&
  umamiWebsiteId.length > 0;

const gaId = process.env.NEXT_PUBLIC_GA_ID ?? "";
const shouldLoadGA = gaId.startsWith("G-") && gaId.length > 0;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - AI Voice Receptionist for Small Businesses`,
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
    title: `${siteConfig.name} - AI Voice Receptionist for Small Businesses`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: `${siteConfig.name} - AI Voice Receptionist for Small Businesses`,
    description: siteConfig.description,
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
        className={`${inter.variable} ${jetbrainsMono.variable} ${plusJakartaSans.variable} antialiased`}
      >
        {children}
        {shouldLoadUmami && (
          <Script
            src={umamiScriptUrl}
            data-website-id={umamiWebsiteId}
            strategy="afterInteractive"
          />
        )}
        {shouldLoadGA && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
