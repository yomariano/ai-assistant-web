'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Phone, MessageSquare, Clock, ArrowRight, History as HistoryIcon, Settings as SettingsIcon, Bot, Voicemail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { userApi, historyApi } from '@/lib/api';
import type { UserStats, CallHistory } from '@/types';
import { useAuthStore } from '@/lib/store';
import { formatDistanceToNow } from 'date-fns';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentCalls, setRecentCalls] = useState<CallHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsData, historyData] = await Promise.all([
          userApi.getStats(),
          historyApi.list(5, 0)
        ]);
        setStats(statsData);
        setRecentCalls(historyData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Calls Answered', value: stats?.totalCalls || 0, icon: Phone, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Messages Taken', value: stats?.savedCalls || 0, icon: MessageSquare, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Voicemails', value: stats?.pendingScheduled || 0, icon: Voicemail, color: 'bg-amber-50 text-amber-600' },
    { label: 'Call Minutes', value: stats?.totalDurationMinutes || 0, icon: Clock, color: 'bg-blue-50 text-blue-600' },
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Welcome back, {user?.fullName?.split(' ')[0]}!
        </h1>
        <p className="text-slate-500 mt-1">
          Your AI receptionist is handling calls 24/7.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm ring-1 ring-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
            <Link href="/history">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary-hover font-semibold">
                View History <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <Card className="border-none shadow-sm ring-1 ring-slate-200 overflow-hidden">
            <div className="divide-y divide-slate-100">
              {recentCalls.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="p-3 bg-slate-50 rounded-full mb-3">
                    <HistoryIcon className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-slate-500">No recent activity found.</p>
                </div>
              ) : (
                recentCalls.map((call) => (
                  <div key={call.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-lg ${call.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                        call.status === 'failed' ? 'bg-rose-50 text-rose-600' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                        <Phone className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900">{call.contactName || call.phoneNumber}</p>
                        <p className="text-sm text-slate-500 truncate max-w-[200px] sm:max-w-md">{call.message}</p>
                      </div>
                    </div>
                    <div className="mt-3 sm:mt-0 flex items-center justify-between sm:text-right gap-4">
                      <div className="sm:hidden text-xs text-slate-400">
                        {formatDistanceToNow(new Date(call.createdAt), { addSuffix: true })}
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${call.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                        call.status === 'failed' ? 'bg-rose-100 text-rose-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                        {call.status}
                      </span>
                      <p className="hidden sm:block text-xs font-medium text-slate-400">
                        {formatDistanceToNow(new Date(call.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Quick Tools */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Quick Tools</h2>
          <div className="grid grid-cols-1 gap-4">
            <Link href="/assistant">
              <Card className="hover:shadow-md transition-all border-none ring-1 ring-slate-200 group cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-violet-50 text-violet-600 rounded-xl group-hover:scale-110 transition-transform">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 leading-tight">AI Assistant</h3>
                      <p className="text-xs text-slate-500 mt-1">Configure your voice AI</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/history">
              <Card className="hover:shadow-md transition-all border-none ring-1 ring-slate-200 group cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 leading-tight">Messages</h3>
                      <p className="text-xs text-slate-500 mt-1">View caller messages</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/notifications">
              <Card className="hover:shadow-md transition-all border-none ring-1 ring-slate-200 group cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-110 transition-transform">
                      <Voicemail className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 leading-tight">Notifications</h3>
                      <p className="text-xs text-slate-500 mt-1">Manage call alerts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/settings">
              <Card className="hover:shadow-md transition-all border-none ring-1 ring-slate-200 group cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-50 text-slate-600 rounded-xl group-hover:scale-110 transition-transform">
                      <SettingsIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 leading-tight">Configurations</h3>
                      <p className="text-xs text-slate-500 mt-1">System and profile preferences</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
