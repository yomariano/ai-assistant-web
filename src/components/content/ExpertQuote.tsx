'use client';

import { Source } from './SourceCitation';

export interface Quote {
  id?: string;
  quote: string;
  author: string;
  title?: string;
  sourceId?: number;
}

interface ExpertQuoteProps {
  quote: Quote;
  sources?: Source[];
  variant?: 'default' | 'highlight' | 'minimal';
  className?: string;
}

export function ExpertQuote({ quote, sources = [], variant = 'default', className = '' }: ExpertQuoteProps) {
  const source = sources.find(s => s.id === quote.sourceId);

  if (variant === 'minimal') {
    return (
      <blockquote className={`text-gray-600 italic ${className}`}>
        &ldquo;{quote.quote}&rdquo;
        <footer className="mt-1 text-sm text-gray-500 not-italic">
          - {quote.author}
          {quote.title && `, ${quote.title}`}
        </footer>
      </blockquote>
    );
  }

  if (variant === 'highlight') {
    return (
      <div className={`my-8 relative ${className}`}>
        {/* Decorative quote marks */}
        <div className="absolute -top-4 -left-2 text-6xl text-blue-100 font-serif leading-none select-none">
          &ldquo;
        </div>

        <blockquote className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
          <p className="text-xl text-gray-800 italic leading-relaxed relative z-10">
            {quote.quote}
          </p>

          <footer className="mt-6 flex items-center gap-4">
            {/* Avatar placeholder */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
              {quote.author.charAt(0)}
            </div>
            <div>
              <div className="font-semibold text-gray-900">{quote.author}</div>
              {quote.title && (
                <div className="text-sm text-gray-600">{quote.title}</div>
              )}
              {source && (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  {source.title}
                </a>
              )}
            </div>
          </footer>
        </blockquote>

        {/* Decorative element */}
        <div className="absolute -bottom-4 -right-2 text-6xl text-blue-100 font-serif leading-none select-none rotate-180">
          &rdquo;
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`my-6 ${className}`}>
      <blockquote className="border-l-4 border-blue-500 pl-6 py-2">
        <p className="text-lg text-gray-700 italic">
          &ldquo;{quote.quote}&rdquo;
        </p>
        <footer className="mt-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
            {quote.author.charAt(0)}
          </div>
          <div>
            <div className="font-medium text-gray-900">{quote.author}</div>
            {quote.title && (
              <div className="text-sm text-gray-600">{quote.title}</div>
            )}
          </div>
        </footer>
        {source && (
          <div className="mt-2 text-sm text-gray-500">
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
      </blockquote>
    </div>
  );
}

/**
 * Inline quote for embedding within text
 */
interface InlineQuoteProps {
  quote: string;
  author: string;
  className?: string;
}

export function InlineQuote({ quote, author, className = '' }: InlineQuoteProps) {
  return (
    <span className={`italic text-gray-700 ${className}`}>
      &ldquo;{quote}&rdquo; <span className="text-gray-500 not-italic">- {author}</span>
    </span>
  );
}

export default ExpertQuote;
