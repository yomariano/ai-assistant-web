export interface User {
  id: string;
  email: string;
  fullName: string;
  dateOfBirth?: string;
  address?: string;
}

export interface SavedCall {
  id: string;
  name: string;
  phoneNumber: string;
  contactName?: string;
  message: string;
  language: string;
  createdAt: string;
  lastUsedAt?: string;
  usageCount: number;
}

export interface ScheduledCall {
  id: string;
  phoneNumber: string;
  contactName?: string;
  message: string;
  language: string;
  scheduledTime: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  createdAt: string;
}

export interface CallHistory {
  id: string;
  phoneNumber: string;
  contactName?: string;
  message: string;
  language: string;
  status: string;
  durationSeconds?: number;
  createdAt: string;
  endedAt?: string;
}

export interface UserStats {
  totalCalls: number;
  savedCalls: number;
  pendingScheduled: number;
  totalDurationMinutes: number;
}

export interface CallRequest {
  phoneNumber: string;
  message: string;
  language?: string;
  contactName?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Voice {
  id: string;
  name: string;
  provider: string;
  preview?: string;
}

export interface Assistant {
  id: string;
  name: string;
  firstMessage: string;
  systemPrompt: string;
  voice: {
    id: string;
    provider: string;
  };
  business: {
    name: string;
    description: string;
    greetingName: string;
  };
  features: {
    voiceCloningEnabled: boolean;
    customKnowledgeBase: boolean;
  };
  lastSyncedAt?: string;
  createdAt: string;
}

export interface AssistantResponse {
  exists: boolean;
  assistant?: Assistant;
  availableVoices?: Voice[];
  planId?: string;
  message?: string;
}

export interface PhoneNumber {
  id: string;
  phoneNumber: string;
  label: string;
  status: 'pending' | 'active' | 'suspended' | 'released';
  createdAt: string;
}

export interface Subscription {
  planId: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export interface UsageInfo {
  minutesUsed: number;
  minutesIncluded: number;
  overageMinutes: number;
  overageAmountCents: number;
  callsMade: number;
}

export interface BillingInfo {
  subscription: Subscription | null;
  usage: UsageInfo;
  phoneNumbers: PhoneNumber[];
}

export interface NotificationPreferences {
  id?: string;
  user_id?: string;
  email_enabled: boolean;
  email_address?: string;
  sms_enabled: boolean;
  sms_number?: string;
  notify_on_call_complete: boolean;
  notify_on_message_taken: boolean;
  notify_on_escalation: boolean;
  notify_on_voicemail: boolean;
  business_hours_only: boolean;
  timezone: string;
}

export interface EscalationSettings {
  id?: string;
  user_id?: string;
  transfer_enabled: boolean;
  transfer_number?: string;
  transfer_method: 'blind_transfer' | 'warm_transfer' | 'callback' | 'sms_alert';
  trigger_keywords: string[];
  max_failed_attempts: number;
  business_hours_only: boolean;
  business_hours_start: string;
  business_hours_end: string;
  business_days: number[];
  timezone: string;
  after_hours_action: 'voicemail' | 'sms_alert' | 'callback_promise' | 'ai_only';
  after_hours_message: string;
}

export interface TestConfig {
  vapiAssistantId: string;
  assistantName: string;
}

// Integrations / Booking System Types

export interface BookingField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'time' | 'select' | 'phone' | 'email';
  required: boolean;
  voicePrompt?: string;
  options?: string[];
  validation?: Record<string, unknown>;
}

export interface VerificationConfig {
  enabled: boolean;
  fields?: string[];
}

export interface PaymentConfig {
  type: 'none' | 'card_hold' | 'deposit';
  amount?: number;
}

export interface IndustryTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  defaultFields: BookingField[];
  defaultVerification: VerificationConfig;
  defaultPayment: PaymentConfig;
}

export interface BookingConfig {
  id: string;
  industryTemplateId: string | null;
  bookingFields: BookingField[];
  verificationEnabled: boolean;
  verificationFields: string[];
  verificationOnFail: 'transfer_to_staff' | 'take_message' | 'retry';
  newCustomerAction: string;
  newCustomerFields: string[];
  paymentRequired: boolean;
  paymentType: 'none' | 'card_hold' | 'deposit';
  depositAmountCents: number;
  calendarProvider: string | null;
  calendarId: string | null;
  calendarConnected: boolean;
  smsConfirmation: boolean;
  emailConfirmation: boolean;
  confirmationTemplate: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Customer {
  id: string;
  fullName: string;
  dateOfBirth?: string;
  phone?: string;
  email?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  postcode?: string;
  country?: string;
  customFields?: Record<string, unknown>;
  notes?: string;
  tags?: string[];
  createdAt: string;
  lastBookingAt?: string;
}

export interface Booking {
  id: string;
  customerId?: string;
  status: 'pending' | 'pending_payment' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  bookingData: Record<string, unknown>;
  bookingDate: string;
  bookingTime: string;
  durationMinutes?: number;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  paymentRequired: boolean;
  paymentStatus?: string;
  paymentAmountCents?: number;
  source: 'phone' | 'web' | 'walk_in';
  confirmedAt?: string;
  cancelledAt?: string;
  createdAt: string;
  customer?: Customer;
}
