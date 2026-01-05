'use client';

import Input from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useCallFormStore } from '@/lib/store';

export const AgentConfigurationCard = () => {
  const phoneNumber = useCallFormStore((s) => s.phoneNumber);
  const contactName = useCallFormStore((s) => s.contactName);
  const message = useCallFormStore((s) => s.message);
  const setPhoneNumber = useCallFormStore((s) => s.setPhoneNumber);
  const setContactName = useCallFormStore((s) => s.setContactName);
  const setMessage = useCallFormStore((s) => s.setMessage);

  return (
    <Card className="border-none shadow-md ring-1 ring-slate-200">
      <CardHeader className="bg-slate-50/50">
        <h2 className="text-lg font-bold text-slate-900">Agent Configuration</h2>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Phone Number"
            placeholder="+1 (555) 000-0000"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="bg-white"
          />

          <Input
            label="Contact Name"
            placeholder="Recipient Identity"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Voice Script & Instructions</label>
          <textarea
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none min-h-[160px] text-sm leading-relaxed"
            placeholder="Define the AI's persona and objective... e.g., 'You are a professional assistant scheduling a dental follow-up...'"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <p className="text-[11px] text-slate-400 mt-2 font-medium italic">
            Tip: Be specific about the goals and constraints of the conversation.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};


