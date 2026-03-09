import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/voicefleet/Header";
import Footer from "@/components/voicefleet/Footer";
import DirectoryGrid from "@/components/directory/DirectoryGrid";
import {
  getAllBusinessesForMarket,
  getVerticalLabel,
  getVerticalsForMarket,
  verticalIcons,
} from "@/lib/directory-data";

export const metadata: Metadata = {
  title: "Australian Business Directory - Find Local Services",
  description:
    "Find local businesses across Australia's major cities. Browse dentists, restaurants, salons, vets, plumbers, physios, mechanics, and gyms in the VoiceFleet AU directory.",
  openGraph: {
    title: "Australian Business Directory",
    description: "Find local businesses powered by AI across Australia's major cities.",
    url: "https://voicefleet.ai/au/directory",
  },
};

export default async function AustraliaDirectoryPage() {
  const [verticals, businesses] = await Promise.all([
    getVerticalsForMarket("AU"),
    getAllBusinessesForMarket("AU"),
  ]);

  const cityCount = new Set(businesses.map((business) => business.citySlug)).size;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-950 text-white pt-20">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Australian Business Directory
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Browse {businesses.length} Australian businesses across {cityCount} cities, with category pages built for local service teams using VoiceFleet.
            </p>
          </div>

          <DirectoryGrid
            items={verticals.map((vertical) => ({
              label: getVerticalLabel(vertical.vertical),
              icon: verticalIcons[vertical.vertical] || "o",
              count: vertical.count,
              href: `/au/directory/${vertical.vertical}`,
            }))}
          />

          <div className="text-center mt-16 pt-12 border-t border-slate-800">
            <h2 className="text-2xl font-semibold mb-4">Want your business listed here?</h2>
            <p className="text-slate-400 mb-6">
              Get local AU traffic and let VoiceFleet answer calls, qualify leads, and book appointments 24/7.
            </p>
            <Link
              href="/register?plan=starter&region=AU"
              className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-500 transition-all"
            >
              Start VoiceFleet in Australia {"->"}
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
