import { Metadata } from 'next';
import Header from '@/components/voicefleet/Header';
import Footer from '@/components/voicefleet/Footer';
import DirectoryGrid from '@/components/directory/DirectoryGrid';
import { getVerticals, verticalLabels, verticalIcons } from '@/lib/directory-data';

export const metadata: Metadata = {
  title: 'Business Directory — Find Local Services | VoiceFleet',
  description: 'Find local businesses across Ireland and Argentina. Restaurants, dentists, vets, salons, and more — all powered by AI.',
  openGraph: {
    title: 'Business Directory | VoiceFleet',
    description: 'Find local businesses powered by AI across Ireland and Argentina.',
    url: 'https://voicefleet.ai/directory',
  },
};

export default function DirectoryPage() {
  const verticals = getVerticals();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-950 text-white pt-20">
        <div className="max-w-6xl mx-auto px-4 py-16">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Find Local Businesses
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Powered by AI — discover top-rated businesses across Ireland and Argentina
            </p>
          </div>

          {/* Grid */}
          <DirectoryGrid
            items={verticals.map(v => ({
              label: verticalLabels[v.vertical] || v.vertical,
              icon: verticalIcons[v.vertical] || '📌',
              count: v.count,
              href: `/directory/${v.vertical}`,
            }))}
          />

          {/* Bottom CTA */}
          <div className="text-center mt-16 pt-12 border-t border-slate-800">
            <h2 className="text-2xl font-semibold mb-4">Want your business listed here?</h2>
            <p className="text-slate-400 mb-6">Get found by customers and let AI handle your calls 24/7</p>
            <a href="/demo" className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-500 transition-all">
              Get Started with VoiceFleet →
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
