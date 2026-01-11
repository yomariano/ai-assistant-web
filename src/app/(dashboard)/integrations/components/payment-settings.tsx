'use client';

import { CreditCard, Ban, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Input from '@/components/ui/input';

interface PaymentSettingsProps {
  paymentType: 'none' | 'card_hold' | 'deposit';
  depositAmountCents: number;
  onPaymentTypeChange: (type: 'none' | 'card_hold' | 'deposit') => void;
  onDepositAmountChange: (cents: number) => void;
}

const paymentOptions = [
  {
    id: 'none',
    label: 'No payment required',
    description: 'Accept bookings without any payment',
    icon: Ban,
  },
  {
    id: 'card_hold',
    label: 'Card hold (verify only)',
    description: 'Verify card is valid without charging',
    icon: Lock,
  },
  {
    id: 'deposit',
    label: 'Collect deposit',
    description: 'Charge a deposit to secure the booking',
    icon: CreditCard,
  },
];

export function PaymentSettings({
  paymentType,
  depositAmountCents,
  onPaymentTypeChange,
  onDepositAmountChange,
}: PaymentSettingsProps) {
  const depositAmount = depositAmountCents / 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <h2 className="text-lg font-bold text-slate-900">Payment</h2>
        <p className="text-sm text-slate-500 mt-1">
          Collect payment or deposit to secure bookings and reduce no-shows.
        </p>
      </div>

      <div className="lg:col-span-2">
        <Card className="border-none shadow-md ring-1 ring-slate-200 overflow-hidden">
          <CardContent className="p-6 space-y-3">
            {paymentOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = paymentType === option.id;

              return (
                <div key={option.id}>
                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentType"
                      checked={isSelected}
                      onChange={() => onPaymentTypeChange(option.id as typeof paymentType)}
                      className="sr-only"
                    />
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-primary' : 'bg-slate-100'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-slate-600'}`} />
                    </div>
                    <div className="flex-1">
                      <span className={`font-semibold ${isSelected ? 'text-primary' : 'text-slate-900'}`}>
                        {option.label}
                      </span>
                      <p className="text-sm text-slate-500">{option.description}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-primary' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                  </label>

                  {/* Deposit Amount Input */}
                  {option.id === 'deposit' && isSelected && (
                    <div className="mt-3 ml-14 flex items-center gap-3">
                      <span className="text-sm text-slate-600">Deposit amount:</span>
                      <div className="relative w-32">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                          €
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="0.50"
                          value={depositAmount}
                          onChange={(e) => {
                            const cents = Math.round(parseFloat(e.target.value || '0') * 100);
                            onDepositAmountChange(cents);
                          }}
                          className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
