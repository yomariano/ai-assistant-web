'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, ExternalLink, Phone, TrendingUp, AlertCircle, Euro } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { billingApi } from '@/lib/api';

interface UsageData {
  callsMade: number;
  totalChargesCents: number;
  totalChargesFormatted: string;
  perCallRateCents: number;
  perCallRateFormatted: string;
  fairUseCap: number | null;
  callsRemaining: number | null;
  isUnlimited: boolean;
  periodStart: string;
  periodEnd: string;
}

interface SubscriptionData {
  plan_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export default function BillingPage() {
  const router = useRouter();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [subRes, usageRes] = await Promise.all([
        billingApi.getSubscription(),
        billingApi.getUsage()
      ]);

      // API returns subscription data directly with status field
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const subData = subRes as any;
      if (subData.status && subData.status !== 'none') {
        setSubscription(subData);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setUsage(usageRes as any);
    } catch (err) {
      console.error('Failed to fetch billing data:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleManageSubscription = async () => {
    setIsRedirecting(true);
    try {
      const { url } = await billingApi.createPortalSession();
      window.location.href = url;
    } catch (err) {
      console.error('Failed to create portal session:', err);
      setIsRedirecting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const planDetails: Record<string, { name: string; price: string; perCall: string; color: string }> = {
    starter: { name: 'Lite', price: '€19/mo', perCall: '+ €0.95/call', color: 'bg-slate-100 text-slate-700' },
    growth: { name: 'Growth', price: '€99/mo', perCall: '+ €0.45/call', color: 'bg-indigo-100 text-indigo-700' },
    scale: { name: 'Pro', price: '€249/mo', perCall: '1500 calls included', color: 'bg-violet-100 text-violet-700' }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Billing & Usage</h1>
        <p className="text-slate-500 mt-2">Manage your subscription and monitor usage.</p>
      </div>

      {/* Subscription Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <h2 className="text-lg font-bold text-slate-900">Current Plan</h2>
          <p className="text-sm text-slate-500 mt-1">
            Your active subscription details.
          </p>
        </div>

        <div className="lg:col-span-2">
          {subscription ? (
            <Card className="border-none shadow-md ring-1 ring-slate-200 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${planDetails[subscription.plan_id]?.color || 'bg-slate-100'}`}>
                        {planDetails[subscription.plan_id]?.name || subscription.plan_id}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        subscription.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                        subscription.status === 'trialing' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {subscription.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">
                        {planDetails[subscription.plan_id]?.price || 'Custom'}
                      </p>
                      <p className="text-sm text-slate-500">
                        {planDetails[subscription.plan_id]?.perCall}
                      </p>
                    </div>
                    <p className="text-sm text-slate-500">
                      {subscription.cancel_at_period_end
                        ? `Cancels on ${formatDate(subscription.current_period_end)}`
                        : `Renews on ${formatDate(subscription.current_period_end)}`
                      }
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleManageSubscription}
                    isLoading={isRedirecting}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Manage Subscription
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                {subscription.cancel_at_period_end && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-800">Subscription ending</p>
                      <p className="text-sm text-amber-700">
                        Your subscription will end on {formatDate(subscription.current_period_end)}.
                        You can reactivate anytime before then.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-none shadow-md ring-1 ring-slate-200 overflow-hidden">
              <CardContent className="py-12 text-center">
                <div className="p-4 bg-slate-50 rounded-full inline-block mb-4">
                  <CreditCard className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">No Active Subscription</h3>
                <p className="text-slate-500 mb-6">
                  Choose a plan to get started with your AI assistant.
                </p>
                <Button onClick={() => router.push('/dashboard?paywall=1')}>
                  Choose a Plan
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Usage */}
      {usage && subscription && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <h2 className="text-lg font-bold text-slate-900">Usage This Period</h2>
            <p className="text-sm text-slate-500 mt-1">
              Track your calls and charges.
            </p>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {/* Usage Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="border-none shadow-sm ring-1 ring-slate-200">
                <CardContent className="pt-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Calls Made</p>
                      <p className="text-xl font-bold text-slate-900">
                        {usage.callsMade}
                        {usage.fairUseCap && <span className="text-sm font-normal text-slate-500"> / {usage.fairUseCap}</span>}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm ring-1 ring-slate-200">
                <CardContent className="pt-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                      <Euro className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Call Charges</p>
                      <p className="text-xl font-bold text-slate-900">{usage.totalChargesFormatted}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm ring-1 ring-slate-200">
                <CardContent className="pt-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Per Call Rate</p>
                      <p className="text-xl font-bold text-slate-900">{usage.perCallRateFormatted}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Usage Bar - only show for plans with fair use cap */}
            {usage.fairUseCap && (
              <Card className="border-none shadow-sm ring-1 ring-slate-200">
                <CardContent className="p-6">
                  {(() => {
                    const percentUsed = (usage.callsMade / usage.fairUseCap) * 100;
                    return (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700">Fair Use Cap</span>
                          <span className="text-sm font-bold text-slate-900">{percentUsed.toFixed(0)}%</span>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              percentUsed >= 100 ? 'bg-rose-500' :
                              percentUsed >= 80 ? 'bg-amber-500' :
                              'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(percentUsed, 100)}%` }}
                          />
                        </div>
                        {percentUsed >= 80 && percentUsed < 100 && (
                          <p className="text-xs text-amber-600 mt-2">
                            Approaching your fair use cap of {usage.fairUseCap} calls.
                          </p>
                        )}
                        {percentUsed >= 100 && (
                          <p className="text-xs text-rose-600 mt-2">
                            You&apos;ve reached your fair use cap. Please contact support to continue.
                          </p>
                        )}
                      </>
                    );
                  })()}
                </CardContent>
              </Card>
            )}

            {/* Pay-per-call info for plans without cap */}
            {!usage.fairUseCap && usage.perCallRateCents > 0 && (
              <Card className="border-none shadow-sm ring-1 ring-slate-200">
                <CardContent className="p-6">
                  <p className="text-sm text-slate-600">
                    You&apos;re on a pay-per-call plan. Each call costs {usage.perCallRateFormatted}.
                    Call charges are added to your monthly invoice.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
