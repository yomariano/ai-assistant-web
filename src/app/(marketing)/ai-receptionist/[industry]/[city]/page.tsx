import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";
import {
  getReceptionistCity,
  getReceptionistCitySlugs,
} from "@/lib/content/receptionist-cities";
import {
  getReceptionistIndustry,
  getReceptionistIndustrySlugs,
} from "@/lib/content/receptionist-industries";
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
  params: Promise<{ industry: string; city: string }>;
}

export async function generateStaticParams() {
  return getReceptionistIndustrySlugs().flatMap((industry) =>
    getReceptionistCitySlugs().map((city) => ({ industry, city })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry: rawIndustry, city: citySlug } = await params;
  const industry = getReceptionistIndustry(rawIndustry);
  const city = getReceptionistCity(citySlug);

  if (!industry || !city) {
    return {};
  }

  const title = `AI Receptionist for ${industry.label} in ${city.name} | VoiceFleet`;
  const description = `24/7 AI receptionist for ${industry.label.toLowerCase()} in ${city.name}. Answer calls, book appointments, and take messages automatically.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `/ai-receptionist/${industry.slug}/${citySlug}`,
    },
    alternates: {
      canonical: `/ai-receptionist/${industry.slug}/${citySlug}`,
    },
  };
}

const VALUE_PROPS = [
  {
    icon: Clock,
    title: "24/7 Availability",
    description:
      "Never miss a call again. Your AI receptionist answers every call after hours, on weekends, and during busy periods.",
  },
  {
    icon: CalendarCheck,
    title: "Booking & Intake",
    description:
      "Capture appointments, quote requests, and new enquiries automatically so callers get an immediate next step.",
  },
  {
    icon: Globe,
    title: "Natural Conversations",
    description:
      "Handle customer questions in a natural voice, qualify leads, and route urgent calls when a human needs to step in.",
  },
  {
    icon: PiggyBank,
    title: "Lower Front Desk Costs",
    description:
      "Plans start from €99/mo instead of staffing every call window with manual coverage just to avoid missed leads.",
  },
];

const STEPS = [
  {
    icon: UserPlus,
    step: "1",
    title: "Set Up Your Workflow",
    description:
      "Configure your greeting, booking questions, escalation rules, and the specific details your team needs after each call.",
  },
  {
    icon: PhoneForwarded,
    step: "2",
    title: "Forward Your Number",
    description:
      "Forward your business number to VoiceFleet so callers keep using the number they already know.",
  },
  {
    icon: Bot,
    step: "3",
    title: "Start Handling Calls",
    description:
      "VoiceFleet answers immediately, captures every enquiry, and sends call summaries to your team in real time.",
  },
];

export default async function IndustryReceptionistCityPage({ params }: Props) {
  const { industry: rawIndustry, city: citySlug } = await params;
  const industry = getReceptionistIndustry(rawIndustry);
  const city = getReceptionistCity(citySlug);

  if (!industry || !city) {
    notFound();
  }

  if (rawIndustry !== industry.slug) {
    permanentRedirect(`/ai-receptionist/${industry.slug}/${citySlug}`);
  }

  const faqs = [
    {
      question: `How does an AI receptionist help ${industry.label.toLowerCase()} in ${city.name}?`,
      answer: `VoiceFleet answers inbound calls for ${industry.label.toLowerCase()} in ${city.name}, handles common questions, captures new leads, and books appointments or callbacks automatically.`,
    },
    {
      question: `Can VoiceFleet book appointments for a ${industry.singular} in ${city.name}?`,
      answer: `Yes. VoiceFleet can collect the caller's details, capture booking preferences, and push the request into your calendar or handoff workflow so your team can confirm the appointment quickly.`,
    },
    {
      question: `What happens if a ${industry.singular} caller needs a person immediately?`,
      answer: `You control escalation. VoiceFleet can transfer urgent calls, take a detailed message, or flag time-sensitive requests for immediate follow-up from your team.`,
    },
    {
      question: `Does VoiceFleet work outside business hours in ${city.name}?`,
      answer: `Yes. VoiceFleet answers 24/7, so your ${industry.singular} keeps capturing calls in ${city.name} even when your front desk or staff are unavailable.`,
    },
  ];

  const relatedCities = getReceptionistCitySlugs()
    .filter((slug) => slug !== citySlug)
    .slice(0, 6);
  const relatedIndustries = getReceptionistIndustrySlugs()
    .filter((slug) => slug !== industry.slug);
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "AI Receptionist", href: "/features" },
    { name: industry.label, href: industry.useCaseHref },
    { name: city.name, href: `/ai-receptionist/${industry.slug}/${citySlug}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <LocalBusinessSchema
        name={`VoiceFleet AI Receptionist - ${industry.label} in ${city.name}`}
        city={city.name}
        state={city.region}
      />
      <FAQSchema items={faqs} />

      <div className="min-h-screen bg-white">
        <Header />

        <div className="pt-20">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <section className="bg-gradient-to-br from-blue-600 to-emerald-500 py-20">
          <div className="max-w-5xl mx-auto px-6 text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
              AI Receptionist for {industry.label} in {city.name}
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Answer every call 24/7, capture more enquiries, and streamline intake for your {industry.singular} in {city.name}.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-white/90 transition-colors shadow-lg hover:shadow-xl"
              >
                Start Free Trial
              </Link>
              <Link
                href={industry.useCaseHref}
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
              >
                Explore Use Case
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-heading font-bold text-center text-gray-900 mb-12">
              Why {industry.label} in {city.name} Choose VoiceFleet
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

        <section className="bg-gray-50 py-16">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl font-heading font-bold text-center text-gray-900 mb-12">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {STEPS.map((step) => (
                <div key={step.step} className="text-center">
                  <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center text-white text-xl font-bold">
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
              {faqs.map((faq, index) => (
                <details
                  key={index}
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
                  More Cities
                </h3>
                <ul className="space-y-1">
                  {relatedCities.map((slug) => {
                    const relatedCity = getReceptionistCity(slug);
                    if (!relatedCity) return null;
                    return (
                      <li key={slug}>
                        <Link
                          href={`/ai-receptionist/${industry.slug}/${slug}`}
                          className="text-blue-600 hover:underline"
                        >
                          {industry.label} in {relatedCity.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Other Industries
                </h3>
                <ul className="space-y-1">
                  {relatedIndustries.map((slug) => {
                    const relatedIndustry = getReceptionistIndustry(slug);
                    if (!relatedIndustry) return null;
                    return (
                      <li key={slug}>
                        <Link
                          href={`/ai-receptionist/${slug}/${citySlug}`}
                          className="text-blue-600 hover:underline"
                        >
                          {relatedIndustry.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Directory
                </h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href={industry.directoryHref}
                      className="text-blue-600 hover:underline"
                    >
                      Browse {industry.label}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`${industry.directoryHref}/${citySlug}`}
                      className="text-blue-600 hover:underline"
                    >
                      {industry.label} in {city.name}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/directory"
                      className="text-blue-600 hover:underline"
                    >
                      All Businesses
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

        <CTASection
          title={`Ready to automate calls for your ${city.name} ${industry.singular}?`}
          description={`Join ${industry.label.toLowerCase()} in ${city.name} already saving time with VoiceFleet.`}
          primaryButtonText="Start Free Trial"
          primaryButtonHref="/register"
        />

        <Footer />
      </div>
    </>
  );
}
