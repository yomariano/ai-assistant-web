import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Globe2, Mail, MapPin, ShieldCheck } from 'lucide-react';
import { buildWaitlistPath, getCountryLabel, getSupportedCountryNames, normalizeCountryCode } from '@/lib/country-access';

export const metadata: Metadata = {
  title: 'Waitlist',
  description: 'VoiceFleet is opening new countries gradually. Join the waitlist if local phone number support is not live in your country yet.',
  robots: {
    index: false,
    follow: false,
  },
};

type WaitlistPageProps = {
  searchParams?: Promise<{
    country?: string;
    from?: string;
  }>;
};

function createMailtoHref(countryCode: string | null, from: string | null) {
  const subject = `VoiceFleet waitlist request${countryCode ? ` - ${countryCode}` : ''}`;
  const body = [
    'Hi VoiceFleet team,',
    '',
    'Please add me to the country waitlist.',
    countryCode ? `Country: ${countryCode}` : 'Country: ',
    from ? `Attempted page: ${from}` : 'Attempted page: ',
    'Company: ',
    'Monthly call volume: ',
    '',
    'Thanks,',
  ].join('\n');

  return `mailto:sales@voicefleet.ai?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default async function WaitlistPage({ searchParams }: WaitlistPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const countryCode = normalizeCountryCode(resolvedSearchParams?.country);
  const attemptedPath = resolvedSearchParams?.from || null;
  const countryLabel = getCountryLabel(countryCode);
  const supportedCountries = getSupportedCountryNames();
  const mailtoHref = createMailtoHref(countryCode, attemptedPath);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,hsl(160_84%_27%/.12),transparent_32%),linear-gradient(180deg,hsl(210_20%_99%)_0%,hsl(210_20%_96%)_100%)] text-foreground">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800">
              <Globe2 className="h-4 w-4" />
              Country rollout in progress
            </div>

            <h1 className="mt-6 max-w-2xl font-heading text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
              VoiceFleet is not available in {countryLabel} yet.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              We only open countries when we can reliably provision local phone numbers and support the onboarding flow end to end.
              That keeps activation clean instead of selling into regions we cannot serve properly yet.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <MapPin className="h-5 w-5 text-primary" />
                <p className="mt-3 text-sm font-semibold text-slate-900">Current support</p>
                <p className="mt-1 text-sm text-slate-600">{supportedCountries.join(', ')}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <p className="mt-3 text-sm font-semibold text-slate-900">Why we gate access</p>
                <p className="mt-1 text-sm text-slate-600">We only onboard markets where we can provide a working local number.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <Mail className="h-5 w-5 text-primary" />
                <p className="mt-3 text-sm font-semibold text-slate-900">Fastest route</p>
                <p className="mt-1 text-sm text-slate-600">Email us and we will track demand for your country rollout.</p>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href={mailtoHref}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Join The Waitlist
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-white"
              >
                Explore The Demo
              </Link>
            </div>

            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">What to send us</p>
              <p className="mt-2">
                Include your country, company name, and expected monthly call volume. That helps us prioritize the next local number rollout.
              </p>
              {attemptedPath ? (
                <p className="mt-2 text-slate-500">
                  Blocked path: <span className="font-mono">{attemptedPath}</span>
                </p>
              ) : null}
            </div>
          </div>

          <aside className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Supported Today
            </p>
            <ul className="mt-6 space-y-4 text-lg text-slate-200">
              {supportedCountries.map((country) => (
                <li key={country} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  {country}
                </li>
              ))}
            </ul>

            <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold text-white">Think you were blocked by mistake?</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Country detection is IP-based. If you are in a supported market and still landed here, contact
                {' '}
                <a className="font-semibold text-emerald-300 hover:text-emerald-200" href="mailto:support@voicefleet.ai">
                  support@voicefleet.ai
                </a>
                {' '}
                and we can check it.
              </p>
            </div>

            <div className="mt-10 text-sm text-slate-400">
              Prefer to keep browsing first? The marketing site stays open globally. Only signup, checkout, and app access are limited by country.
            </div>

            <div className="mt-6">
              <Link
                href={buildWaitlistPath(countryCode, attemptedPath)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
              >
                Refresh this page
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
