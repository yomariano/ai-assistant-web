'use client';

import { Calendar, CalendarCheck, Square, BookOpen, UtensilsCrossed, Dumbbell, ExternalLink, Sparkles, HeartPulse, Stethoscope, PawPrint } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import type { BookingProvider } from '@/types';

const PROVIDER_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Calendar: Calendar,
  CalendarCheck: CalendarCheck,
  Square: Square,
  BookOpen: BookOpen,
  UtensilsCrossed: UtensilsCrossed,
  Dumbbell: Dumbbell,
  HeartPulse: HeartPulse,
  Stethoscope: Stethoscope,
  PawPrint: PawPrint,
};

const CATEGORY_COLORS: Record<string, string> = {
  general: 'bg-blue-100 text-blue-700',
  restaurant: 'bg-orange-100 text-orange-700',
  salon: 'bg-pink-100 text-pink-700',
  fitness: 'bg-green-100 text-green-700',
  healthcare: 'bg-purple-100 text-purple-700',
  veterinary: 'bg-teal-100 text-teal-700',
};

interface ProviderCardProps {
  provider: BookingProvider;
  onConnect: () => void;
}

export function ProviderCard({ provider, onConnect }: ProviderCardProps) {
  const IconComponent = PROVIDER_ICONS[provider.icon] || Calendar;
  const categoryColor = CATEGORY_COLORS[provider.category] || 'bg-slate-100 text-slate-700';

  return (
    <Card className="border-none shadow-md ring-1 ring-slate-200 hover:ring-primary/50 hover:shadow-lg transition-all">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-100 rounded-xl">
              <IconComponent className="w-6 h-6 text-slate-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900">{provider.name}</h3>
                {provider.isBeta && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded">
                    <Sparkles className="w-3 h-3" />
                    Beta
                  </span>
                )}
              </div>
              <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full capitalize ${categoryColor}`}>
                {provider.category}
              </span>
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-500 mb-4 line-clamp-2">{provider.description}</p>

        {/* Features */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {provider.features.availabilitySync && (
            <span className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded">Availability</span>
          )}
          {provider.features.bookingCreate && (
            <span className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded">Create</span>
          )}
          {provider.features.bookingCancel && (
            <span className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded">Cancel</span>
          )}
          {provider.features.webhooks && (
            <span className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded">Webhooks</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={onConnect} className="flex-1">
            Connect
          </Button>
          {provider.docsUrl && (
            <a
              href={provider.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
