'use client';

import { useState, useEffect } from 'react';
import { Save, Clock, AlertCircle, Loader2, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { notificationsApi, billingApi } from '@/lib/api';
import type { AISchedule, AIScheduleDay, EscalationSettings } from '@/types';

// Common timezones for the dropdown
const TIMEZONES = [
  { value: 'Europe/Dublin', label: 'Dublin (GMT/IST)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
  { value: 'Europe/Madrid', label: 'Madrid (CET/CEST)' },
  { value: 'Europe/Rome', label: 'Rome (CET/CEST)' },
  { value: 'Europe/Amsterdam', label: 'Amsterdam (CET/CEST)' },
  { value: 'America/New_York', label: 'New York (EST/EDT)' },
  { value: 'America/Chicago', label: 'Chicago (CST/CDT)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
  { value: 'America/Argentina/Buenos_Aires', label: 'Buenos Aires (ART)' },
  { value: 'America/Sao_Paulo', label: 'Sao Paulo (BRT)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
];

const DAYS = [
  { key: '1', label: 'Monday', short: 'Mon' },
  { key: '2', label: 'Tuesday', short: 'Tue' },
  { key: '3', label: 'Wednesday', short: 'Wed' },
  { key: '4', label: 'Thursday', short: 'Thu' },
  { key: '5', label: 'Friday', short: 'Fri' },
  { key: '6', label: 'Saturday', short: 'Sat' },
  { key: '7', label: 'Sunday', short: 'Sun' },
];

// Toggle Switch Component
function Toggle({ enabled, onChange, disabled }: { enabled: boolean; onChange: (val: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
        enabled ? 'bg-primary' : 'bg-slate-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

// Time picker component
function TimePicker({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}) {
  return (
    <input
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
        disabled ? 'bg-slate-100 cursor-not-allowed text-slate-400' : 'bg-white'
      }`}
    />
  );
}

// Schedule row for a single day
function ScheduleRow({
  day,
  config,
  onChange,
}: {
  day: { key: string; label: string; short: string };
  config: AIScheduleDay | null;
  onChange: (config: AIScheduleDay | null) => void;
}) {
  const isActive = config !== null;
  const isAllDay = config?.allDay === true;

  const handleActiveChange = (active: boolean) => {
    if (active) {
      // Default to all day when enabling
      onChange({ allDay: true });
    } else {
      onChange(null);
    }
  };

  const handleAllDayChange = (allDay: boolean) => {
    if (allDay) {
      onChange({ allDay: true });
    } else {
      // Default times when switching from all day
      onChange({ start: '18:00', end: '09:00' });
    }
  };

  const handleTimeChange = (field: 'start' | 'end', value: string) => {
    onChange({ ...config, allDay: false, [field]: value });
  };

  return (
    <div className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0">
      {/* Day name and active toggle */}
      <div className="w-28 flex items-center gap-3">
        <Toggle enabled={isActive} onChange={handleActiveChange} />
        <span className={`text-sm font-medium ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
          {day.short}
        </span>
      </div>

      {/* All day or time range */}
      {isActive && (
        <div className="flex items-center gap-4 flex-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isAllDay}
              onChange={(e) => handleAllDayChange(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20"
            />
            <span className="text-sm text-slate-600">All day</span>
          </label>

          {!isAllDay && (
            <div className="flex items-center gap-2">
              <TimePicker
                value={config?.start || '18:00'}
                onChange={(val) => handleTimeChange('start', val)}
              />
              <span className="text-slate-400">to</span>
              <TimePicker
                value={config?.end || '09:00'}
                onChange={(val) => handleTimeChange('end', val)}
              />
              {config?.start && config?.end && config.start > config.end && (
                <span className="text-xs text-slate-400">(next day)</span>
              )}
            </div>
          )}
        </div>
      )}

      {!isActive && (
        <div className="flex-1">
          <span className="text-sm text-slate-400 italic">AI off - calls forward to your mobile / direct line</span>
        </div>
      )}
    </div>
  );
}

export default function AISchedulePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Plan info
  const [planId, setPlanId] = useState<string | null>(null);
  const [canAccessFeature, setCanAccessFeature] = useState(false);

  // Settings
  const [timezone, setTimezone] = useState('Europe/Dublin');
  const [schedule, setSchedule] = useState<AISchedule>({});
  const [transferNumber, setTransferNumber] = useState('');
  const [scheduleEnabled, setScheduleEnabled] = useState(false);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load subscription to check plan
        const subRes = await billingApi.getSubscription();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subData = subRes as any;
        const currentPlanId = subData?.plan_id || null;
        setPlanId(currentPlanId);

        // Only Growth and Pro can access this feature
        const hasAccess = currentPlanId === 'growth' || currentPlanId === 'pro';
        setCanAccessFeature(hasAccess);

        // Load escalation settings
        const { settings } = await notificationsApi.getEscalation();
        if (settings) {
          setTimezone(settings.timezone || 'Europe/Dublin');
          setTransferNumber(settings.transfer_number || '');
          if (settings.ai_schedule) {
            setSchedule(settings.ai_schedule);
            setScheduleEnabled(true);
          }
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
        setError('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Clear messages after delay
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleDayChange = (dayKey: string, config: AIScheduleDay | null) => {
    setSchedule((prev) => {
      const newSchedule = { ...prev };
      if (config === null) {
        delete newSchedule[dayKey];
      } else {
        newSchedule[dayKey] = config;
      }
      return newSchedule;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      // If schedule is disabled or empty, save null
      const scheduleToSave = scheduleEnabled && Object.keys(schedule).length > 0 ? schedule : null;

      await notificationsApi.updateEscalation({
        timezone,
        transfer_number: transferNumber || undefined,
        ai_schedule: scheduleToSave,
      });

      setSuccess('AI schedule saved successfully!');
    } catch (err: unknown) {
      console.error('Failed to save AI schedule:', err);
      // Extract error message
      let message = 'Failed to save AI schedule';
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const response = (err as { response?: { data?: { error?: { message?: string } } } }).response;
        message = response?.data?.error?.message || message;
      }
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEnableSchedule = (enabled: boolean) => {
    setScheduleEnabled(enabled);
    if (enabled && Object.keys(schedule).length === 0) {
      // Set default schedule: AI active evenings and weekends
      setSchedule({
        '1': { start: '18:00', end: '09:00' },
        '2': { start: '18:00', end: '09:00' },
        '3': { start: '18:00', end: '09:00' },
        '4': { start: '18:00', end: '09:00' },
        '5': { start: '17:00', end: '09:00' },
        '6': { allDay: true },
        '7': { allDay: true },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show upgrade prompt for Starter plan
  if (!canAccessFeature) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">AI Schedule</h1>
          <p className="text-slate-500 mt-2">Configure when the AI receptionist answers calls.</p>
        </div>

        <Card className="border-none shadow-md ring-1 ring-amber-200 overflow-hidden bg-amber-50/50">
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
              <Clock className="h-8 w-8 text-amber-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Upgrade to Growth or Pro</h2>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              AI Schedule is available on Growth and Pro plans. Configure when the AI answers calls vs. when calls forward to your team.
            </p>
            <Link href="/billing">
              <Button className="shadow-lg shadow-primary/20">
                View Plans
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <p className="text-sm text-slate-500 mt-4">
              You&apos;re currently on the <span className="font-semibold capitalize">{planId || 'Starter'}</span> plan
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">AI Schedule</h1>
        <p className="text-slate-500 mt-2">Control when the AI answers calls. With no-answer forwarding, the AI only picks up missed calls — use this for additional fine-grained control.</p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <p className="text-sm font-semibold">{success}</p>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="h-2 w-2 rounded-full bg-rose-500" />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

      {/* Main Settings Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-slate-900">Schedule</h2>
          </div>
          <p className="text-sm text-slate-500">
            When should the AI answer your calls? Outside these hours, calls will forward to your mobile or direct line.
          </p>
        </div>

        <div className="lg:col-span-2">
          <Card className="border-none shadow-md ring-1 ring-slate-200 overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6 space-y-6">
                {/* Enable/Disable Schedule */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <p className="font-semibold text-slate-900">Enable AI Schedule</p>
                    <p className="text-sm text-slate-500">When disabled, AI answers 24/7</p>
                  </div>
                  <Toggle enabled={scheduleEnabled} onChange={handleEnableSchedule} />
                </div>

                {scheduleEnabled && (
                  <>
                    {/* Timezone */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Timezone</label>
                      <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50/50 text-sm"
                      >
                        {TIMEZONES.map((tz) => (
                          <option key={tz.value} value={tz.value}>
                            {tz.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Schedule Table */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3">When AI is Active</label>
                      <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                        {DAYS.map((day) => (
                          <ScheduleRow
                            key={day.key}
                            day={day}
                            config={schedule[day.key] || null}
                            onChange={(config) => handleDayChange(day.key, config)}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-slate-400 mt-2">
                        Enable days when the AI should answer. For overnight hours (e.g., 6pm-9am), the end time is the next morning.
                      </p>
                    </div>

                    {/* Forward Number */}
                    <div>
                      <Input
                        type="tel"
                        label="Mobile / Direct Line (when AI is off)"
                        value={transferNumber}
                        onChange={(e) => setTransferNumber(e.target.value)}
                        placeholder="+353 85 123 4567"
                        className="bg-slate-50/50"
                      />
                      <p className="text-xs text-slate-400 mt-1">
                        Use your mobile or a direct line — not your main business number (to avoid call loops).
                      </p>
                    </div>

                    {/* Warning if no forward number */}
                    {!transferNumber && Object.keys(schedule).length > 0 && Object.keys(schedule).length < 7 && (
                      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                        <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-amber-800">No forward number set</p>
                          <p className="text-sm text-amber-700">
                            When AI is off, calls need somewhere to go. Add a business line or the AI will answer anyway.
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {!scheduleEnabled && (
                  <div className="text-center py-8 text-slate-500">
                    <Clock className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p className="font-medium">AI answers 24/7</p>
                    <p className="text-sm mt-1">Enable the schedule to configure specific hours</p>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 px-6 py-4 flex justify-end border-t border-slate-100">
                <Button onClick={handleSave} isLoading={isSaving} className="shadow-lg shadow-primary/20">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
        <h3 className="font-semibold text-slate-900 mb-2">How it works</h3>
        <ul className="text-sm text-slate-600 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">1.</span>
            <span><strong>AI Active:</strong> During scheduled hours, the AI answers calls, books appointments, and handles inquiries.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">2.</span>
            <span><strong>AI Off:</strong> Outside scheduled hours, calls forward directly to your business line for human handling.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">3.</span>
            <span><strong>Overnight hours:</strong> Set 6pm-9am and the AI will be active from 6pm until 9am the next morning.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
