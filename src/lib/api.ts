import axios from 'axios';
import type { User, SavedCall, ScheduledCall, CallHistory, UserStats, CallRequest, AssistantResponse, Voice, PhoneNumber, NotificationPreferences, EscalationSettings, TestConfig, IndustryTemplate, BookingConfig, Customer, Booking, BookingField, BookingProvider, ProviderConnection, ProviderEventType, ProviderTimeSlot, ProviderSyncLog } from '@/types';
import { getSession } from './supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

console.log('[API] Initializing with API_URL:', API_URL);

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
  console.log('[API] Request interceptor - URL:', config.url);

  // Skip auth for public endpoints
  const isPublicEndpoint = PUBLIC_ENDPOINTS.some(endpoint => config.url?.includes(endpoint));
  if (isPublicEndpoint) {
    console.log('[API] Public endpoint, skipping auth');
    return config;
  }

  // Check for dev mode first
  const storedAuth = localStorage.getItem('auth-storage');
  if (storedAuth) {
    const { state } = JSON.parse(storedAuth);
    if (state?.devMode && state?.token === 'dev-mode') {
      console.log('[API] Dev mode detected, skipping auth token');
      return config;
    }
  }

  // Try to get Supabase session token (with short timeout)
  try {
    // If the request already has an Authorization header (e.g. authApi.me(token)),
    // don't call getSession (avoids extra timeouts and work).
    const existingAuthHeader =
      (config.headers as Record<string, unknown> | undefined)?.Authorization ??
      (config.headers as Record<string, unknown> | undefined)?.authorization;
    if (existingAuthHeader) {
      console.log('[API] Authorization already present, skipping getSession');
      return config;
    }

    console.log('[API] Getting Supabase session for auth header...');
    const session = await getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
      console.log('[API] Added auth token to request');
    } else {
      console.log('[API] No session token available');
    }
  } catch (error) {
    console.error('[API] Failed to get session:', error);
  }

  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    console.log('[API] Response success:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('[API] Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });

    if (error.response?.status === 401) {
      // Check if in dev mode before redirecting
      const storedAuth = localStorage.getItem('auth-storage');
      if (storedAuth) {
        const { state } = JSON.parse(storedAuth);
        if (state?.devMode) {
          console.log('[API] 401 error in dev mode, not redirecting');
          return Promise.reject(error);
        }
      }
      console.log('[API] 401 error, redirecting to login');
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
  }): Promise<{ success: boolean; assistant: AssistantResponse['assistant'] }> => {
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

  sendTest: async (type: 'email' | 'sms'): Promise<{ success: boolean; message: string; messageId?: string }> => {
    const { data } = await api.post('/api/notifications/test', { type });
    return data;
  },
};

// Billing
export const billingApi = {
  getSubscription: async (): Promise<{ subscription: any; usage: any }> => {
    const { data } = await api.get('/api/billing/subscription');
    return data;
  },

  getUsage: async (): Promise<{ usage: any; limits: any; percentUsed: number }> => {
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
