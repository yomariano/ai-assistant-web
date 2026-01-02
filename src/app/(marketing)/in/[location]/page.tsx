import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getLocationPage, getLocationSlugs, getNearbyLocations } from "@/lib/content/locations";
import { generateLocationMetadata } from "@/lib/seo/metadata";
import { LocalBusinessSchema, BreadcrumbSchema } from "@/components/seo";
import Breadcrumbs from "@/components/marketing/Breadcrumbs";
import CTASection from "@/components/marketing/CTASection";
import { MapPin, Check } from "lucide-react";

interface Props {
  params: Promise<{ location: string }>;
}

export async function generateStaticParams() {
  const slugs = await getLocationSlugs();
  return slugs.map((location) => ({ location }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { location } = await params;
  const page = await getLocationPage(location);

  if (!page) {
    return {};
  }

  return generateLocationMetadata(page);
}

export default async function LocationPage({ params }: Props) {
  const { location } = await params;
  const page = await getLocationPage(location);

  if (!page) {
    notFound();
  }

  const nearbyLocations = page.nearby_locations?.length
    ? await getNearbyLocations(page.nearby_locations)
    : [];

  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Locations", href: "/in" },
    {
      name: `${page.city_name}${page.state_code ? `, ${page.state_code}` : ""}`,
      href: `/in/${location}`,
    },
  ];

  return (
    <>
      <LocalBusinessSchema
        name={`ValidateCall ${page.city_name}`}
        city={page.city_name}
        state={page.state_code || ""}
        latitude={page.latitude || undefined}
        longitude={page.longitude || undefined}
      />
      <BreadcrumbSchema items={breadcrumbs} />

      <div className="min-h-screen bg-white">
        <Breadcrumbs items={breadcrumbs} />

        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5" />
                  <span className="text-blue-200">
                    {page.city_name}
                    {page.state_code && `, ${page.state_code}`}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  {page.headline}
                </h1>
                <p className="text-xl text-blue-100 mb-8">{page.subheadline}</p>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors shadow-lg"
                >
                  Start Free Trial
                </Link>
              </div>
              {page.hero_image_url && (
                <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={page.hero_image_url}
                    alt={page.hero_image_alt || page.city_name}
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

        {/* Local Content */}
        {page.local_description && (
          <section className="py-16 max-w-7xl mx-auto px-6">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                AI Voice Agents for {page.city_name} Businesses
              </h2>
              <p className="text-gray-600">{page.local_description}</p>
            </div>
          </section>
        )}

        {/* Local Stats */}
        {page.local_stats && Object.keys(page.local_stats).length > 0 && (
          <section className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
                {page.city_name} at a Glance
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {Object.entries(page.local_stats).map(([key, value]) => (
                  <div key={key} className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="text-3xl font-bold text-indigo-600">
                      {String(value)}
                    </div>
                    <div className="text-sm text-gray-600 capitalize mt-1">
                      {key.replace(/_/g, " ")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Local Benefits */}
        {page.local_benefits && page.local_benefits.length > 0 && (
          <section className="py-16 max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Benefits for {page.city_name} Businesses
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {page.local_benefits.map((benefit, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Local Testimonial */}
        {page.local_testimonial && (
          <section className="bg-indigo-50 py-16">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <blockquote className="text-2xl text-gray-800 italic mb-6">
                &ldquo;{page.local_testimonial.quote}&rdquo;
              </blockquote>
              <p className="font-semibold text-gray-900">
                {page.local_testimonial.author}
              </p>
              <p className="text-gray-600">{page.local_testimonial.company}</p>
            </div>
          </section>
        )}

        {/* Nearby Locations */}
        {nearbyLocations.length > 0 && (
          <section className="py-16 max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Also Serving Nearby Areas
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {nearbyLocations.map((loc) => (
                <Link
                  key={loc.slug}
                  href={`/in/${loc.slug}`}
                  className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                >
                  {loc.city_name}
                  {loc.state_code && `, ${loc.state_code}`}
                </Link>
              ))}
            </div>
          </section>
        )}

        <CTASection
          title={`Ready to automate calls in ${page.city_name}?`}
          description="Join local businesses already saving time with AI voice agents."
        />
      </div>
    </>
  );
}
