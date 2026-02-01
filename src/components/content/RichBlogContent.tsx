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

  // Robust markdown to HTML converter
  const convertMarkdownToHtml = (markdown: string): string => {
    let html = markdown;

    // Step 1: Normalize - add line breaks before headers that are inline
    html = html.replace(/([.!?])\s*(#{2,3}\s)/g, '$1\n\n$2');
    html = html.replace(/([a-z])\s*(#{2,3}\s)/gi, '$1\n\n$2');

    // Step 2: Split into lines for processing
    const lines = html.split('\n');
    const processedLines: string[] = [];
    let inList = false;

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (!trimmedLine) {
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        processedLines.push('');
        continue;
      }

      // Headers
      if (trimmedLine.startsWith('### ')) {
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        const headerText = trimmedLine.slice(4);
        processedLines.push(`<h3 class="text-xl font-bold text-gray-900 mt-10 mb-4">${processInlineMarkdown(headerText)}</h3>`);
        continue;
      }

      if (trimmedLine.startsWith('## ')) {
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        const headerText = trimmedLine.slice(3);
        processedLines.push(`<h2 class="text-2xl font-bold text-gray-900 mt-12 mb-5 pb-3 border-b border-gray-200">${processInlineMarkdown(headerText)}</h2>`);
        continue;
      }

      // Bullet lists
      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        if (!inList) {
          processedLines.push('<ul class="my-6 space-y-2 list-disc list-inside">');
          inList = true;
        }
        const listItemText = trimmedLine.slice(2);
        processedLines.push(`<li class="text-gray-700 leading-relaxed">${processInlineMarkdown(listItemText)}</li>`);
        continue;
      }

      // Numbered lists
      const numberedMatch = trimmedLine.match(/^(\d+)\.\s+(.*)$/);
      if (numberedMatch) {
        if (!inList) {
          processedLines.push('<ol class="my-6 space-y-2 list-decimal list-inside">');
          inList = true;
        }
        processedLines.push(`<li class="text-gray-700 leading-relaxed">${processInlineMarkdown(numberedMatch[2])}</li>`);
        continue;
      }

      // Close list if we're not continuing one
      if (inList) {
        processedLines.push('</ul>');
        inList = false;
      }

      // Regular paragraph
      processedLines.push(`<p class="my-5 text-gray-700 leading-relaxed text-lg">${processInlineMarkdown(trimmedLine)}</p>`);
    }

    // Close any open list
    if (inList) {
      processedLines.push('</ul>');
    }

    return processedLines.join('\n');
  };

  // Process inline markdown (bold, italic, links, code)
  const processInlineMarkdown = (text: string): string => {
    return text
      // Bold and italic combined
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="font-bold"><em>$1</em></strong>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-indigo-600 hover:text-indigo-800 underline font-medium" target="_blank" rel="noopener noreferrer">$1</a>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-0.5 rounded text-sm font-mono text-gray-800">$1</code>');
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
