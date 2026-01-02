import Link from "next/link";
import { getRelatedFeatures } from "@/lib/content/features";
import { getNearbyLocations } from "@/lib/content/locations";

interface InternalLinksProps {
  relatedFeatures?: string[];
  relatedLocations?: string[];
  relatedUseCases?: string[];
}

export default async function InternalLinks({
  relatedFeatures,
  relatedLocations,
  relatedUseCases,
}: InternalLinksProps) {
  const [features, locations] = await Promise.all([
    relatedFeatures?.length ? getRelatedFeatures(relatedFeatures) : [],
    relatedLocations?.length ? getNearbyLocations(relatedLocations) : [],
  ]);

  if (!features.length && !locations.length && !relatedUseCases?.length) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
          Explore More
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                Related Features
              </h3>
              <ul className="space-y-3">
                {features.map((feature) => (
                  <li key={feature.slug}>
                    <Link
                      href={`/features/${feature.slug}`}
                      className="text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      {feature.feature_name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {locations.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Available In</h3>
              <ul className="space-y-3">
                {locations.map((loc) => (
                  <li key={loc.slug}>
                    <Link
                      href={`/in/${loc.slug}`}
                      className="text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      {loc.city_name}
                      {loc.state_code && `, ${loc.state_code}`}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {relatedUseCases && relatedUseCases.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Industries</h3>
              <ul className="space-y-3">
                {relatedUseCases.map((slug) => (
                  <li key={slug}>
                    <Link
                      href={`/for/${slug}`}
                      className="text-indigo-600 hover:text-indigo-800 transition-colors capitalize"
                    >
                      {slug.replace(/-/g, " ")}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
