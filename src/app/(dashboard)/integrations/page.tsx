'use client';

import { useCallback, useEffect, useState } from 'react';
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

export default function IntegrationsPage() {
  const [templates, setTemplates] = useState<IndustryTemplate[]>([]);
  const [config, setConfig] = useState<BookingConfig | null>(null);
  const [connections, setConnections] = useState<ProviderConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Booking mode - determined by what's configured
  const [bookingMode, setBookingMode] = useState<BookingMode>('none');

  // Form state for built-in booking
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [bookingFields, setBookingFields] = useState<BookingField[]>([]);
  const [verificationEnabled, setVerificationEnabled] = useState(false);
  const [verificationFields, setVerificationFields] = useState<string[]>([]);
  const [verificationOnFail, setVerificationOnFail] = useState<'transfer_to_staff' | 'take_message' | 'retry'>('transfer_to_staff');
  const [paymentRequired, setPaymentRequired] = useState(false);
  const [paymentType, setPaymentType] = useState<'none' | 'card_hold' | 'deposit'>('none');
  const [depositAmountCents, setDepositAmountCents] = useState(0);
  const [smsConfirmation, setSmsConfirmation] = useState(true);
  const [emailConfirmation, setEmailConfirmation] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [templatesRes, configRes, connectionsRes] = await Promise.all([
        integrationsApi.getTemplates(),
        integrationsApi.getConfig(),
        providersApi.getConnections().catch(() => ({ connections: [] }))
      ]);

      setTemplates(templatesRes.templates || []);
      const activeConnections = (connectionsRes.connections || []).filter(
        (c: ProviderConnection) => c.status === 'connected'
      );
      setConnections(activeConnections);

      // Determine booking mode
      if (activeConnections.length > 0) {
        setBookingMode('external');
      } else if (configRes.exists && configRes.config?.industryTemplateId) {
        setBookingMode('builtin');
      } else {
        setBookingMode('none');
      }

      if (configRes.exists && configRes.config) {
        setConfig(configRes.config);
        setSelectedTemplateId(configRes.config.industryTemplateId);
        setBookingFields(configRes.config.bookingFields || []);
        setVerificationEnabled(configRes.config.verificationEnabled);
        setVerificationFields(configRes.config.verificationFields || []);
        setVerificationOnFail(configRes.config.verificationOnFail);
        setPaymentRequired(configRes.config.paymentRequired);
        setPaymentType(configRes.config.paymentType);
        setDepositAmountCents(configRes.config.depositAmountCents);
        setSmsConfirmation(configRes.config.smsConfirmation);
        setEmailConfirmation(configRes.config.emailConfirmation);
      }
    } catch (err) {
      console.error('Failed to fetch integrations data:', err);
      setError('Failed to load integrations configuration');
    } finally {
      setIsLoading(false);
    }
  }

  const handleTemplateSelect = useCallback((template: IndustryTemplate) => {
    setSelectedTemplateId(template.id);
    setBookingFields(template.defaultFields);
    setVerificationEnabled(template.defaultVerification?.enabled || false);
    setVerificationFields(template.defaultVerification?.fields || []);
    setPaymentType(template.defaultPayment?.type || 'none');
    setPaymentRequired(template.defaultPayment?.type !== 'none');
    setDepositAmountCents(template.defaultPayment?.amount || 0);
    setSuccess(`Applied "${template.name}" template. Customize the settings below.`);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');

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
        smsConfirmation,
        emailConfirmation
      });
      setSuccess('Booking configuration saved successfully!');
      setBookingMode('builtin');
    } catch {
      setError('Failed to save configuration. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSwitchToBuiltin = () => {
    setBookingMode('builtin');
  };

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
          <button onClick={() => setSuccess('')} className="ml-auto text-emerald-500 hover:text-emerald-700">
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="h-2 w-2 rounded-full bg-rose-500" />
          <p className="text-sm font-semibold">{error}</p>
          <button onClick={() => setError('')} className="ml-auto text-rose-500 hover:text-rose-700">
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
              onFieldsChange={setBookingFields}
            />
          )}

          {/* Customer Verification */}
          {selectedTemplateId && (
            <VerificationSettings
              enabled={verificationEnabled}
              fields={verificationFields}
              onFail={verificationOnFail}
              onEnabledChange={setVerificationEnabled}
              onFieldsChange={setVerificationFields}
              onFailChange={setVerificationOnFail}
            />
          )}

          {/* Payment Settings */}
          {selectedTemplateId && (
            <PaymentSettings
              paymentType={paymentType}
              depositAmountCents={depositAmountCents}
              onPaymentTypeChange={(type) => {
                setPaymentType(type);
                setPaymentRequired(type !== 'none');
              }}
              onDepositAmountChange={setDepositAmountCents}
            />
          )}

          {/* Calendar Integration */}
          {selectedTemplateId && <CalendarStatus />}

          {/* Confirmation Settings */}
          {selectedTemplateId && (
            <ConfirmationSettings
              smsEnabled={smsConfirmation}
              emailEnabled={emailConfirmation}
              onSmsChange={setSmsConfirmation}
              onEmailChange={setEmailConfirmation}
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
