'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

export interface ScheduleDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  scheduleDate: string;
  scheduleTime: string;
  minDate: string;
  onScheduleDateChange: (date: string) => void;
  onScheduleTimeChange: (time: string) => void;
  onClose: () => void;
  onSchedule: () => void;
}

export const ScheduleDialog = ({
  isOpen,
  isLoading,
  scheduleDate,
  scheduleTime,
  minDate,
  onScheduleDateChange,
  onScheduleTimeChange,
  onClose,
  onSchedule,
}: ScheduleDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
      <Card className="w-full max-w-md border-none shadow-2xl animate-in zoom-in-95">
        <CardHeader className="border-b-0 pt-8 text-center">
          <h3 className="text-xl font-bold text-slate-900">Set Call Schedule</h3>
          <p className="text-sm text-slate-500 mt-1">Automate the call deployment for a later time.</p>
        </CardHeader>
        <CardContent className="space-y-6 px-8 pb-8">
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              label="Date"
              value={scheduleDate}
              onChange={(e) => onScheduleDateChange(e.target.value)}
              min={minDate}
              className="bg-slate-50 border-none ring-1 ring-slate-200"
            />
            <Input
              type="time"
              label="Time"
              value={scheduleTime}
              onChange={(e) => onScheduleTimeChange(e.target.value)}
              className="bg-slate-50 border-none ring-1 ring-slate-200"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="flex-1 order-1 sm:order-2"
              onClick={onSchedule}
              disabled={!scheduleDate || !scheduleTime}
              isLoading={isLoading}
            >
              Confirm Schedule
            </Button>
            <Button variant="ghost" className="flex-1 order-2 sm:order-1 text-slate-400" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


