'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

export interface SaveDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  name: string;
  onNameChange: (name: string) => void;
  onClose: () => void;
  onSave: () => void;
}

export const SaveDialog = ({
  isOpen,
  isLoading,
  name,
  onNameChange,
  onClose,
  onSave,
}: SaveDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
      <Card className="w-full max-w-md border-none shadow-2xl animate-in zoom-in-95">
        <CardHeader className="border-b-0 pt-8 text-center">
          <h3 className="text-xl font-bold text-slate-900">Save Call Template</h3>
          <p className="text-sm text-slate-500 mt-1">Reuse these instructions for future calls.</p>
        </CardHeader>
        <CardContent className="space-y-6 px-8 pb-8">
          <Input
            label="Template Name"
            placeholder="e.g., Patient Outreach"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-primary"
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1 order-1 sm:order-2" onClick={onSave} disabled={!name.trim()} isLoading={isLoading}>
              Save to Agenda
            </Button>
            <Button variant="ghost" className="flex-1 order-2 sm:order-1 text-slate-400" onClick={onClose}>
              Discard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


