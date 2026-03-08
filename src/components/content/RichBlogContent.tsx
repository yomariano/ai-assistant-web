'use client';

import { type ReactNode, useMemo } from 'react';
import { ContentChart, type ChartConfig } from './ContentChart';
import { StatCallout, type Statistic } from './StatCallout';
import { ExpertQuote, type Quote } from './ExpertQuote';
import { SourcesList, type Source } from './SourceCitation';

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
  chart_data?: ChartConfig[];
  statistics?: Statistic[];
  sources?: Source[];
  expert_quotes?: Quote[];
}

interface RichBlogContentProps {
  post: BlogPost;
  className?: string;
}

type MarkerType = 'CHART' | 'STAT' | 'QUOTE' | 'SOURCE';

const MARKER_PATTERN = /\[(CHART|STAT|QUOTE|SOURCE):([^\]]+)\]/g;
const HTML_PATTERN = /<\/?[a-z][\s\S]*?>/i;
const ENTITY_MAP: Record<string, string> = {
  '&nbsp;': ' ',
  '&amp;': '&',
  '&quot;': '"',
  '&#39;': "'",
  '&lt;': '<',
  '&gt;': '>',
};
const ARTIFACT_REPLACEMENTS: Array<[string, string]> = [
  ['Â·', '·'],
  ['â€”', '—'],
  ['â€“', '–'],
  ['â€™', '’'],
  ['â€œ', '“'],
  ['â€\u009d', '”'],
  ['â€˜', '‘'],
  ['â†’', '→'],
  ['Ã©', 'é'],
  ['Ã¡', 'á'],
  ['Ã­', 'í'],
  ['Ã³', 'ó'],
  ['Ãº', 'ú'],
  ['Ã±', 'ñ'],
  ['Ã¼', 'ü'],
  ['Â¿', '¿'],
  ['Â¡', '¡'],
];

function extractMarkers(content: string) {
  const markers: Array<{ placeholder: string; type: MarkerType; id: string }> = [];
  let markerIndex = 0;

  const text = content.replace(MARKER_PATTERN, (_, rawType: MarkerType, id: string) => {
    const placeholder = `___MARKER_${markerIndex}___`;
    markers.push({
      placeholder,
      type: rawType,
      id,
    });
    markerIndex += 1;
    return placeholder;
  });

  return { text, markers };
}

function normalizeSourceContent(raw: string, title?: string): string {
  const withConsistentEncoding = repairEncodingArtifacts(raw).replace(/\r\n/g, '\n');
  const source = looksLikeHtml(withConsistentEncoding)
    ? htmlToMarkdownish(withConsistentEncoding)
    : withConsistentEncoding;

  return preprocessMarkdown(source, title);
}

function looksLikeHtml(text: string): boolean {
  return HTML_PATTERN.test(text);
}

function repairEncodingArtifacts(text: string): string {
  let result = text;

  for (const [artifact, replacement] of ARTIFACT_REPLACEMENTS) {
    result = result.replaceAll(artifact, replacement);
  }

  return result;
}

function decodeBasicEntities(text: string): string {
  let result = text;

  for (const [entity, replacement] of Object.entries(ENTITY_MAP)) {
    result = result.replaceAll(entity, replacement);
  }

  return result;
}

function stripResidualTags(text: string): string {
  return decodeBasicEntities(text.replace(/<\/?[^>]+>/g, ''));
}

function htmlToMarkdownish(rawHtml: string): string {
  let text = rawHtml;

  text = text.replace(/<script[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[\s\S]*?<\/style>/gi, '');
  text = text.replace(/<h1[^>]*>[\s\S]*?<\/h1>/gi, '');
  text = text.replace(/<hr[^>]*\/?>/gi, '\n\n---\n\n');
  text = text.replace(/<br\s*\/?>/gi, '\n');

  text = text.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, (_, _tag, inner: string) => `**${stripResidualTags(inner).trim()}**`);
  text = text.replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, (_, _tag, inner: string) => `*${stripResidualTags(inner).trim()}*`);
  text = text.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, inner: string) => `\`${stripResidualTags(inner).trim()}\``);

  text = text.replace(/<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href: string, label: string) => {
    const cleanLabel = stripResidualTags(label).trim();
    const cleanHref = decodeBasicEntities(href.trim());
    return cleanLabel ? `[${cleanLabel}](${cleanHref})` : '';
  });

  text = text.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, inner: string) => {
    const lines = stripResidualTags(inner)
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => `> ${line}`);

    return `\n\n${lines.join('\n')}\n\n`;
  });

  text = text.replace(/<(h2|h3|h4|h5|h6)[^>]*>([\s\S]*?)<\/\1>/gi, (_, tag: string, inner: string) => {
    const level = Math.min(Number(tag.slice(1)), 4);
    const clean = stripResidualTags(inner).trim();
    return clean ? `\n\n${'#'.repeat(level)} ${clean}\n\n` : '\n\n';
  });

  text = text.replace(/<\/?(ul|ol)[^>]*>/gi, '\n');
  text = text.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, inner: string) => `\n- ${stripResidualTags(inner).trim()}`);

  text = text.replace(/<(p|div|section|article|aside|header|footer|main|figure|figcaption)[^>]*>/gi, '');
  text = text.replace(/<\/(p|div|section|article|aside|header|footer|main|figure|figcaption)>/gi, '\n\n');

  text = stripResidualTags(text);
  text = repairEncodingArtifacts(text);
  text = text.replace(/\n{3,}/g, '\n\n');

  return text.trim();
}

