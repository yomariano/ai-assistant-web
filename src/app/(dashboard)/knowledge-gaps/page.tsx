'use client';

import { useState, useEffect, useCallback } from 'react';
import { HelpCircle, CheckCircle, XCircle, Loader2, Sparkles, Phone, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { knowledgeGapsApi, type KnowledgeGap } from '@/lib/api';

const CATEGORY_LABELS: Record<string, string> = {
  menu: 'Menu',
  hours: 'Hours',
  policy: 'Policy',
  pricing: 'Pricing',
  services: 'Services',
  location: 'Location',
  other: 'Other',
};

const CATEGORY_COLORS: Record<string, string> = {
  menu: 'bg-orange-100 text-orange-700',
  hours: 'bg-blue-100 text-blue-700',
  policy: 'bg-purple-100 text-purple-700',
  pricing: 'bg-green-100 text-green-700',
  services: 'bg-cyan-100 text-cyan-700',
  location: 'bg-rose-100 text-rose-700',
  other: 'bg-slate-100 text-slate-700',
};

type FilterStatus = 'open' | 'resolved' | 'all';

export default function KnowledgeGapsPage() {
  const [gaps, setGaps] = useState<KnowledgeGap[]>([]);
  const [stats, setStats] = useState({ open: 0, resolved: 0, dismissed: 0 });
  const [filter, setFilter] = useState<FilterStatus>('open');
  const [isLoading, setIsLoading] = useState(true);
  const [resolveId, setResolveId] = useState<string | null>(null);
  const [resolveNote, setResolveNote] = useState('');
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [dismissingId, setDismissingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = useCallback(async () => {
    try {
      const [gapsRes, statsRes] = await Promise.all([
        knowledgeGapsApi.list({ status: filter === 'all' ? undefined : filter, limit: 50 }),
        knowledgeGapsApi.getStats(),
      ]);
      setGaps(gapsRes.gaps);
      setStats(statsRes);
    } catch {
      setError('Failed to load knowledge gaps');
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    setIsLoading(true);
    loadData();
  }, [loadData]);

  const handleResolve = async (id: string) => {
    if (!resolveNote.trim()) return;
    try {
      await knowledgeGapsApi.update(id, {
        status: 'resolved',
        resolution_note: resolveNote.trim(),
      });
      setResolveId(null);
      setResolveNote('');
      setSuccess('Gap resolved');
      loadData();
    } catch {
      setError('Failed to resolve gap');
    }
  };

  const handleApply = async (id: string) => {
    setApplyingId(id);
    setError('');
    try {
      const result = await knowledgeGapsApi.applyToAI(id);
      setSuccess(result.message || 'Applied to AI assistant');
      loadData();
    } catch {
      setError('Failed to apply to AI');
    } finally {
      setApplyingId(null);
    }
  };

  const handleDismiss = async (id: string) => {
    setDismissingId(id);
    try {
      await knowledgeGapsApi.update(id, { status: 'dismissed' });
      setSuccess('Gap dismissed');
      loadData();
    } catch {
      setError('Failed to dismiss gap');
    } finally {
      setDismissingId(null);
    }
  };

  // Clear messages after 3 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => { setSuccess(''); setError(''); }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Knowledge Gaps</h1>
        <p className="text-slate-500 mt-1">Questions your AI couldn&apos;t answer. Resolve them to make your AI smarter.</p>
      </div>

      {/* Status messages */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      {success && (
        <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">{success}</div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{stats.open}</p>
            <p className="text-xs text-slate-500 mt-1">Open</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
            <p className="text-xs text-slate-500 mt-1">Resolved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-400">{stats.dismissed}</p>
            <p className="text-xs text-slate-500 mt-1">Dismissed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        {(['open', 'resolved', 'all'] as FilterStatus[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              filter === tab
                ? 'bg-white text-primary border border-b-0 border-slate-200'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === 'open' && stats.open > 0 && (
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs px-2 py-0.5">
                {stats.open}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Gap list */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : gaps.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <HelpCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-700">
              {filter === 'open' ? 'No open knowledge gaps' : 'No knowledge gaps found'}
            </h3>
            <p className="text-sm text-slate-500 mt-2">
              {filter === 'open'
                ? 'Your AI is handling all questions! Gaps will appear here when callers ask something the AI can\'t answer.'
                : 'Try a different filter to see knowledge gaps.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {gaps.map((gap) => (
            <Card key={gap.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Question */}
                    <p className="text-base font-semibold text-slate-900">&ldquo;{gap.question}&rdquo;</p>

                    {/* Meta row */}
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${CATEGORY_COLORS[gap.category] || CATEGORY_COLORS.other}`}>
                        <Tag className="h-3 w-3" />
                        {CATEGORY_LABELS[gap.category] || gap.category}
                      </span>
                      {gap.caller_phone && (
                        <span className="inline-flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {gap.caller_phone}
                        </span>
                      )}
                      <span>{new Date(gap.created_at).toLocaleDateString('en-IE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    {/* Resolution note (if resolved) */}
                    {gap.resolution_note && (
                      <div className="mt-3 rounded-lg bg-green-50 border border-green-100 px-3 py-2 text-sm text-green-800">
                        <span className="font-medium">Answer:</span> {gap.resolution_note}
                      </div>
                    )}

                    {/* Resolve form */}
                    {resolveId === gap.id && (
                      <div className="mt-3 space-y-2">
                        <textarea
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          rows={3}
                          placeholder="Write the answer to this question..."
                          value={resolveNote}
                          onChange={(e) => setResolveNote(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleResolve(gap.id)} disabled={!resolveNote.trim()}>
                            Save Answer
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => { setResolveId(null); setResolveNote(''); }}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0">
                    {gap.status === 'open' && resolveId !== gap.id && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => { setResolveId(gap.id); setResolveNote(''); }}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Resolve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDismiss(gap.id)}
                          disabled={dismissingId === gap.id}
                        >
                          {dismissingId === gap.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 mr-1" />
                              Dismiss
                            </>
                          )}
                        </Button>
                      </>
                    )}
                    {gap.status === 'resolved' && gap.resolution_note && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApply(gap.id)}
                        disabled={applyingId === gap.id}
                      >
                        {applyingId === gap.id ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Sparkles className="h-4 w-4 mr-1" />
                        )}
                        Apply to AI
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
