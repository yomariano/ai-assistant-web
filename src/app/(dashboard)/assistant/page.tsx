'use client';

import { useCallback, useEffect, useMemo, useReducer } from 'react';
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
import type { SelectedTemplateData } from '@/components/assistant/PromptTemplateSelector';
import type { TestConfig } from '@/types';

// Consolidated state for assistant page
interface AssistantPageState {
  // Data state
  assistant: Assistant | null;
  voices: Voice[];
  phoneNumbers: PhoneNumber[];
  planId: string;
  stats: { calls: number; minutes: number } | null;
  limits: { minutesIncluded: number; maxMinutesPerCall: number } | null;
  testConfig: TestConfig | null;
  // UI state
  isLoading: boolean;
  isSaving: boolean;
  success: string;
  error: string;
  isTestModalOpen: boolean;
  // Form state
  businessName: string;
  businessDescription: string;
  greetingName: string;
  selectedVoice: string;
  firstMessage: string;
  systemPrompt: string;
  selectedTemplateId: string | undefined;
}

type AssistantPageAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SAVING'; payload: boolean }
  | { type: 'SET_SUCCESS'; payload: string }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_TEST_MODAL_OPEN'; payload: boolean }
  | { type: 'SET_SELECTED_VOICE'; payload: string }
  | { type: 'UPDATE_FORM'; payload: Partial<Pick<AssistantPageState, 'businessName' | 'businessDescription' | 'greetingName' | 'firstMessage' | 'systemPrompt' | 'selectedTemplateId'>> }
  | { type: 'LOAD_DATA_SUCCESS'; payload: {
      assistant: Assistant | null;
      voices: Voice[];
      phoneNumbers: PhoneNumber[];
      planId: string;
      stats: { calls: number; minutes: number } | null;
      limits: { minutesIncluded: number; maxMinutesPerCall: number } | null;
      testConfig: TestConfig | null;
      formData?: {
        businessName: string;
        businessDescription: string;
        greetingName: string;
        selectedVoice: string;
        firstMessage: string;
        systemPrompt: string;
      };
    }};

const initialState: AssistantPageState = {
  assistant: null,
  voices: [],
  phoneNumbers: [],
  planId: 'starter',
  stats: null,
  limits: null,
  testConfig: null,
  isLoading: true,
  isSaving: false,
  success: '',
  error: '',
  isTestModalOpen: false,
  businessName: '',
  businessDescription: '',
  greetingName: '',
  selectedVoice: '',
  firstMessage: '',
  systemPrompt: '',
  selectedTemplateId: undefined,
};

function assistantPageReducer(state: AssistantPageState, action: AssistantPageAction): AssistantPageState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_SAVING':
      return { ...state, isSaving: action.payload };
    case 'SET_SUCCESS':
      return { ...state, success: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_TEST_MODAL_OPEN':
      return { ...state, isTestModalOpen: action.payload };
    case 'SET_SELECTED_VOICE':
      return { ...state, selectedVoice: action.payload };
    case 'UPDATE_FORM':
      return { ...state, ...action.payload };
    case 'LOAD_DATA_SUCCESS':
      return {
        ...state,
        isLoading: false,
        assistant: action.payload.assistant,
        voices: action.payload.voices,
        phoneNumbers: action.payload.phoneNumbers,
        planId: action.payload.planId,
        stats: action.payload.stats,
        limits: action.payload.limits,
        testConfig: action.payload.testConfig,
        ...(action.payload.formData || {}),
      };
    default:
      return state;
  }
}

