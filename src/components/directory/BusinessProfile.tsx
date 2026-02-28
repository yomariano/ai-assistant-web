import CTAButton from './CTAButton';
import { Business } from '@/lib/directory-data';

const dayMapES: Record<string, string> = {
  Mo: 'Lun', Tu: 'Mar', We: 'Mié', Th: 'Jue', Fr: 'Vie', Sa: 'Sáb', Su: 'Dom',
};

const verticalNameES: Record<string, string> = {
  dentists: 'clínica dental', vets: 'veterinaria', restaurants: 'restaurante',
  salons: 'peluquería', plumbers: 'plomería', gyms: 'gimnasio',
  mechanics: 'taller mecánico', accountants: 'estudio profesional',
  physios: 'centro de fisioterapia', barbers: 'barbería',
};

function localizeHours(hours: string, isES: boolean): string {
  if (!isES) return hours;
  return hours.replace(/\b(Mo|Tu|We|Th|Fr|Sa|Su)\b/g, (m) => dayMapES[m] || m);
}

function localizeDescription(desc: string, business: Business, isES: boolean): string {
  if (!isES) return desc;
  const match = desc.match(/^(.+) is a trusted .+ located in (.+),\s*(.+)\.\s*Providing quality service to the local community\.$/);
  if (!match) return desc;
  const vName = verticalNameES[business.vertical] || business.vertical;
  return `${match[1]} es una ${vName} de confianza ubicada en ${match[2]}, ${match[3]}. Brindando servicios de calidad a la comunidad local.`;
}

export default function BusinessProfile({ business, locale = 'en' }: { business: Business; locale?: string }) {
  const isES = locale === 'es';
  const demoHref = isES ? '/es/demo' : '/demo';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{business.name}</h1>
        <p className="text-slate-400 text-lg">{business.address}</p>
      </div>

      {/* Contact Info */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          {business.phone && (
            <div>
              <p className="text-slate-400 text-sm">{isES ? 'Telefono' : 'Phone'}</p>
              <a href={`tel:${business.phone}`} className="text-cyan-400 font-medium hover:text-cyan-300">
                {business.phone}
              </a>
            </div>
          )}
          {business.website && (
            <div>
              <p className="text-slate-400 text-sm">{isES ? 'Sitio Web' : 'Website'}</p>
              <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 font-medium hover:text-blue-300 truncate block">
                {business.website.replace(/https?:\/\//, '').replace(/\/$/, '')}
              </a>
            </div>
          )}
          {business.email && (
            <div>
              <p className="text-slate-400 text-sm">Email</p>
              <a href={`mailto:${business.email}`} className="text-blue-400 font-medium hover:text-blue-300">
                {business.email}
              </a>
            </div>
          )}
        </div>
        {business.openingHours && (
          <div className="mt-4 pt-4 border-t border-slate-700">
            <p className="text-slate-400 text-sm">{isES ? 'Horarios' : 'Opening Hours'}</p>
            <p className="text-white">{localizeHours(business.openingHours, isES)}</p>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-3">{isES ? 'Acerca de' : 'About'} {business.name}</h2>
        <p className="text-slate-300 leading-relaxed">{localizeDescription(business.description, business, isES)}</p>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        {business.phone && (
          <CTAButton href={`tel:${business.phone}`} variant="primary">
            📞 {isES ? 'Llamar Ahora — IA 24/7' : 'Call Now — AI Answers 24/7'}
          </CTAButton>
        )}
        <CTAButton href={demoHref} variant="secondary">
          {isES ? 'Solicitar Demo' : 'Book a Demo'}
        </CTAButton>
      </div>

      {/* FAQs */}
      {business.faqs.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">{isES ? 'Preguntas Frecuentes' : 'Frequently Asked Questions'}</h2>
          <div className="space-y-4">
            {business.faqs.map((faq, i) => (
              <div key={i} className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-5">
                <h3 className="text-white font-medium mb-2">{faq.q}</h3>
                <p className="text-slate-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VoiceFleet Value Prop */}
      <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/20 border border-blue-500/20 rounded-2xl p-8">
        <h2 className="text-2xl font-semibold text-white mb-4">
          {isES ? `Sos dueno de ${business.name}?` : `Own ${business.name}?`}
        </h2>
        <p className="text-slate-300 mb-4">
          {isES
            ? `VoiceFleet puede responder automaticamente las llamadas de ${business.name} las 24 horas del dia, agendar turnos, y responder consultas — todo con inteligencia artificial.`
            : `VoiceFleet can automatically answer calls to ${business.name} 24/7, book appointments, and handle enquiries — all powered by AI.`}
        </p>
        <ul className="text-slate-400 space-y-2 mb-6">
          <li>✅ {isES ? 'Nunca mas pierdas una llamada' : 'Never miss a call again'}</li>
          <li>✅ {isES ? 'Agendamiento automatico de turnos' : 'Automatic appointment booking'}</li>
          <li>✅ {isES ? 'Configuracion en 5 minutos' : 'Set up in 5 minutes'}</li>
          <li>✅ {isES ? 'Funciona con tu numero actual' : 'Works with your existing number'}</li>
        </ul>
        <CTAButton href={demoHref} variant="primary">
          🚀 {isES ? 'Proba VoiceFleet Gratis' : 'Try VoiceFleet Free'}
        </CTAButton>
      </div>
    </div>
  );
}
