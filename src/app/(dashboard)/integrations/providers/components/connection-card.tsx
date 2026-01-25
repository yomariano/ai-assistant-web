'use client';

import { useState } from 'react';
import { Calendar, CalendarCheck, Square, BookOpen, UtensilsCrossed, Dumbbell, CheckCircle, XCircle, AlertCircle, Clock, RefreshCw, Trash2, Settings, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import type { ProviderConnection } from '@/types';
import { formatDistanceToNow } from 'date-fns';

const PROVIDER_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Calendar: Calendar,
  CalendarCheck: CalendarCheck,
  Square: Square,
  BookOpen: BookOpen,
  UtensilsCrossed: UtensilsCrossed,
  Dumbbell: Dumbbell,
};

const STATUS_CONFIG: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; bgColor: string; label: string }> = {
  connected: { icon: CheckCircle, color: 'text-emerald-600', bgColor: 'bg-emerald-100', label: 'Connected' },
  pending: { icon: Clock, color: 'text-amber-600', bgColor: 'bg-amber-100', label: 'Pending' },
  error: { icon: XCircle, color: 'text-rose-600', bgColor: 'bg-rose-100', label: 'Error' },
  expired: { icon: AlertCircle, color: 'text-orange-600', bgColor: 'bg-orange-100', label: 'Expired' },
  disconnected: { icon: XCircle, color: 'text-slate-500', bgColor: 'bg-slate-100', label: 'Disconnected' },
};

interface ConnectionCardProps {
  connection: ProviderConnection;
  onDisconnect: () => void;
  onTest: () => void;
  onSync: () => void;
  onSetPrimary?: () => void;
  hasMultipleConnections?: boolean;
}

export function ConnectionCard({ connection, onDisconnect, onTest, onSync, onSetPrimary, hasMultipleConnections }: ConnectionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSettingPrimary, setIsSettingPrimary] = useState(false);

  const IconComponent = connection.provider?.icon
    ? PROVIDER_ICONS[connection.provider.icon] || Calendar
    : Calendar;

  const statusConfig = STATUS_CONFIG[connection.status] || STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.icon;

  const handleTest = async () => {
    setIsTestingConnection(true);
    try {
      await onTest();
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await onSync();
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSetPrimary = async () => {
    if (!onSetPrimary) return;
    setIsSettingPrimary(true);
    try {
      await onSetPrimary();
    } finally {
      setIsSettingPrimary(false);
    }
  };

  return (
    <Card className="border-none shadow-md ring-1 ring-slate-200">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-slate-100 rounded-xl">
              <IconComponent className="w-6 h-6 text-slate-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900">{connection.provider?.name || connection.providerId}</h3>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${statusConfig.bgColor} ${statusConfig.color}`}>
                  <StatusIcon className="w-3 h-3" />
                  {statusConfig.label}
                </span>
                {connection.isPrimary && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                    <Star className="w-3 h-3 fill-current" />
                    Primary
                  </span>
                )}
              </div>
              {connection.externalAccountName && (
                <p className="text-sm text-slate-500 mt-0.5">{connection.externalAccountName}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {connection.status === 'connected' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSync}
                  isLoading={isSyncing}
                  className="text-slate-600"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Sync
                </Button>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleTest}
              isLoading={isTestingConnection}
              className="text-slate-600"
            >
              Test
            </Button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Error message */}
        {connection.errorMessage && (
          <div className="mt-3 p-3 bg-rose-50 text-rose-700 text-sm rounded-lg">
            {connection.errorMessage}
          </div>
        )}

        {/* Expanded details */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-slate-200 space-y-4">
            {/* Sync info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500">Sync Direction:</span>
                <span className="ml-2 font-medium text-slate-700 capitalize">{connection.syncDirection}</span>
              </div>
              <div>
                <span className="text-slate-500">Sync Enabled:</span>
                <span className="ml-2 font-medium text-slate-700">{connection.syncEnabled ? 'Yes' : 'No'}</span>
              </div>
              {connection.lastSyncAt && (
                <div>
                  <span className="text-slate-500">Last Sync:</span>
                  <span className="ml-2 font-medium text-slate-700">
                    {formatDistanceToNow(new Date(connection.lastSyncAt), { addSuffix: true })}
                  </span>
                </div>
              )}
              {connection.connectedAt && (
                <div>
                  <span className="text-slate-500">Connected:</span>
                  <span className="ml-2 font-medium text-slate-700">
                    {formatDistanceToNow(new Date(connection.connectedAt), { addSuffix: true })}
                  </span>
                </div>
              )}
            </div>

            {/* Last sync error */}
            {connection.lastSyncError && (
              <div className="p-3 bg-amber-50 text-amber-700 text-sm rounded-lg">
                <strong>Last sync error:</strong> {connection.lastSyncError}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                {connection.status === 'connected' && hasMultipleConnections && !connection.isPrimary && onSetPrimary && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSetPrimary}
                    isLoading={isSettingPrimary}
                    className="text-primary hover:bg-primary/5 hover:border-primary/30"
                  >
                    <Star className="w-4 h-4 mr-1" />
                    Set as Primary
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {}}
                  className="text-slate-600"
                >
                  <Settings className="w-4 h-4 mr-1" />
                  Configure
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onDisconnect}
                className="text-rose-600 hover:bg-rose-50 hover:border-rose-200"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Disconnect
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
