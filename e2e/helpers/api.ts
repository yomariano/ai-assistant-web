/**
 * E2E Test API Helpers
 * Direct API calls for test setup and verification
 * Note: In dev mode, the API uses the current dev user set via loginAsDevUser
 */

const API_URL = process.env.E2E_API_URL || 'http://localhost:3000';

// Track current user context
let currentUserId: string | null = null;
let currentPlan: string = 'starter';

interface DevUser {
  id: string;
  email: string;
  fullName: string;
}

interface DevLoginResponse {
  user: DevUser;
  subscription: { planId: string; status: string } | null;
  currentPlan: string;
  devMode: boolean;
}

/**
 * Login as a specific dev user plan
 */
export async function loginAsDevUser(plan: 'starter' | 'growth' | 'scale'): Promise<DevLoginResponse> {
  const response = await fetch(`${API_URL}/api/auth/dev-login?plan=${plan}`);
  if (!response.ok) {
    throw new Error(`Failed to login as ${plan}: ${response.statusText}`);
  }
  const data = await response.json();
  currentUserId = data.user?.id || null;
  currentPlan = plan;
  return data;
}

/**
 * Login as a specific user by ID (for E2E tests with dynamic users)
 */
export async function loginAsUser(userId: string): Promise<DevLoginResponse> {
  const response = await fetch(`${API_URL}/api/auth/dev-login?userId=${userId}`);
  if (!response.ok) {
    throw new Error(`Failed to login as user ${userId}: ${response.statusText}`);
  }
  const data = await response.json();
  currentUserId = userId;
  return data;
}

/**
 * Get current dev users list
 */
export async function getDevUsers() {
  const response = await fetch(`${API_URL}/api/auth/dev-users`);
  return response.json();
}

/**
 * Get user's phone numbers
 */
export async function getPhoneNumbers(): Promise<{ phoneNumbers: any[]; limit: number; count: number }> {
  const response = await fetch(`${API_URL}/api/billing/phone-numbers`);
  const data = await response.json();
  // Map API response to expected test interface
  return {
    phoneNumbers: data.numbers || [],
    limit: data.maxAllowed || 0,
    count: data.count || 0,
  };
}

/**
 * Get user's subscription
 */
export async function getSubscription() {
  const response = await fetch(`${API_URL}/api/billing/subscription`);
  return response.json();
}

/**
 * Get user's assistant
 */
export async function getAssistant(): Promise<{ exists: boolean; assistant: any | null }> {
  const response = await fetch(`${API_URL}/api/assistant`);
  const data = await response.json();
  return {
    exists: data.exists || false,
    assistant: data.assistant || null,
  };
}

/**
 * Simulate a Stripe checkout.session.completed webhook
 * This is used in E2E tests to simulate what happens after payment
 * Note: This also logs in as the user so subsequent API calls work correctly
 */
export async function simulateCheckoutCompleted(options: {
  userId: string;
  planId: 'starter' | 'growth' | 'scale';
  customerId?: string;
  subscriptionId?: string;
}): Promise<void> {
  const {
    userId,
    planId,
    customerId = `cus_test_${Date.now()}`,
    subscriptionId = `sub_test_${Date.now()}`,
  } = options;

  const response = await fetch(`${API_URL}/api/billing/test/simulate-checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      planId,
      customerId,
      subscriptionId,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to simulate checkout: ${response.statusText} - ${errorText}`);
  }

  // Automatically switch to this user for subsequent API calls
  await loginAsUser(userId);
}

/**
 * Simulate a plan change (upgrade/downgrade)
 */
export async function simulatePlanChange(options: {
  userId: string;
  oldPlanId: string;
  newPlanId: string;
}): Promise<void> {
  const response = await fetch(`${API_URL}/api/billing/test/simulate-plan-change`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options),
  });

  if (!response.ok) {
    throw new Error(`Failed to simulate plan change: ${response.statusText}`);
  }
}

/**
 * Simulate subscription cancellation
 */
export async function simulateCancellation(userId: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/billing/test/simulate-cancellation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error(`Failed to simulate cancellation: ${response.statusText}`);
  }
}

/**
 * Reset test user to clean state
 */
export async function resetTestUser(userId: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/billing/test/reset-user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error(`Failed to reset user: ${response.statusText}`);
  }
}

/**
 * Wait for provisioning to complete (polls until numbers are ready)
 */
export async function waitForProvisioning(
  expectedCount: number,
  maxWaitMs: number = 30000
): Promise<boolean> {
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitMs) {
    const { phoneNumbers } = await getPhoneNumbers();
    const activeCount = phoneNumbers.filter((p: any) => p.status === 'active').length;

    if (activeCount >= expectedCount) {
      return true;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return false;
}
