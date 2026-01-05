'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Phone, Trash2, BookMarked } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { savedCallsApi } from '@/lib/api';
import { useCallFormStore } from '@/lib/store';
import type { SavedCall } from '@/types';
import { formatDistanceToNow } from 'date-fns';

export default function AgendaPage() {
  const router = useRouter();
  const { loadFromSavedCall } = useCallFormStore();
  const [savedCalls, setSavedCalls] = useState<SavedCall[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSavedCalls();
  }, []);

  const fetchSavedCalls = async () => {
    try {
      const data = await savedCallsApi.list();
      setSavedCalls(data);
    } catch (error) {
      console.error('Failed to fetch saved calls:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUse = async (call: SavedCall) => {
    try {
      await savedCallsApi.markAsUsed(call.id);
      loadFromSavedCall(call);
      router.push('/call');
    } catch (error) {
      console.error('Failed to mark call as used:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this saved call?')) return;

    try {
      await savedCallsApi.delete(id);
      setSavedCalls(savedCalls.filter(c => c.id !== id));
    } catch (error) {
      console.error('Failed to delete saved call:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Call Agendas</h1>
          <p className="text-slate-500 mt-1">Pre-configured scripts and templates for your AI agents.</p>
        </div>
        <Link href="/call">
          <Button variant="outline" size="md" className="group">
            <BookMarked className="w-4 h-4 mr-2 text-primary" />
            Create New Agenda
          </Button>
        </Link>
      </div>

      {savedCalls.length === 0 ? (
        <Card className="border-none ring-1 ring-slate-200">
          <CardContent className="py-20 text-center">
            <div className="mx-auto w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-400">
              <BookMarked className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No agendas saved</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto">
              Save your call scripts during the call setup to reuse them later and optimize your workflow.
            </p>
            <Button className="mt-8 shadow-indigo-200 shadow-lg" onClick={() => router.push('/call')}>
              Make Your First Call
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {savedCalls.map((call) => (
            <Card key={call.id} className="group relative flex flex-col border-none ring-1 ring-slate-200 transition-all hover:ring-primary/30">
              <CardContent className="flex-1 p-6">
                <div className="flex items-start justify-between">
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    <BookMarked className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full" onClick={() => handleDelete(call.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">{call.name}</h3>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">{call.contactName || call.phoneNumber}</p>
                  <p className="text-sm text-slate-600 mt-3 line-clamp-3 leading-relaxed">{call.message}</p>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50/50 border-t border-slate-100 flex items-center justify-between p-4">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-tight">System Usage</span>
                  <span className="text-xs font-bold text-slate-700">{call.usageCount} executions</span>
                </div>
                <Button size="sm" className="h-9 px-4 shadow-sm" onClick={() => handleUse(call)}>
                  Run Agenda
                  <Phone className="w-3.5 h-3.5 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
