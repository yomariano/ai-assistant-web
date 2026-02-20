import Link from "next/link";
import Image from "next/image";
import { Leaf } from "lucide-react";
import { INTEGRATIONS } from "@/lib/marketing/integrations";

type BrandItem = {
  id: string;
  name: string;
  logoSrc: string;
  href: string;
  external?: boolean;
};

const BRAND_NAME_OVERRIDES: Record<string, string> = {
  "Microsoft 365 (Outlook)": "Outlook",
};

const BRAND_LOGOS: Record<string, string> = {
  "google-calendar": "/integrations/google-calendar.png",
  "microsoft-365": "/integrations/outlook.png",
  calendly: "/integrations/calendly.png",
  "cal-com": "/integrations/cal-com.png",
  "square-appointments": "/integrations/square.png",
  "simplybook-me": "/integrations/simplybook-me.png",
  mindbody: "/integrations/mindbody.png",
  thefork: "/integrations/thefork.png",
  opentable: "/integrations/opentable.png",
  resy: "/integrations/resy.png",
};

const integrationBrands: BrandItem[] = INTEGRATIONS.map((integration) => ({
  id: integration.slug,
  name: BRAND_NAME_OVERRIDES[integration.name] || integration.name,
  logoSrc: BRAND_LOGOS[integration.slug],
  href: `/connect/${integration.slug}`,
}));

const reviewBrands: BrandItem[] = [
  {
    id: "trustpilot",
    name: "Trustpilot",
    logoSrc: "/integrations/trustpilot.svg",
    href: "https://www.trustpilot.com/",
    external: true,
  },
  {
    id: "g2",
    name: "G2",
    logoSrc: "/integrations/g2.svg",
    href: "https://www.g2.com/",
    external: true,
  },
  {
    id: "capterra",
    name: "Capterra",
    logoSrc: "/integrations/capterra.png",
    href: "https://www.capterra.com/",
    external: true,
  },
];

const brands = [...integrationBrands, ...reviewBrands];
const marqueeBrands = [...brands, ...brands];
const complianceBadges = ["GDPR compliant", "EU AI Act compliant"];

const IntegrationBrandsCarousel = () => {
  return (
    <section aria-label="Integration partners" className="py-6 lg:py-8 bg-background">
      <div className="container mx-auto px-4 mb-4">
        <p className="text-center text-[11px] sm:text-xs tracking-[0.14em] font-semibold uppercase text-muted-foreground">
          Trusted integrations for booking and scheduling workflows
        </p>
      </div>

      <div className="container mx-auto px-4 mb-5">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {complianceBadges.map((badge) => (
            <div
              key={badge}
              className="inline-flex items-center gap-2.5 rounded-full border border-border/70 bg-card/40 px-4 py-2 text-sm font-semibold text-foreground/65"
            >
              <Leaf className="h-4 w-4 -scale-x-100 text-muted-foreground/70" aria-hidden="true" />
              <span>{badge}</span>
              <Leaf className="h-4 w-4 text-muted-foreground/70" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>

      <div className="integration-marquee relative overflow-hidden border-y border-border/70 bg-card/30">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="integration-marquee-track py-4 sm:py-5">
          {marqueeBrands.map((brand, index) => (
            brand.external ? (
              <a
                key={`${brand.id}-${index}`}
                href={brand.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-1.5 sm:mx-2.5 inline-flex h-12 items-center gap-2.5 rounded-full border border-border bg-background/90 px-3.5 sm:px-4 hover:border-primary/40 transition-colors whitespace-nowrap"
                aria-label={brand.name}
              >
                <Image
                  src={brand.logoSrc}
                  alt={brand.name}
                  width={24}
                  height={24}
                  className="h-5 w-5 sm:h-6 sm:w-6 object-contain"
                />
                <span className="text-xs sm:text-sm font-semibold text-foreground/80">{brand.name}</span>
              </a>
            ) : (
              <Link
                key={`${brand.id}-${index}`}
                href={brand.href}
                className="mx-1.5 sm:mx-2.5 inline-flex h-12 items-center gap-2.5 rounded-full border border-border bg-background/90 px-3.5 sm:px-4 hover:border-primary/40 transition-colors whitespace-nowrap"
                aria-label={brand.name}
              >
                <Image
                  src={brand.logoSrc}
                  alt={brand.name}
                  width={24}
                  height={24}
                  className="h-5 w-5 sm:h-6 sm:w-6 object-contain"
                />
                <span className="text-xs sm:text-sm font-semibold text-foreground/80">{brand.name}</span>
              </Link>
            )
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntegrationBrandsCarousel;
