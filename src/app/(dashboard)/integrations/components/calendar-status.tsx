'use client';

import { useEffect, useState } from 'react';
import { Calendar, Link2, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { integrationsApi } from '@/lib/api';

export function CalendarStatus() {
  const [status, setStatus] = useState<{
    connected: boolean;
    provider: string | null;
    calendarId: string | null;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStatus();
  }, []);

  async function fetchStatus() {
    try {
      const result = await integrationsApi.getCalendarStatus();
      setStatus(result);
    } catch (error) {
      console.error('Failed to fetch calendar status:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleConnect = () => {
    // TODO: Implement Google Calendar OAuth flow
    alert('Google Calendar integration coming soon!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <h2 className="text-lg font-bold text-slate-900">Calendar</h2>
        <p className="text-sm text-slate-500 mt-1">
          Sync bookings with your calendar to avoid double-booking and see availability.
        </p>
      </div>

      <div className="lg:col-span-2">
        <Card className="border-none shadow-md ring-1 ring-slate-200 overflow-hidden">
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
                  <div className="h-3 w-48 bg-slate-100 rounded mt-2 animate-pulse" />
                </div>
              </div>
            ) : status?.connected ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <Check className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Google Calendar Connected</span>
                    <p className="text-sm text-slate-500">
                      Syncing with {status.calendarId || 'your calendar'}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Disconnect
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Calendar not connected</span>
                    <p className="text-sm text-slate-500">
                      Connect to sync bookings automatically
                    </p>
                  </div>
                </div>
                <Button onClick={handleConnect}>
                  <Link2 className="w-4 h-4 mr-2" />
                  Connect Google Calendar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
