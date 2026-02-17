'use client';

import { useState } from 'react';
import { X, Key, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/button';
import { providersApi } from '@/lib/api';
import type { BookingProvider } from '@/types';

interface ConnectProviderModalProps {
  provider: BookingProvider;
  onClose: () => void;
  onSuccess: () => void;
}

export function ConnectProviderModal({ provider, onClose, onSuccess }: ConnectProviderModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [companyLogin, setCompanyLogin] = useState('');
  const [serverDomain, setServerDomain] = useState('simplybook.me');
  const [restaurantId, setRestaurantId] = useState('');
  const [siteId, setSiteId] = useState('');
  const [clinikoRegion, setClinikoRegion] = useState('eu1');
  const [pabauCompanyId, setPabauCompanyId] = useState('');
  const [nookalLocationId, setNookalLocationId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  const isOAuth = provider.authType === 'oauth2';

  const handleApiKeyConnect = async () => {
    if (!apiKey) {
      setError('API key is required');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      // Build config based on provider
      const config: Record<string, unknown> = {};

      if (provider.id === 'simplybook') {
        if (companyLogin) config.companyLogin = companyLogin;
        if (serverDomain) config.serverDomain = serverDomain;
      }
      if (provider.id === 'thefork' && restaurantId) {
        config.restaurantId = restaurantId;
      }
      if (provider.id === 'meitre' && restaurantId) {
        config.restaurantId = restaurantId;
      }
      if (provider.id === 'mindbody' && siteId) {
        config.siteId = siteId;
      }
      if (provider.id === 'cliniko') {
        config.region = clinikoRegion;
      }
      if (provider.id === 'nookal' && nookalLocationId) {
        config.locationID = nookalLocationId;
      }
      if (provider.id === 'pabau') {
        if (!pabauCompanyId) {
          setError('Company ID is required for Pabau');
          setIsConnecting(false);
          return;
        }
        config.companyId = pabauCompanyId;
      }

      await providersApi.createConnection({
        providerId: provider.id,
        apiKey,
        apiSecret: apiSecret || undefined,
        config: Object.keys(config).length > 0 ? config : undefined,
      });

      onSuccess();
    } catch (err: unknown) {
      console.error('Failed to connect:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to connect: ${errorMessage}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleOAuthConnect = async () => {
    setIsConnecting(true);
    setError('');

    try {
      const redirectUri = `${window.location.origin}/integrations/providers/oauth/callback`;
      const { url } = await providersApi.getOAuthUrl(provider.id, redirectUri);

      // Open OAuth flow in popup or redirect
      window.location.href = url;
    } catch (err: unknown) {
      console.error('Failed to start OAuth:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to start OAuth: ${errorMessage}`);
      setIsConnecting(false);
    }
  };

  // Provider-specific fields
  const renderProviderFields = () => {
    switch (provider.id) {
      case 'simplybook':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Server Region <span className="text-rose-500">*</span>
              </label>
              <select
                value={serverDomain}
                onChange={(e) => setServerDomain(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="simplybook.me">simplybook.me (US/Default)</option>
                <option value="simplybook.it">simplybook.it (Italy/EU)</option>
                <option value="simplybook.asia">simplybook.asia (Asia)</option>
              </select>
              <p className="mt-1 text-xs text-slate-500">
                Check Settings → Custom Features → API for your &quot;JSON RPC API Endpoint&quot;
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Company Login <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={companyLogin}
                onChange={(e) => setCompanyLogin(e.target.value)}
                placeholder="your-company-login"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <p className="mt-1 text-xs text-slate-500">
                Your SimplyBook company login (e.g., &quot;voicefleet&quot;)
              </p>
            </div>
          </div>
        );
      case 'thefork':
        return (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Restaurant ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={restaurantId}
              onChange={(e) => setRestaurantId(e.target.value)}
              placeholder="123456"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <p className="mt-1 text-xs text-slate-500">
              Your TheFork restaurant ID
            </p>
          </div>
        );
      case 'meitre':
        return (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Restaurant ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={restaurantId}
              onChange={(e) => setRestaurantId(e.target.value)}
              placeholder="your-restaurant-id"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <p className="mt-1 text-xs text-slate-500">
              Your Meitre restaurant ID (found in your Meitre dashboard settings)
            </p>
          </div>
        );
      case 'mindbody':
        return (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Site ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={siteId}
              onChange={(e) => setSiteId(e.target.value)}
              placeholder="-99"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <p className="mt-1 text-xs text-slate-500">
              Your Mindbody Site ID (found in your developer account)
            </p>
          </div>
        );
      case 'cliniko':
        return (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Region <span className="text-rose-500">*</span>
            </label>
            <select
              value={clinikoRegion}
              onChange={(e) => setClinikoRegion(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="eu1">EU (eu1)</option>
              <option value="au1">Australia (au1)</option>
              <option value="au2">Australia (au2)</option>
              <option value="au3">Australia (au3)</option>
              <option value="ca1">Canada (ca1)</option>
              <option value="uk1">United Kingdom (uk1)</option>
              <option value="us1">United States (us1)</option>
            </select>
            <p className="mt-1 text-xs text-slate-500">
              Select the region matching your Cliniko account
            </p>
          </div>
        );
      case 'nookal':
        return (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Location ID (optional)
            </label>
            <input
              type="text"
              value={nookalLocationId}
              onChange={(e) => setNookalLocationId(e.target.value)}
              placeholder="e.g., 1"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <p className="mt-1 text-xs text-slate-500">
              For multi-location clinics, enter your location ID
            </p>
          </div>
        );
      case 'pabau':
        return (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Company ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={pabauCompanyId}
              onChange={(e) => setPabauCompanyId(e.target.value)}
              placeholder="e.g., 12345"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <p className="mt-1 text-xs text-slate-500">
              Found in Settings &gt; API in your Pabau account
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Connect {provider.name}</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {isOAuth ? 'Sign in with your account' : 'Enter your API credentials'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Error */}
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 text-sm rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isOAuth ? (
            /* OAuth flow */
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="w-8 h-8 text-primary" />
              </div>
              <p className="text-slate-600 mb-6">
                Click the button below to sign in with your {provider.name} account.
                You&apos;ll be redirected back here after authorization.
              </p>
              <Button
                onClick={handleOAuthConnect}
                isLoading={isConnecting}
                className="w-full"
              >
                Connect with {provider.name}
              </Button>
            </div>
          ) : (
            /* API Key flow */
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  API Key <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key"
                    className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              {/* Optional API Secret for some providers */}
              {['square', 'simplybook'].includes(provider.id) && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Secret Key {provider.id === 'square' ? '(optional)' : '(optional - for REST API)'}
                  </label>
                  <input
                    type="password"
                    value={apiSecret}
                    onChange={(e) => setApiSecret(e.target.value)}
                    placeholder={provider.id === 'simplybook' ? 'Enter your secret key (if using REST API)' : 'Enter your API secret'}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              )}

              {/* Provider-specific fields */}
              {renderProviderFields()}

              {/* Help text */}
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-600">
                  <strong>Where to find your API key:</strong> Go to{' '}
                  <a
                    href={provider.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {provider.name} developer docs
                  </a>{' '}
                  and follow the instructions to generate an API key.
                </p>
              </div>

              <Button
                onClick={handleApiKeyConnect}
                isLoading={isConnecting}
                className="w-full"
              >
                Connect Provider
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 rounded-b-2xl border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">
            Your credentials are encrypted and stored securely.{' '}
            <a href="#" className="text-primary hover:underline">
              Learn more about security
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
