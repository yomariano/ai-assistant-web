'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Phone,
  History,
  Settings,
  LogOut,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  X,
  Bot,
  CreditCard,
  Bell,
  MessageSquare,
  Plug,
  Mail,
  Shield
} from 'lucide-react';
import { useAuthStore, useBillingStore, getPlanDisplayName, getPlanBadgeColor } from '@/lib/store';
import { adminApi } from '@/lib/api';
import { useRegion } from '@/hooks/useRegion';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/assistant', label: 'AI Assistant', icon: Bot },
  { href: '/integrations', label: 'Integrations', icon: Plug },
  { href: '/history', label: 'Call History', icon: Phone },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/billing', label: 'Billing', icon: CreditCard },
  { href: '/settings', label: 'Settings', icon: Settings },
];

const adminNavItems = [
  { href: '/admin/campaigns', label: 'Email Campaigns', icon: Mail },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated, isLoading } = useAuthStore();
  const { region } = useRegion();
  const subscription = useBillingStore((state) => state.subscription);
  const usage = useBillingStore((state) => state.usage);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const adminCheckDoneRef = useRef(false);

  // Check admin status only once after authentication is complete
  useEffect(() => {
    // Wait for auth to settle before making API calls
    if (isLoading || !isAuthenticated) {
      // Reset the check flag if user logs out
      if (!isAuthenticated && !isLoading) {
        adminCheckDoneRef.current = false;
        setIsAdmin(false);
      }
      return;
    }

    // Only check once per authentication session
    if (adminCheckDoneRef.current) {
      return;
    }

    adminCheckDoneRef.current = true;
    adminApi.checkStatus()
      .then(({ isAdmin }) => setIsAdmin(isAdmin))
      .catch(() => setIsAdmin(false));
  }, [isAuthenticated, isLoading]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Close sidebar on route change (mobile)
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  const sidebarWidth = isCollapsed ? 'w-20' : 'w-64';
  const countryLabel = region === 'AR' ? 'Argentina' : 'Ireland';

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-slate-900 text-slate-300 transition-all duration-300 lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } ${sidebarWidth}`}
      >
        {/* Logo Section */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500">
              <svg width="20" height="20" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M166 172L256 318L346 172" stroke="white" strokeWidth="52" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="256" cy="356" r="14" fill="white" fillOpacity="0.9" />
              </svg>
            </div>
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white whitespace-nowrap">
                  VoiceFleet
                </span>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 whitespace-nowrap">
                  {countryLabel}
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'hover:bg-white/5 hover:text-white'
                  }`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? '' : 'text-slate-400 group-hover:text-white'}`} />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
                {isCollapsed && (
                  <div className="absolute left-16 z-50 hidden rounded-md bg-slate-800 px-2 py-1 text-xs text-white group-hover:block whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}

          {/* Admin Section */}
          {isAdmin && (
            <>
              <div className={`mt-4 mb-2 ${isCollapsed ? 'px-3' : 'px-3'}`}>
                {!isCollapsed && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <Shield className="h-3 w-3" />
                    Admin
                  </div>
                )}
                {isCollapsed && (
                  <div className="h-px bg-white/10" />
                )}
              </div>
              {adminNavItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                        ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
                        : 'hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    <Icon className={`h-5 w-5 shrink-0 ${isActive ? '' : 'text-slate-400 group-hover:text-white'}`} />
                    {!isCollapsed && <span className="font-medium">{item.label}</span>}
                    {isCollapsed && (
                      <div className="absolute left-16 z-50 hidden rounded-md bg-slate-800 px-2 py-1 text-xs text-white group-hover:block whitespace-nowrap">
                        {item.label}
                      </div>
                    )}
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        {/* User & Settings Section */}
        <div className="border-t border-white/10 p-4 space-y-2">
          {/* Minutes Remaining */}
          {subscription && usage && usage.minutesIncluded && (
            <Link
              href="/billing"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group ${
                isCollapsed ? 'justify-center' : ''
              } hover:bg-white/5`}
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-700">
                <Phone className="h-3.5 w-3.5 text-slate-300" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col overflow-hidden flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Minutes remaining</span>
                    <span className={`text-xs font-medium ${
                      (usage.minutesRemaining ?? 0) === 0
                        ? 'text-rose-400'
                        : (usage.minutesRemaining ?? 0) <= Math.round(usage.minutesIncluded * 0.2)
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                    }`}>
                      {Math.round(usage.minutesRemaining ?? 0)}/{usage.minutesIncluded}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        (usage.minutesRemaining ?? 0) === 0
                          ? 'bg-rose-500'
                          : (usage.minutesRemaining ?? 0) <= Math.round(usage.minutesIncluded * 0.2)
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.round(((usage.minutesRemaining ?? 0) / usage.minutesIncluded) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
              {isCollapsed && (
                <div className="absolute left-16 z-50 hidden rounded-md bg-slate-800 px-2 py-1 text-xs text-white group-hover:block whitespace-nowrap">
                  {Math.round(usage.minutesRemaining ?? 0)}/{usage.minutesIncluded} minutes remaining
                </div>
              )}
            </Link>
          )}

          {/* Subscription Plan Badge */}
          {subscription && (
            <Link
              href="/billing"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                isCollapsed ? 'justify-center' : ''
              } hover:bg-white/5`}
            >
              <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${getPlanBadgeColor(subscription.plan_id)}`}>
                <CreditCard className="h-3.5 w-3.5 text-white" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs text-slate-400">Current Plan</span>
                  <span className="text-sm font-medium text-white truncate">
                    {getPlanDisplayName(subscription.plan_id)}
                  </span>
                </div>
              )}
              {isCollapsed && (
                <div className="absolute left-16 z-50 hidden rounded-md bg-slate-800 px-2 py-1 text-xs text-white group-hover:block whitespace-nowrap">
                  {getPlanDisplayName(subscription.plan_id)} Plan
                </div>
              )}
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 transition-colors group"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>

          {/* Collapse Toggle (Desktop only) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5 shrink-0 mx-auto" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5 shrink-0" />
                <span className="font-medium">Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
