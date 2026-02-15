import Link from "next/link";

interface CTASectionProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
}

const CALENDLY_URL = "https://calendly.com/voicefleet";

export default function CTASection({
  title = "Ready to automate your phone calls?",
  description = "Join businesses saving hours every week with AI-powered voice agents.",
  primaryButtonText = "Book a Demo",
  primaryButtonHref = CALENDLY_URL,
  secondaryButtonText = "See How It Works",
  secondaryButtonHref = "/#features",
}: CTASectionProps) {
  const isExternalLink = primaryButtonHref.startsWith("http");

  return (
    <section className="bg-gradient-hero py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-4">
          {title}
        </h2>
        <p className="text-lg lg:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {isExternalLink ? (
            <a
              href={primaryButtonHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary rounded-xl font-semibold hover:bg-white/90 transition-colors shadow-lg hover:shadow-xl"
              data-umami-event="cta_click"
              data-umami-event-location="cta_section"
            >
              {primaryButtonText}
            </a>
          ) : (
            <Link
              href={primaryButtonHref}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary rounded-xl font-semibold hover:bg-white/90 transition-colors shadow-lg hover:shadow-xl"
              data-umami-event="cta_click"
              data-umami-event-location="cta_section"
            >
              {primaryButtonText}
            </Link>
          )}
          <Link
            href={secondaryButtonHref}
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary-foreground text-primary-foreground rounded-xl font-semibold hover:bg-primary-foreground/10 transition-colors"
          >
            {secondaryButtonText}
          </Link>
        </div>
      </div>
    </section>
  );
}
