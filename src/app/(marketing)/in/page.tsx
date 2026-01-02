import { Metadata } from "next";
import Link from "next/link";
import { getLocationPages } from "@/lib/content/locations";
import { generatePageMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/marketing/Breadcrumbs";
import CTASection from "@/components/marketing/CTASection";
import { MapPin } from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "AI Voice Assistant - Available Locations",
  description:
    "ValidateCall AI voice assistant is available nationwide. Find AI-powered phone automation services in your city.",
  path: "/in",
});

export default async function LocationsPage() {
  const pages = await getLocationPages();

  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Locations", href: "/in" },
  ];

  // Group by state
  const byState = pages.reduce(
    (acc, page) => {
      const state = page.state_code || "Other";
      if (!acc[state]) {
        acc[state] = [];
      }
      acc[state].push(page);
      return acc;
    },
    {} as Record<string, typeof pages>
  );

  const sortedStates = Object.keys(byState).sort();

  return (
    <div className="min-h-screen bg-white">
      <Breadcrumbs items={breadcrumbs} />

      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            AI Voice Assistant Locations
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            ValidateCall serves businesses nationwide. Find local AI phone
            automation services in your area.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-6">
        {pages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Location pages coming soon. Check back later!
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {sortedStates.map((state) => (
              <div key={state}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">
                  {state}
                </h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {byState[state].map((page) => (
                    <Link
                      key={page.id}
                      href={`/in/${page.slug}`}
                      className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
                    >
                      <MapPin className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 flex-shrink-0" />
                      <span className="text-gray-900 group-hover:text-indigo-600 font-medium">
                        {page.city_name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <CTASection
        title="Don't see your city?"
        description="ValidateCall works anywhere in the US. Start your free trial today."
      />
    </div>
  );
}
