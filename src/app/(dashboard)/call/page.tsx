'use client';

import { useState } from 'react';
import { Phone, Save, Calendar, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { format } from 'date-fns';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { callsApi, savedCallsApi, scheduledCallsApi } from '@/lib/api';
import { useCallFormStore } from '@/lib/store';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
];

export default function CallPage() {
  const {
    phoneNumber, setPhoneNumber,
    contactName, setContactName,
    message, setMessage,
    language, setLanguage,
    reset
  } = useCallFormStore();

  const [isCallingLoading, setIsCallingLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const isFormValid = phoneNumber.trim() && message.trim();

  const handleCall = async () => {
    if (!isFormValid) return;

    setIsCallingLoading(true);
    setError('');
    setSuccess('');

    try {
      await callsApi.create({
        phoneNumber,
        message,
        language,
        contactName: contactName || undefined,
      });
      setSuccess('Call initiated successfully! Your AI agent is on the way.');
      reset();
    } catch (err) {
      setError('Failed to initiate call. Please check the number and try again.');
    } finally {
      setIsCallingLoading(false);
    }
  };

  const handleSave = async () => {
    if (!saveName.trim()) return;

    setIsSaveLoading(true);
    setError('');

    try {
      await savedCallsApi.create({
        name: saveName,
        phoneNumber,
        contactName: contactName || undefined,
        message,
        language,
      });
      setSuccess('Call template saved to your agenda.');
      setShowSaveDialog(false);
      setSaveName('');
    } catch (err) {
      setError('Failed to save call template.');
    } finally {
      setIsSaveLoading(false);
    }
  };

  const handleSchedule = async () => {
    if (!scheduleDate || !scheduleTime) return;

    setIsSaveLoading(true);
    setError('');

    try {
      const scheduledTime = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();
      await scheduledCallsApi.create({
        phoneNumber,
        contactName: contactName || undefined,
        message,
        language,
        scheduledTime,
      });
      setSuccess('Call successfully scheduled for ' + format(new Date(scheduledTime), 'PPPp') + '.');
      setShowScheduleDialog(false);
      setScheduleDate('');
      setScheduleTime('');
    } catch (err) {
      setError('Failed to schedule call.');
    } finally {
      setIsSaveLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-12">
      <div className="text-center sm:text-left">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Launch AI Call</h1>
        <p className="text-slate-500 mt-2">Configure and deploy your AI agents with custom voice and script.</p>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-none shadow-md ring-1 ring-slate-200">
            <CardHeader className="bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900">Agent Configuration</h2>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Phone Number"
                  placeholder="+1 (555) 000-0000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="bg-white"
                />

                <Input
                  label="Contact Name"
                  placeholder="Recipient Identity"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Voice Script & Instructions
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none min-h-[160px] text-sm leading-relaxed"
                  placeholder="Define the AI's persona and objective... e.g., 'You are a professional assistant scheduling a dental follow-up...'"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <p className="text-[11px] text-slate-400 mt-2 font-medium italic">
                  Tip: Be specific about the goals and constraints of the conversation.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-md ring-1 ring-slate-200 h-full">
            <CardHeader className="bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900">Execution Parameters</h2>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Deployment Language
                </label>
                <select
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white text-sm font-medium"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-6 space-y-3">
                <Button
                  className="w-full shadow-lg shadow-indigo-100"
                  size="lg"
                  onClick={handleCall}
                  disabled={!isFormValid || isCallingLoading}
                  isLoading={isCallingLoading}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Initiate Immediate Call
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowSaveDialog(true)}
                    disabled={!isFormValid}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Template
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowScheduleDialog(true)}
                    disabled={!isFormValid}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <Card className="w-full max-w-md border-none shadow-2xl animate-in zoom-in-95">
            <CardHeader className="border-b-0 pt-8 text-center">
              <h3 className="text-xl font-bold text-slate-900">Save Call Template</h3>
              <p className="text-sm text-slate-500 mt-1">Reuse these instructions for future calls.</p>
            </CardHeader>
            <CardContent className="space-y-6 px-8 pb-8">
              <Input
                label="Template Name"
                placeholder="e.g., Patient Outreach"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                className="bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-primary"
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  className="flex-1 order-1 sm:order-2"
                  onClick={handleSave}
                  disabled={!saveName.trim()}
                  isLoading={isSaveLoading}
                >
                  Save to Agenda
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1 order-2 sm:order-1 text-slate-400"
                  onClick={() => setShowSaveDialog(false)}
                >
                  Discard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Schedule Dialog */}
      {showScheduleDialog && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <Card className="w-full max-w-md border-none shadow-2xl animate-in zoom-in-95">
            <CardHeader className="border-b-0 pt-8 text-center">
              <h3 className="text-xl font-bold text-slate-900">Set Call Schedule</h3>
              <p className="text-sm text-slate-500 mt-1">Automate the call deployment for a later time.</p>
            </CardHeader>
            <CardContent className="space-y-6 px-8 pb-8">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="Date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="bg-slate-50 border-none ring-1 ring-slate-200"
                />
                <Input
                  type="time"
                  label="Time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="bg-slate-50 border-none ring-1 ring-slate-200"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  className="flex-1 order-1 sm:order-2"
                  onClick={handleSchedule}
                  disabled={!scheduleDate || !scheduleTime}
                  isLoading={isSaveLoading}
                >
                  Confirm Schedule
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1 order-2 sm:order-1 text-slate-400"
                  onClick={() => setShowScheduleDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
