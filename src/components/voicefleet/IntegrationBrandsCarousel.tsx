import Link from "next/link";
import { INTEGRATIONS } from "@/lib/marketing/integrations";

const BRAND_NAME_OVERRIDES: Record<string, string> = {
  "Microsoft 365 (Outlook)": "Outlook",
};

const brands = INTEGRATIONS.map((integration) => ({
  slug: integration.slug,
  name: BRAND_NAME_OVERRIDES[integration.name] || integration.name,
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
              className="mx-1.5 sm:mx-2.5 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-xs sm:text-sm font-semibold text-foreground/70 hover:text-foreground hover:border-primary/40 transition-colors whitespace-nowrap"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-foreground/30" />
              <span>{brand.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntegrationBrandsCarousel;
