'use client';

import { memo } from 'react';
import { Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { PhoneNumber } from '@/types';

export interface AssistantPhoneNumbersProps {
  phoneNumbers: PhoneNumber[];
}

export const AssistantPhoneNumbers = memo(function AssistantPhoneNumbers({
  phoneNumbers,
}: AssistantPhoneNumbersProps) {
  if (phoneNumbers.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <h2 className="text-lg font-bold text-slate-900">Your Phone Numbers</h2>
        <p className="text-sm text-slate-500 mt-1">These numbers are assigned to your AI assistant.</p>
      </div>

      <div className="lg:col-span-2">
        <Card className="border-none shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-0 divide-y divide-slate-100">
            {phoneNumbers.map((phone) => (
              <div key={phone.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <Phone className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{phone.phoneNumber}</p>
                    <p className="text-xs text-slate-500">{phone.label}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    phone.status === 'active'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {phone.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
});


