import Link from "next/link";
import Image from "next/image";
import { INTEGRATIONS } from "@/lib/marketing/integrations";

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

const brands = INTEGRATIONS.map((integration) => ({
  slug: integration.slug,
  name: BRAND_NAME_OVERRIDES[integration.name] || integration.name,
  logoSrc: BRAND_LOGOS[integration.slug],
}));

const marqueeBrands = [...brands, ...brands];

const IntegrationBrandsCarousel = () => {
  return (
    <section aria-label="Integration partners" className="py-6 lg:py-8 bg-background">
      <div className="container mx-auto px-4 mb-4">
        <p className="text-center text-[11px] sm:text-xs tracking-[0.14em] font-semibold uppercase text-muted-foreground">
          Trusted integrations for booking and scheduling workflows
        </p>
      </div>

      <div className="integration-marquee relative overflow-hidden border-y border-border/70 bg-card/30">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="integration-marquee-track py-4 sm:py-5">
          {marqueeBrands.map((brand, index) => (
            <Link
              key={`${brand.slug}-${index}`}
              href={`/connect/${brand.slug}`}
              className="mx-1.5 sm:mx-2.5 inline-flex h-12 w-20 sm:h-14 sm:w-24 items-center justify-center rounded-2xl border border-border bg-background/90 hover:border-primary/40 transition-colors"
              aria-label={brand.name}
            >
              {brand.logoSrc ? (
                <Image
                  src={brand.logoSrc}
                  alt={brand.name}
                  width={38}
                  height={38}
                  className="h-6 w-6 sm:h-7 sm:w-7 object-contain grayscale opacity-75 hover:opacity-100 transition-opacity"
                />
              ) : (
                <span className="text-[10px] font-semibold text-muted-foreground">{brand.name}</span>
              )}
              <span className="sr-only">{brand.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntegrationBrandsCarousel;
