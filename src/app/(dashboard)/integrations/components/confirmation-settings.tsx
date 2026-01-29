'use client';

import { Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ConfirmationSettingsProps {
  emailEnabled: boolean;
  onEmailChange: (enabled: boolean) => void;
}

export function ConfirmationSettings({
  emailEnabled,
  onEmailChange,
}: ConfirmationSettingsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <h2 className="text-lg font-bold text-slate-900">Confirmations</h2>
        <p className="text-sm text-slate-500 mt-1">
          How to notify customers when their booking is confirmed.
        </p>
      </div>

      <div className="lg:col-span-2">
        <Card className="border-none shadow-md ring-1 ring-slate-200 overflow-hidden">
          <CardContent className="p-6 space-y-4">
            {/* Email Confirmation */}
            <label className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Email Confirmation</span>
                  <p className="text-sm text-slate-500">Send booking details via email</p>
                </div>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={emailEnabled}
                  onChange={(e) => onEmailChange(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-12 h-6 rounded-full transition-colors ${
                    emailEnabled ? 'bg-primary' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`absolute w-5 h-5 bg-white rounded-full shadow top-0.5 transition-transform ${
                      emailEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </div>
              </div>
            </label>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
