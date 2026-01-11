'use client';

import { ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface VerificationSettingsProps {
  enabled: boolean;
  fields: string[];
  onFail: 'transfer_to_staff' | 'take_message' | 'retry';
  onEnabledChange: (enabled: boolean) => void;
  onFieldsChange: (fields: string[]) => void;
  onFailChange: (action: 'transfer_to_staff' | 'take_message' | 'retry') => void;
}

const verificationFieldOptions = [
  { id: 'full_name', label: 'Full Name' },
  { id: 'date_of_birth', label: 'Date of Birth' },
  { id: 'postcode', label: 'Postcode' },
  { id: 'phone', label: 'Phone Number' },
  { id: 'email', label: 'Email' },
  { id: 'member_id', label: 'Member ID' },
];

const onFailOptions = [
  { id: 'transfer_to_staff', label: 'Transfer to staff' },
  { id: 'take_message', label: 'Take a message' },
  { id: 'retry', label: 'Ask to try again' },
];

export function VerificationSettings({
  enabled,
  fields,
  onFail,
  onEnabledChange,
  onFieldsChange,
  onFailChange,
}: VerificationSettingsProps) {
  const toggleField = (fieldId: string) => {
    if (fields.includes(fieldId)) {
      onFieldsChange(fields.filter((f) => f !== fieldId));
    } else {
      onFieldsChange([...fields, fieldId]);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <h2 className="text-lg font-bold text-slate-900">Customer Verification</h2>
        <p className="text-sm text-slate-500 mt-1">
          Verify caller identity before accessing their records or making changes.
        </p>
      </div>

      <div className="lg:col-span-2">
        <Card className="border-none shadow-md ring-1 ring-slate-200 overflow-hidden">
          <CardContent className="p-6 space-y-6">
            {/* Enable Toggle */}
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Verify existing customers</span>
                  <p className="text-sm text-slate-500">Ask verification questions before accessing records</p>
                </div>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => onEnabledChange(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-12 h-6 rounded-full transition-colors ${
                    enabled ? 'bg-primary' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`absolute w-5 h-5 bg-white rounded-full shadow top-0.5 transition-transform ${
                      enabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </div>
              </div>
            </label>

            {enabled && (
              <>
                {/* Verification Fields */}
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-sm font-medium text-slate-700 mb-3">Verify with:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {verificationFieldOptions.map((option) => (
                      <label
                        key={option.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          fields.includes(option.id)
                            ? 'border-primary bg-primary/5'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={fields.includes(option.id)}
                          onChange={() => toggleField(option.id)}
                          className="rounded border-slate-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm font-medium text-slate-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* On Fail Action */}
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-sm font-medium text-slate-700 mb-3">If verification fails:</p>
                  <div className="space-y-2">
                    {onFailOptions.map((option) => (
                      <label
                        key={option.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          onFail === option.id
                            ? 'border-primary bg-primary/5'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="onFail"
                          checked={onFail === option.id}
                          onChange={() => onFailChange(option.id as typeof onFail)}
                          className="border-slate-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm font-medium text-slate-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
