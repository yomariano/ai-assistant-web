import Link from 'next/link';

interface GridItem {
  label: string;
  icon: string;
  count: number;
  href: string;
}

export default function DirectoryGrid({ items }: { items: GridItem[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {items.map(item => (
        <Link key={item.href} href={item.href} className="group">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 text-center hover:border-blue-500/50 hover:bg-slate-800/80 transition-all duration-200">
            <div className="text-4xl mb-3">{item.icon}</div>
            <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors">{item.label}</h3>
            <p className="text-slate-400 text-sm mt-1">{item.count} businesses</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
