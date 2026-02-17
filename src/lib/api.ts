import axios from 'axios';
import type { User, SavedCall, ScheduledCall, CallHistory, UserStats, CallRequest, AssistantResponse, Voice, PhoneNumber, NotificationPreferences, EscalationSettings, TestConfig, IndustryTemplate, BookingConfig, Customer, Booking, BookingField, BookingProvider, ProviderConnection, ProviderEventType, ProviderTimeSlot, ProviderSyncLog } from '@/types';
import { getSession } from './supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Endpoints that don't require authentication
const PUBLIC_ENDPOINTS = [
  '/api/auth/config',
  '/api/auth/dev-login',
  '/api/auth/dev-users',
];

// Request interceptor to add auth token
api.interceptors.request.use(async (config) => {
  // Skip auth for public endpoints
  const isPublicEndpoint = PUBLIC_ENDPOINTS.some(endpoint => config.url?.includes(endpoint));
  if (isPublicEndpoint) {
    return config;
  }

  // Check for dev mode first
  const storedAuth = localStorage.getItem('auth-storage');
  if (storedAuth) {
    const { state } = JSON.parse(storedAuth);
    if (state?.devMode && state?.token === 'dev-mode') {
      return config;
    }
  }

  // Try to get auth token - prefer stored token, fallback to Supabase session
  try {
    // If the request already has an Authorization header (e.g. authApi.me(token)),
    // don't call getSession (avoids extra timeouts and work).
    const existingAuthHeader =
      (config.headers as Record<string, unknown> | undefined)?.Authorization ??
      (config.headers as Record<string, unknown> | undefined)?.authorization;
    if (existingAuthHeader) {
      return config;
    }

    // First, try to get token from auth store (faster, no async)
    const storedAuth = localStorage.getItem('auth-storage');
    if (storedAuth) {
      try {
        const { state } = JSON.parse(storedAuth);
        // Note: `isAuthenticated` is not persisted in `auth-storage` (token is enough),
        // so don't depend on it here or we'll skip using a valid stored token and
        // fall back to Supabase `getSession()` (which can intermittently time out).
        if (state?.token && state.token !== 'dev-mode') {
          config.headers.Authorization = `Bearer ${state.token}`;
          return config;
        }
      } catch {
        // Ignore parse errors
      }
    }

    // Fallback: get fresh session from Supabase
    const session = await getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch {
    // Session retrieval failed — continue without auth
  }

  return config;
});

// Endpoints where 401 should NOT trigger a redirect (they handle errors gracefully)
const SILENT_401_ENDPOINTS = [
  '/api/admin/status',
  '/api/auth/me',
];

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect for endpoints that handle 401 gracefully
      const isSilent401 = SILENT_401_ENDPOINTS.some(ep => error.config?.url?.includes(ep));
      if (isSilent401) {
        return Promise.reject(error);
      }

      // Check if in dev mode before redirecting
      const storedAuth = localStorage.getItem('auth-storage');
      if (storedAuth) {
        const { state } = JSON.parse(storedAuth);
        if (state?.devMode) {
          return Promise.reject(error);
        }
      }

      // Prevent redirect loop: check if we've redirected recently
      const lastRedirect = sessionStorage.getItem('auth-redirect-time');
      const now = Date.now();
      if (lastRedirect && now - parseInt(lastRedirect) < 5000) {
        return Promise.reject(error);
      }

      // Don't redirect if already on login page
      if (window.location.pathname === '/login') {
        return Promise.reject(error);
      }

      sessionStorage.setItem('auth-redirect-time', now.toString());
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authApi = {
  getConfig: async (): Promise<{ devMode: boolean; supabaseUrl?: string; supabaseAnonKey?: string }> => {
    const { data } = await api.get('/api/auth/config');
    return data;
  },

  devLogin: async (): Promise<{ user: User; devMode: boolean }> => {
    const { data } = await api.get('/api/auth/dev-login');
    return data;
  },

  me: async (token?: string): Promise<{ user: User }> => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const { data } = await api.get('/api/auth/me', config);
    return data;
  },
};

// Onboarding types
export interface OnboardingProgress {
  currentStep: number;
  stepsCompleted: string[];
  callForwardingProvider?: string;
  testCallMade: boolean;
  startedAt?: string;
  completedAt?: string;
}

