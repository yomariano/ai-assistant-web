'use client';

import { useCallback, useEffect, useReducer } from 'react';
import { Save, Plug, Link2, ArrowRight, CheckCircle, Calendar, Settings, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { integrationsApi, providersApi } from '@/lib/api';
import type { IndustryTemplate, BookingConfig, BookingField, ProviderConnection } from '@/types';
import { IndustryTemplateSelector } from './components/industry-template-selector';
import { BookingFieldsEditor } from './components/booking-fields-editor';
import { VerificationSettings } from './components/verification-settings';
import { PaymentSettings } from './components/payment-settings';
import { CalendarStatus } from './components/calendar-status';
import { ConfirmationSettings } from './components/confirmation-settings';

type BookingMode = 'none' | 'external' | 'builtin';

// Consolidated state for integrations page
interface IntegrationsPageState {
  // Data state
  templates: IndustryTemplate[];
  config: BookingConfig | null;
  connections: ProviderConnection[];
  // UI state
  isLoading: boolean;
  isSaving: boolean;
  success: string;
  error: string;
  bookingMode: BookingMode;
  // Form state
  selectedTemplateId: string | null;
  bookingFields: BookingField[];
  verificationEnabled: boolean;
  verificationFields: string[];
  verificationOnFail: 'transfer_to_staff' | 'take_message' | 'retry';
  paymentRequired: boolean;
  paymentType: 'none' | 'card_hold' | 'deposit';
  depositAmountCents: number;
  emailConfirmation: boolean;
}

type IntegrationsPageAction =
  | { type: 'SET_SAVING'; payload: boolean }
  | { type: 'SET_SUCCESS'; payload: string }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_BOOKING_MODE'; payload: BookingMode }
  | { type: 'SET_BOOKING_FIELDS'; payload: BookingField[] }
  | { type: 'SET_VERIFICATION_ENABLED'; payload: boolean }
  | { type: 'SET_VERIFICATION_FIELDS'; payload: string[] }
  | { type: 'SET_VERIFICATION_ON_FAIL'; payload: 'transfer_to_staff' | 'take_message' | 'retry' }
  | { type: 'SET_PAYMENT_TYPE'; payload: { type: 'none' | 'card_hold' | 'deposit'; required: boolean } }
  | { type: 'SET_DEPOSIT_AMOUNT'; payload: number }
  | { type: 'SET_EMAIL_CONFIRMATION'; payload: boolean }
  | { type: 'APPLY_TEMPLATE'; payload: {
      templateId: string;
      bookingFields: BookingField[];
      verificationEnabled: boolean;
      verificationFields: string[];
      paymentType: 'none' | 'card_hold' | 'deposit';
      paymentRequired: boolean;
      depositAmountCents: number;
      successMessage: string;
    }}
  | { type: 'LOAD_DATA_SUCCESS'; payload: {
      templates: IndustryTemplate[];
      connections: ProviderConnection[];
      config: BookingConfig | null;
      bookingMode: BookingMode;
      formData?: {
        selectedTemplateId: string | null;
        bookingFields: BookingField[];
        verificationEnabled: boolean;
        verificationFields: string[];
        verificationOnFail: 'transfer_to_staff' | 'take_message' | 'retry';
        paymentRequired: boolean;
        paymentType: 'none' | 'card_hold' | 'deposit';
        depositAmountCents: number;
        emailConfirmation: boolean;
      };
    }};

const initialState: IntegrationsPageState = {
  templates: [],
  config: null,
  connections: [],
  isLoading: true,
  isSaving: false,
  success: '',
  error: '',
  bookingMode: 'none',
  selectedTemplateId: null,
  bookingFields: [],
  verificationEnabled: false,
  verificationFields: [],
  verificationOnFail: 'transfer_to_staff',
  paymentRequired: false,
  paymentType: 'none',
  depositAmountCents: 0,
  emailConfirmation: false,
};

function integrationsPageReducer(state: IntegrationsPageState, action: IntegrationsPageAction): IntegrationsPageState {
  switch (action.type) {
    case 'SET_SAVING':
      return { ...state, isSaving: action.payload };
    case 'SET_SUCCESS':
      return { ...state, success: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_BOOKING_MODE':
      return { ...state, bookingMode: action.payload };
    case 'SET_BOOKING_FIELDS':
      return { ...state, bookingFields: action.payload };
    case 'SET_VERIFICATION_ENABLED':
      return { ...state, verificationEnabled: action.payload };
    case 'SET_VERIFICATION_FIELDS':
      return { ...state, verificationFields: action.payload };
    case 'SET_VERIFICATION_ON_FAIL':
      return { ...state, verificationOnFail: action.payload };
    case 'SET_PAYMENT_TYPE':
      return { ...state, paymentType: action.payload.type, paymentRequired: action.payload.required };
    case 'SET_DEPOSIT_AMOUNT':
      return { ...state, depositAmountCents: action.payload };
    case 'SET_EMAIL_CONFIRMATION':
      return { ...state, emailConfirmation: action.payload };
    case 'APPLY_TEMPLATE':
      return {
        ...state,
        selectedTemplateId: action.payload.templateId,
        bookingFields: action.payload.bookingFields,
        verificationEnabled: action.payload.verificationEnabled,
        verificationFields: action.payload.verificationFields,
        paymentType: action.payload.paymentType,
        paymentRequired: action.payload.paymentRequired,
        depositAmountCents: action.payload.depositAmountCents,
        success: action.payload.successMessage,
      };
    case 'LOAD_DATA_SUCCESS':
      return {
        ...state,
        isLoading: false,
        templates: action.payload.templates,
        connections: action.payload.connections,
        config: action.payload.config,
        bookingMode: action.payload.bookingMode,
        ...(action.payload.formData || {}),
      };
    default:
      return state;
  }
}

export default function IntegrationsPage() {
  const [state, dispatch] = useReducer(integrationsPageReducer, initialState);

  // Destructure state for easier access
  const {
    templates, connections, isLoading, isSaving, success, error,
    bookingMode, selectedTemplateId, bookingFields, verificationEnabled,
    verificationFields, verificationOnFail, paymentRequired, paymentType,
    depositAmountCents, emailConfirmation,
  } = state;

  useEffect(() => {
    async function fetchData() {
      try {
        const [templatesRes, configRes, connectionsRes] = await Promise.all([
          integrationsApi.getTemplates(),
          integrationsApi.getConfig(),
          providersApi.getConnections().catch(() => ({ connections: [] }))
        ]);

        const activeConnections = (connectionsRes.connections || []).filter(
          (c: ProviderConnection) => c.status === 'connected'
        );

        // Determine booking mode
        let mode: BookingMode = 'none';
        if (activeConnections.length > 0) {
          mode = 'external';
        } else if (configRes.exists && configRes.config?.industryTemplateId) {
          mode = 'builtin';
        }

        let formData: {
          selectedTemplateId: string | null;
          bookingFields: BookingField[];
          verificationEnabled: boolean;
          verificationFields: string[];
          verificationOnFail: 'transfer_to_staff' | 'take_message' | 'retry';
          paymentRequired: boolean;
          paymentType: 'none' | 'card_hold' | 'deposit';
          depositAmountCents: number;
          emailConfirmation: boolean;
        } | undefined;

        if (configRes.exists && configRes.config) {
          formData = {
            selectedTemplateId: configRes.config.industryTemplateId,
            bookingFields: configRes.config.bookingFields || [],
            verificationEnabled: configRes.config.verificationEnabled,
            verificationFields: configRes.config.verificationFields || [],
            verificationOnFail: configRes.config.verificationOnFail,
            paymentRequired: configRes.config.paymentRequired,
            paymentType: configRes.config.paymentType,
            depositAmountCents: configRes.config.depositAmountCents,
            emailConfirmation: configRes.config.emailConfirmation,
          };
        }

        // Single dispatch for all data - reduces re-renders from 13+ to 1
        dispatch({
          type: 'LOAD_DATA_SUCCESS',
          payload: {
            templates: templatesRes.templates || [],
            connections: activeConnections,
            config: configRes.exists && configRes.config ? configRes.config : null,
            bookingMode: mode,
            formData,
          },
        });
      } catch (err) {
        console.error('Failed to fetch integrations data:', err);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load integrations configuration' });
      }
    }

    fetchData();
  }, []);

  const handleTemplateSelect = useCallback((template: IndustryTemplate) => {
    dispatch({
      type: 'APPLY_TEMPLATE',
      payload: {
        templateId: template.id,
        bookingFields: template.defaultFields,
        verificationEnabled: template.defaultVerification?.enabled || false,
        verificationFields: template.defaultVerification?.fields || [],
        paymentType: template.defaultPayment?.type || 'none',
        paymentRequired: template.defaultPayment?.type !== 'none',
        depositAmountCents: template.defaultPayment?.amount || 0,
        successMessage: `Applied "${template.name}" template. Customize the settings below.`,
      },
    });
  }, []);

  const handleSave = useCallback(async () => {
    dispatch({ type: 'SET_SAVING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: '' });
    dispatch({ type: 'SET_SUCCESS', payload: '' });

    try {
      await integrationsApi.saveConfig({
        industryTemplateId: selectedTemplateId || undefined,
        bookingFields,
        verificationEnabled,
        verificationFields,
        verificationOnFail,
        paymentRequired,
        paymentType,
        depositAmountCents,
        emailConfirmation
      });
      dispatch({ type: 'SET_SUCCESS', payload: 'Booking configuration saved successfully!' });
      dispatch({ type: 'SET_BOOKING_MODE', payload: 'builtin' });
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save configuration. Please try again.' });
    } finally {
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  }, [selectedTemplateId, bookingFields, verificationEnabled, verificationFields, verificationOnFail, paymentRequired, paymentType, depositAmountCents, emailConfirmation]);

  const handleSwitchToBuiltin = useCallback(() => {
    dispatch({ type: 'SET_BOOKING_MODE', payload: 'builtin' });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Get connected provider names for display
  const connectedProviderNames = connections.map(c => c.provider?.name || c.providerId).join(', ');

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Booking Setup</h1>
        <p className="text-slate-500 mt-2">Configure how your AI handles bookings and appointments.</p>
      </div>

      {/* Alerts */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
          <p className="text-sm font-semibold">{success}</p>
          <button onClick={() => dispatch({ type: 'SET_SUCCESS', payload: '' })} className="ml-auto text-emerald-500 hover:text-emerald-700">
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="h-2 w-2 rounded-full bg-rose-500" />
          <p className="text-sm font-semibold">{error}</p>
          <button onClick={() => dispatch({ type: 'SET_ERROR', payload: '' })} className="ml-auto text-rose-500 hover:text-rose-700">
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* EXTERNAL PROVIDER MODE */}
      {bookingMode === 'external' && (
        <>
          {/* Connected Provider Status */}
          <Card className="border-none shadow-md ring-1 ring-emerald-200 bg-emerald-50/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 text-lg">External Booking System Connected</h3>
                  <p className="text-slate-600 mt-1">
                    Your AI assistant is using <strong>{connectedProviderNames}</strong> for bookings.
                    Availability, booking fields, and confirmations are managed by your external provider.
                  </p>
                  <div className="flex items-center gap-3 mt-4">
                    <Link href="/integrations/providers">
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Manage Providers
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info about what external mode means */}
          <Card className="border-none shadow-md ring-1 ring-slate-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">How External Booking Works</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <div className="text-2xl mb-2">1</div>
                  <p className="text-sm text-slate-600">Caller requests a booking via phone</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <div className="text-2xl mb-2">2</div>
                  <p className="text-sm text-slate-600">AI checks availability in {connectedProviderNames}</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <div className="text-2xl mb-2">3</div>
                  <p className="text-sm text-slate-600">Booking created directly in your system</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* NO BOOKING MODE - CHOICE SCREEN */}
      {bookingMode === 'none' && (
        <>
          <div className="text-center py-4">
            <h2 className="text-lg font-semibold text-slate-900">Choose Your Booking Method</h2>
            <p className="text-slate-500 mt-1">Select how you want your AI to handle appointments</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Option 1: External Provider */}
            <Link href="/integrations/providers">
              <Card className="border-none shadow-md ring-1 ring-slate-200 hover:ring-primary/50 hover:shadow-lg transition-all cursor-pointer group h-full">
                <CardContent className="p-6">
                  <div className="p-3 bg-primary/10 rounded-xl inline-block mb-4">
                    <Link2 className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-slate-900 text-lg mb-2">Connect External System</h3>
                  <p className="text-slate-500 text-sm mb-4">
                    Already use Calendly, Cal.com, Square, OpenTable, or another booking system? Connect it and let your AI sync directly.
                  </p>
                  <div className="flex items-center text-primary font-medium text-sm">
                    Browse Providers
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Option 2: Built-in Booking */}
            <Card
              className="border-none shadow-md ring-1 ring-slate-200 hover:ring-primary/50 hover:shadow-lg transition-all cursor-pointer group h-full"
              onClick={handleSwitchToBuiltin}
            >
              <CardContent className="p-6">
                <div className="p-3 bg-amber-100 rounded-xl inline-block mb-4">
                  <Calendar className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="font-semibold text-slate-900 text-lg mb-2">Use Built-in Booking</h3>
                <p className="text-slate-500 text-sm mb-4">
                  Don&apos;t have a booking system? Use our built-in solution. Configure fields, availability, and confirmations here.
                </p>
                <div className="flex items-center text-primary font-medium text-sm">
                  Set Up Now
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* BUILT-IN BOOKING MODE */}
      {bookingMode === 'builtin' && (
        <>
          {/* Header with option to switch */}
          <Card className="border-none shadow-md ring-1 ring-slate-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-100 rounded-xl">
                    <Calendar className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Built-in Booking System</h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Configure your AI&apos;s booking fields and settings below
                    </p>
                  </div>
                </div>
                <Link href="/integrations/providers">
                  <Button variant="outline" size="sm">
                    <Link2 className="w-4 h-4 mr-2" />
                    Switch to External
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Industry Template Selector */}
          <IndustryTemplateSelector
            templates={templates}
            selectedTemplateId={selectedTemplateId}
            onSelectTemplate={handleTemplateSelect}
          />

          {/* Booking Fields */}
          {selectedTemplateId && (
            <BookingFieldsEditor
              fields={bookingFields}
              onFieldsChange={(fields) => dispatch({ type: 'SET_BOOKING_FIELDS', payload: fields })}
            />
          )}

          {/* Customer Verification */}
          {selectedTemplateId && (
            <VerificationSettings
              enabled={verificationEnabled}
              fields={verificationFields}
              onFail={verificationOnFail}
              onEnabledChange={(enabled) => dispatch({ type: 'SET_VERIFICATION_ENABLED', payload: enabled })}
              onFieldsChange={(fields) => dispatch({ type: 'SET_VERIFICATION_FIELDS', payload: fields })}
              onFailChange={(onFail) => dispatch({ type: 'SET_VERIFICATION_ON_FAIL', payload: onFail })}
            />
          )}

          {/* Payment Settings */}
          {selectedTemplateId && (
            <PaymentSettings
              paymentType={paymentType}
              depositAmountCents={depositAmountCents}
              onPaymentTypeChange={(type) => dispatch({ type: 'SET_PAYMENT_TYPE', payload: { type, required: type !== 'none' } })}
              onDepositAmountChange={(amount) => dispatch({ type: 'SET_DEPOSIT_AMOUNT', payload: amount })}
            />
          )}

          {/* Calendar Integration */}
          {selectedTemplateId && <CalendarStatus />}

          {/* Confirmation Settings */}
          {selectedTemplateId && (
            <ConfirmationSettings
              emailEnabled={emailConfirmation}
              onEmailChange={(enabled) => dispatch({ type: 'SET_EMAIL_CONFIRMATION', payload: enabled })}
            />
          )}

          {/* Save Button */}
          {selectedTemplateId && (
            <div className="flex justify-end pt-6 border-t border-slate-200">
              <Button onClick={handleSave} isLoading={isSaving} className="shadow-lg shadow-primary/20">
                <Save className="w-4 h-4 mr-2" />
                Save Configuration
              </Button>
            </div>
          )}

          {/* Empty State - no template selected */}
          {!selectedTemplateId && templates.length > 0 && (
            <Card className="border-none shadow-md ring-1 ring-slate-200">
              <CardContent className="py-12 text-center">
                <div className="p-4 bg-slate-50 rounded-full inline-block mb-4">
                  <Plug className="w-8 h-8 text-slate-400" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">Select an Industry Template</h2>
                <p className="text-slate-500">
                  Choose a template above to pre-configure your booking fields and settings.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
