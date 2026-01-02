'use client';

import { useEffect, useState } from 'react';
import { Calendar, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { scheduledCallsApi } from '@/lib/api';
import type { ScheduledCall } from '@/types';
import { format } from 'date-fns';

export default function ScheduledPage() {
  const [scheduledCalls, setScheduledCalls] = useState<ScheduledCall[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('pending');

  useEffect(() => {
    fetchScheduledCalls();
  }, [filter]);

  const fetchScheduledCalls = async () => {
    setIsLoading(true);
    try {
      const data = await scheduledCallsApi.list(filter === 'all' ? undefined : filter);
      setScheduledCalls(data);
    } catch (error) {
      console.error('Failed to fetch scheduled calls:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this scheduled call?')) return;

    try {
      await scheduledCallsApi.cancel(id);
      fetchScheduledCalls();
    } catch (error) {
      console.error('Failed to cancel scheduled call:', error);
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20';
      case 'completed': return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20';
      case 'failed': return 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20';
      case 'cancelled': return 'bg-slate-50 text-slate-700 ring-1 ring-slate-600/20';
      default: return 'bg-slate-50 text-slate-700 ring-1 ring-slate-600/20';
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Scheduled Events</h1>
          <p className="text-slate-500 mt-1">Manage and monitor your upcoming automated calls.</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-xl w-fit">
        {['pending', 'completed', 'failed', 'cancelled', 'all'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all duration-200 ${filter === status
                ? 'bg-white text-primary shadow-sm'
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
              }`}
          >
            {status}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : scheduledCalls.length === 0 ? (
        <Card className="border-none ring-1 ring-slate-200">
          <CardContent className="py-20 text-center">
            <div className="mx-auto w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-400">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No scheduled calls</h3>
            <p className="text-slate-500 mt-2 max-w-xs mx-auto">
              Ready to automate? Schedule a call from the New Call page to see it here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
          {scheduledCalls.map((call) => (
            <Card key={call.id} className="border-none ring-1 ring-slate-200 hover:ring-primary/30 transition-all overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 text-primary rounded-lg">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">
                          {format(new Date(call.scheduledTime), 'EEE, MMM d, yyyy')}
                        </span>
                        <span className="text-xs font-medium text-slate-500">
                          Started at {format(new Date(call.scheduledTime), 'h:mm a')}
                        </span>
                      </div>
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyles(call.status)}`}>
                        {call.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900">{call.contactName || call.phoneNumber}</h4>
                      {call.contactName && <p className="text-xs text-slate-400 font-medium">{call.phoneNumber}</p>}
                    </div>

                    <p className="text-sm text-slate-600 line-clamp-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      &quot;{call.message}&quot;
                    </p>
                  </div>

                  {call.status === 'pending' && (
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full" onClick={() => handleCancel(call.id)}>
                      <X className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
