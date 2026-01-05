import Link from "next/link";

interface CTASectionProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
}

export default function CTASection({
  title = "Ready to automate your phone calls?",
  description = "Join thousands of businesses saving hours every week with AI-powered phone calls.",
  primaryButtonText = "Start Free Trial",
  primaryButtonHref = "/login",
  secondaryButtonText = "See How It Works",
  secondaryButtonHref = "/#how-it-works",
}: CTASectionProps) {
  return (
    <section className="bg-gradient-to-br from-orange-500 to-orange-600 py-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {title}
        </h2>
        <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={primaryButtonHref}
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-colors shadow-lg hover:shadow-xl"
          >
            {primaryButtonText}
          </Link>
          <Link
            href={secondaryButtonHref}
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
          >
            {secondaryButtonText}
          </Link>
        </div>
      </div>
    </section>
  );
}
