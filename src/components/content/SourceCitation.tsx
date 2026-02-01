'use client';

export interface Source {
  id: number;
  title: string;
  url: string;
  author?: string;
  publishedDate?: string;
  accessedDate?: string;
  type?: 'report' | 'article' | 'study' | 'website';
}

interface InlineCitationProps {
  sourceId: number;
  sources: Source[];
  className?: string;
}

/**
 * Inline citation that appears as a superscript link
 */
export function InlineCitation({ sourceId, sources, className = '' }: InlineCitationProps) {
  const source = sources.find(s => s.id === sourceId);

  if (!source) {
    return <sup className="text-gray-400">[{sourceId}]</sup>;
  }

  return (
    <sup className={className}>
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 font-medium"
        title={source.title}
      >
        [{sourceId}]
      </a>
    </sup>
  );
}

interface SourcesListProps {
  sources: Source[];
  title?: string;
  className?: string;
}

/**
 * Full sources list typically shown at the bottom of an article
 */
export function SourcesList({ sources, title = 'Sources', className = '' }: SourcesListProps) {
  if (!sources || sources.length === 0) {
    return null;
  }

  const getSourceTypeIcon = (type?: string) => {
    switch (type) {
      case 'report':
        return '📊';
      case 'study':
        return '🔬';
      case 'article':
        return '📰';
      default:
        return '🔗';
    }
  };

  return (
    <div className={`mt-12 pt-8 border-t border-gray-200 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ol className="space-y-3 text-sm">
        {sources.map((source) => (
          <li key={source.id} className="flex items-start gap-3">
            <span className="text-gray-400 font-medium min-w-[24px]">[{source.id}]</span>
            <div className="flex-1">
              <span className="mr-2">{getSourceTypeIcon(source.type)}</span>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {source.title}
              </a>
              {source.author && (
                <span className="text-gray-600 ml-2">- {source.author}</span>
              )}
              {source.publishedDate && (
                <span className="text-gray-500 ml-2">({source.publishedDate})</span>
              )}
              {source.accessedDate && (
                <span className="text-gray-400 ml-2 text-xs">
                  [Accessed {source.accessedDate}]
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * Compact inline source reference with tooltip
 */
interface SourceRefProps {
  source: Source;
  className?: string;
}

export function SourceRef({ source, className = '' }: SourceRefProps) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center text-sm text-gray-500 hover:text-blue-600 ${className}`}
      title={`Source: ${source.title}`}
    >
      <svg
        className="w-3.5 h-3.5 mr-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
      {source.title}
    </a>
  );
}

export default SourcesList;
