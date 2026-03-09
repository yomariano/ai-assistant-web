"use client";

import { Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { REVIEW_PLATFORMS } from "@/lib/marketing/review-platforms";
import SocialLinks from "@/components/voicefleet/SocialLinks";
import {
  getBlogPath,
  getComparePath,
  getDirectoryPath,
  getFeaturesPath,
  getMarketBasePath,
  getPricingPath,
  getReceptionistCityPath,
} from "@/lib/market";

const Footer = () => {
  const pathname = usePathname();
  const marketBasePath = getMarketBasePath(pathname);
  const featuresHref = getFeaturesPath(marketBasePath);
  const directoryHref = getDirectoryPath(marketBasePath);
  const compareHref = getComparePath(marketBasePath);
  const pricingHref = getPricingPath(marketBasePath);
  const blogHref = getBlogPath(marketBasePath);
  const directoryVerticalPrefix = marketBasePath === "/au" ? "/au/directory" : "/directory";
  const featuredCities =
    marketBasePath === "/au"
      ? [
          { name: "Sydney", slug: "sydney" },
          { name: "Melbourne", slug: "melbourne" },
          { name: "Brisbane", slug: "brisbane" },
          { name: "Perth", slug: "perth" },
          { name: "Adelaide", slug: "adelaide" },
          { name: "Gold Coast", slug: "gold-coast" },
        ]
      : [
          { name: "Dublin", slug: "dublin" },
          { name: "London", slug: "london" },
          { name: "New York", slug: "new-york" },
          { name: "Cork", slug: "cork" },
          { name: "Manchester", slug: "manchester" },
          { name: "Miami", slug: "miami" },
        ];

  return (
    <footer className="bg-gradient-dark text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href={marketBasePath} className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-foreground/10 rounded-xl flex items-center justify-center">
                <Image
                  src="/logo-mark.svg"
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </div>
              <span className="text-xl font-heading font-bold">VoiceFleet</span>
            </Link>
            <p className="text-sm text-primary-foreground/70 max-w-xs">
              AI voice receptionist for small businesses. Answer calls, take messages, and book appointments.
            </p>
            <Link
              href={`${marketBasePath}#product-tour`}
              className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              <Phone className="w-4 h-4" />
              Talk to our team
            </Link>
            <SocialLinks
              className="pt-1"
              linkClassName="h-9 w-9 border border-primary-foreground/20 bg-primary-foreground/5 text-primary-foreground/70 hover:text-primary-foreground hover:border-primary-foreground/40"
            />
          </div>

          {/* Links */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm">
              <Link href={featuresHref} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Features
              </Link>
              <Link href="/for" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Industries
              </Link>
              <Link href="/connect" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Integrations
              </Link>
              <Link href={compareHref} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Compare
              </Link>
              <Link href={pricingHref} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Pricing
              </Link>
              <Link href={blogHref} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Blog
              </Link>
              <Link href={directoryHref} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Directory
              </Link>
              <Link href="/privacy" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Terms
              </Link>
            </div>

            {/* Directory */}
            <div>
              <p className="text-xs font-semibold text-primary-foreground/50 uppercase tracking-wider mb-2">
                Directory
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <Link href={`${directoryVerticalPrefix}/restaurants`} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Restaurants
                </Link>
                <Link href={`${directoryVerticalPrefix}/dentists`} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Dental Practices
                </Link>
                <Link href={`${directoryVerticalPrefix}/salons`} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Hair Salons
                </Link>
                <Link href={`${directoryVerticalPrefix}/vets`} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Veterinary Clinics
                </Link>
                <Link href={`${directoryVerticalPrefix}/physios`} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Physiotherapy
                </Link>
              </div>
            </div>

            {/* Top Cities */}
            <div>
              <p className="text-xs font-semibold text-primary-foreground/50 uppercase tracking-wider mb-2">
                Featured Cities
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {featuredCities.map((city) => (
                  <Link
                    key={city.slug}
                    href={getReceptionistCityPath(marketBasePath, city.slug)}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {city.name}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-primary-foreground/50 uppercase tracking-wider mb-2">
                Review Platforms
              </p>
              <div className="flex flex-wrap gap-2.5">
                {REVIEW_PLATFORMS.map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-3 py-1.5 text-xs text-primary-foreground/80 hover:text-primary-foreground hover:border-primary-foreground/40 transition-colors"
                  >
                    <Image
                      src={platform.logo}
                      alt={platform.name}
                      width={16}
                      height={16}
                      className="h-4 w-4 object-contain"
                    />
                    <span className="font-medium">{platform.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary-foreground/10">
          <p className="text-sm text-primary-foreground/60 text-center">
            &copy; {new Date().getFullYear()} VoiceFleet. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
