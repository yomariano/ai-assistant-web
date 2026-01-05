'use client';

import { useState, useEffect } from 'react';
import { Save, Mail, MessageSquare, PhoneForwarded, Send, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
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

// Select Component
function Select({
  value,
  onChange,
  options,
  disabled
}: {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm bg-slate-50/50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}

export default function NotificationsPage() {
  // Notification Preferences State
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_enabled: true,
    email_address: '',
    sms_enabled: false,
    sms_number: '',
    notify_on_call_complete: true,
    notify_on_message_taken: true,
    notify_on_escalation: true,
    notify_on_voicemail: true,
    business_hours_only: false,
    timezone: 'Europe/Dublin',
  });

  // Escalation Settings State
  const [escalation, setEscalation] = useState<EscalationSettings>({
    transfer_enabled: false,
    transfer_number: '',
    transfer_method: 'warm_transfer',
    trigger_keywords: ['speak to someone', 'real person', 'manager', 'human', 'complaint'],
    max_failed_attempts: 2,
    business_hours_only: true,
    business_hours_start: '09:00',
    business_hours_end: '18:00',
    business_days: [1, 2, 3, 4, 5],
    timezone: 'Europe/Dublin',
    after_hours_action: 'voicemail',
    after_hours_message: 'We are currently closed. Please leave a message and we will get back to you.',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState<'email' | 'sms' | null>(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Load existing preferences
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

  const handleSavePreferences = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      await notificationsApi.updatePreferences(preferences);
      setSuccess('Notification preferences saved successfully!');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEscalation = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      await notificationsApi.updateEscalation(escalation);
      setSuccess('Escalation settings saved successfully!');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to save escalation settings');
    } finally {
      setIsSaving(false);
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
        setError(`Failed to send test ${type}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || `Failed to send test ${type}`);
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
    <div className="max-w-4xl mx-auto space-y-10 pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Notification Settings</h1>
        <p className="text-slate-500 mt-2">Configure how you receive order notifications and call escalations.</p>
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

      {/* Email Notifications Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-slate-900">Email Notifications</h2>
          </div>
          <p className="text-sm text-slate-500">
            Receive order summaries and important alerts via email after each call.
          </p>
        </div>

        <div className="lg:col-span-2">
          <Card className="border-none shadow-md ring-1 ring-slate-200 overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6 space-y-6">
                {/* Enable Email */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">Enable Email Notifications</p>
                    <p className="text-sm text-slate-500">Receive emails when orders are taken</p>
                  </div>
                  <Toggle
                    enabled={preferences.email_enabled}
                    onChange={(val) => setPreferences(prev => ({ ...prev, email_enabled: val }))}
                  />
                </div>

                {/* Email Address */}
                <div className={preferences.email_enabled ? '' : 'opacity-50'}>
                  <Input
                    type="email"
                    label="Email Address"
                    value={preferences.email_address || ''}
                    onChange={(e) => setPreferences(prev => ({ ...prev, email_address: e.target.value }))}
                    placeholder="restaurant@example.com"
                    disabled={!preferences.email_enabled}
                    className="bg-slate-50/50"
                  />
                  <p className="text-xs text-slate-400 mt-1">Leave blank to use your account email</p>
                </div>

                {/* Notification Triggers */}
                <div className={`space-y-4 ${preferences.email_enabled ? '' : 'opacity-50'}`}>
                  <p className="text-sm font-semibold text-slate-700">Notify me when:</p>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-slate-600">Call completed with order</span>
                    <Toggle
                      enabled={preferences.notify_on_call_complete}
                      onChange={(val) => setPreferences(prev => ({ ...prev, notify_on_call_complete: val }))}
                      disabled={!preferences.email_enabled}
                    />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-slate-600">Message taken from customer</span>
                    <Toggle
                      enabled={preferences.notify_on_message_taken}
                      onChange={(val) => setPreferences(prev => ({ ...prev, notify_on_message_taken: val }))}
                      disabled={!preferences.email_enabled}
                    />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-slate-600">Call escalated to human</span>
                    <Toggle
                      enabled={preferences.notify_on_escalation}
                      onChange={(val) => setPreferences(prev => ({ ...prev, notify_on_escalation: val }))}
                      disabled={!preferences.email_enabled}
                    />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-slate-600">Voicemail received</span>
                    <Toggle
                      enabled={preferences.notify_on_voicemail}
                      onChange={(val) => setPreferences(prev => ({ ...prev, notify_on_voicemail: val }))}
                      disabled={!preferences.email_enabled}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 px-6 py-4 flex justify-between items-center gap-3 border-t border-slate-100">
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
                  Send Test Email
                </Button>
                <Button onClick={handleSavePreferences} isLoading={isSaving} className="shadow-lg shadow-primary/20">
                  <Save className="w-4 h-4 mr-2" />
                  Save Email Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SMS Notifications Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-slate-900">SMS Notifications</h2>
          </div>
          <p className="text-sm text-slate-500">
            Get instant SMS alerts for urgent orders or escalations.
          </p>
        </div>

        <div className="lg:col-span-2">
          <Card className="border-none shadow-md ring-1 ring-slate-200 overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6 space-y-6">
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
                <div className={preferences.sms_enabled ? '' : 'opacity-50'}>
                  <Input
                    type="tel"
                    label="Phone Number"
                    value={preferences.sms_number || ''}
                    onChange={(e) => setPreferences(prev => ({ ...prev, sms_number: e.target.value }))}
                    placeholder="+353851234567"
                    disabled={!preferences.sms_enabled}
                    className="bg-slate-50/50"
                  />
                  <p className="text-xs text-slate-400 mt-1">Use international format (e.g., +353 for Ireland)</p>
                </div>

                {/* Business Hours Only */}
                <div className={`flex items-center justify-between py-2 ${preferences.sms_enabled ? '' : 'opacity-50'}`}>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Business Hours Only</p>
                    <p className="text-xs text-slate-500">Only send SMS during business hours</p>
                  </div>
                  <Toggle
                    enabled={preferences.business_hours_only}
                    onChange={(val) => setPreferences(prev => ({ ...prev, business_hours_only: val }))}
                    disabled={!preferences.sms_enabled}
                  />
                </div>
              </div>

              <div className="bg-slate-50 px-6 py-4 flex justify-between items-center gap-3 border-t border-slate-100">
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
                  Send Test SMS
                </Button>
                <Button onClick={handleSavePreferences} isLoading={isSaving} className="shadow-lg shadow-primary/20">
                  <Save className="w-4 h-4 mr-2" />
                  Save SMS Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call Escalation Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <PhoneForwarded className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-slate-900">Call Escalation</h2>
          </div>
          <p className="text-sm text-slate-500">
            Configure when and how calls should be transferred to a human.
          </p>
        </div>

        <div className="lg:col-span-2">
          <Card className="border-none shadow-md ring-1 ring-slate-200 overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6 space-y-6">
                {/* Enable Transfer */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">Enable Call Transfer</p>
                    <p className="text-sm text-slate-500">Allow calls to be transferred to a human when needed</p>
                  </div>
                  <Toggle
                    enabled={escalation.transfer_enabled}
                    onChange={(val) => setEscalation(prev => ({ ...prev, transfer_enabled: val }))}
                  />
                </div>

                {/* Transfer Number */}
                <div className={escalation.transfer_enabled ? '' : 'opacity-50'}>
                  <Input
                    type="tel"
                    label="Transfer Phone Number"
                    value={escalation.transfer_number || ''}
                    onChange={(e) => setEscalation(prev => ({ ...prev, transfer_number: e.target.value }))}
                    placeholder="+353851234567"
                    disabled={!escalation.transfer_enabled}
                    className="bg-slate-50/50"
                  />
                  <p className="text-xs text-slate-400 mt-1">The number calls will be transferred to</p>
                </div>

                {/* Transfer Method */}
                <div className={escalation.transfer_enabled ? '' : 'opacity-50'}>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Transfer Method</label>
                  <Select
                    value={escalation.transfer_method}
                    onChange={(val) => setEscalation(prev => ({ ...prev, transfer_method: val as any }))}
                    disabled={!escalation.transfer_enabled}
                    options={[
                      { value: 'warm_transfer', label: 'Warm Transfer - AI introduces the caller' },
                      { value: 'blind_transfer', label: 'Blind Transfer - Direct transfer' },
                      { value: 'callback', label: 'Callback - Take details, call back later' },
                      { value: 'sms_alert', label: 'SMS Alert - Send alert, AI continues' },
                    ]}
                  />
                </div>

                {/* Business Hours */}
                <div className={`space-y-4 ${escalation.transfer_enabled ? '' : 'opacity-50'}`}>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Business Hours Only</p>
                      <p className="text-xs text-slate-500">Only transfer during business hours</p>
                    </div>
                    <Toggle
                      enabled={escalation.business_hours_only}
                      onChange={(val) => setEscalation(prev => ({ ...prev, business_hours_only: val }))}
                      disabled={!escalation.transfer_enabled}
                    />
                  </div>

                  {escalation.business_hours_only && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Opens</label>
                        <input
                          type="time"
                          value={escalation.business_hours_start}
                          onChange={(e) => setEscalation(prev => ({ ...prev, business_hours_start: e.target.value }))}
                          disabled={!escalation.transfer_enabled}
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm bg-slate-50/50 disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Closes</label>
                        <input
                          type="time"
                          value={escalation.business_hours_end}
                          onChange={(e) => setEscalation(prev => ({ ...prev, business_hours_end: e.target.value }))}
                          disabled={!escalation.transfer_enabled}
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm bg-slate-50/50 disabled:opacity-50"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* After Hours Action */}
                {escalation.business_hours_only && (
                  <div className={escalation.transfer_enabled ? '' : 'opacity-50'}>
                    <label className="block text-sm font-bold text-slate-700 mb-2">After Hours Behavior</label>
                    <Select
                      value={escalation.after_hours_action}
                      onChange={(val) => setEscalation(prev => ({ ...prev, after_hours_action: val as any }))}
                      disabled={!escalation.transfer_enabled}
                      options={[
                        { value: 'voicemail', label: 'Take voicemail message' },
                        { value: 'sms_alert', label: 'Send SMS alert to owner' },
                        { value: 'callback_promise', label: 'Promise to call back' },
                        { value: 'ai_only', label: 'AI handles everything' },
                      ]}
                    />

                    {escalation.after_hours_action === 'voicemail' && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">After Hours Message</label>
                        <textarea
                          value={escalation.after_hours_message}
                          onChange={(e) => setEscalation(prev => ({ ...prev, after_hours_message: e.target.value }))}
                          disabled={!escalation.transfer_enabled}
                          placeholder="We are currently closed..."
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none min-h-[80px] text-sm bg-slate-50/50 disabled:opacity-50"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
                <Button onClick={handleSaveEscalation} isLoading={isSaving} className="shadow-lg shadow-primary/20">
                  <Save className="w-4 h-4 mr-2" />
                  Save Escalation Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