function preprocessMarkdown(raw: string, title?: string): string {
  let text = raw.replace(/\r\n/g, '\n');

  text = text.replace(/^\*{0,2}(?:Target keywords?|Secondary keywords?|Word count|Date|Keywords?)\s*:?\*{0,2}\s*:?\s*.+$/gim, '');
  text = text.replace(/^#\s+.+$/gm, '');

  if (title) {
    const targetTitle = title.toLowerCase().trim();
    text = text
      .split('\n')
      .filter((line) => line.trim().toLowerCase() !== targetTitle)
      .join('\n');
  }

  text = text.replace(/^\s*---\s*$/gm, '\n---\n');
  text = text.replace(/(?:\n\s*){2,}(?=\|)/g, '\n');
  text = text.replace(/(?<=\|[^\n]+)\n{2,}(?=\|)/g, '\n');
  text = text.replace(/^\s*(\*{3,}|-{3,})\s*$/gm, '\n$1\n');
  text = text.replace(/([^\n])\n(#{2,4}\s)/g, '$1\n\n$2');
  text = text.replace(/(#{2,4}\s.+)\n([^\n#])/g, '$1\n\n$2');

  const lines = text.split('\n');
  const result: string[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index];
    const line = rawLine.trim();

    if (!line) {
      result.push('');
      continue;
    }

    if (
      line.startsWith('#') ||
      line.startsWith('- ') ||
      line.startsWith('* ') ||
      /^\d+\.\s/.test(line) ||
      line.startsWith('>') ||
      line.startsWith('|') ||
      /^-{3,}$/.test(line) ||
      /^\*{3,}$/.test(line)
    ) {
      result.push(line);
      continue;
    }

    const previousLine = findPreviousContentLine(result);
    const isAfterBlank = result.length === 0 || result[result.length - 1].trim() === '';
    const isAfterSentenceEnd = previousLine !== null && /[.!?]["']?\s*$/.test(previousLine);

    if ((isAfterBlank || isAfterSentenceEnd) && looksLikeHeading(line)) {
      if (!isAfterBlank) {
        result.push('');
      }

      result.push(`## ${line}`);
      result.push('');
      continue;
    }

    result.push(rawLine);
  }

  return result.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function looksLikeHeading(line: string): boolean {
  if (line.length < 5 || line.length > 90) {
    return false;
  }

  if (/[.,;:]$/.test(line)) {
    return false;
  }

  if (
    line.startsWith('**') ||
    line.startsWith('*') ||
    line.startsWith('[') ||
    line.toLowerCase().startsWith('tl;dr') ||
    line.toLowerCase().startsWith('call our') ||
    line.toLowerCase().startsWith('start your') ||
    line.toLowerCase().startsWith('hear it') ||
    line.toLowerCase().startsWith('learn more') ||
    line.toLowerCase().startsWith('click here')
  ) {
    return false;
  }

  const words = line
    .replace(/[^\w\s'-]/g, '')
    .split(/\s+/)
    .filter(Boolean);

  if (words.length < 2) {
    return false;
  }

  const significantWords = words.filter((word) => word.length > 3);
  if (significantWords.length === 0) {
    return true;
  }

  const capitalizedWords = significantWords.filter((word) => /^[A-Z]/.test(word)).length;
  return capitalizedWords / significantWords.length >= 0.5;
}

function findPreviousContentLine(lines: string[]): string | null {
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const line = lines[index].trim();
    if (line) {
      return line;
    }
  }

  return null;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttribute(text: string): string {
  return escapeHtml(text).replace(/`/g, '&#96;');
}

function processInline(text: string): string {
  let html = escapeHtml(repairEncodingArtifacts(text.trim()));

  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
  html = html.replace(/`([^`]+)`/g, '<code class="blog-inline-code">$1</code>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label: string, href: string) => {
    const cleanHref = href.trim();
    const external = /^(?:https?:)?\/\//i.test(cleanHref) || cleanHref.startsWith('mailto:');
    const target = external ? ' target="_blank" rel="noopener noreferrer"' : '';

    return `<a href="${escapeAttribute(cleanHref)}" class="blog-link"${target}>${label}</a>`;
  });

  return html;
}

function convertMarkdownToHtml(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const output: string[] = [];

  let inList = false;
  let listType: 'ul' | 'ol' | null = null;
  let isFirstParagraph = true;
  let paragraphBuffer: string[] = [];
  let blockquoteBuffer: string[] = [];
  let tableBuffer: string[] = [];

  const flushParagraph = () => {
    if (paragraphBuffer.length === 0) {
      return;
    }

    const text = paragraphBuffer.join(' ').replace(/\s+/g, ' ').trim();
    if (!text) {
      paragraphBuffer = [];
      return;
    }

    output.push(
      `<p class="${isFirstParagraph ? 'blog-paragraph blog-first-paragraph' : 'blog-paragraph'}">${processInline(text)}</p>`
    );
    isFirstParagraph = false;
    paragraphBuffer = [];
  };

  const flushBlockquote = () => {
    if (blockquoteBuffer.length === 0) {
      return;
    }

    const body = blockquoteBuffer
      .map((line) => line.replace(/^>\s?/, '').trim())
      .filter(Boolean)
      .map((line) => `<p>${processInline(line)}</p>`)
      .join('');

    output.push(`<blockquote class="blog-blockquote">${body}</blockquote>`);
    blockquoteBuffer = [];
  };

  const closeList = () => {
    if (!inList || !listType) {
      return;
    }

    output.push(listType === 'ol' ? '</ol>' : '</ul>');
    inList = false;
    listType = null;
  };

  const flushTable = () => {
    if (tableBuffer.length === 0) {
      return;
    }

    if (tableBuffer.length < 2) {
      paragraphBuffer.push(...tableBuffer);
      tableBuffer = [];
      return;
    }

    const separatorIndex = tableBuffer.findIndex((row) => /^\|[\s\-:|]+\|$/.test(row.trim()));
    const headerRows = separatorIndex > 0 ? tableBuffer.slice(0, separatorIndex) : [tableBuffer[0]];
    const bodyRows = separatorIndex > 0 ? tableBuffer.slice(separatorIndex + 1) : tableBuffer.slice(1);

    const parseCells = (row: string) =>
      row
        .trim()
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map((cell) => cell.trim());

    let table = '<div class="blog-table-wrap"><table class="blog-table">';

    if (headerRows.length > 0) {
      table += '<thead><tr>';
      for (const cell of parseCells(headerRows[0])) {
        table += `<th>${processInline(cell)}</th>`;
      }
      table += '</tr></thead>';
    }

    if (bodyRows.length > 0) {
      table += '<tbody>';
      for (const row of bodyRows) {
        table += '<tr>';
        for (const cell of parseCells(row)) {
          table += `<td>${processInline(cell)}</td>`;
        }
        table += '</tr>';
      }
      table += '</tbody>';
    }

    table += '</table></div>';
    output.push(table);
    tableBuffer = [];
  };

  const flushAll = () => {
    flushTable();
    flushParagraph();
    flushBlockquote();
    closeList();
  };

  const findNextNonEmptyLine = (startIndex: number) => {
    for (let nextIndex = startIndex; nextIndex < lines.length; nextIndex += 1) {
      const nextLine = lines[nextIndex].trim();
      if (nextLine) {
        return nextLine;
      }
    }

    return null;
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      if (tableBuffer.length > 0) {
        const nextLine = findNextNonEmptyLine(index + 1);
        if (nextLine?.startsWith('|')) {
          continue;
        }
      }

      flushAll();
      continue;
    }

    if (trimmed.startsWith('## ')) {
      flushAll();
      output.push(`<h2 class="blog-heading blog-heading-2">${processInline(trimmed.slice(3).trim())}</h2>`);
      continue;
    }

    if (trimmed.startsWith('### ')) {
      flushAll();
      output.push(`<h3 class="blog-heading blog-heading-3">${processInline(trimmed.slice(4).trim())}</h3>`);
      continue;
    }

    if (trimmed.startsWith('#### ')) {
      flushAll();
      output.push(`<h4 class="blog-heading blog-heading-4">${processInline(trimmed.slice(5).trim())}</h4>`);
      continue;
    }

    if (/^[-*]{3,}$/.test(trimmed)) {
      flushAll();
      output.push('<hr class="blog-divider" />');
      continue;
    }

    if (trimmed.startsWith('>')) {
      flushParagraph();
      flushTable();
      closeList();
      blockquoteBuffer.push(trimmed);
      continue;
    }

    if (blockquoteBuffer.length > 0) {
      flushBlockquote();
    }

    if (trimmed.startsWith('|')) {
      flushParagraph();
      closeList();
      tableBuffer.push(trimmed);
      continue;
    }

    if (tableBuffer.length > 0) {
      flushTable();
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      flushParagraph();
      if (!inList || listType !== 'ul') {
        closeList();
        output.push('<ul class="blog-list blog-list-ul">');
        inList = true;
        listType = 'ul';
      }

      output.push(`<li>${processInline(trimmed.slice(2).trim())}</li>`);
      continue;
    }

    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numberedMatch) {
      flushParagraph();
      if (!inList || listType !== 'ol') {
        closeList();
        output.push('<ol class="blog-list blog-list-ol">');
        inList = true;
        listType = 'ol';
      }

      output.push(`<li>${processInline(numberedMatch[2].trim())}</li>`);
      continue;
    }

    closeList();
    paragraphBuffer.push(trimmed);
  }

  flushAll();
  return output.join('\n');
}

export function RichBlogContent({ post, className = '' }: RichBlogContentProps) {
  const { content, chart_data = [], statistics = [], sources = [], expert_quotes = [] } = post;

  const chartMap = useMemo(() => new Map(chart_data.map((chart) => [chart.id, chart])), [chart_data]);
  const statMap = useMemo(
    () => new Map(statistics.map((stat, index) => [stat.id || `stat-${index}`, stat])),
    [statistics]
  );
  const quoteMap = useMemo(
    () => new Map(expert_quotes.map((quote, index) => [quote.id || `quote-${index}`, quote])),
    [expert_quotes]
  );

  const processedContent = useMemo(() => {
    const { text, markers } = extractMarkers(content);
    const normalized = normalizeSourceContent(text, post.title);
    const html = convertMarkdownToHtml(normalized).replace(/\[[A-Z]+:[^\]]*\]/g, '');

    return { html, markers };
  }, [content, post.title]);

  const renderContent = () => {
    const { html, markers } = processedContent;

    if (markers.length === 0) {
      return <div dangerouslySetInnerHTML={{ __html: html }} />;
    }

    const parts: ReactNode[] = [];
    let remaining = html;
    let partIndex = 0;

    for (const marker of markers) {
      const splitIndex = remaining.indexOf(marker.placeholder);
      if (splitIndex === -1) {
        continue;
      }

      const before = remaining.slice(0, splitIndex);
      if (before) {
        parts.push(<div key={`html-${partIndex}`} dangerouslySetInnerHTML={{ __html: before }} />);
      }

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
            parts.push(
              <ExpertQuote
                key={`quote-${partIndex}`}
                quote={quote}
                sources={sources}
                variant="highlight"
              />
            );
          }
          break;
        }
        case 'SOURCE': {
          const sourceId = Number.parseInt(marker.id, 10);
          const source = sources.find((entry) => entry.id === sourceId);
          if (source) {
            parts.push(
              <sup key={`source-${partIndex}`} className="ml-1 text-sm font-semibold text-indigo-600" title={source.title}>
                [{marker.id}]
              </sup>
            );
          }
          break;
        }
      }

      remaining = remaining.slice(splitIndex + marker.placeholder.length);
      partIndex += 1;
    }

    if (remaining) {
      parts.push(<div key={`html-${partIndex}`} dangerouslySetInnerHTML={{ __html: remaining }} />);
    }

    return <>{parts}</>;
  };

  return (
    <article className={`max-w-none ${className}`}>
      <div className="blog-content">
        {renderContent()}
      </div>

      {sources.length > 0 && (
        <div className="mt-16 border-t border-stone-200 pt-8">
          <SourcesList sources={sources} />
        </div>
      )}
    </article>
  );
}

export default RichBlogContent;
