'use client';

import { useMemo } from 'react';
import { ContentChart, ChartConfig } from './ContentChart';
import { StatCallout, Statistic } from './StatCallout';
import { ExpertQuote, Quote } from './ExpertQuote';
import { InlineCitation, SourcesList, Source } from './SourceCitation';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  author_name?: string;
  published_at?: string;
  // Rich content fields
  chart_data?: ChartConfig[];
  statistics?: Statistic[];
  sources?: Source[];
  expert_quotes?: Quote[];
}

interface RichBlogContentProps {
  post: BlogPost;
  className?: string;
}

/**
 * Parses markdown content and inserts rich content components at marker positions
 * Markers: [CHART:id], [STAT:id], [QUOTE:id], [SOURCE:id]
 */
export function RichBlogContent({ post, className = '' }: RichBlogContentProps) {
  const { content, chart_data = [], statistics = [], sources = [], expert_quotes = [] } = post;

  // Create lookup maps for faster access
  const chartMap = useMemo(() => new Map(chart_data.map(c => [c.id, c])), [chart_data]);
  const statMap = useMemo(() => new Map(statistics.map(s => [s.id, s])), [statistics]);
  const quoteMap = useMemo(() => new Map(expert_quotes.map(q => [q.id, q])), [expert_quotes]);

  // Parse content and split into segments
  const segments = useMemo(() => {
    const result: Array<{ type: 'text' | 'chart' | 'stat' | 'quote'; content: string; data?: ChartConfig | Statistic | Quote }> = [];

    // Pattern to match all markers
    const markerPattern = /\[(CHART|STAT|QUOTE):([^\]]+)\]/g;

    let lastIndex = 0;
    let match;

    while ((match = markerPattern.exec(content)) !== null) {
      // Add text before the marker
      if (match.index > lastIndex) {
        result.push({
          type: 'text',
          content: content.slice(lastIndex, match.index)
        });
      }

      const markerType = match[1].toLowerCase() as 'chart' | 'stat' | 'quote';
      const markerId = match[2];

      // Find the corresponding data
      let data;
      switch (markerType) {
        case 'chart':
          data = chartMap.get(markerId);
          break;
        case 'stat':
          data = statMap.get(markerId);
          break;
        case 'quote':
          data = quoteMap.get(markerId);
          break;
      }

      if (data) {
        result.push({
          type: markerType,
          content: markerId,
          data
        });
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      result.push({
        type: 'text',
        content: content.slice(lastIndex)
      });
    }

    return result;
  }, [content, chartMap, statMap, quoteMap]);

  // Process source citations in text: [SOURCE:id]
  const processSourceCitations = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    const sourcePattern = /\[SOURCE:(\d+)\]/g;

    let lastIndex = 0;
    let match;

    while ((match = sourcePattern.exec(text)) !== null) {
      // Add text before citation
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`} dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(text.slice(lastIndex, match.index)) }} />
        );
      }

      const sourceId = parseInt(match[1], 10);
      parts.push(
        <InlineCitation key={`source-${match.index}`} sourceId={sourceId} sources={sources} />
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(
        <span key={`text-${lastIndex}`} dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(text.slice(lastIndex)) }} />
      );
    }

    return parts;
  };

  // Simple markdown to HTML converter
  const convertMarkdownToHtml = (markdown: string): string => {
    return markdown
      // Headers
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold text-gray-900 mt-8 mb-4">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-gray-900 mt-10 mb-5">$1</h2>')
      // Bold and italic
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm">$1</code>')
      // Lists
      .replace(/^\- (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(/^(\d+)\. (.*$)/gm, '<li class="ml-4">$2</li>')
      // Paragraphs (wrap lines not already wrapped)
      .replace(/^(?!<[hlo])(.*\S.*)$/gm, '<p class="my-4 text-gray-700 leading-relaxed">$1</p>')
      // Clean up extra paragraph tags around block elements
      .replace(/<p class="[^"]*"><(h[23]|ul|ol|li)/g, '<$1')
      .replace(/<\/(h[23]|ul|ol|li)><\/p>/g, '</$1>');
  };

  return (
    <article className={`prose prose-lg max-w-none ${className}`}>
      {segments.map((segment, index) => {
        switch (segment.type) {
          case 'chart':
            return (
              <ContentChart
                key={`chart-${index}`}
                config={segment.data as ChartConfig}
              />
            );

          case 'stat':
            return (
              <StatCallout
                key={`stat-${index}`}
                stat={segment.data as Statistic}
                sources={sources}
              />
            );

          case 'quote':
            return (
              <ExpertQuote
                key={`quote-${index}`}
                quote={segment.data as Quote}
                sources={sources}
                variant="highlight"
              />
            );

          case 'text':
          default:
            return (
              <div key={`text-${index}`}>
                {processSourceCitations(segment.content)}
              </div>
            );
        }
      })}

      {/* Sources list at the bottom */}
      {sources.length > 0 && (
        <SourcesList sources={sources} />
      )}
    </article>
  );
}

export default RichBlogContent;
