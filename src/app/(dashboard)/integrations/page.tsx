'use client';

import { useCallback, useEffect, useState } from 'react';
import { Save, Plug } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { integrationsApi } from '@/lib/api';
import type { IndustryTemplate, BookingConfig, BookingField } from '@/types';
import { IndustryTemplateSelector } from './components/industry-template-selector';
import { BookingFieldsEditor } from './components/booking-fields-editor';
import { VerificationSettings } from './components/verification-settings';
import { PaymentSettings } from './components/payment-settings';
import { CalendarStatus } from './components/calendar-status';
import { ConfirmationSettings } from './components/confirmation-settings';

export default function IntegrationsPage() {
  const [templates, setTemplates] = useState<IndustryTemplate[]>([]);
  const [config, setConfig] = useState<BookingConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Form state
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
      const [templatesRes, configRes] = await Promise.all([
        integrationsApi.getTemplates(),
        integrationsApi.getConfig()
      ]);

      setTemplates(templatesRes.templates || []);

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
      setSuccess('Integrations configuration saved successfully!');
    } catch {
      setError('Failed to save configuration. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Integrations</h1>
        <p className="text-slate-500 mt-2">Configure how your AI handles bookings and appointments.</p>
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

      {/* Empty State */}
      {!selectedTemplateId && templates.length > 0 && (
        <Card className="border-none shadow-md ring-1 ring-slate-200">
          <CardContent className="py-12 text-center">
            <div className="p-4 bg-slate-50 rounded-full inline-block mb-4">
              <Plug className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Get Started</h2>
            <p className="text-slate-500">
              Select an industry template above to configure your booking system.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
