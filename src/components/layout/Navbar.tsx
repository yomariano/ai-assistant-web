'use client';

import { Menu, Bell, Search, User } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import Button from '@/components/ui/Button';

interface NavbarProps {
    onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
    const { user } = useAuthStore();

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-white/70 px-4 backdrop-blur-md lg:px-8">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden"
                    onClick={onMenuClick}
                >
                    <Menu className="h-5 w-5" />
                </Button>
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="h-9 w-64 rounded-lg border border-border bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-5 w-5 text-slate-600" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 border-2 border-white"></span>
                </Button>

                <div className="h-8 w-[1px] bg-border mx-2"></div>

                <div className="flex items-center gap-3 pl-2">
                    <div className="hidden text-right lg:block">
                        <p className="text-sm font-semibold text-slate-900">{user?.fullName}</p>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Administrator</p>
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
                        {user?.fullName?.charAt(0).toUpperCase() || <User className="h-5 w-5" />}
                    </div>
                </div>
            </div>
        </header>
    );
}
