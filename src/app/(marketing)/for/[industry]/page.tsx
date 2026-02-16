import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getUseCasePage, getUseCaseSlugs } from "@/lib/content/use-cases";
import { generateUseCaseMetadata } from "@/lib/seo/metadata";
import { BreadcrumbSchema, FAQSchema } from "@/components/seo";
import Breadcrumbs from "@/components/marketing/Breadcrumbs";
import CTASection from "@/components/marketing/CTASection";
import InternalLinks from "@/components/marketing/InternalLinks";
import MidPageCTA from "@/components/marketing/MidPageCTA";
import Header from "@/components/voicefleet/Header";
import Footer from "@/components/voicefleet/Footer";
import { Check, AlertTriangle, Sparkles, TrendingDown, TrendingUp, Phone, Clock, Euro, Users } from "lucide-react";

interface Props {
  params: Promise<{ industry: string }>;
}

export async function generateStaticParams() {
  const slugs = await getUseCaseSlugs();
  return slugs.map((industry) => ({ industry }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry } = await params;
  const page = await getUseCasePage(industry);

  if (!page) {
    return {};
  }

  return generateUseCaseMetadata(page);
}

export default async function UseCasePage({ params }: Props) {
  const { industry } = await params;
  const page = await getUseCasePage(industry);

  if (!page) {
    notFound();
  }

  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Industries", href: "/for" },
    { name: page.industry_name, href: `/for/${industry}` },
  ];

  const faqItems = [
    {
      question: `Can VoiceFleet book appointments for ${page.industry_name.toLowerCase()}?`,
      answer:
        "Yes. VoiceFleet can capture the caller's intent and details, then book into your calendar or booking system (or take a structured booking request, depending on your setup).",
    },
    {
      question: "What happens if the AI can't handle a call?",
      answer:
        "You control escalation: transfer to staff, take a detailed message, or flag urgent calls for immediate attention.",
    },
    {
      question: "How do I start using VoiceFleet?",
      answer:
        "Most teams start by forwarding their existing phone number. You then configure greeting, booking fields, and business rules in the dashboard.",
    },
    {
      question: "Does it integrate with calendars and booking tools?",
      answer:
        "Yes. VoiceFleet supports calendar and booking integrations so availability and bookings can sync with your existing tools.",
    },
    {
      question: "Is VoiceFleet suitable for small teams?",
      answer:
        "Yes. It's designed for SMBs that need reliable phone coverage without adding headcount, while keeping control over what the AI says and does.",
    },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema items={faqItems} />

      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16 lg:pt-20">
          <Breadcrumbs items={breadcrumbs} />

          {/* Hero Section */}
          <section className="bg-gradient-to-br from-blue-600 to-emerald-500 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  {page.headline}
                </h1>
                <p className="text-xl text-indigo-100 mb-8">
                  {page.subheadline}
                </p>
                <Link
                  href={page.cta_url}
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors shadow-lg"
                >
                  {page.cta_text}
                </Link>
              </div>
              {page.hero_image_url && (
                <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={page.hero_image_url}
                    alt={page.hero_image_alt || page.industry_name}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Problem/Solution - Redesigned */}
        {(page.problem_statement || page.solution_description) && (
          <section>
            {/* The Challenge */}
            {page.problem_statement && (
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 py-16">
                <div className="max-w-7xl mx-auto px-6">
                  {/* Header */}
                  <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 mb-6">
                      <div className="p-2 bg-red-500/20 rounded-lg">
                        <AlertTriangle className="h-6 w-6 text-red-400" />
                      </div>
                      <span className="text-red-400 font-semibold uppercase tracking-wide text-sm">The Problem</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                      Why {page.industry_name} Struggle with Phone Calls
                    </h2>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Text Content - Better formatted */}
                    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8">
                      <div className="space-y-4">
                        {page.problem_statement.split('. ').reduce((acc: string[][], sentence, index, arr) => {
                          const groupIndex = Math.floor(index / 2);
                          if (!acc[groupIndex]) acc[groupIndex] = [];
                          acc[groupIndex].push(sentence + (index < arr.length - 1 ? '.' : ''));
                          return acc;
                        }, []).map((group, i) => (
                          <p key={i} className="text-slate-300 leading-relaxed">
                            {group.join(' ')}
                          </p>
                        ))}
                      </div>

                      {/* Pain Points */}
                      <div className="mt-8 pt-6 border-t border-white/10">
                        <h4 className="font-semibold text-white mb-4">Common Pain Points:</h4>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="mt-1 p-1 bg-red-500/20 rounded-full">
                              <AlertTriangle className="h-4 w-4 text-red-400" />
                            </div>
                            <span className="text-slate-300"><strong className="text-white">Missed Revenue</strong> — Every unanswered call is a lost customer</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="mt-1 p-1 bg-red-500/20 rounded-full">
                              <AlertTriangle className="h-4 w-4 text-red-400" />
                            </div>
                            <span className="text-slate-300"><strong className="text-white">High Staff Costs</strong> — Receptionists cost €25,000+ per year</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="mt-1 p-1 bg-amber-500/20 rounded-full">
                              <Clock className="h-4 w-4 text-amber-400" />
                            </div>
                            <span className="text-slate-300"><strong className="text-white">After-Hours Gaps</strong> — Customers call when you&apos;re closed</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="mt-1 p-1 bg-amber-500/20 rounded-full">
                              <Users className="h-4 w-4 text-amber-400" />
                            </div>
                            <span className="text-slate-300"><strong className="text-white">Staff Distraction</strong> — Constant interruptions hurt productivity</span>
                          </div>
                        </div>
                      </div>

                      {/* Related Links */}
                      <div className="mt-6 pt-6 border-t border-white/10">
                        <p className="text-slate-400 text-sm mb-3">See how others solved this:</p>
                        <div className="flex flex-wrap gap-2">
                          <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                            <span>Case Studies</span>
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                          </Link>
                          <span className="text-slate-600">•</span>
                          <Link href="/features" className="inline-flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                            <span>How It Works</span>
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 group hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingDown className="h-5 w-5 text-red-400" />
                          <span className="text-slate-400 text-sm">Missed Calls</span>
                        </div>
                        <div className="text-4xl font-bold text-white mb-1">Varies</div>
                        <div className="text-slate-500 text-sm">by call volume and staffing</div>
                        <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full w-[55%] bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
                        </div>
                        <p className="mt-3 text-xs text-slate-600 group-hover:text-slate-500 transition-colors">A common pain point for busy teams.</p>
                      </div>

                      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 group hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <Euro className="h-5 w-5 text-red-400" />
                          <span className="text-slate-400 text-sm">Lost Revenue</span>
                        </div>
                        <div className="text-4xl font-bold text-white mb-1">At risk</div>
                        <div className="text-slate-500 text-sm">when callers hang up</div>
                        <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full w-[65%] bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
                        </div>
                        <p className="mt-3 text-xs text-slate-600 group-hover:text-slate-500 transition-colors">Missed calls often mean missed bookings.</p>
                      </div>

                      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 group hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-5 w-5 text-amber-400" />
                          <span className="text-slate-400 text-sm">After Hours</span>
                        </div>
                        <div className="text-4xl font-bold text-white mb-1">Often</div>
                        <div className="text-slate-500 text-sm">when you can&apos;t pick up</div>
                        <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full w-[40%] bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full" />
                        </div>
                        <p className="mt-3 text-xs text-slate-600 group-hover:text-slate-500 transition-colors">Capture leads even after closing time.</p>
                      </div>

                      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 group hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-5 w-5 text-amber-400" />
                          <span className="text-slate-400 text-sm">Staff Cost</span>
                        </div>
                        <div className="text-4xl font-bold text-white mb-1">High</div>
                        <div className="text-slate-500 text-sm">for peak coverage</div>
                        <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full w-[80%] bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full" />
                        </div>
                        <p className="mt-3 text-xs text-slate-600 group-hover:text-slate-500 transition-colors">Automation reduces interruptions for your team.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* The Solution */}
            {page.solution_description && (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 py-16">
                <div className="max-w-7xl mx-auto px-6">
                  {/* Header */}
                  <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 mb-6">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Sparkles className="h-6 w-6 text-emerald-600" />
                      </div>
                      <span className="text-emerald-600 font-semibold uppercase tracking-wide text-sm">The Solution</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                      VoiceFleet AI for {page.industry_name}
                    </h2>
                  </div>

                  {/* Content Grid */}
                  <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Text Content - Better formatted */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-emerald-100">
                      <div className="prose prose-lg max-w-none">
                        {page.solution_description.split('. ').reduce((acc: string[][], sentence, index, arr) => {
                          const groupIndex = Math.floor(index / 2);
                          if (!acc[groupIndex]) acc[groupIndex] = [];
                          acc[groupIndex].push(sentence + (index < arr.length - 1 ? '.' : ''));
                          return acc;
                        }, []).map((group, i) => (
                          <p key={i} className="text-slate-600 leading-relaxed mb-6 last:mb-0">
                            {group.join(' ')}
                          </p>
                        ))}
                      </div>

                      {/* Key Highlights */}
                      <div className="mt-8 pt-6 border-t border-emerald-100">
                        <h4 className="font-semibold text-slate-900 mb-4">Key Benefits:</h4>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="mt-1 p-1 bg-emerald-100 rounded-full">
                              <Check className="h-4 w-4 text-emerald-600" />
                            </div>
                            <span className="text-slate-600"><strong className="text-slate-900">Always Available</strong> — 24/7 call answering including weekends and holidays</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="mt-1 p-1 bg-emerald-100 rounded-full">
                              <Check className="h-4 w-4 text-emerald-600" />
                            </div>
                            <span className="text-slate-600"><strong className="text-slate-900">Industry Trained</strong> — Understands your terminology and services</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="mt-1 p-1 bg-emerald-100 rounded-full">
                              <Check className="h-4 w-4 text-emerald-600" />
                            </div>
                            <span className="text-slate-600"><strong className="text-slate-900">Instant Setup</strong> — Live in under an hour, no technical skills needed</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="mt-1 p-1 bg-emerald-100 rounded-full">
                              <Check className="h-4 w-4 text-emerald-600" />
                            </div>
                            <span className="text-slate-600"><strong className="text-slate-900">80% Cost Savings</strong> — Just €3,000-€5,000 annually vs €25,000+ for staff</span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Links */}
                      <div className="mt-6 pt-6 border-t border-emerald-100">
                        <p className="text-slate-500 text-sm mb-3">Learn more about our solution:</p>
                        <div className="flex flex-wrap gap-3">
                          <Link href="/pricing" className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors">
                            <Euro className="h-4 w-4" />
                            <span>View Pricing</span>
                          </Link>
                          <Link href="/features" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
                            <Sparkles className="h-4 w-4" />
                            <span>All Features</span>
                          </Link>
                          <Link href="/login" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-200 transition-colors">
                            <Phone className="h-4 w-4" />
                            <span>Start Free Trial</span>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-2xl p-6 shadow-lg shadow-emerald-100 border border-emerald-100 hover:shadow-xl hover:shadow-emerald-200 transition-shadow cursor-default">
                        <div className="flex items-center gap-2 mb-2">
                          <Phone className="h-5 w-5 text-emerald-600" />
                          <span className="text-slate-500 text-sm">Answer Rate</span>
                        </div>
                        <div className="text-4xl font-bold text-slate-900 mb-1">100%</div>
                        <div className="text-slate-500 text-sm">every call answered</div>
                        <div className="mt-3 h-2 bg-emerald-100 rounded-full overflow-hidden">
                          <div className="h-full w-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
                        </div>
                        <p className="mt-3 text-xs text-slate-400">VoiceFleet AI guarantee</p>
                      </div>

                      <Link href="/pricing" className="bg-white rounded-2xl p-6 shadow-lg shadow-emerald-100 border border-emerald-100 hover:shadow-xl hover:shadow-emerald-200 hover:border-emerald-300 transition-all group">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-5 w-5 text-emerald-600" />
                          <span className="text-slate-500 text-sm">Cost Savings</span>
                        </div>
                        <div className="text-4xl font-bold text-slate-900 mb-1">80%</div>
                        <div className="text-slate-500 text-sm">vs. traditional staff</div>
                        <div className="mt-3 h-2 bg-emerald-100 rounded-full overflow-hidden">
                          <div className="h-full w-[80%] bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
                        </div>
                        <p className="mt-3 text-xs text-emerald-600 group-hover:text-emerald-700">See pricing comparison →</p>
                      </Link>

                      <div className="bg-white rounded-2xl p-6 shadow-lg shadow-emerald-100 border border-emerald-100 hover:shadow-xl hover:shadow-emerald-200 transition-shadow cursor-default">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-5 w-5 text-emerald-600" />
                          <span className="text-slate-500 text-sm">Availability</span>
                        </div>
                        <div className="text-4xl font-bold text-slate-900 mb-1">24/7</div>
                        <div className="text-slate-500 text-sm">always available</div>
                        <div className="mt-3 flex gap-1">
                          {[...Array(7)].map((_, i) => (
                            <div key={i} className="flex-1 h-6 bg-gradient-to-t from-emerald-500 to-teal-400 rounded" />
                          ))}
                        </div>
                        <p className="mt-3 text-xs text-slate-400">Including holidays & weekends</p>
                      </div>

                      <Link href="/login" className="bg-white rounded-2xl p-6 shadow-lg shadow-emerald-100 border border-emerald-100 hover:shadow-xl hover:shadow-emerald-200 hover:border-emerald-300 transition-all group">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-5 w-5 text-emerald-600" />
                          <span className="text-slate-500 text-sm">Setup Time</span>
                        </div>
                        <div className="text-4xl font-bold text-slate-900 mb-1">&lt;1hr</div>
                        <div className="text-slate-500 text-sm">to get started</div>
                        <div className="mt-3 h-2 bg-emerald-100 rounded-full overflow-hidden">
                          <div className="h-full w-[10%] bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
                        </div>
                        <p className="mt-3 text-xs text-emerald-600 group-hover:text-emerald-700">Start free trial →</p>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Benefits */}
        {page.benefits && page.benefits.length > 0 && (
          <section className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Why {page.industry_name} Professionals Choose VoiceFleet
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {page.benefits.map((benefit, i) => (
                  <div
                    key={i}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                  >
                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                      <Check className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <MidPageCTA />

        {/* Use Cases */}
        {page.use_cases && page.use_cases.length > 0 && (
          <section className="py-16 max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Common Use Cases in {page.industry_name}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {page.use_cases.map((useCase, i) => (
                <div
                  key={i}
                  className="border border-gray-200 p-6 rounded-xl hover:border-indigo-200 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {useCase.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{useCase.description}</p>
                  {useCase.example && (
                    <p className="text-sm text-indigo-600 italic bg-indigo-50 p-3 rounded-lg">
                      &ldquo;{useCase.example}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Testimonial */}
        {page.testimonial && (
          <section className="bg-indigo-50 py-16">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <blockquote className="text-2xl text-gray-800 italic mb-6">
                &ldquo;{page.testimonial.quote}&rdquo;
              </blockquote>
              <p className="font-semibold text-gray-900">
                {page.testimonial.author}
              </p>
              <p className="text-gray-600">{page.testimonial.company}</p>
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqItems.map((item) => (
                <div key={item.question} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.question}</h3>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

          {/* Internal Links */}
          <InternalLinks
            relatedFeatures={page.related_features}
            relatedLocations={page.related_locations}
          />

          <CTASection
            title={`Ready to transform your ${page.industry_name.toLowerCase()} operations?`}
            description="Start your free trial today and see how AI voice agents can help."
          />
        </main>
        <Footer />
      </div>
    </>
  );
}
