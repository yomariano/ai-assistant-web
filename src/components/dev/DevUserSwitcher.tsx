'use client';

import { useState, useEffect } from 'react';
import { Users, ChevronDown, Check } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

interface DevUser {
  plan: string;
  userId: string;
  email: string;
  fullName: string;
  subscription: { plan_id: string; status: string } | null;
  phoneCount: number;
  isCurrent: boolean;
}

export default function DevUserSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<DevUser[]>([]);
  const [currentPlan, setCurrentPlan] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuthStore();

  useEffect(() => {
    fetchDevUsers();
  }, []);

  async function fetchDevUsers() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/auth/dev-users`
      );
      const data = await response.json();
      if (data.users) {
        setUsers(data.users);
        setCurrentPlan(data.currentPlan);
      }
    } catch (err) {
      console.error('Failed to fetch dev users:', err);
    }
  }

  async function switchUser(plan: string) {
    if (plan === currentPlan) {
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/auth/dev-login?plan=${plan}`
      );
      const data = await response.json();

      if (data.user) {
        setUser(data.user);
        setCurrentPlan(plan);
        // Refresh the page to load new user data
        window.location.reload();
      }
    } catch (err) {
      console.error('Failed to switch user:', err);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  }

  const planColors: Record<string, string> = {
    starter: 'bg-slate-500',
    growth: 'bg-indigo-500',
    scale: 'bg-violet-500',
  };

  const currentUser = users.find(u => u.isCurrent);

  if (users.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg shadow-lg hover:bg-slate-700 transition-colors"
        >
          <Users className="w-4 h-4" />
          <span className="font-medium">Dev: {currentPlan}</span>
          <span className={`w-2 h-2 rounded-full ${planColors[currentPlan] || 'bg-gray-500'}`} />
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-3 bg-slate-50 border-b border-slate-200">
              <p className="text-xs font-bold text-slate-500 uppercase">Switch Dev User</p>
            </div>
            <div className="divide-y divide-slate-100">
              {users.map((user) => (
                <button
                  key={user.plan}
                  onClick={() => switchUser(user.plan)}
                  disabled={isLoading}
                  className={`w-full p-3 text-left hover:bg-slate-50 transition-colors flex items-center justify-between ${
                    user.isCurrent ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${planColors[user.plan]}`} />
                    <div>
                      <p className="font-semibold text-slate-900 capitalize">{user.plan}</p>
                      <p className="text-xs text-slate-500">
                        {user.phoneCount} phone{user.phoneCount !== 1 ? 's' : ''} • {user.subscription?.status || 'no sub'}
                      </p>
                    </div>
                  </div>
                  {user.isCurrent && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </button>
              ))}
            </div>
            <div className="p-3 bg-amber-50 border-t border-amber-100">
              <p className="text-xs text-amber-700">
                Run <code className="bg-amber-100 px-1 rounded">node scripts/seedDevUsers.js</code> to create test users
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
