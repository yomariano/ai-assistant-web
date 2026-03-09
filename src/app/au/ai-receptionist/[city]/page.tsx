import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getCityFAQs,
  getReceptionistCities,
  getReceptionistCity,
  getReceptionistCitySlugs,
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
  return getReceptionistCitySlugs("AU").map((city) => ({ city }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getReceptionistCity(slug, "AU");

  if (!city) {
    return {};
  }

  const title = `AI Receptionist in ${city.name}, Australia | VoiceFleet`;
  const description = `24/7 AI receptionist for ${city.name} businesses. Answer calls, book appointments, and take messages automatically with Australian pricing from A$140/mo.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `/au/ai-receptionist/${slug}`,
    },
    alternates: {
      canonical: `/au/ai-receptionist/${slug}`,
    },
  };
}

const VALUE_PROPS = [
  {
    icon: Clock,
    title: "24/7 Coverage",
    description:
      "Answer every inbound call after hours, on weekends, and during staff gaps without sending callers to voicemail.",
  },
  {
    icon: CalendarCheck,
    title: "Appointment Booking",
    description:
      "Let customers book directly into your calendar while your team stays focused on work already in progress.",
  },
  {
    icon: Globe,
    title: "Australian Voice Workflows",
    description:
      "Handle Australian English conversations, local routing rules, and lead capture flows designed for service businesses.",
  },
  {
    icon: PiggyBank,
    title: "Lower Reception Costs",
    description:
      "Plans start at A$140/mo instead of hiring full-time front-desk coverage just to keep the phones answered.",
  },
];

const STEPS = [
  {
    icon: UserPlus,
    step: "1",
    title: "Sign Up",
    description:
      "Create your account, choose an AU plan, and configure your greeting, booking rules, and escalation instructions.",
  },
  {
    icon: PhoneForwarded,
    step: "2",
    title: "Forward Your Number",
    description:
      "Forward your existing business number to your new VoiceFleet Australian number. Keep the number your customers already know.",
  },
  {
    icon: Bot,
    step: "3",
    title: "Go Live",
    description:
      "Your AI receptionist starts answering calls immediately, taking messages, capturing leads, and booking appointments around the clock.",
  },
];

export default async function AustraliaReceptionistCityPage({ params }: Props) {
  const { city: slug } = await params;
  const city = getReceptionistCity(slug, "AU");

  if (!city) {
    notFound();
  }

  const faqs = getCityFAQs(city);
  const relatedCities = getReceptionistCities("AU").filter((candidate) => candidate.slug !== slug).slice(0, 6);
  const breadcrumbs = [
    { name: "Home", href: "/au" },
    { name: "AI Receptionist", href: "/au/features" },
    { name: city.name, href: `/au/ai-receptionist/${slug}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <LocalBusinessSchema
        name={`VoiceFleet AI Receptionist - ${city.name}`}
        city={city.name}
        state={city.region}
      />
      <FAQSchema items={faqs} />

      <div className="min-h-screen bg-white">
        <Header />

        <div className="pt-20">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <section className="bg-gradient-to-br from-amber-400 via-blue-500 to-cyan-500 py-20">
          <div className="max-w-5xl mx-auto px-6 text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
              AI Receptionist for {city.name} Businesses
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Answer every call 24/7, capture more leads, and book appointments automatically for your team in {city.name}.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register?plan=starter&region=AU"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-slate-950 rounded-xl font-semibold hover:bg-white/90 transition-colors shadow-lg hover:shadow-xl"
              >
                Start Free Trial
              </Link>
              <Link
                href="/au#pricing"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
              >
                See AU Pricing
              </Link>
            </div>
          </div>
        </section>

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
                  <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <prop.icon className="h-6 w-6 text-amber-700" />
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

        <section className="bg-gray-50 py-16">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl font-heading font-bold text-center text-gray-900 mb-12">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {STEPS.map((step) => (
                <div key={step.step} className="text-center">
                  <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-gradient-to-br from-amber-400 to-cyan-400 flex items-center justify-center text-white text-xl font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <MidPageCTA />

        <section className="py-16">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-heading font-bold text-center text-gray-900 mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
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

        <section className="bg-gray-50 py-12">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Explore More
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Australian Cities
                </h3>
                <ul className="space-y-1">
                  {relatedCities.map((relatedCity) => (
                    <li key={relatedCity.slug}>
                      <Link
                        href={`/au/ai-receptionist/${relatedCity.slug}`}
                        className="text-blue-600 hover:underline"
                      >
                        AI Receptionist {relatedCity.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Directory
                </h3>
                <ul className="space-y-1">
                  <li>
                    <Link href="/au/directory" className="text-blue-600 hover:underline">
                      All Businesses
                    </Link>
                  </li>
                  <li>
                    <Link href="/au/directory/dentists" className="text-blue-600 hover:underline">
                      Dentists
                    </Link>
                  </li>
                  <li>
                    <Link href="/au/directory/restaurants" className="text-blue-600 hover:underline">
                      Restaurants
                    </Link>
                  </li>
                  <li>
                    <Link href="/au/directory/physios" className="text-blue-600 hover:underline">
                      Physios
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Product</h3>
                <ul className="space-y-1">
                  <li>
                    <Link href="/au/features" className="text-blue-600 hover:underline">
                      All Features
                    </Link>
                  </li>
                  <li>
                    <Link href="/connect" className="text-blue-600 hover:underline">
                      Integrations
                    </Link>
                  </li>
                  <li>
                    <Link href="/au/compare" className="text-blue-600 hover:underline">
                      Compare
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Get Started</h3>
                <ul className="space-y-1">
                  <li>
                    <Link href="/au#pricing" className="text-blue-600 hover:underline">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="/register?plan=starter&region=AU" className="text-blue-600 hover:underline">
                      Free Trial
                    </Link>
                  </li>
                  <li>
                    <Link href="/demo" className="text-blue-600 hover:underline">
                      Live Demo
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <CTASection
          title={`Ready to automate your ${city.name} business calls?`}
          description={`Start with AU pricing, local number provisioning, and an AI receptionist that keeps ${city.name} leads from slipping through.`}
          primaryButtonText="Start Free Trial"
          primaryButtonHref="/register?plan=starter&region=AU"
          secondaryButtonText="See AU Pricing"
          secondaryButtonHref="/au#pricing"
        />

        <Footer />
      </div>
    </>
  );
}