export default function AssistantPage() {
  const router = useRouter();
  const [state, dispatch] = useReducer(assistantPageReducer, initialState);

  // Destructure state for easier access
  const {
    assistant, voices, phoneNumbers, planId, stats, limits, testConfig,
    isLoading, isSaving, success, error, isTestModalOpen,
    businessName, businessDescription, greetingName, selectedVoice,
    firstMessage, systemPrompt, selectedTemplateId,
  } = state;

  // Handle template selection
  const handleTemplateSelect = useCallback((template: SelectedTemplateData) => {
    dispatch({
      type: 'UPDATE_FORM',
      payload: {
        selectedTemplateId: template.id,
        ...(template.suggestedAssistantName ? { greetingName: template.suggestedAssistantName } : {}),
        firstMessage: template.firstMessage,
        systemPrompt: template.systemPrompt,
      },
    });
    dispatch({
      type: 'SET_SUCCESS',
      payload: `Applied "${template.name}" template with security rules and speech patterns.`,
    });
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
    async function fetchData() {
      try {
        const [assistantRes, voicesRes, phoneRes, statsRes] = await Promise.all([
          assistantApi.get(),
          assistantApi.getVoices(),
          billingApi.getPhoneNumbers(),
          assistantApi.getStats()
        ]);

        let testConfigData: TestConfig | null = null;
        let formData: {
          businessName: string;
          businessDescription: string;
          greetingName: string;
          selectedVoice: string;
          firstMessage: string;
          systemPrompt: string;
        } | undefined;

        if (assistantRes.exists && assistantRes.assistant) {
          const availableVoices = voicesRes.voices || [];
          const assistantVoiceId = assistantRes.assistant.voice.id || '';
          const hasAssistantVoice = availableVoices.some((voice) => voice.id === assistantVoiceId);
          const resolvedVoiceId = hasAssistantVoice
            ? assistantVoiceId
            : (availableVoices[0]?.id || '');

          formData = {
            businessName: assistantRes.assistant.business.name || '',
            businessDescription: assistantRes.assistant.business.description || '',
            greetingName: assistantRes.assistant.business.greetingName || '',
            selectedVoice: resolvedVoiceId,
            firstMessage: assistantRes.assistant.firstMessage || '',
            systemPrompt: assistantRes.assistant.systemPrompt || '',
          };

          // Fetch test config if assistant exists
          try {
            testConfigData = await assistantApi.getTestConfig();
          } catch (testErr) {
            console.warn('Failed to fetch test config:', testErr);
          }
        }

        // Single dispatch for all data - reduces re-renders from 8-13 to 1
        dispatch({
          type: 'LOAD_DATA_SUCCESS',
          payload: {
            assistant: assistantRes.exists && assistantRes.assistant ? assistantRes.assistant : null,
            voices: voicesRes.voices || [],
            phoneNumbers: phoneRes.numbers || [],
            planId: voicesRes.planId || 'starter',
            stats: statsRes.thisMonth || null,
            limits: statsRes.limits || null,
            testConfig: testConfigData,
            formData,
          },
        });
      } catch (err) {
        console.error('Failed to fetch assistant data:', err);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load assistant configuration' });
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }

    fetchData();
  }, []);

  const onSelectVoice = useCallback((voiceId: string) => {
    dispatch({ type: 'SET_SELECTED_VOICE', payload: voiceId });
  }, []);

  const handleSave = useCallback(async () => {
    dispatch({ type: 'SET_SAVING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: '' });
    dispatch({ type: 'SET_SUCCESS', payload: '' });

    try {
      const voice = voices.find(v => v.id === selectedVoice);
      const result = await assistantApi.update({
        businessName,
        businessDescription,
        greetingName,
        voiceId: selectedVoice,
        voiceProvider: voice?.provider,
        firstMessage,
        systemPrompt
      });
      if (result.warning) {
        dispatch({ type: 'SET_ERROR', payload: result.warning });
      } else {
        dispatch({ type: 'SET_SUCCESS', payload: 'Assistant configuration saved successfully!' });
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: { message?: string } } } };
      const msg = axiosErr?.response?.data?.error?.message || 'Failed to save configuration. Please try again.';
      dispatch({ type: 'SET_ERROR', payload: msg });
    } finally {
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  }, [voices, selectedVoice, businessName, businessDescription, greetingName, firstMessage, systemPrompt]);

  const handleRegeneratePrompt = useCallback(async () => {
    try {
      const { systemPrompt: newPrompt } = await assistantApi.regeneratePrompt(
        businessName,
        businessDescription,
        greetingName
      );
      dispatch({ type: 'UPDATE_FORM', payload: { systemPrompt: newPrompt } });
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to regenerate prompt' });
    }
  }, [businessName, businessDescription, greetingName]);

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
            onClick={() => dispatch({ type: 'SET_TEST_MODAL_OPEN', payload: true })}
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
            businessName={businessName}
            businessDescription={businessDescription}
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
                onChange={(e) => dispatch({ type: 'UPDATE_FORM', payload: { businessName: e.target.value } })}
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
                  onChange={(e) => dispatch({ type: 'UPDATE_FORM', payload: { businessDescription: e.target.value } })}
                  placeholder="Describe what your business does..."
                />
              </div>

              <Input
                label="Assistant Name"
                value={greetingName}
                onChange={(e) => dispatch({ type: 'UPDATE_FORM', payload: { greetingName: e.target.value } })}
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
                onChange={(e) => dispatch({ type: 'UPDATE_FORM', payload: { firstMessage: e.target.value } })}
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
            Instructions that guide how your AI responds. Think of this as a script for your assistant.
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

          <div className="mt-5 p-3 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="text-xs font-semibold text-blue-800 mb-2">Tips to customize:</p>
            <ul className="text-xs text-blue-700 space-y-1.5">
              <li>Add your business hours and location</li>
              <li>List your services, menu items, or pricing</li>
              <li>Specify how to handle bookings or complaints</li>
              <li>Add answers to frequently asked questions</li>
              <li>Set a tone &mdash; friendly, formal, or casual</li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-2">
          <Card className="border-none shadow-md ring-1 ring-slate-200 overflow-hidden">
            <CardContent className="p-6">
              <textarea
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-y min-h-[400px] text-sm bg-slate-50/50 font-mono"
                value={systemPrompt}
                onChange={(e) => dispatch({ type: 'UPDATE_FORM', payload: { systemPrompt: e.target.value } })}
                placeholder="You are a helpful AI assistant..."
              />
              <p className="text-xs text-slate-400 mt-2">Drag the bottom-right corner to resize</p>
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
          onClose={() => dispatch({ type: 'SET_TEST_MODAL_OPEN', payload: false })}
          vapiAssistantId={testConfig.vapiAssistantId}
          assistantName={testConfig.assistantName}
        />
      )}
    </div>
  );
}
