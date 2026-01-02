import axios from 'axios';
import type { User, SavedCall, ScheduledCall, CallHistory, UserStats, CallRequest, AssistantResponse, Voice, PhoneNumber } from '@/types';
import { getSession } from './supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(async (config) => {
  // Check for dev mode first
  const storedAuth = localStorage.getItem('auth-storage');
  if (storedAuth) {
    const { state } = JSON.parse(storedAuth);
    if (state?.devMode && state?.token === 'dev-mode') {
      // Dev mode - no token needed, backend will use dev user
      return config;
    }
  }

  // Try to get Supabase session token
  try {
    const session = await getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch (error) {
    console.error('Failed to get session:', error);
  }
  
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Check if in dev mode before redirecting
      const storedAuth = localStorage.getItem('auth-storage');
      if (storedAuth) {
        const { state } = JSON.parse(storedAuth);
        if (state?.devMode) {
          // In dev mode, don't redirect
          return Promise.reject(error);
        }
      }
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

  getPhoneNumbers: async (): Promise<{ phoneNumbers: PhoneNumber[]; limit: number }> => {
    const { data } = await api.get('/api/billing/phone-numbers');
    return data;
  },

  createPortalSession: async (): Promise<{ url: string }> => {
    const { data } = await api.post('/api/billing/portal');
    return data;
  },
};

export default api;
