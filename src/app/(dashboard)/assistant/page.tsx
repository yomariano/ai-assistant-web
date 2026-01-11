'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bot, Save, RefreshCw, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { assistantApi, billingApi } from '@/lib/api';
import type { Assistant, Voice, PhoneNumber } from '@/types';
import { AssistantStatsCards } from './components/assistant-stats-cards';
import { AssistantPhoneNumbers } from './components/assistant-phone-numbers';
import { AssistantVoiceGrid } from './components/assistant-voice-grid';
import { TestAgentModal } from './components/test-agent-modal';
import { PromptTemplateSelector } from '@/components/assistant/PromptTemplateSelector';
import type { PromptTemplate } from '@/lib/content/prompt-templates';
import type { TestConfig } from '@/types';

export default function AssistantPage() {
  const router = useRouter();
  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [planId, setPlanId] = useState<string>('starter');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState<{ calls: number; minutes: number } | null>(null);
  const [limits, setLimits] = useState<{ minutesIncluded: number; maxMinutesPerCall: number } | null>(null);

  // Form state
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [greetingName, setGreetingName] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('');
  const [firstMessage, setFirstMessage] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>();

  // Test modal state
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testConfig, setTestConfig] = useState<TestConfig | null>(null);

  // Handle template selection
  const handleTemplateSelect = useCallback((template: PromptTemplate) => {
    setSelectedTemplateId(template.id);
    setGreetingName(template.suggestedAssistantName);
    setFirstMessage(template.firstMessage);
    setSystemPrompt(template.systemPrompt);
    setSuccess(`Applied "${template.name}" template. Customize the placeholders in curly braces with your business information.`);
  }, []);

  const minutesUsed = stats?.minutes ?? 0;
  const minutesIncluded = limits?.minutesIncluded ?? 0;
  const statsProps = useMemo(
    () => ({
      phoneNumbersCount: phoneNumbers.length,
      minutesUsed,
      minutesIncluded,
      planId,
    }),
    [phoneNumbers.length, minutesUsed, minutesIncluded, planId]
  );

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [assistantRes, voicesRes, phoneRes, statsRes] = await Promise.all([
        assistantApi.get(),
        assistantApi.getVoices(),
        billingApi.getPhoneNumbers(),
        assistantApi.getStats()
      ]);

      if (assistantRes.exists && assistantRes.assistant) {
        setAssistant(assistantRes.assistant);
        setBusinessName(assistantRes.assistant.business.name || '');
        setBusinessDescription(assistantRes.assistant.business.description || '');
        setGreetingName(assistantRes.assistant.business.greetingName || '');
        setSelectedVoice(assistantRes.assistant.voice.id || '');
        setFirstMessage(assistantRes.assistant.firstMessage || '');
        setSystemPrompt(assistantRes.assistant.systemPrompt || '');

        // Fetch test config if assistant exists
        try {
          const testConfigRes = await assistantApi.getTestConfig();
          setTestConfig(testConfigRes);
        } catch (testErr) {
          console.warn('Failed to fetch test config:', testErr);
        }
      }

      setVoices(voicesRes.voices || []);
      setPlanId(voicesRes.planId || 'starter');
      setPhoneNumbers(phoneRes.numbers || []);
      setStats(statsRes.thisMonth || null);
      setLimits(statsRes.limits || null);
    } catch (err) {
      console.error('Failed to fetch assistant data:', err);
      setError('Failed to load assistant configuration');
    } finally {
      setIsLoading(false);
    }
  }

  const onSelectVoice = useCallback((voiceId: string) => {
    setSelectedVoice(voiceId);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const voice = voices.find(v => v.id === selectedVoice);
      await assistantApi.update({
        businessName,
        businessDescription,
        greetingName,
        voiceId: selectedVoice,
        voiceProvider: voice?.provider,
        firstMessage,
        systemPrompt
      });
      setSuccess('Assistant configuration saved successfully!');
    } catch {
      setError('Failed to save configuration. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegeneratePrompt = async () => {
    try {
      const { systemPrompt: newPrompt } = await assistantApi.regeneratePrompt(
        businessName,
        businessDescription,
        greetingName
      );
      setSystemPrompt(newPrompt);
    } catch {
      setError('Failed to regenerate prompt');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!assistant) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">AI Assistant</h1>
          <p className="text-slate-500 mt-2">Configure your AI voice assistant.</p>
        </div>

        <Card className="border-none shadow-md ring-1 ring-slate-200">
          <CardContent className="py-12 text-center">
            <div className="p-4 bg-slate-50 rounded-full inline-block mb-4">
              <Bot className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">No Assistant Configured</h2>
            <p className="text-slate-500 mb-6">
              Subscribe to a plan to get your AI assistant and phone number.
            </p>
            <Button onClick={() => router.push('/dashboard?paywall=1')}>
              Choose a Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-12">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">AI Assistant</h1>
          <p className="text-slate-500 mt-2">Configure how your AI assistant handles calls.</p>
        </div>
        {testConfig && (
          <Button
            onClick={() => setIsTestModalOpen(true)}
            variant="outline"
            className="shrink-0"
          >
            <Phone className="w-4 h-4 mr-2" />
            Test Agent
          </Button>
        )}
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

      <AssistantStatsCards {...statsProps} />

      <AssistantPhoneNumbers phoneNumbers={phoneNumbers} />

      {/* Template Selector */}
      <Card className="border-none shadow-md ring-1 ring-slate-200 overflow-hidden">
        <CardContent className="p-6">
          <PromptTemplateSelector
            onSelectTemplate={handleTemplateSelect}
            currentTemplateId={selectedTemplateId}
          />
        </CardContent>
      </Card>

      {/* Business Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <h2 className="text-lg font-bold text-slate-900">Business Identity</h2>
          <p className="text-sm text-slate-500 mt-1">
            This information shapes how your AI introduces itself.
          </p>
        </div>

        <div className="lg:col-span-2">
          <Card className="border-none shadow-md ring-1 ring-slate-200 overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <Input
                label="Business Name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Acme Inc."
                className="bg-slate-50/50"
              />

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Business Description
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none min-h-[100px] text-sm bg-slate-50/50"
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  placeholder="Describe what your business does..."
                />
              </div>

              <Input
                label="Assistant Name"
                value={greetingName}
                onChange={(e) => setGreetingName(e.target.value)}
                placeholder="Sarah"
                helperText="The name your AI uses to introduce itself"
                className="bg-slate-50/50"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <AssistantVoiceGrid voices={voices} selectedVoice={selectedVoice} onSelectVoice={onSelectVoice} />

      {/* First Message */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <h2 className="text-lg font-bold text-slate-900">Greeting</h2>
          <p className="text-sm text-slate-500 mt-1">
            What your AI says when it answers a call.
          </p>
        </div>

        <div className="lg:col-span-2">
          <Card className="border-none shadow-md ring-1 ring-slate-200 overflow-hidden">
            <CardContent className="p-6">
              <textarea
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none min-h-[100px] text-sm bg-slate-50/50"
                value={firstMessage}
                onChange={(e) => setFirstMessage(e.target.value)}
                placeholder="Hi! Thank you for calling. How can I help you today?"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* System Prompt */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <h2 className="text-lg font-bold text-slate-900">Behavior</h2>
          <p className="text-sm text-slate-500 mt-1">
            Instructions that guide how your AI responds.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRegeneratePrompt}
            className="mt-4"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Regenerate from Business Info
          </Button>
        </div>

        <div className="lg:col-span-2">
          <Card className="border-none shadow-md ring-1 ring-slate-200 overflow-hidden">
            <CardContent className="p-6">
              <textarea
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none min-h-[200px] text-sm bg-slate-50/50 font-mono"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="You are a helpful AI assistant..."
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-slate-200">
        <Button onClick={handleSave} isLoading={isSaving} className="shadow-lg shadow-primary/20">
          <Save className="w-4 h-4 mr-2" />
          Save Configuration
        </Button>
      </div>

      {/* Test Agent Modal */}
      {testConfig && (
        <TestAgentModal
          isOpen={isTestModalOpen}
          onClose={() => setIsTestModalOpen(false)}
          vapiAssistantId={testConfig.vapiAssistantId}
          assistantName={testConfig.assistantName}
        />
      )}
    </div>
  );
}