export interface OnboardingStatus {
  completed: boolean;
  completedAt?: string;
  progress: OnboardingProgress;
}

// User
export const userApi = {
  getProfile: async (): Promise<User> => {
    const { data } = await api.get('/api/users/profile');
    return data;
  },

  updateProfile: async (profile: Partial<User>): Promise<User> => {
    const { data } = await api.put('/api/users/profile', profile);
    return data;
  },

  getStats: async (): Promise<UserStats> => {
    const { data } = await api.get('/api/users/stats');
    return data;
  },

  // Onboarding
  getOnboarding: async (): Promise<OnboardingStatus> => {
    const { data } = await api.get('/api/users/onboarding');
    return data;
  },

  updateOnboarding: async (updates: Partial<OnboardingProgress>): Promise<OnboardingProgress> => {
    const { data } = await api.patch('/api/users/onboarding', updates);
    return data;
  },

  completeOnboarding: async (): Promise<{ completed: boolean; completedAt: string; message: string }> => {
    const { data } = await api.post('/api/users/onboarding/complete');
    return data;
  },
};

// Calls
export const callsApi = {
  create: async (call: CallRequest): Promise<{ id: string; vapiCallId: string; status: string }> => {
    const { data } = await api.post('/api/calls', call);
    return data;
  },

  getStatus: async (id: string): Promise<{ id: string; status: string; duration?: number }> => {
    const { data } = await api.get(`/api/calls/${id}/status`);
    return data;
  },
};

