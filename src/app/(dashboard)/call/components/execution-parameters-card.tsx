'use client';

import { Calendar, Phone, Save } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { useCallFormStore } from '@/lib/store';

export interface ExecutionParametersCardProps {
  isCallingLoading: boolean;
  isFormSubmitDisabled: boolean;
  onCall: () => void;
  onOpenSaveDialog: () => void;
  onOpenScheduleDialog: () => void;
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
];

export const ExecutionParametersCard = ({
  isCallingLoading,
  isFormSubmitDisabled,
  onCall,
  onOpenSaveDialog,
  onOpenScheduleDialog,
}: ExecutionParametersCardProps) => {
  const language = useCallFormStore((s) => s.language);
  const setLanguage = useCallFormStore((s) => s.setLanguage);
  const isFormValid = useCallFormStore((s) => Boolean(s.phoneNumber.trim() && s.message.trim()));

  return (
    <Card className="border-none shadow-md ring-1 ring-slate-200 h-full">
      <CardHeader className="bg-slate-50/50">
        <h2 className="text-lg font-bold text-slate-900">Execution Parameters</h2>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Deployment Language</label>
          <select
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white text-sm font-medium"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-6 space-y-3">
          <Button
            className="w-full shadow-lg shadow-indigo-100"
            size="lg"
            onClick={onCall}
            disabled={!isFormValid || isCallingLoading || isFormSubmitDisabled}
            isLoading={isCallingLoading}
          >
            <Phone className="w-4 h-4 mr-2" />
            Initiate Immediate Call
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={onOpenSaveDialog}
              disabled={!isFormValid || isFormSubmitDisabled}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Template
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={onOpenScheduleDialog}
              disabled={!isFormValid || isFormSubmitDisabled}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};



