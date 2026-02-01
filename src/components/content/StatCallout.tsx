'use client';

export interface Statistic {
  id?: string;
  value: string;
  label: string;
  context: string;
  sourceId?: number;
  highlight?: boolean;
}

export interface Source {
  id: number;
  title: string;
  url: string;
  author?: string;
  publishedDate?: string;
  type?: string;
}

interface StatCalloutProps {
  stat: Statistic;
  sources?: Source[];
  className?: string;
}

export function StatCallout({ stat, sources = [], className = '' }: StatCalloutProps) {
  const source = sources.find(s => s.id === stat.sourceId);

  const baseClasses = stat.highlight
    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500'
    : 'bg-gray-50 border-l-4 border-gray-300';

  return (
    <div className={`${baseClasses} p-6 my-6 rounded-r-lg ${className}`}>
      <div className={`text-4xl font-bold ${stat.highlight ? 'text-blue-600' : 'text-gray-700'}`}>
        {stat.value}
      </div>
      <div className="text-lg font-medium mt-1 text-gray-900">
        {stat.label}
      </div>
      <div className="text-gray-600 mt-2">
        {stat.context}
      </div>
      {source && (
        <div className="mt-3 text-sm text-gray-500">
          Source:{' '}
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {source.title}
          </a>
        </div>
      )}
    </div>
  );
}

// Compact version for inline display
interface StatBadgeProps {
  value: string;
  label: string;
  className?: string;
}

export function StatBadge({ value, label, className = '' }: StatBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium ${className}`}>
      <span className="font-bold">{value}</span>
      <span className="text-blue-600">{label}</span>
    </span>
  );
}

export default StatCallout;
