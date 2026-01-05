'use client';

import { useEffect, useState } from 'react';
import { Phone, History } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { historyApi } from '@/lib/api';
import type { CallHistory } from '@/types';
import { format, formatDistanceToNow } from 'date-fns';

export default function HistoryPage() {
  const [history, setHistory] = useState<CallHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await historyApi.list(50, 0);
      setHistory(data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20';
      case 'failed': return 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20';
      case 'initiated': return 'bg-sky-50 text-sky-700 ring-1 ring-sky-600/20';
      default: return 'bg-slate-50 text-slate-700 ring-1 ring-slate-600/20';
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Call History</h1>
          <p className="text-slate-500 mt-1">Review and analyze your past AI call interactions.</p>
        </div>
      </div>

      {history.length === 0 ? (
        <Card className="border-none ring-1 ring-slate-200">
          <CardContent className="py-20 text-center">
            <div className="mx-auto w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <History className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No history available</h3>
            <p className="text-slate-500 mt-2 max-w-xs mx-auto">
              Your call activity will appear here once you start using the AI Assistant.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-none shadow-sm ring-1 ring-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Message Snippet</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((call) => (
                  <tr key={call.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-white transition-colors">
                          <Phone className="w-4 h-4 text-slate-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 leading-none">{call.contactName || call.phoneNumber}</p>
                          {call.contactName && (
                            <p className="text-xs text-slate-400 mt-1">{call.phoneNumber}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm text-slate-600 line-clamp-1 max-w-[200px] lg:max-w-md">{call.message}</p>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusStyles(call.status)}`}>
                        {call.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-600">
                      {formatDuration(call.durationSeconds)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      <p className="text-sm font-semibold text-slate-900">
                        {format(new Date(call.createdAt), 'MMM d, yyyy')}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {formatDistanceToNow(new Date(call.createdAt), { addSuffix: true })}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
