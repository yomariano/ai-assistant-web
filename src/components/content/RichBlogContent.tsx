'use client';

import { useMemo } from 'react';
import { ContentChart, ChartConfig } from './ContentChart';
import { StatCallout, Statistic } from './StatCallout';
import { ExpertQuote, Quote } from './ExpertQuote';
import { SourcesList, Source } from './SourceCitation';

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
 * Renders blog content with Medium-style typography
 * Converts markdown to styled HTML and renders rich components
 */
export function RichBlogContent({ post, className = '' }: RichBlogContentProps) {
  const { content, chart_data = [], statistics = [], sources = [], expert_quotes = [] } = post;

  // Create lookup maps for rich content
  const chartMap = useMemo(() => new Map(chart_data.map(c => [c.id, c])), [chart_data]);
  const statMap = useMemo(() => new Map(statistics.map(s => [s.id || `stat-${statistics.indexOf(s)}`, s])), [statistics]);
  const quoteMap = useMemo(() => new Map(expert_quotes.map(q => [q.id || `quote-${expert_quotes.indexOf(q)}`, q])), [expert_quotes]);

  // Process the content
  const processedContent = (() => {
    // First, extract and replace markers with placeholders
    const markers: Array<{ placeholder: string; type: string; id: string }> = [];
    let processed = preprocessMarkdown(content, post.title);

    // Find all markers: [CHART:id], [STAT:id], [QUOTE:id], [SOURCE:id]
    const markerPattern = /\[(CHART|STAT|QUOTE|SOURCE):([^\]]+)\]/g;
    let match;
    let markerIndex = 0;

    while ((match = markerPattern.exec(content)) !== null) {
      const placeholder = `___MARKER_${markerIndex}___`;
      markers.push({
        placeholder,
        type: match[1].toUpperCase(),
        id: match[2]
      });
      processed = processed.replace(match[0], placeholder);
      markerIndex++;
    }

    // Convert markdown to HTML
    processed = convertMarkdownToHtml(processed);

    // Clean up any remaining markers that weren't in our pattern (malformed ones)
    processed = processed.replace(/\[[A-Z]+:[^\]]*\]/g, '');

    return { html: processed, markers };
  })();

  /**
   * Preprocess markdown to normalize inconsistent AI-generated content.
   * Strips metadata, H1 lines, duplicate titles, and auto-detects headings.
   */
  function preprocessMarkdown(raw: string, title?: string): string {
    let text = raw;

    // Normalize line endings
    text = text.replace(/\r\n/g, '\n');

    // Strip metadata lines (e.g. "**Target keyword:** value" or "Target keyword: value")
    text = text.replace(/^\*{0,2}(?:Target keywords?|Secondary keywords?|Word count|Date|Keywords?)\s*:?\*{0,2}\s*:?\s*.+$/gim, '');

    // Strip H1 lines (title is in hero section)
    text = text.replace(/^#\s+.+$/gm, '');

    // Strip lines that exactly match the blog title (already in hero)
    if (title) {
      const titleLower = title.toLowerCase().trim();
      text = text.split('\n').filter(line => line.trim().toLowerCase() !== titleLower).join('\n');
    }

    // Ensure double newlines around horizontal rules
    text = text.replace(/\n?(-{3,})\n?/g, '\n\n$1\n\n');

    // Ensure double newlines before/after existing markdown headings
    text = text.replace(/([^\n])\n(#{2,4}\s)/g, '$1\n\n$2');
    text = text.replace(/(#{2,4}\s.+)\n([^\n#])/g, '$1\n\n$2');

    // Auto-detect heading-like lines that lack ## prefix
    const lines = text.split('\n');
    const result: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();

      if (!trimmed) {
        result.push('');
        continue;
      }

      // Skip lines that are already markdown elements
      if (trimmed.startsWith('#') || trimmed.startsWith('- ') || trimmed.startsWith('* ') ||
          /^\d+\.\s/.test(trimmed) || trimmed.startsWith('>') || trimmed.startsWith('|') ||
          /^-{3,}$/.test(trimmed) || /^\*{3,}$/.test(trimmed)) {
        result.push(lines[i]);
        continue;
      }

      // Check context: is previous line blank (or start of content)?
      const prevResultLine = result.length > 0 ? result[result.length - 1].trim() : '';
      const isAfterBlank = prevResultLine === '' || result.length === 0;

      // Also detect heading after sentence-ending line (no blank line between)
      const prevContentLine = findPrevContentLine(result);
      const isAfterSentenceEnd = prevContentLine !== null && /[.!?]["']?\s*$/.test(prevContentLine);

      if ((isAfterBlank || isAfterSentenceEnd) && looksLikeHeading(trimmed)) {
        // Add blank line before heading if needed
        if (!isAfterBlank && result.length > 0) {
          result.push('');
        }
        result.push(`## ${trimmed}`);
        result.push(''); // blank line after heading
        continue;
      }

      result.push(lines[i]);
    }

    text = result.join('\n');

    // Clean up 3+ consecutive blank lines → 2
    text = text.replace(/\n{3,}/g, '\n\n');

    return text.trim();
  }

  function looksLikeHeading(line: string): boolean {
    if (line.length > 80 || line.length < 5) return false;
    // Must not end with sentence punctuation (? is allowed for headings)
    if (line.endsWith('.') || line.endsWith(',') || line.endsWith(';') || line.endsWith(':')) return false;
    // Must not be bold/italic (TL;DR, CTA blocks)
    if (line.startsWith('**') || line.startsWith('*')) return false;
    // Must not be a CTA or link
    if (line.includes('→') || line.includes('-->') || line.startsWith('[') ||
        line.toLowerCase().startsWith('tl;dr') || line.toLowerCase().startsWith('call our') ||
        line.toLowerCase().startsWith('start your') || line.toLowerCase().startsWith('hear it') ||
        line.toLowerCase().startsWith('learn more') || line.toLowerCase().startsWith('click here')) return false;
    // Title case check: majority of significant words (>3 chars) are capitalized
    const words = line.replace(/[^\w\s'-]/g, '').split(/\s+/).filter(w => w.length > 0);
    if (words.length < 2) return false;
    const significantWords = words.filter(w => w.length > 3);
    if (significantWords.length === 0) return true;
    const capitalizedCount = significantWords.filter(w => /^[A-Z]/.test(w)).length;
    return capitalizedCount / significantWords.length >= 0.5;
  }

  function findPrevContentLine(lines: string[]): string | null {
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].trim()) return lines[i].trim();
    }
    return null;
  }

  // Convert markdown to Medium-style HTML
  function convertMarkdownToHtml(markdown: string): string {
    let html = markdown;

    // Normalize line breaks
    html = html.replace(/\r\n/g, '\n');

    // Strip Kramdown-style attributes like {: .cta-hero }, {: .trust-badges }
    html = html.replace(/\{:\s*[^}]+\}/g, '');

    // Add proper line breaks before headers that are inline with text
    html = html.replace(/([.!?:])(\s*)(#{1,3}\s)/g, '$1\n\n$3');
    html = html.replace(/([a-zA-Z0-9])(\s*)(#{1,3}\s)/g, '$1\n\n$3');

    // Split into lines
    const lines = html.split('\n');
    const output: string[] = [];
    let inList = false;
    let listType: 'ul' | 'ol' | null = null;
    let paragraphBuffer: string[] = [];
    let tableBuffer: string[] = [];
    let isFirstParagraph = true;

    const flushParagraph = () => {
      if (paragraphBuffer.length > 0) {
        const text = paragraphBuffer.join(' ').trim();
        if (text) {
          // First paragraph gets drop cap styling
          if (isFirstParagraph) {
            output.push(`<p class="blog-first-para text-xl text-gray-700 leading-[1.9] mb-8" style="font-family: Georgia, 'Times New Roman', serif;">${processInline(text)}</p>`);
            isFirstParagraph = false;
          } else {
            output.push(`<p class="text-xl text-gray-700 leading-[1.9] mb-8" style="font-family: Georgia, 'Times New Roman', serif;">${processInline(text)}</p>`);
          }
        }
        paragraphBuffer = [];
      }
    };

    const closeList = () => {
      if (inList) {
        output.push(listType === 'ol' ? '</ol>' : '</ul>');
        inList = false;
        listType = null;
      }
    };

    const flushTable = () => {
      if (tableBuffer.length < 2) {
        // Not enough rows for a table, treat as paragraphs
        for (const row of tableBuffer) {
          paragraphBuffer.push(row);
        }
        tableBuffer = [];
        return;
      }

      // Find separator row (|---|---|)
      const separatorIndex = tableBuffer.findIndex(row => /^\|[\s\-:|]+\|$/.test(row.trim()));

      const parseCells = (row: string): string[] => {
        return row.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
      };

      let headerRows: string[] = [];
      let bodyRows: string[] = [];

      if (separatorIndex > 0) {
        headerRows = tableBuffer.slice(0, separatorIndex);
        bodyRows = tableBuffer.slice(separatorIndex + 1);
      } else {
        // No separator found — treat first row as header
        headerRows = [tableBuffer[0]];
        bodyRows = tableBuffer.slice(1);
      }

      let table = '<div class="overflow-x-auto my-8 rounded-lg border border-gray-200"><table class="min-w-full divide-y divide-gray-200">';

      // Header
      if (headerRows.length > 0) {
        table += '<thead class="bg-gray-50">';
        for (const row of headerRows) {
          const cells = parseCells(row);
          table += '<tr>';
          for (const cell of cells) {
            table += `<th class="px-4 py-3 text-left text-sm font-semibold text-gray-900">${processInline(cell)}</th>`;
          }
          table += '</tr>';
        }
        table += '</thead>';
      }

      // Body
      if (bodyRows.length > 0) {
        table += '<tbody class="divide-y divide-gray-100 bg-white">';
        for (const row of bodyRows) {
          const cells = parseCells(row);
          table += '<tr>';
          for (const cell of cells) {
            table += `<td class="px-4 py-3 text-sm text-gray-700" style="font-family: Georgia, \'Times New Roman\', serif;">${processInline(cell)}</td>`;
          }
          table += '</tr>';
        }
        table += '</tbody>';
      }

      table += '</table></div>';
      output.push(table);
      tableBuffer = [];
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Empty line - flush paragraph
      if (!trimmed) {
        flushTable();
        flushParagraph();
        closeList();
        continue;
      }

      // H2 headers
      if (trimmed.startsWith('## ')) {
        flushParagraph();
        closeList();
        const text = trimmed.slice(3).trim();
        output.push(`<h2 class="text-3xl font-bold text-gray-900 mt-16 mb-6 tracking-tight" style="font-family: system-ui, -apple-system, sans-serif;">${processInline(text)}</h2>`);
        continue;
      }

      // H3 headers
      if (trimmed.startsWith('### ')) {
        flushParagraph();
        closeList();
        const text = trimmed.slice(4).trim();
        output.push(`<h3 class="text-2xl font-bold text-gray-900 mt-12 mb-4" style="font-family: system-ui, -apple-system, sans-serif;">${processInline(text)}</h3>`);
        continue;
      }

      // H4 headers
      if (trimmed.startsWith('#### ')) {
        flushParagraph();
        closeList();
        const text = trimmed.slice(5).trim();
        output.push(`<h4 class="text-xl font-bold text-gray-900 mt-10 mb-3" style="font-family: system-ui, -apple-system, sans-serif;">${processInline(text)}</h4>`);
        continue;
      }

      // Bullet lists
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        flushParagraph();
        if (!inList || listType !== 'ul') {
          closeList();
          output.push('<ul class="my-8 ml-6 space-y-4">');
          inList = true;
          listType = 'ul';
        }
        const text = trimmed.slice(2).trim();
        output.push(`<li class="text-xl text-gray-700 leading-relaxed pl-2 list-disc" style="font-family: Georgia, 'Times New Roman', serif;">${processInline(text)}</li>`);
        continue;
      }

      // Numbered lists
      const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
      if (numberedMatch) {
        flushParagraph();
        if (!inList || listType !== 'ol') {
          closeList();
          output.push('<ol class="my-8 ml-6 space-y-4 list-decimal">');
          inList = true;
          listType = 'ol';
        }
        output.push(`<li class="text-xl text-gray-700 leading-relaxed pl-2" style="font-family: Georgia, 'Times New Roman', serif;">${processInline(numberedMatch[2])}</li>`);
        continue;
      }

      // Blockquotes
      if (trimmed.startsWith('> ')) {
        flushParagraph();
        closeList();
        const text = trimmed.slice(2).trim();
        output.push(`<blockquote class="my-10 pl-6 border-l-4 border-indigo-500 italic text-xl text-gray-600" style="font-family: Georgia, 'Times New Roman', serif;">${processInline(text)}</blockquote>`);
        continue;
      }

      // Horizontal rule
      if (trimmed === '---' || trimmed === '***') {
        flushParagraph();
        closeList();
        output.push('<hr class="my-12 border-t border-gray-200" />');
        continue;
      }

      // Table rows
      if (trimmed.startsWith('|')) {
        flushParagraph();
        closeList();
        tableBuffer.push(trimmed);
        continue;
      }

      // Non-table line while table is buffered — flush the table
      if (tableBuffer.length > 0) {
        flushTable();
      }

      // Regular text - add to paragraph buffer
      closeList();
      paragraphBuffer.push(trimmed);
    }

    // Flush remaining content
    flushTable();
    flushParagraph();
    closeList();

    return output.join('\n');
  }

  // Process inline markdown (bold, italic, links, code)
  function processInline(text: string): string {
    return text
      // Bold + italic
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="font-bold"><em>$1</em></strong>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
      // Italic
      .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em class="italic">$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-indigo-600 hover:text-indigo-800 underline decoration-indigo-300 underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer">$1</a>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-lg font-mono text-indigo-700">$1</code>');
  }

  // Render the content with markers replaced by components
  const renderContent = () => {
    const { html, markers } = processedContent;

    // If no markers, just return the HTML
    if (markers.length === 0) {
      return <div dangerouslySetInnerHTML={{ __html: html }} />;
    }

    // Split by markers and interleave with components
    const parts: React.ReactNode[] = [];
    let remaining = html;
    let partIndex = 0;

    for (const marker of markers) {
      const splitIndex = remaining.indexOf(marker.placeholder);
      if (splitIndex === -1) continue;

      // Add HTML before marker
      const before = remaining.slice(0, splitIndex);
      if (before) {
        parts.push(<div key={`html-${partIndex}`} dangerouslySetInnerHTML={{ __html: before }} />);
      }

      // Add component for marker
      switch (marker.type) {
        case 'CHART': {
          const chart = chartMap.get(marker.id);
          if (chart) {
            parts.push(<ContentChart key={`chart-${partIndex}`} config={chart} />);
          }
          break;
        }
        case 'STAT': {
          const stat = statMap.get(marker.id);
          if (stat) {
            parts.push(<StatCallout key={`stat-${partIndex}`} stat={stat} sources={sources} />);
          }
          break;
        }
        case 'QUOTE': {
          const quote = quoteMap.get(marker.id);
          if (quote) {
            parts.push(<ExpertQuote key={`quote-${partIndex}`} quote={quote} sources={sources} variant="highlight" />);
          }
          break;
        }
        case 'SOURCE': {
          // Inline source citation - just show as superscript number
          const sourceId = parseInt(marker.id, 10);
          const source = sources.find(s => s.id === sourceId);
          if (source) {
            parts.push(
              <sup key={`source-${partIndex}`} className="text-indigo-600 cursor-help text-sm ml-0.5" title={source.title}>
                [{marker.id}]
              </sup>
            );
          }
          break;
        }
      }

      remaining = remaining.slice(splitIndex + marker.placeholder.length);
      partIndex++;
    }

    // Add remaining HTML
    if (remaining) {
      parts.push(<div key={`html-${partIndex}`} dangerouslySetInnerHTML={{ __html: remaining }} />);
    }

    return <>{parts}</>;
  };

  return (
    <article className={`max-w-none ${className}`}>
      {/* Main content */}
      <div className="blog-content">
        {renderContent()}
      </div>

      {/* Sources list at the bottom */}
      {sources.length > 0 && (
        <div className="mt-16 pt-8 border-t border-gray-200">
          <SourcesList sources={sources} />
        </div>
      )}
    </article>
  );
}

export default RichBlogContent;
