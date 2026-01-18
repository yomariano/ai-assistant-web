'use client';

import { useState, useEffect } from 'react';
import { Save, Mail, MessageSquare, PhoneForwarded, Send, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { notificationsApi } from '@/lib/api';
import type { NotificationPreferences, EscalationSettings } from '@/types';

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

export default function NotificationsPage() {
  // Simplified Notification Preferences State
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_enabled: true,
    email_address: '',
    sms_enabled: false,
    sms_number: '',
    notify_on_call_complete: true,
    notify_on_escalation: true,
    notify_on_voicemail: true,
  });

  // Simplified Escalation Settings State
  const [escalation, setEscalation] = useState<EscalationSettings>({
    transfer_enabled: false,
    transfer_number: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);
  const [isSavingEscalation, setIsSavingEscalation] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState<'email' | 'sms' | null>(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const getErrorMessage = (err: unknown): string | null => {
    if (typeof err !== 'object' || err === null) return null;
    if (!('response' in err)) return null;
    const response = (err as { response?: unknown }).response;
    if (typeof response !== 'object' || response === null) return null;
    if (!('data' in response)) return null;
    const data = (response as { data?: unknown }).data;
    if (typeof data !== 'object' || data === null) return null;
    if (!('error' in data)) return null;
    const errorObj = (data as { error?: unknown }).error;
    if (typeof errorObj !== 'object' || errorObj === null) return null;
    if (!('message' in errorObj)) return null;
    const message = (errorObj as { message?: unknown }).message;
    return typeof message === 'string' ? message : null;
  };

  // Load existing settings
  useEffect(() => {
    const loadData = async () => {
      try {
        const [prefsResponse, escalationResponse] = await Promise.all([
          notificationsApi.getPreferences(),
          notificationsApi.getEscalation(),
        ]);

        if (prefsResponse.preferences) {
          setPreferences(prev => ({ ...prev, ...prefsResponse.preferences }));
        }
        if (escalationResponse.settings) {
          setEscalation(prev => ({ ...prev, ...escalationResponse.settings }));
        }
      } catch (err) {
        console.error('Failed to load notification settings:', err);
        setError('Failed to load notification settings');
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

  const handleSavePreferences = async () => {
    setIsSavingPrefs(true);
    setError('');
    setSuccess('');

    try {
      await notificationsApi.updatePreferences(preferences);
      setSuccess('Notification settings saved!');
    } catch (err: unknown) {
      setError(getErrorMessage(err) || 'Failed to save settings');
    } finally {
      setIsSavingPrefs(false);
    }
  };

  const handleSaveEscalation = async () => {
    setIsSavingEscalation(true);
    setError('');
    setSuccess('');

    try {
      await notificationsApi.updateEscalation(escalation);
      setSuccess('Call transfer settings saved!');
    } catch (err: unknown) {
      setError(getErrorMessage(err) || 'Failed to save settings');
    } finally {
      setIsSavingEscalation(false);
    }
  };

  const handleSendTest = async (type: 'email' | 'sms') => {
    setIsSendingTest(type);
    setError('');
    setSuccess('');

    try {
      const result = await notificationsApi.sendTest(type);
      if (result.success) {
        setSuccess(`Test ${type} sent successfully!`);
      } else {
        setError(result.message || `Failed to send test ${type}`);
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err) || `Failed to send test ${type}`);
    } finally {
      setIsSendingTest(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Notifications</h1>
        <p className="text-slate-500 mt-2">Get notified when calls come in and configure call transfers.</p>
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

      {/* Email Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-slate-900">Email</h2>
          </div>
          <p className="text-sm text-slate-500">
            Receive call summaries and alerts via email.
          </p>
        </div>

        <div className="lg:col-span-2">
          <Card className="border-none shadow-md ring-1 ring-slate-200 overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6 space-y-5">
                {/* Enable Email */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">Enable Email Notifications</p>
                    <p className="text-sm text-slate-500">Get emails when calls are completed</p>
                  </div>
                  <Toggle
                    enabled={preferences.email_enabled}
                    onChange={(val) => setPreferences(prev => ({ ...prev, email_enabled: val }))}
                  />
                </div>

                {/* Email Address */}
                {preferences.email_enabled && (
                  <div>
                    <Input
                      type="email"
                      label="Email Address"
                      value={preferences.email_address || ''}
                      onChange={(e) => setPreferences(prev => ({ ...prev, email_address: e.target.value }))}
                      placeholder="your@email.com"
                      className="bg-slate-50/50"
                    />
                    <p className="text-xs text-slate-400 mt-1">Leave blank to use your account email</p>
                  </div>
                )}

                {/* Notification Types */}
                {preferences.email_enabled && (
                  <div className="space-y-3 pt-2">
                    <p className="text-sm font-semibold text-slate-700">Notify me when:</p>

                    <div className="flex items-center justify-between py-1">
                      <span className="text-sm text-slate-600">Call completed</span>
                      <Toggle
                        enabled={preferences.notify_on_call_complete}
                        onChange={(val) => setPreferences(prev => ({ ...prev, notify_on_call_complete: val }))}
                      />
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <span className="text-sm text-slate-600">Call transferred to human</span>
                      <Toggle
                        enabled={preferences.notify_on_escalation}
                        onChange={(val) => setPreferences(prev => ({ ...prev, notify_on_escalation: val }))}
                      />
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <span className="text-sm text-slate-600">Voicemail received</span>
                      <Toggle
                        enabled={preferences.notify_on_voicemail}
                        onChange={(val) => setPreferences(prev => ({ ...prev, notify_on_voicemail: val }))}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSendTest('email')}
                  disabled={!preferences.email_enabled || isSendingTest === 'email'}
                >
                  {isSendingTest === 'email' ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Send Test
                </Button>
                <Button onClick={handleSavePreferences} isLoading={isSavingPrefs} className="shadow-lg shadow-primary/20">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SMS Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-slate-900">SMS</h2>
          </div>
          <p className="text-sm text-slate-500">
            Get instant text alerts for important calls.
          </p>
        </div>

        <div className="lg:col-span-2">
          <Card className="border-none shadow-md ring-1 ring-slate-200 overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6 space-y-5">
                {/* Enable SMS */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">Enable SMS Notifications</p>
                    <p className="text-sm text-slate-500">Receive text messages for urgent alerts</p>
                  </div>
                  <Toggle
                    enabled={preferences.sms_enabled}
                    onChange={(val) => setPreferences(prev => ({ ...prev, sms_enabled: val }))}
                  />
                </div>

                {/* Phone Number */}
                {preferences.sms_enabled && (
                  <div>
                    <Input
                      type="tel"
                      label="Phone Number"
                      value={preferences.sms_number || ''}
                      onChange={(e) => setPreferences(prev => ({ ...prev, sms_number: e.target.value }))}
                      placeholder="+353851234567"
                      className="bg-slate-50/50"
                    />
                    <p className="text-xs text-slate-400 mt-1">Use international format (e.g., +353 for Ireland)</p>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSendTest('sms')}
                  disabled={!preferences.sms_enabled || !preferences.sms_number || isSendingTest === 'sms'}
                >
                  {isSendingTest === 'sms' ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Send Test
                </Button>
                <Button onClick={handleSavePreferences} isLoading={isSavingPrefs} className="shadow-lg shadow-primary/20">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call Transfer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <PhoneForwarded className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-slate-900">Call Transfer</h2>
          </div>
          <p className="text-sm text-slate-500">
            Allow the AI to transfer calls to you when needed.
          </p>
        </div>

        <div className="lg:col-span-2">
          <Card className="border-none shadow-md ring-1 ring-slate-200 overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6 space-y-5">
                {/* Enable Transfer */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">Enable Call Transfer</p>
                    <p className="text-sm text-slate-500">Let AI transfer calls when a customer asks for a human</p>
                  </div>
                  <Toggle
                    enabled={escalation.transfer_enabled}
                    onChange={(val) => setEscalation(prev => ({ ...prev, transfer_enabled: val }))}
                  />
                </div>

                {/* Transfer Number */}
                {escalation.transfer_enabled && (
                  <div>
                    <Input
                      type="tel"
                      label="Transfer To"
                      value={escalation.transfer_number || ''}
                      onChange={(e) => setEscalation(prev => ({ ...prev, transfer_number: e.target.value }))}
                      placeholder="+353851234567"
                      className="bg-slate-50/50"
                    />
                    <p className="text-xs text-slate-400 mt-1">Calls will be transferred to this number</p>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 px-6 py-4 flex justify-end border-t border-slate-100">
                <Button onClick={handleSaveEscalation} isLoading={isSavingEscalation} className="shadow-lg shadow-primary/20">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
