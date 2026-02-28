import Link from 'next/link';

interface BusinessCardProps {
  name: string;
  address: string;
  description: string;
  href: string;
  phone?: string;
  locale?: string;
}

export default function BusinessCard({ name, address, description, href, phone, locale = 'en' }: BusinessCardProps) {
  const isES = locale === 'es';

  return (
    <Link href={href} className="block group">
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/50 hover:bg-slate-800/80 transition-all duration-200">
        <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">{name}</h3>
        <p className="text-slate-400 text-sm mt-1">{address}</p>
        {phone && <p className="text-cyan-400 text-sm mt-1">{phone}</p>}
        <p className="text-slate-300 text-sm mt-3 line-clamp-2">{description}</p>
        <span className="inline-block mt-4 text-blue-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
          {isES ? 'Ver Perfil →' : 'View Profile →'}
        </span>
      </div>
    </Link>
  );
}
