import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getReceptionistCity,
  getReceptionistCitySlugs,
  getCityFAQs,
} from "@/lib/content/receptionist-cities";
import {
  LocalBusinessSchema,
  BreadcrumbSchema,
  FAQSchema,
} from "@/components/seo";
import Breadcrumbs from "@/components/marketing/Breadcrumbs";
import CTASection from "@/components/marketing/CTASection";
import MidPageCTA from "@/components/marketing/MidPageCTA";
import Header from "@/components/voicefleet/Header";
import Footer from "@/components/voicefleet/Footer";
import {
  Clock,
  CalendarCheck,
  Globe,
  PiggyBank,
  UserPlus,
  PhoneForwarded,
  Bot,
} from "lucide-react";

interface Props {
  params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
  return getReceptionistCitySlugs().map((city) => ({ city }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getReceptionistCity(slug);
  if (!city) return {};

  const title = `AI Receptionist in ${city.name} | VoiceFleet`;
  const description = `24/7 AI receptionist for ${city.name} businesses. Answer calls, book appointments, and take messages automatically. Plans from \u20ac99/mo. Try free for 30 days.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `/ai-receptionist/${slug}`,
    },
    alternates: {
      canonical: `/ai-receptionist/${slug}`,
    },
  };
}

const VALUE_PROPS = [
  {
    icon: Clock,
    title: "24/7 Availability",
    description:
      "Never miss a call again. Your AI receptionist answers every call, day or night, weekends and holidays included.",
  },
  {
    icon: CalendarCheck,
    title: "Appointment Booking",
    description:
      "Automatically schedule appointments into your calendar. Customers get instant confirmation without waiting on hold.",
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    description:
      "Handle calls in English, Spanish, French, German, and Italian. Serve diverse customers in their preferred language.",
  },
  {
    icon: PiggyBank,
    title: "95% Cost Savings",
    description:
      "Plans from \u20ac99/mo vs \u20ac56,000/year for a human receptionist. Same quality service at a fraction of the cost.",
  },
];

const STEPS = [
  {
    icon: UserPlus,
    step: "1",
    title: "Sign Up",
    description:
      "Create your account in under 2 minutes. Choose your plan and customise your AI receptionist\u2019s greeting and responses.",
  },
  {
    icon: PhoneForwarded,
    step: "2",
    title: "Forward Your Number",
    description:
      "Forward your existing business phone number to your new VoiceFleet number. No new number needed \u2014 keep the one your customers know.",
  },
  {
    icon: Bot,
    step: "3",
    title: "AI Answers Calls",
    description:
      "Your AI receptionist starts answering calls immediately. It greets callers, handles enquiries, books appointments, and sends you summaries.",
  },
];

export default async function CityPage({ params }: Props) {
  const { city: slug } = await params;
  const city = getReceptionistCity(slug);

  if (!city) {
    notFound();
  }

  const faqs = getCityFAQs(city);

  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "AI Receptionist", href: "/features" },
    { name: city.name, href: `/ai-receptionist/${slug}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <LocalBusinessSchema
        name={`VoiceFleet AI Receptionist — ${city.name}`}
        city={city.name}
        state={city.region}
      />
      <FAQSchema items={faqs} />

      <div className="min-h-screen bg-white">
        <Header />

        {/* Breadcrumbs */}
        <div className="pt-20">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-600 to-emerald-500 py-20">
          <div className="max-w-5xl mx-auto px-6 text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
              AI Receptionist for {city.name} Businesses
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Answer every call 24/7, book appointments automatically, and never
              lose a customer in {city.name} again. Set up in under 5 minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-white/90 transition-colors shadow-lg hover:shadow-xl"
              >
                Start Free Trial
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
              >
                See Pricing
              </Link>
            </div>
          </div>
        </section>

        {/* Value Props */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-heading font-bold text-center text-gray-900 mb-12">
              Why {city.name} Businesses Choose VoiceFleet
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {VALUE_PROPS.map((prop) => (
                <div
                  key={prop.title}
                  className="bg-gray-50 p-6 rounded-2xl text-center"
                >
                  <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <prop.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {prop.title}
                  </h3>
                  <p className="text-sm text-gray-600">{prop.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl font-heading font-bold text-center text-gray-900 mb-12">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {STEPS.map((s) => (
                <div key={s.step} className="text-center">
                  <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center text-white text-xl font-bold">
                    {s.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-gray-600">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MidPageCTA */}
        <MidPageCTA />

        {/* FAQ */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-heading font-bold text-center text-gray-900 mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group border border-gray-200 rounded-xl p-6 open:shadow-sm transition-shadow"
                >
                  <summary className="cursor-pointer text-lg font-semibold text-gray-900 list-none flex items-center justify-between gap-4">
                    {faq.question}
                    <span className="flex-shrink-0 text-gray-400 group-open:rotate-45 transition-transform text-xl">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Internal Links */}
        <section className="bg-gray-50 py-12">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Explore More
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  By Location
                </h3>
                <ul className="space-y-1">
                  {["dublin", "london", "new-york", "cork", "manchester"].map(
                    (s) => {
                      if (s === slug) return null;
                      const c = getReceptionistCity(s);
                      if (!c) return null;
                      return (
                        <li key={s}>
                          <Link
                            href={`/ai-receptionist/${s}`}
                            className="text-blue-600 hover:underline"
                          >
                            AI Receptionist {c.name}
                          </Link>
                        </li>
                      );
                    }
                  )}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  By Industry
                </h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/for/dental-practices"
                      className="text-blue-600 hover:underline"
                    >
                      Dental Practices
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/for/restaurants"
                      className="text-blue-600 hover:underline"
                    >
                      Restaurants
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/for/beauty-salons"
                      className="text-blue-600 hover:underline"
                    >
                      Beauty Salons
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/for/plumbers"
                      className="text-blue-600 hover:underline"
                    >
                      Plumbers
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Features</h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/features"
                      className="text-blue-600 hover:underline"
                    >
                      All Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/connect"
                      className="text-blue-600 hover:underline"
                    >
                      Integrations
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/compare"
                      className="text-blue-600 hover:underline"
                    >
                      Compare
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Get Started</h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/pricing"
                      className="text-blue-600 hover:underline"
                    >
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/register"
                      className="text-blue-600 hover:underline"
                    >
                      Free Trial
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/demo"
                      className="text-blue-600 hover:underline"
                    >
                      Live Demo
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <CTASection
          title={`Ready to automate your ${city.name} business calls?`}
          description={`Join businesses in ${city.name} saving hours every week with AI-powered voice agents.`}
          primaryButtonText="Start Free Trial"
          primaryButtonHref="/register"
        />

        <Footer />
      </div>
    </>
  );
}
