'use client';

import { useCallback, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { callsApi, savedCallsApi, scheduledCallsApi } from '@/lib/api';
import { useCallFormStore } from '@/lib/store';
import { AgentConfigurationCard } from './components/agent-configuration-card';
import { ExecutionParametersCard } from './components/execution-parameters-card';
import { SaveDialog } from './components/save-dialog';
import { ScheduleDialog } from './components/schedule-dialog';

export default function CallPage() {
  const reset = useCallFormStore((s) => s.reset);
  const [isCallingLoading, setIsCallingLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const minScheduleDate = useMemo(() => new Date().toISOString().split('T')[0], []);

  const handleCall = useCallback(async () => {
    const { phoneNumber, message } = useCallFormStore.getState();
    if (!phoneNumber.trim() || !message.trim()) return;

    setIsCallingLoading(true);
    setError('');
    setSuccess('');

    try {
      const { contactName, language } = useCallFormStore.getState();
      await callsApi.create({
        phoneNumber,
        message,
        language,
        contactName: contactName || undefined,
      });
      setSuccess('Call initiated successfully! Your AI agent is on the way.');
      reset();
    } catch {
      setError('Failed to initiate call. Please check the number and try again.');
    } finally {
      setIsCallingLoading(false);
    }
  }, [reset]);

  const handleSave = useCallback(async () => {
    if (!saveName.trim()) return;

    setIsSaveLoading(true);
    setError('');

    try {
      const { phoneNumber, contactName, message, language } = useCallFormStore.getState();
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
    } catch {
      setError('Failed to save call template.');
    } finally {
      setIsSaveLoading(false);
    }
  }, [saveName]);

  const handleSchedule = useCallback(async () => {
    if (!scheduleDate || !scheduleTime) return;

    setIsSaveLoading(true);
    setError('');

    try {
      const { phoneNumber, contactName, message, language } = useCallFormStore.getState();
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
    } catch {
      setError('Failed to schedule call.');
    } finally {
      setIsSaveLoading(false);
    }
  }, [scheduleDate, scheduleTime]);

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
          <AgentConfigurationCard />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <ExecutionParametersCard
            isCallingLoading={isCallingLoading}
            isFormSubmitDisabled={false}
            onCall={handleCall}
            onOpenSaveDialog={() => setShowSaveDialog(true)}
            onOpenScheduleDialog={() => setShowScheduleDialog(true)}
          />
        </div>
      </div>

      <SaveDialog
        isOpen={showSaveDialog}
        isLoading={isSaveLoading}
        name={saveName}
        onNameChange={setSaveName}
        onClose={() => setShowSaveDialog(false)}
        onSave={handleSave}
      />

      <ScheduleDialog
        isOpen={showScheduleDialog}
        isLoading={isSaveLoading}
        scheduleDate={scheduleDate}
        scheduleTime={scheduleTime}
        minDate={minScheduleDate}
        onScheduleDateChange={setScheduleDate}
        onScheduleTimeChange={setScheduleTime}
        onClose={() => setShowScheduleDialog(false)}
        onSchedule={handleSchedule}
      />
    </div>
  );
}
