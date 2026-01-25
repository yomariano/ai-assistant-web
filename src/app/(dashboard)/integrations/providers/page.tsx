'use client';

import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, Plus, RefreshCw, ExternalLink, Trash2, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { providersApi } from '@/lib/api';
import type { BookingProvider, ProviderConnection } from '@/types';
import { ProviderCard } from './components/provider-card';
import { ConnectProviderModal } from './components/connect-provider-modal';
import { ConnectionCard } from './components/connection-card';

export default function ProvidersPage() {
  const [providers, setProviders] = useState<BookingProvider[]>([]);
  const [connections, setConnections] = useState<ProviderConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal state
  const [selectedProvider, setSelectedProvider] = useState<BookingProvider | null>(null);
  const [showConnectModal, setShowConnectModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setIsLoading(true);
      const [providersRes, connectionsRes] = await Promise.all([
        providersApi.getProviders(),
        providersApi.getConnections(),
      ]);

      setProviders(providersRes.providers || []);
      setConnections(connectionsRes.connections || []);
    } catch (err) {
      console.error('Failed to fetch providers data:', err);
      setError('Failed to load providers');
    } finally {
      setIsLoading(false);
    }
  }

  const handleConnect = useCallback((provider: BookingProvider) => {
    setSelectedProvider(provider);
    setShowConnectModal(true);
  }, []);

  const handleConnectionCreated = useCallback(async () => {
    setShowConnectModal(false);
    setSelectedProvider(null);
    setSuccess('Provider connected successfully!');
    await fetchData();
  }, []);

  const handleDisconnect = useCallback(async (connectionId: string) => {
    try {
      await providersApi.deleteConnection(connectionId);
      setSuccess('Provider disconnected successfully');
      await fetchData();
    } catch (err) {
      console.error('Failed to disconnect:', err);
      setError('Failed to disconnect provider');
    }
  }, []);

  const handleTestConnection = useCallback(async (connectionId: string) => {
    try {
      const result = await providersApi.testConnection(connectionId);
      if (result.success) {
        setSuccess('Connection test successful!');
      } else {
        setError(`Connection test failed: ${result.error}`);
      }
      await fetchData();
    } catch (err) {
      console.error('Failed to test connection:', err);
      setError('Failed to test connection');
    }
  }, []);

  const handleSync = useCallback(async (connectionId: string) => {
    try {
      const result = await providersApi.syncBookings(connectionId);
      setSuccess(`Synced ${result.count} bookings from provider`);
    } catch (err) {
      console.error('Failed to sync:', err);
      setError('Failed to sync bookings');
    }
  }, []);

  const handleSetPrimary = useCallback(async (connectionId: string) => {
    try {
      await providersApi.setPrimary(connectionId);
      setSuccess('Primary provider updated! The AI assistant will now use this provider for bookings.');
      await fetchData();
    } catch (err) {
      console.error('Failed to set primary:', err);
      setError('Failed to set primary provider');
    }
  }, []);

  // Get connected provider IDs
  const connectedProviderIds = new Set(connections.map(c => c.providerId));

  // Separate connected and available providers
  const availableProviders = providers.filter(p => !connectedProviderIds.has(p.id));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/integrations" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Booking Providers</h1>
          <p className="text-slate-500 mt-1">Connect your existing booking systems to sync reservations and availability.</p>
        </div>
      </div>

      {/* Alerts */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="h-5 w-5 text-emerald-500" />
          <p className="text-sm font-semibold">{success}</p>
          <button onClick={() => setSuccess('')} className="ml-auto text-emerald-500 hover:text-emerald-700">
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="h-5 w-5 text-rose-500" />
          <p className="text-sm font-semibold">{error}</p>
          <button onClick={() => setError('')} className="ml-auto text-rose-500 hover:text-rose-700">
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Connected Providers */}
      {connections.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Connected Providers</h2>
            {connections.filter(c => c.status === 'connected').length > 1 && (
              <p className="text-sm text-slate-500">
                The primary provider is used by the AI assistant for bookings
              </p>
            )}
          </div>
          <div className="space-y-4">
            {connections.map(connection => (
              <ConnectionCard
                key={connection.id}
                connection={connection}
                onDisconnect={() => handleDisconnect(connection.id)}
                onTest={() => handleTestConnection(connection.id)}
                onSync={() => handleSync(connection.id)}
                onSetPrimary={() => handleSetPrimary(connection.id)}
                hasMultipleConnections={connections.filter(c => c.status === 'connected').length > 1}
              />
            ))}
          </div>
        </section>
      )}

      {/* Available Providers */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          {connections.length > 0 ? 'Add More Providers' : 'Available Providers'}
        </h2>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'general', 'restaurant', 'fitness', 'salon'].map(category => (
            <button
              key={category}
              className="px-3 py-1.5 text-sm font-medium rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors capitalize"
            >
              {category === 'all' ? 'All' : category}
            </button>
          ))}
        </div>

        {/* Provider Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {availableProviders.map(provider => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              onConnect={() => handleConnect(provider)}
            />
          ))}
        </div>

        {availableProviders.length === 0 && (
          <Card className="border-none shadow-md ring-1 ring-slate-200">
            <CardContent className="py-12 text-center">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">All providers connected!</h3>
              <p className="text-slate-500">You&apos;ve connected all available booking providers.</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Connect Modal */}
      {showConnectModal && selectedProvider && (
        <ConnectProviderModal
          provider={selectedProvider}
          onClose={() => {
            setShowConnectModal(false);
            setSelectedProvider(null);
          }}
          onSuccess={handleConnectionCreated}
        />
      )}
    </div>
  );
}
