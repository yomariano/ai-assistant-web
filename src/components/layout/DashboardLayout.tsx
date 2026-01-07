'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import DevUserSwitcher from '@/components/dev/DevUserSwitcher';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth, devMode, user } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  console.log('[DASHBOARD] ====== DashboardLayout render ======');
  console.log('[DASHBOARD] State:', { isLoading, isAuthenticated, devMode, userEmail: user?.email });

  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

  useEffect(() => {
    console.log('[DASHBOARD] useEffect - calling checkAuth()');
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    console.log('[DASHBOARD] useEffect - auth state changed:', { isLoading, isAuthenticated });
    if (!isLoading && !isAuthenticated) {
      console.log('[DASHBOARD] Not authenticated, redirecting to /login');
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    console.log('[DASHBOARD] Rendering loading spinner...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('[DASHBOARD] Not authenticated, returning null');
    return null;
  }

  console.log('[DASHBOARD] Rendering full dashboard');
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar onMenuClick={toggleSidebar} />
        <main className="flex-1 overflow-y-auto px-4 py-8 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
      {/* Dev user switcher - only visible in dev mode */}
      {devMode && <DevUserSwitcher />}
    </div>
  );
}
