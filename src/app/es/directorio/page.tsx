import { Metadata } from 'next';
import DirectoryGrid from '@/components/directory/DirectoryGrid';
import { getVerticals, verticalLabelsES, verticalIcons, verticalSlugsES } from '@/lib/directory-data';

export const metadata: Metadata = {
  title: 'Directorio de Negocios — Encontra Servicios Locales | VoiceFleet',
  description: 'Encontra negocios locales en Argentina e Irlanda. Restaurantes, dentistas, veterinarias y mas — impulsado por IA.',
  openGraph: { title: 'Directorio de Negocios | VoiceFleet', description: 'Encontra negocios locales impulsados por IA.' },
};

export default function DirectorioPage() {
  const verticals = getVerticals();
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Encontra Negocios Locales
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Impulsado por IA — descubri los mejores negocios en Argentina e Irlanda
          </p>
        </div>
        <DirectoryGrid
          items={verticals.map(v => ({
            label: verticalLabelsES[v.vertical] || v.vertical,
            icon: verticalIcons[v.vertical] || '📌',
            count: v.count,
            href: `/es/directorio/${verticalSlugsES[v.vertical] || v.vertical}`,
          }))}
        />
        <div className="text-center mt-16 pt-12 border-t border-slate-800">
          <h2 className="text-2xl font-semibold mb-4">Queres que tu negocio aparezca aca?</h2>
          <p className="text-slate-400 mb-6">Deja que la IA atienda tus llamadas 24/7</p>
          <a href="/demo" className="inline-flex items-center bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-500 transition-all">
            Empeza con VoiceFleet →
          </a>
        </div>
      </div>
    </div>
  );
}