// Saved Calls
export const savedCallsApi = {
  list: async (): Promise<SavedCall[]> => {
    const { data } = await api.get('/api/saved-calls');
    return data;
  },

  get: async (id: string): Promise<SavedCall> => {
    const { data } = await api.get(`/api/saved-calls/${id}`);
    return data;
  },

  create: async (call: Omit<SavedCall, 'id' | 'createdAt' | 'lastUsedAt' | 'usageCount'>): Promise<SavedCall> => {
    const { data } = await api.post('/api/saved-calls', call);
    return data;
  },

  update: async (id: string, call: Partial<SavedCall>): Promise<SavedCall> => {
    const { data } = await api.put(`/api/saved-calls/${id}`, call);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/saved-calls/${id}`);
  },

  markAsUsed: async (id: string): Promise<void> => {
    await api.post(`/api/saved-calls/${id}/use`);
  },
};

// Scheduled Calls
export const scheduledCallsApi = {
  list: async (status?: string): Promise<ScheduledCall[]> => {
    const { data } = await api.get('/api/scheduled-calls', { params: { status } });
    return data;
  },

  get: async (id: string): Promise<ScheduledCall> => {
    const { data } = await api.get(`/api/scheduled-calls/${id}`);
    return data;
  },

  create: async (call: Omit<ScheduledCall, 'id' | 'status' | 'createdAt'>): Promise<ScheduledCall> => {
    const { data } = await api.post('/api/scheduled-calls', call);
    return data;
  },

  update: async (id: string, call: Partial<ScheduledCall>): Promise<ScheduledCall> => {
    const { data } = await api.put(`/api/scheduled-calls/${id}`, call);
    return data;
  },

  cancel: async (id: string): Promise<void> => {
    await api.delete(`/api/scheduled-calls/${id}`);
  },
};

// History
export const historyApi = {
  list: async (limit?: number, offset?: number): Promise<CallHistory[]> => {
    const { data } = await api.get('/api/history', { params: { limit, offset } });
    return data;
  },

  get: async (id: string): Promise<CallHistory> => {
    const { data } = await api.get(`/api/history/${id}`);
    return data;
  },
};

// Assistant
export const assistantApi = {
  get: async (): Promise<AssistantResponse> => {
    const { data } = await api.get('/api/assistant');
    return data;
  },

  update: async (updates: {
    name?: string;
    firstMessage?: string;
    systemPrompt?: string;
    voiceId?: string;
    voiceProvider?: string;
    businessName?: string;
    businessDescription?: string;
    greetingName?: string;
  }): Promise<{ success: boolean; assistant: AssistantResponse['assistant']; warning?: string }> => {
    const { data } = await api.patch('/api/assistant', updates);
    return data;
  },

  getVoices: async (): Promise<{ voices: Voice[]; currentVoice: { id: string; provider: string } | null; planId: string }> => {
    const { data } = await api.get('/api/assistant/voices');
    return data;
  },

  testGreeting: async (businessName?: string, greetingName?: string): Promise<{ greeting: string }> => {
    const { data } = await api.post('/api/assistant/test-greeting', { businessName, greetingName });
    return data;
  },

  regeneratePrompt: async (businessName: string, businessDescription: string, greetingName: string): Promise<{ systemPrompt: string }> => {
    const { data } = await api.post('/api/assistant/regenerate-prompt', { businessName, businessDescription, greetingName });
    return data;
  },

  getStats: async (): Promise<{ thisMonth: { calls: number; minutes: number }; limits: { minutesIncluded: number; maxMinutesPerCall: number } }> => {
    const { data } = await api.get('/api/assistant/stats');
    return data;
  },

  getTestConfig: async (): Promise<TestConfig> => {
    const { data } = await api.get('/api/assistant/test-config');
    return data;
  },
};

// Notifications
export const notificationsApi = {
  getPreferences: async (): Promise<{ preferences: NotificationPreferences }> => {
    const { data } = await api.get('/api/notifications/preferences');
    return data;
  },

  updatePreferences: async (updates: Partial<NotificationPreferences>): Promise<{ preferences: NotificationPreferences; message: string }> => {
    const { data } = await api.put('/api/notifications/preferences', updates);
    return data;
  },

  getEscalation: async (): Promise<{ settings: EscalationSettings }> => {
    const { data } = await api.get('/api/notifications/escalation');
    return data;
  },

  updateEscalation: async (updates: Partial<EscalationSettings>): Promise<{ settings: EscalationSettings; message: string }> => {
    const { data } = await api.put('/api/notifications/escalation', updates);
    return data;
  },

  sendTest: async (): Promise<{ success: boolean; message: string; messageId?: string }> => {
    const { data } = await api.post('/api/notifications/test', {});
    return data;
  },

  getHistory: async (params?: {
    limit?: number;
    offset?: number;
  }): Promise<{
    notifications: Array<{
      id: string;
      user_id: string;
      call_id: string | null;
      notification_type: 'email';
      event_type: 'call_complete' | 'message_taken' | 'escalation' | 'voicemail' | 'missed_call';
      recipient: string;
      subject?: string | null;
      content?: string | null;
      status: 'pending' | 'sent' | 'delivered' | 'failed';
      error_message?: string | null;
      sent_at?: string | null;
      delivered_at?: string | null;
      created_at: string;
    }>;
    total: number;
    limit: number;
    offset: number;
  }> => {
    const { data } = await api.get('/api/notifications/history', { params });
    return data;
  },
};

// Billing
export const billingApi = {
  getSubscription: async (): Promise<{ subscription: unknown; usage: unknown }> => {
    const { data } = await api.get('/api/billing/subscription');
    return data;
  },

  getUsage: async (): Promise<{ usage: unknown; limits: unknown; percentUsed: number }> => {
    const { data } = await api.get('/api/billing/usage');
    return data;
  },

  getPaymentLink: async (planId: string): Promise<{ url: string }> => {
    const { data } = await api.get(`/api/billing/payment-link/${planId}`);
    return data;
  },

  getPaymentLinks: async (): Promise<{ plans: Array<{ id: string; name: string; url: string }> }> => {
    const { data } = await api.get('/api/billing/payment-links');
    return data;
  },

  getPhoneNumbers: async (): Promise<{ numbers: PhoneNumber[]; count: number; maxAllowed: number; canAddMore: boolean }> => {
    const { data } = await api.get('/api/billing/phone-numbers');
    return data;
  },

  getProvisioningStatus: async (): Promise<{
    provisioning: unknown | null;
    numbers: Array<{ phone_number: string; status: string; created_at: string }>;
    reserved: { phone_number: string; reserved_until: string; region: string } | null;
    isComplete: boolean;
    hasFailed: boolean;
  }> => {
    const { data } = await api.get('/api/billing/provisioning-status');
    return data;
  },

  createPortalSession: async (): Promise<{ url: string }> => {
    const { data } = await api.post('/api/billing/portal');
    return data;
  },

  startTrial: async (planId: 'starter' | 'growth' | 'pro'): Promise<{
    message: string;
    subscription: unknown;
    trialEndsAt: string;
    trialCalls: number;
  }> => {
    const { data } = await api.post('/api/billing/start-trial', { planId });
    return data;
  },
};

// Integrations / Booking System
export const integrationsApi = {
  // Templates
  getTemplates: async (): Promise<{ templates: IndustryTemplate[] }> => {
    const { data } = await api.get('/api/integrations/templates');
    return data;
  },

  // Config
  getConfig: async (): Promise<{ exists: boolean; config?: BookingConfig }> => {
    const { data } = await api.get('/api/integrations/config');
    return data;
  },

  saveConfig: async (config: Partial<BookingConfig> & { industryTemplateId?: string; bookingFields?: BookingField[] }): Promise<{ success: boolean; config: BookingConfig }> => {
    const { data } = await api.post('/api/integrations/config', config);
    return data;
  },

  deleteConfig: async (): Promise<{ success: boolean }> => {
    const { data } = await api.delete('/api/integrations/config');
    return data;
  },

  // Customers
  listCustomers: async (params?: { search?: string; limit?: number; offset?: number }): Promise<{ customers: Customer[]; total: number }> => {
    const { data } = await api.get('/api/integrations/customers', { params });
    return data;
  },

  getCustomer: async (id: string): Promise<{ customer: Customer; bookings: Booking[] }> => {
    const { data } = await api.get(`/api/integrations/customers/${id}`);
    return data;
  },

  createCustomer: async (customer: Partial<Customer>): Promise<{ success: boolean; customer: Customer }> => {
    const { data } = await api.post('/api/integrations/customers', customer);
    return data;
  },

  updateCustomer: async (id: string, updates: Partial<Customer>): Promise<{ success: boolean; customer: Customer }> => {
    const { data } = await api.patch(`/api/integrations/customers/${id}`, updates);
    return data;
  },

  deleteCustomer: async (id: string): Promise<{ success: boolean }> => {
    const { data } = await api.delete(`/api/integrations/customers/${id}`);
    return data;
  },

  verifyCustomer: async (verificationData: Record<string, string>, requiredFields: string[]): Promise<{ verified: boolean; customer?: Customer; error?: string; mismatches?: string[] }> => {
    const { data } = await api.post('/api/integrations/customers/verify', { verificationData, requiredFields });
    return data;
  },

  // Bookings
  listBookings: async (params?: { status?: string; startDate?: string; endDate?: string; limit?: number; offset?: number }): Promise<{ bookings: Booking[]; total: number }> => {
    const { data } = await api.get('/api/integrations/bookings', { params });
    return data;
  },

  getBooking: async (id: string): Promise<{ booking: Booking }> => {
    const { data } = await api.get(`/api/integrations/bookings/${id}`);
    return data;
  },

  createBooking: async (booking: Partial<Booking>): Promise<{ success: boolean; booking: Booking }> => {
    const { data } = await api.post('/api/integrations/bookings', booking);
    return data;
  },

  updateBooking: async (id: string, updates: Partial<Booking>): Promise<{ success: boolean; booking: Booking }> => {
    const { data } = await api.patch(`/api/integrations/bookings/${id}`, updates);
    return data;
  },

  cancelBooking: async (id: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await api.delete(`/api/integrations/bookings/${id}`);
    return data;
  },

  confirmBooking: async (id: string, paymentDetails?: Record<string, unknown>): Promise<{ success: boolean; booking: Booking }> => {
    const { data } = await api.post(`/api/integrations/bookings/${id}/confirm`, paymentDetails);
    return data;
  },

  // Calendar
  getCalendarStatus: async (): Promise<{ connected: boolean; provider: string | null; calendarId: string | null }> => {
    const { data } = await api.get('/api/integrations/calendar/status');
    return data;
  },
};

// Templates
export interface AssistantTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface TemplatePreview {
  firstMessage: string;
  systemPromptPreview: string;
  systemPromptFull: string;
  voice: { provider: string; voiceId: string };
  suggestedEscalation: {
    triggerKeywords: string[];
    afterHoursMessage: string;
  };
}

export const templatesApi = {
  list: async (params?: { region?: string; locale?: string }): Promise<{ success: boolean; templates: AssistantTemplate[] }> => {
    const { data } = await api.get('/api/templates', { params });
    return data;
  },

  get: async (templateId: string, params?: { region?: string; locale?: string }): Promise<{ success: boolean; template: AssistantTemplate & { defaultSettings: Record<string, string>; sampleFirstMessage: string } }> => {
    const { data } = await api.get(`/api/templates/${templateId}`, { params });
    return data;
  },

  preview: async (templateId: string, config: {
    businessName: string;
    businessDescription?: string;
    greetingName?: string;
    voiceId?: string;
    voiceProvider?: string;
    region?: string;
    locale?: string;
  }): Promise<{ success: boolean; preview: TemplatePreview }> => {
    const { data } = await api.post(`/api/templates/${templateId}/preview`, config);
    return data;
  },
};

// Onboarding
export interface QuickSetupParams {
  templateId: string;
  businessName: string;
  businessDescription?: string;
  greetingName?: string;
  voiceId?: string;
  voiceProvider?: string;
  region?: string;
  locale?: string;
  customizePrompt?: boolean;
  customPrompt?: string;
}

export interface OnboardingStatusResponse {
  success: boolean;
  onboardingCompleted: boolean;
  progress: number;
  steps: {
    accountCreated: boolean;
    assistantConfigured: boolean;
    phoneNumberAssigned: boolean;
    bookingProviderConnected: boolean;
    firstCallMade: boolean;
  };
  assistant: { id: string; businessName: string; templateId: string } | null;
  phoneNumber: string | null;
}

export const onboardingApi = {
  quickSetup: async (params: QuickSetupParams): Promise<{
    success: boolean;
    message: string;
    assistant: { id: string; businessName: string; templateId: string; firstMessage: string; voiceId: string };
    nextSteps: string[];
  }> => {
    const { data } = await api.post('/api/onboarding/quick-setup', params);
    return data;
  },

  getStatus: async (): Promise<OnboardingStatusResponse> => {
    const { data } = await api.get('/api/onboarding/status');
    return data;
  },

  skip: async (): Promise<{ success: boolean; message: string }> => {
    const { data } = await api.post('/api/onboarding/skip');
    return data;
  },
};

// Email / Event Tracking
export const emailApi = {
  trackEvent: async (eventType: string, eventData?: Record<string, unknown>, pageUrl?: string): Promise<{ success: boolean; eventId?: string }> => {
    try {
      const { data } = await api.post('/api/email/track-event', {
        eventType,
        eventData,
        pageUrl: pageUrl || (typeof window !== 'undefined' ? window.location.href : undefined),
        referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      });
      return data;
    } catch {
      // Silently fail - event tracking should not break the app
      console.warn('[API] Event tracking failed');
      return { success: false };
    }
  },
};

// Admin API (for email campaigns panel)
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  text_content?: string;
  variables: string[];
  category: string;
  is_active: boolean;
}

export interface AutomatedTrigger {
  id: string;
  name: string;
  description?: string;
  template_id: string;
  trigger_type: string;
  condition_json: Record<string, unknown>;
  discount_code?: string;
  discount_percent?: number;
  cooldown_days?: number;
  max_sends_per_user?: number;
  priority: number;
  is_active: boolean;
}

export interface EmailCampaign {
  id: string;
  name: string;
  description?: string;
  template_id: string;
  subject_override?: string;
  segment_json: Record<string, unknown>;
  scheduled_at?: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';
  sent_at?: string;
  total_recipients: number;
  emails_sent: number;
  emails_opened: number;
  emails_clicked: number;
  template?: EmailTemplate;
}

export interface CampaignAnalytics {
  campaign: { id: string; name: string; status: string; sentAt?: string };
  stats: { total: number; sent: number; failed: number; opened: number; clicked: number; pending: number };
  rates: { deliveryRate: string; openRate: string; clickRate: string };
}

export const adminApi = {
  // Check admin status
  checkStatus: async (): Promise<{ isAdmin: boolean }> => {
    try {
      const { data } = await api.get('/api/admin/status');
      return data;
    } catch {
      return { isAdmin: false };
    }
  },

  // Templates
  getTemplates: async (category?: string): Promise<{ templates: EmailTemplate[] }> => {
    const { data } = await api.get('/api/admin/templates', { params: { category } });
    return data;
  },

  getTemplate: async (id: string): Promise<{ template: EmailTemplate }> => {
    const { data } = await api.get(`/api/admin/templates/${id}`);
    return data;
  },

  updateTemplate: async (id: string, template: Partial<EmailTemplate>): Promise<{ template: EmailTemplate }> => {
    const { data } = await api.put(`/api/admin/templates/${id}`, template);
    return data;
  },

  // Triggers
  getTriggers: async (): Promise<{ triggers: AutomatedTrigger[] }> => {
    const { data } = await api.get('/api/admin/triggers');
    return data;
  },

  getTrigger: async (id: string): Promise<{ trigger: AutomatedTrigger }> => {
    const { data } = await api.get(`/api/admin/triggers/${id}`);
    return data;
  },

  updateTrigger: async (id: string, updates: Partial<AutomatedTrigger>): Promise<{ trigger: AutomatedTrigger }> => {
    const { data } = await api.patch(`/api/admin/triggers/${id}`, updates);
    return data;
  },

  toggleTrigger: async (id: string, active: boolean): Promise<{ trigger: AutomatedTrigger }> => {
    const { data } = await api.post(`/api/admin/triggers/${id}/toggle`, { active });
    return data;
  },

  runTriggers: async (): Promise<{ message: string; results: { sent: number; skipped: number; errors: number } }> => {
    const { data } = await api.post('/api/admin/triggers/run');
    return data;
  },

  runSingleTrigger: async (id: string): Promise<{ message: string; results: unknown }> => {
    const { data } = await api.post(`/api/admin/triggers/${id}/run`);
    return data;
  },

  // Campaigns
  getCampaigns: async (status?: string, limit?: number): Promise<{ campaigns: EmailCampaign[] }> => {
    const { data } = await api.get('/api/admin/campaigns', { params: { status, limit } });
    return data;
  },

  getCampaign: async (id: string): Promise<{ campaign: EmailCampaign }> => {
    const { data } = await api.get(`/api/admin/campaigns/${id}`);
    return data;
  },

  createCampaign: async (campaign: {
    name: string;
    description?: string;
    templateId: string;
    subjectOverride?: string;
    segmentJson?: Record<string, unknown>;
    scheduledAt?: string;
  }): Promise<{ campaign: EmailCampaign }> => {
    const { data } = await api.post('/api/admin/campaigns', campaign);
    return data;
  },

  updateCampaignStatus: async (id: string, status: string): Promise<{ campaign: EmailCampaign }> => {
    const { data } = await api.patch(`/api/admin/campaigns/${id}`, { status });
    return data;
  },

  previewCampaignRecipients: async (id: string): Promise<{ count: number; preview: Array<{ id: string; email: string; fullName?: string; planId?: string }> }> => {
    const { data } = await api.get(`/api/admin/campaigns/${id}/preview`);
    return data;
  },

  sendCampaign: async (id: string, options?: { batchSize?: number; delayMs?: number }): Promise<{ message: string; results: { campaignId: string; totalRecipients: number; sent: number; failed: number } }> => {
    const { data } = await api.post(`/api/admin/campaigns/${id}/send`, options);
    return data;
  },

  getCampaignAnalytics: async (id: string): Promise<CampaignAnalytics> => {
    const { data } = await api.get(`/api/admin/campaigns/${id}/analytics`);
    return data;
  },

  // Segments
  previewSegment: async (segmentJson: Record<string, unknown>): Promise<{ count: number; preview: Array<{ id: string; email: string; fullName?: string; planId?: string }> }> => {
    const { data } = await api.post('/api/admin/segments/preview', segmentJson);
    return data;
  },
};

// Booking Providers
export const providersApi = {
  // Provider catalog
  getProviders: async (): Promise<{ providers: BookingProvider[] }> => {
    const { data } = await api.get('/api/providers');
    return data;
  },

  getProvider: async (providerId: string): Promise<{ provider: BookingProvider }> => {
    const { data } = await api.get(`/api/providers/${providerId}`);
    return data;
  },

  // Connections
  getConnections: async (): Promise<{ connections: ProviderConnection[] }> => {
    const { data } = await api.get('/api/providers/connections/list');
    return data;
  },

  getConnection: async (connectionId: string): Promise<{ connection: ProviderConnection }> => {
    const { data } = await api.get(`/api/providers/connections/${connectionId}`);
    return data;
  },

  createConnection: async (params: {
    providerId: string;
    apiKey?: string;
    apiSecret?: string;
    config?: Record<string, unknown>;
  }): Promise<{ success: boolean; connection: ProviderConnection }> => {
    const { data } = await api.post('/api/providers/connections', params);
    return data;
  },

  updateConnection: async (connectionId: string, updates: {
    syncEnabled?: boolean;
    syncDirection?: 'inbound' | 'outbound' | 'bidirectional';
    config?: Record<string, unknown>;
  }): Promise<{ success: boolean; connection: ProviderConnection }> => {
    const { data } = await api.patch(`/api/providers/connections/${connectionId}`, updates);
    return data;
  },

  deleteConnection: async (connectionId: string): Promise<{ success: boolean }> => {
    const { data } = await api.delete(`/api/providers/connections/${connectionId}`);
    return data;
  },

  testConnection: async (connectionId: string): Promise<{ success: boolean; error?: string; accountInfo?: { id: string; name: string; email?: string } }> => {
    const { data } = await api.post(`/api/providers/connections/${connectionId}/test`);
    return data;
  },

  setPrimary: async (connectionId: string): Promise<{ success: boolean; connection: ProviderConnection }> => {
    const { data } = await api.post(`/api/providers/connections/${connectionId}/set-primary`);
    return data;
  },

  getPrimaryConnection: async (): Promise<{ connection: ProviderConnection | null }> => {
    const { data } = await api.get('/api/providers/connections/primary');
    return data;
  },

  // OAuth
  getOAuthUrl: async (providerId: string, redirectUri: string): Promise<{ url: string; state: string }> => {
    const { data } = await api.get(`/api/providers/${providerId}/oauth/url`, { params: { redirectUri } });
    return data;
  },

  handleOAuthCallback: async (providerId: string, code: string, state: string, redirectUri: string): Promise<{ success: boolean; connection: ProviderConnection }> => {
    const { data } = await api.post(`/api/providers/${providerId}/oauth/callback`, { code, state, redirectUri });
    return data;
  },

  // Provider operations
  getEventTypes: async (connectionId: string): Promise<{ eventTypes: ProviderEventType[] }> => {
    const { data } = await api.get(`/api/providers/connections/${connectionId}/event-types`);
    return data;
  },

  getAvailability: async (connectionId: string, eventTypeId: string, startDate: string, endDate: string): Promise<{ slots: ProviderTimeSlot[] }> => {
    const { data } = await api.get(`/api/providers/connections/${connectionId}/availability`, {
      params: { eventTypeId, startDate, endDate }
    });
    return data;
  },

  syncBookings: async (connectionId: string, startDate?: string, endDate?: string): Promise<{ success: boolean; bookings: unknown[]; count: number }> => {
    const { data } = await api.post(`/api/providers/connections/${connectionId}/sync`, { startDate, endDate });
    return data;
  },

  createExternalBooking: async (connectionId: string, params: {
    eventTypeId: string;
    startTime: string;
    endTime?: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    metadata?: Record<string, unknown>;
  }): Promise<{ success: boolean; booking: unknown }> => {
    const { data } = await api.post(`/api/providers/connections/${connectionId}/bookings`, params);
    return data;
  },

  cancelExternalBooking: async (connectionId: string, bookingId: string, reason?: string): Promise<{ success: boolean }> => {
    const { data } = await api.delete(`/api/providers/connections/${connectionId}/bookings/${bookingId}`, { data: { reason } });
    return data;
  },

  getSyncLogs: async (connectionId: string, limit?: number): Promise<{ logs: ProviderSyncLog[] }> => {
    const { data } = await api.get(`/api/providers/connections/${connectionId}/logs`, { params: { limit } });
    return data;
  },
};

export default api;
