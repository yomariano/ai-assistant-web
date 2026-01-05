'use client';

import { memo } from 'react';
import { Phone, Clock, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

export interface AssistantStatsCardsProps {
  phoneNumbersCount: number;
  minutesUsed: number;
  minutesIncluded: number;
  planId: string;
}

export const AssistantStatsCards = memo(function AssistantStatsCards({
  phoneNumbersCount,
  minutesUsed,
  minutesIncluded,
  planId,
}: AssistantStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="border-none shadow-sm ring-1 ring-slate-200">
        <CardContent className="pt-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Phone Numbers</p>
              <p className="text-xl font-bold text-slate-900">{phoneNumbersCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm ring-1 ring-slate-200">
        <CardContent className="pt-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Minutes Used</p>
              <p className="text-xl font-bold text-slate-900">
                {minutesUsed} / {minutesIncluded}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm ring-1 ring-slate-200">
        <CardContent className="pt-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Plan</p>
              <p className="text-xl font-bold text-slate-900 capitalize">{planId}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});


