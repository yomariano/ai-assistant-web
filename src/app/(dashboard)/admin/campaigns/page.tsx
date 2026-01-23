'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Zap,
  FileText,
  Play,
  Pause,
  Send,
  Users,
  BarChart3,
  RefreshCw,
  Plus,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { adminApi, type AutomatedTrigger, type EmailCampaign, type EmailTemplate } from '@/lib/api';

type TabType = 'triggers' | 'campaigns' | 'templates';

export default function AdminCampaignsPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('triggers');
  const [isLoading, setIsLoading] = useState(true);

  // Data states
  const [triggers, setTriggers] = useState<AutomatedTrigger[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);

  // Action states
  const [runningTrigger, setRunningTrigger] = useState<string | null>(null);
  const [togglingTrigger, setTogglingTrigger] = useState<string | null>(null);
  const [runningAllTriggers, setRunningAllTriggers] = useState(false);

  useEffect(() => {
    checkAdminAndFetchData();
  }, []);

  async function checkAdminAndFetchData() {
    try {
      const { isAdmin: adminStatus } = await adminApi.checkStatus();
      setIsAdmin(adminStatus);

      if (adminStatus) {
        await fetchAllData();
      }
    } catch (error) {
      console.error('Failed to check admin status:', error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchAllData() {
    try {
      const [triggersRes, campaignsRes, templatesRes] = await Promise.all([
        adminApi.getTriggers(),
        adminApi.getCampaigns(),
        adminApi.getTemplates(),
      ]);
      setTriggers(triggersRes.triggers || []);
      setCampaigns(campaignsRes.campaigns || []);
      setTemplates(templatesRes.templates || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  }

  async function handleToggleTrigger(triggerId: string, currentActive: boolean) {
    setTogglingTrigger(triggerId);
    try {
      await adminApi.toggleTrigger(triggerId, !currentActive);
      setTriggers(prev =>
        prev.map(t => (t.id === triggerId ? { ...t, is_active: !currentActive } : t))
      );
    } catch (error) {
      console.error('Failed to toggle trigger:', error);
    } finally {
      setTogglingTrigger(null);
    }
  }

  async function handleRunTrigger(triggerId: string) {
    setRunningTrigger(triggerId);
    try {
      const result = await adminApi.runSingleTrigger(triggerId);
      alert(`Trigger executed: ${JSON.stringify(result.results)}`);
    } catch (error) {
      console.error('Failed to run trigger:', error);
      alert('Failed to run trigger');
    } finally {
      setRunningTrigger(null);
    }
  }

  async function handleRunAllTriggers() {
    setRunningAllTriggers(true);
    try {
      const result = await adminApi.runTriggers();
      alert(`All triggers executed: Sent ${result.results.sent}, Skipped ${result.results.skipped}, Errors ${result.results.errors}`);
    } catch (error) {
      console.error('Failed to run triggers:', error);
      alert('Failed to run triggers');
    } finally {
      setRunningAllTriggers(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <Card className="border-none shadow-md ring-1 ring-slate-200">
          <CardContent className="py-12 text-center">
            <div className="p-4 bg-rose-50 rounded-full inline-block mb-4">
              <AlertCircle className="w-8 h-8 text-rose-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Admin Access Required</h3>
            <p className="text-slate-500 mb-6">
              You don&apos;t have permission to access the admin panel.
            </p>
            <Button onClick={() => router.push('/dashboard')}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Email Campaigns
          </h1>
          <p className="text-slate-500 mt-2">
            Manage automated triggers and marketing campaigns.
          </p>
        </div>
        <Button onClick={fetchAllData} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-8">
          {[
            { id: 'triggers', label: 'Automated Triggers', icon: Zap, count: triggers.filter(t => t.is_active).length },
            { id: 'campaigns', label: 'Campaigns', icon: Mail, count: campaigns.length },
            { id: 'templates', label: 'Templates', icon: FileText, count: templates.length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
              <span className={`px-2 py-0.5 text-xs rounded-full ${
                activeTab === tab.id
                  ? 'bg-primary/10 text-primary'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'triggers' && (
        <TriggersTab
          triggers={triggers}
          runningTrigger={runningTrigger}
          togglingTrigger={togglingTrigger}
          runningAllTriggers={runningAllTriggers}
          onToggle={handleToggleTrigger}
          onRun={handleRunTrigger}
          onRunAll={handleRunAllTriggers}
        />
      )}

      {activeTab === 'campaigns' && (
        <CampaignsTab campaigns={campaigns} onRefresh={fetchAllData} />
      )}

      {activeTab === 'templates' && (
        <TemplatesTab templates={templates} />
      )}
    </div>
  );
}

// ============================================
// Triggers Tab
// ============================================

interface TriggersTabProps {
  triggers: AutomatedTrigger[];
  runningTrigger: string | null;
  togglingTrigger: string | null;
  runningAllTriggers: boolean;
  onToggle: (id: string, currentActive: boolean) => void;
  onRun: (id: string) => void;
  onRunAll: () => void;
}

function TriggersTab({
  triggers,
  runningTrigger,
  togglingTrigger,
  runningAllTriggers,
  onToggle,
  onRun,
  onRunAll,
}: TriggersTabProps) {
  const triggerTypeColors: Record<string, string> = {
    usage: 'bg-blue-100 text-blue-700',
    inactivity: 'bg-amber-100 text-amber-700',
    abandoned_upgrade: 'bg-purple-100 text-purple-700',
    welcome_sequence: 'bg-emerald-100 text-emerald-700',
    social_proof: 'bg-pink-100 text-pink-700',
  };

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex justify-end">
        <Button onClick={onRunAll} isLoading={runningAllTriggers}>
          <Play className="w-4 h-4 mr-2" />
          Run All Triggers Now
        </Button>
      </div>

      {/* Triggers List */}
      <div className="grid gap-4">
        {triggers.map(trigger => (
          <Card key={trigger.id} className="border-none shadow-sm ring-1 ring-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Status indicator */}
                  <div className={`w-3 h-3 rounded-full ${trigger.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`} />

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{trigger.name}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${triggerTypeColors[trigger.trigger_type] || 'bg-slate-100 text-slate-600'}`}>
                        {trigger.trigger_type}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{trigger.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      {trigger.discount_code && (
                        <span>Code: <strong className="text-slate-600">{trigger.discount_code}</strong> ({trigger.discount_percent}% off)</span>
                      )}
                      {trigger.cooldown_days && (
                        <span>Cooldown: {trigger.cooldown_days} days</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRun(trigger.id)}
                    isLoading={runningTrigger === trigger.id}
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Run
                  </Button>
                  <Button
                    variant={trigger.is_active ? 'outline' : 'primary'}
                    size="sm"
                    onClick={() => onToggle(trigger.id, trigger.is_active)}
                    isLoading={togglingTrigger === trigger.id}
                  >
                    {trigger.is_active ? (
                      <>
                        <Pause className="w-3 h-3 mr-1" />
                        Disable
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 mr-1" />
                        Enable
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {triggers.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No triggers configured. Run the database migration to add default triggers.
        </div>
      )}
    </div>
  );
}

// ============================================
// Campaigns Tab
// ============================================

interface CampaignsTabProps {
  campaigns: EmailCampaign[];
  onRefresh: () => void;
}

function CampaignsTab({ campaigns, onRefresh }: CampaignsTabProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sendingCampaign, setSendingCampaign] = useState<string | null>(null);

  const statusColors: Record<string, { bg: string; text: string; icon: typeof CheckCircle }> = {
    draft: { bg: 'bg-slate-100', text: 'text-slate-600', icon: FileText },
    scheduled: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Clock },
    sending: { bg: 'bg-amber-100', text: 'text-amber-700', icon: RefreshCw },
    sent: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle },
    cancelled: { bg: 'bg-rose-100', text: 'text-rose-700', icon: AlertCircle },
  };

  async function handleSendCampaign(campaignId: string) {
    if (!confirm('Are you sure you want to send this campaign? This will email all recipients.')) {
      return;
    }

    setSendingCampaign(campaignId);
    try {
      const result = await adminApi.sendCampaign(campaignId);
      alert(`Campaign sent! ${result.results.sent} emails sent, ${result.results.failed} failed.`);
      onRefresh();
    } catch (error) {
      console.error('Failed to send campaign:', error);
      alert('Failed to send campaign');
    } finally {
      setSendingCampaign(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex justify-end">
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Campaigns List */}
      <div className="grid gap-4">
        {campaigns.map(campaign => {
          const status = statusColors[campaign.status] || statusColors.draft;
          const StatusIcon = status.icon;

          return (
            <Card key={campaign.id} className="border-none shadow-sm ring-1 ring-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{campaign.name}</h3>
                      <span className={`flex items-center gap-1 px-2 py-0.5 text-xs rounded-full ${status.bg} ${status.text}`}>
                        <StatusIcon className="w-3 h-3" />
                        {campaign.status}
                      </span>
                    </div>
                    {campaign.description && (
                      <p className="text-sm text-slate-500 mt-1">{campaign.description}</p>
                    )}
                    <div className="flex items-center gap-6 mt-3 text-sm">
                      <div className="flex items-center gap-1 text-slate-500">
                        <Users className="w-4 h-4" />
                        <span>{campaign.total_recipients || 0} recipients</span>
                      </div>
                      {campaign.status === 'sent' && (
                        <>
                          <div className="flex items-center gap-1 text-emerald-600">
                            <Send className="w-4 h-4" />
                            <span>{campaign.emails_sent} sent</span>
                          </div>
                          <div className="flex items-center gap-1 text-blue-600">
                            <BarChart3 className="w-4 h-4" />
                            <span>{campaign.emails_opened} opened</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {campaign.status === 'draft' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleSendCampaign(campaign.id)}
                        isLoading={sendingCampaign === campaign.id}
                      >
                        <Send className="w-3 h-3 mr-1" />
                        Send
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {campaigns.length === 0 && (
        <div className="text-center py-12">
          <div className="p-4 bg-slate-50 rounded-full inline-block mb-4">
            <Mail className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No campaigns yet</h3>
          <p className="text-slate-500 mb-4">Create your first email campaign to get started.</p>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      )}

      {/* Create Campaign Modal - placeholder */}
      {showCreateModal && (
        <CreateCampaignModal
          onClose={() => setShowCreateModal(false)}
          onCreated={onRefresh}
        />
      )}
    </div>
  );
}

// ============================================
// Templates Tab
// ============================================

interface TemplatesTabProps {
  templates: EmailTemplate[];
}

function TemplatesTab({ templates }: TemplatesTabProps) {
  const categoryColors: Record<string, string> = {
    usage: 'bg-blue-100 text-blue-700',
    reactivation: 'bg-amber-100 text-amber-700',
    marketing: 'bg-purple-100 text-purple-700',
    welcome: 'bg-emerald-100 text-emerald-700',
    transactional: 'bg-slate-100 text-slate-600',
  };

  return (
    <div className="space-y-6">
      {/* Templates Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {templates.map(template => (
          <Card key={template.id} className="border-none shadow-sm ring-1 ring-slate-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{template.name}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${categoryColors[template.category] || 'bg-slate-100 text-slate-600'}`}>
                      {template.category}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1 line-clamp-1">
                    {template.subject}
                  </p>
                  {template.variables && template.variables.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(template.variables as unknown as string[]).slice(0, 4).map((v: string) => (
                        <span key={v} className="px-1.5 py-0.5 text-xs bg-slate-100 text-slate-500 rounded font-mono">
                          {`{{${v}}}`}
                        </span>
                      ))}
                      {(template.variables as unknown as string[]).length > 4 && (
                        <span className="text-xs text-slate-400">+{(template.variables as unknown as string[]).length - 4} more</span>
                      )}
                    </div>
                  )}
                </div>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No templates found. Run the database migration to add default templates.
        </div>
      )}
    </div>
  );
}

// ============================================
// Create Campaign Modal
// ============================================

interface CreateCampaignModalProps {
  onClose: () => void;
  onCreated: () => void;
}

function CreateCampaignModal({ onClose, onCreated }: CreateCampaignModalProps) {
  const [name, setName] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [subjectOverride, setSubjectOverride] = useState('');
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [activeOnly, setActiveOnly] = useState(true);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [previewCount, setPreviewCount] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    adminApi.getTemplates().then(res => setTemplates(res.templates || []));
  }, []);

  async function handlePreview() {
    const segment: Record<string, unknown> = {};
    if (selectedPlans.length > 0) segment.plan = selectedPlans;
    if (activeOnly) segment.active = true;

    try {
      const result = await adminApi.previewSegment(segment);
      setPreviewCount(result.count);
    } catch {
      setPreviewCount(0);
    }
  }

  async function handleCreate() {
    if (!name || !templateId) {
      alert('Name and template are required');
      return;
    }

    setIsCreating(true);
    try {
      const segment: Record<string, unknown> = {};
      if (selectedPlans.length > 0) segment.plan = selectedPlans;
      if (activeOnly) segment.active = true;

      await adminApi.createCampaign({
        name,
        templateId,
        subjectOverride: subjectOverride || undefined,
        segmentJson: segment,
      });

      onCreated();
      onClose();
    } catch (error) {
      console.error('Failed to create campaign:', error);
      alert('Failed to create campaign');
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Create Campaign</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Campaign Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., New Feature Announcement"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Template</label>
            <select
              value={templateId}
              onChange={e => setTemplateId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select a template...</option>
              {templates.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Subject Override (optional)</label>
            <input
              type="text"
              value={subjectOverride}
              onChange={e => setSubjectOverride(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Leave empty to use template subject"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Target Plans</label>
            <div className="flex gap-2">
              {['starter', 'growth', 'scale'].map(plan => (
                <label key={plan} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedPlans.includes(plan)}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedPlans([...selectedPlans, plan]);
                      } else {
                        setSelectedPlans(selectedPlans.filter(p => p !== plan));
                      }
                    }}
                    className="rounded border-slate-300"
                  />
                  <span className="text-sm text-slate-600 capitalize">{plan}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={activeOnly}
                onChange={e => setActiveOnly(e.target.checked)}
                className="rounded border-slate-300"
              />
              <span className="text-sm text-slate-600">Active users only (had calls in last 7 days)</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handlePreview}>
              <Users className="w-4 h-4 mr-1" />
              Preview Recipients
            </Button>
            {previewCount !== null && (
              <span className="text-sm text-slate-600">{previewCount} users match</span>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-200">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleCreate} isLoading={isCreating}>
            Create Campaign
          </Button>
        </div>
      </div>
    </div>
  );
}
