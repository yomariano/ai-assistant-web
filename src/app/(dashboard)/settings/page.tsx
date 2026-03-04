'use client';

import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { userApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setDateOfBirth(user.dateOfBirth || '');
      setAddress(user.address || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const updatedUser = await userApi.updateProfile({
        fullName,
        dateOfBirth: dateOfBirth || undefined,
        address: address || undefined,
      });
      setUser(updatedUser);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Account Settings</h1>
        <p className="text-slate-500 mt-2">Manage your profile, identity preferences, and security.</p>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <p className="text-sm font-semibold">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <h2 className="text-lg font-bold text-slate-900">Personal Identity</h2>
          <p className="text-sm text-slate-500 mt-1">
            This information is used by the AI to represent you accurately during calls.
          </p>
        </div>

        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card className="border-none shadow-md ring-1 ring-slate-200 overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 space-y-6">
                  <Input
                    label="Full Legal Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="bg-slate-50/50"
                  />

                  <Input
                    type="date"
                    label="Date of Birth"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="bg-slate-50/50"
                  />

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Primary Address
                    </label>
                    <textarea
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none min-h-[100px] text-sm bg-slate-50/50"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street, City, Country"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
                  <Button type="submit" isLoading={isLoading} className="shadow-lg shadow-primary/20">
                    <Save className="w-4 h-4 mr-2" />
                    Apply Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
        <div className="lg:col-span-1">
          <h2 className="text-lg font-bold text-slate-900">Security & Authentication</h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage your login credentials and account access.
          </p>
        </div>

        <div className="lg:col-span-2">
          <Card className="border-none shadow-sm ring-1 ring-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                  <p className="font-semibold text-slate-900">{user?.email}</p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Update Email
                </Button>
              </div>

              <div className="h-px bg-slate-100 my-6" />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</p>
                  <p className="text-sm text-slate-500">Last changed 3 months ago</p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Reset Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
