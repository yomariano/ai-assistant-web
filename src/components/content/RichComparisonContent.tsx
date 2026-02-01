'use client';

import { ContentChart, ChartConfig } from './ContentChart';
import { StatCallout, Statistic } from './StatCallout';
import { SourcesList, Source, InlineCitation } from './SourceCitation';
import { InteractiveTable, FeatureComparison } from './InteractiveTable';

export interface PricingData {
  voicefleet: {
    min: number;
    max: number;
    currency: string;
    period: string;
  };
  alternative: {
    min: number | null;
    max: number | null;
    currency: string;
    period: string;
    notes?: string;
    sourceId?: number;
  };
}

export interface ComparisonPage {
  id: string;
  slug: string;
  alternative_name: string;
  title: string;
  hero_title: string;
  hero_subtitle: string;
  who_this_is_for: string[];
  quick_take: Array<{ label: string; value: string }>;
  when_voicefleet_wins: string[];
  when_alternative_wins: string[];
  feature_comparison: FeatureComparison[];
  faq: Array<{ question: string; answer: string }>;
  detailed_comparison?: string;
  // Rich content fields
  chart_data?: ChartConfig[];
  statistics?: Statistic[];
  sources?: Source[];
  pricing_data?: PricingData;
}

interface RichComparisonContentProps {
  page: ComparisonPage;
  className?: string;
}

export function RichComparisonContent({ page, className = '' }: RichComparisonContentProps) {
  const {
    alternative_name,
    who_this_is_for,
    quick_take,
    when_voicefleet_wins,
    when_alternative_wins,
    feature_comparison,
    faq,
    detailed_comparison,
    chart_data = [],
    statistics = [],
    sources = [],
    pricing_data
  } = page;

  // Process source citations in text: [SOURCE:id]
  const processSourceCitations = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    const sourcePattern = /\[SOURCE:(\d+)\]/g;

    let lastIndex = 0;
    let match;

    while ((match = sourcePattern.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>{text.slice(lastIndex, match.index)}</span>
        );
      }

      const sourceId = parseInt(match[1], 10);
      parts.push(
        <InlineCitation key={`source-${match.index}`} sourceId={sourceId} sources={sources} />
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(
        <span key={`text-${lastIndex}`}>{text.slice(lastIndex)}</span>
      );
    }

    return parts.length > 0 ? parts : [text];
  };

  // Find pricing chart if available
  const pricingChart = chart_data.find(c => c.id === 'pricing-comparison');
  const featureRadar = chart_data.find(c => c.type === 'radar');
  const otherCharts = chart_data.filter(c => c.id !== 'pricing-comparison' && c.type !== 'radar');

  return (
    <div className={`${className}`}>
      {/* Quick Take Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Take</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quick_take.map((item, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                {item.label}
              </div>
              <div className="text-lg text-gray-900">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Statistics Callouts */}
      {statistics.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {statistics.slice(0, 4).map((stat, index) => (
              <StatCallout key={index} stat={stat} sources={sources} />
            ))}
          </div>
        </section>
      )}

      {/* Feature Radar Chart */}
      {featureRadar && (
        <section className="mb-12">
          <ContentChart config={featureRadar} />
        </section>
      )}

      {/* Who This Is For */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Who This Comparison Is For</h2>
        <div className="flex flex-wrap gap-2">
          {who_this_is_for.map((industry, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium capitalize"
            >
              {industry.replace(/-/g, ' ')}
            </span>
          ))}
        </div>
      </section>

      {/* When Each Wins */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* VoiceFleet Wins */}
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              VoiceFleet Wins When...
            </h3>
            <ul className="space-y-3">
              {when_voicefleet_wins.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-green-900">
                  <span className="text-green-600 mt-1">•</span>
                  {processSourceCitations(item)}
                </li>
              ))}
            </ul>
          </div>

          {/* Alternative Wins */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {alternative_name} Wins When...
            </h3>
            <ul className="space-y-3">
              {when_alternative_wins.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <span className="text-gray-500 mt-1">•</span>
                  {processSourceCitations(item)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Pricing Comparison Chart */}
      {pricingChart && (
        <section className="mb-12">
          <ContentChart config={pricingChart} />
          {pricing_data?.alternative?.notes && (
            <p className="text-sm text-gray-500 mt-2 text-center">
              {pricing_data.alternative.notes}
              {pricing_data.alternative.sourceId && (
                <InlineCitation sourceId={pricing_data.alternative.sourceId} sources={sources} />
              )}
            </p>
          )}
        </section>
      )}

      {/* Feature Comparison Table */}
      {feature_comparison.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Feature-by-Feature Comparison</h2>
          <InteractiveTable
            data={feature_comparison}
            alternativeName={alternative_name}
          />
        </section>
      )}

      {/* Other Charts */}
      {otherCharts.map((chart, index) => (
        <section key={index} className="mb-12">
          <ContentChart config={chart} />
        </section>
      ))}

      {/* Detailed Comparison */}
      {detailed_comparison && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Analysis</h2>
          <div className="prose prose-lg max-w-none">
            {detailed_comparison.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700 leading-relaxed mb-4">
                {processSourceCitations(paragraph)}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faq.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faq.map((item, index) => (
              <details key={index} className="group border border-gray-200 rounded-lg">
                <summary className="px-6 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50 flex items-center justify-between">
                  {item.question}
                  <svg
                    className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-4 text-gray-700">
                  {processSourceCitations(item.answer)}
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Sources */}
      {sources.length > 0 && (
        <SourcesList sources={sources} />
      )}
    </div>
  );
}

export default RichComparisonContent;
