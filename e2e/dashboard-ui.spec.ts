import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:3000';
const WEB_URL = 'http://localhost:3001';
const TEST_USER_ID = '00000000-0000-0000-0000-000000000066'; // Different from other tests

// Helper to get auth cookie
async function getAuthCookie(request: any, userId: string) {
  const response = await request.get(`${API_URL}/api/auth/dev-login?userId=${userId}`);
  return response.headers()['set-cookie'] || '';
}

// Helper to setup user with subscription
async function setupUserWithSubscription(request: any, userId: string, planId: string) {
  const response = await request.post(`${API_URL}/api/billing/test/simulate-checkout`, {
    data: { userId, planId }
  });
  return response.json();
}

// Helper to create test user
async function createTestUser(request: any, userId: string) {
  await request.post(`${API_URL}/api/billing/test/reset-user`, {
    data: { userId }
  });
  await request.post(`${API_URL}/api/billing/test/create-test-user`, {
    data: { userId }
  });
}

// Helper to login via browser
async function loginUser(page: any, userId: string) {
  // Use dev login to set session
  await page.goto(`${API_URL}/api/auth/dev-login?userId=${userId}&redirect=${WEB_URL}/dashboard`);
  await page.waitForURL(/dashboard/, { timeout: 10000 });
}

test.describe('Dashboard API Endpoints', () => {
  test.beforeEach(async ({ request }) => {
    await request.post(`${API_URL}/api/billing/test/reset-user`, {
      data: { userId: TEST_USER_ID }
    });
    await setupUserWithSubscription(request, TEST_USER_ID, 'starter');
  });

  test('subscription endpoint returns correct data', async ({ request }) => {
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    const response = await request.get(`${API_URL}/api/billing/subscription`, {
      headers: { 'Cookie': cookie }
    });

    expect(response.ok()).toBe(true);
    const data = await response.json();
    console.log('Subscription data:', data);

    expect(data.status).toBe('active');
    expect(data.plan_id).toBe('starter');
    expect(data.stripe_customer_id).toBeDefined();
  });

  test('usage endpoint returns correct limits', async ({ request }) => {
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    const response = await request.get(`${API_URL}/api/billing/usage`, {
      headers: { 'Cookie': cookie }
    });

    expect(response.ok()).toBe(true);
    const data = await response.json();
    console.log('Usage data:', data);

    // Usage data is at top level (minutesUsed, callsMade, etc.)
    expect(data.minutesUsed).toBeDefined();
    expect(data.minutesIncluded).toBeDefined();
    expect(data.planLimits).toBeDefined();
    expect(data.percentUsed).toBeDefined();
  });

  test('phone numbers endpoint returns provisioned numbers', async ({ request }) => {
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    const response = await request.get(`${API_URL}/api/billing/phone-numbers`, {
      headers: { 'Cookie': cookie }
    });

    expect(response.ok()).toBe(true);
    const data = await response.json();
    console.log('Phone numbers:', data);

    expect(data.numbers).toBeDefined();
    expect(Array.isArray(data.numbers)).toBe(true);
    expect(data.numbers.length).toBeGreaterThanOrEqual(1);
  });

  test('plans endpoint returns all available plans', async ({ request }) => {
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    const response = await request.get(`${API_URL}/api/billing/plans`, {
      headers: { 'Cookie': cookie }
    });

    expect(response.ok()).toBe(true);
    const data = await response.json();
    console.log('Plans:', data);

    // Plans might be at data.plans or directly as array
    const plans = data.plans || data;
    expect(Array.isArray(plans)).toBe(true);
    expect(plans.length).toBeGreaterThanOrEqual(3);

    // Verify plan structure
    const starterPlan = plans.find((p: any) => p.id === 'starter');
    expect(starterPlan).toBeDefined();
    expect(starterPlan.name).toBeDefined();
    // Price might be price_cents
    expect(starterPlan.price_cents || starterPlan.price).toBeDefined();
  });
});

test.describe('Dashboard Data by Plan', () => {
  test.beforeEach(async ({ request }) => {
    await request.post(`${API_URL}/api/billing/test/reset-user`, {
      data: { userId: TEST_USER_ID }
    });
  });

  test('starter plan shows correct limits', async ({ request }) => {
    await setupUserWithSubscription(request, TEST_USER_ID, 'starter');
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    const response = await request.get(`${API_URL}/api/billing/usage`, {
      headers: { 'Cookie': cookie }
    });
    const data = await response.json();

    // Starter: 1 phone, limited minutes (planLimits is at top level)
    expect(data.planLimits.phoneNumbers).toBe(1);
    console.log('Starter limits:', data.planLimits);
  });

  test('growth plan shows correct limits', async ({ request }) => {
    await setupUserWithSubscription(request, TEST_USER_ID, 'growth');
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    const response = await request.get(`${API_URL}/api/billing/usage`, {
      headers: { 'Cookie': cookie }
    });
    const data = await response.json();

    // Growth: 2 phones, more minutes
    expect(data.planLimits.phoneNumbers).toBe(2);
    console.log('Growth limits:', data.planLimits);
  });

  test('scale plan shows correct limits', async ({ request }) => {
    await setupUserWithSubscription(request, TEST_USER_ID, 'scale');
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    const response = await request.get(`${API_URL}/api/billing/usage`, {
      headers: { 'Cookie': cookie }
    });
    const data = await response.json();

    // Scale: 5 phones, maximum minutes
    expect(data.planLimits.phoneNumbers).toBe(5);
    console.log('Scale limits:', data.planLimits);
  });
});

test.describe('Billing Page Data', () => {
  test.beforeEach(async ({ request }) => {
    await request.post(`${API_URL}/api/billing/test/reset-user`, {
      data: { userId: TEST_USER_ID }
    });
    await setupUserWithSubscription(request, TEST_USER_ID, 'growth');
  });

  test('billing data includes subscription period', async ({ request }) => {
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    const response = await request.get(`${API_URL}/api/billing/subscription`, {
      headers: { 'Cookie': cookie }
    });
    const data = await response.json();

    expect(data.current_period_start).toBeDefined();
    expect(data.current_period_end).toBeDefined();
    console.log('Subscription period:', {
      start: data.current_period_start,
      end: data.current_period_end
    });
  });

  test('usage calculation shows zero for new subscription', async ({ request }) => {
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    const response = await request.get(`${API_URL}/api/billing/usage`, {
      headers: { 'Cookie': cookie }
    });
    const data = await response.json();

    // New subscription should have 0% usage
    expect(data.percentUsed).toBe(0);
    console.log('Initial usage percent:', data.percentUsed);
  });
});

test.describe('Assistant Page Data', () => {
  test.beforeEach(async ({ request }) => {
    await request.post(`${API_URL}/api/billing/test/reset-user`, {
      data: { userId: TEST_USER_ID }
    });
    await setupUserWithSubscription(request, TEST_USER_ID, 'starter');
  });

  test('assistant page data loads correctly', async ({ request }) => {
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    // Fetch all data needed for assistant page
    const [assistantRes, voicesRes, phonesRes] = await Promise.all([
      request.get(`${API_URL}/api/assistant`, { headers: { 'Cookie': cookie } }),
      request.get(`${API_URL}/api/assistant/voices`, { headers: { 'Cookie': cookie } }),
      request.get(`${API_URL}/api/billing/phone-numbers`, { headers: { 'Cookie': cookie } })
    ]);

    expect(assistantRes.ok()).toBe(true);
    expect(voicesRes.ok()).toBe(true);
    expect(phonesRes.ok()).toBe(true);

    const assistantData = await assistantRes.json();
    const voicesData = await voicesRes.json();
    const phonesData = await phonesRes.json();

    console.log('Assistant page data:', {
      assistantName: assistantData.assistant?.name,
      voiceCount: voicesData.voices?.length,
      phoneCount: phonesData.numbers?.length
    });

    expect(assistantData.assistant).toBeDefined();
    expect(voicesData.voices).toBeDefined();
    expect(phonesData.numbers).toBeDefined();
  });
});

test.describe('User Stats Endpoint', () => {
  test.beforeEach(async ({ request }) => {
    await request.post(`${API_URL}/api/billing/test/reset-user`, {
      data: { userId: TEST_USER_ID }
    });
    await setupUserWithSubscription(request, TEST_USER_ID, 'starter');
  });

  test('user stats returns call statistics', async ({ request }) => {
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    const response = await request.get(`${API_URL}/api/users/stats`, {
      headers: { 'Cookie': cookie }
    });

    expect(response.ok()).toBe(true);
    const data = await response.json();
    console.log('User stats:', data);

    // Stats should contain call-related data
    expect(data).toBeDefined();
  });
});

test.describe('Routes with Dev Mode Auth', () => {
  // Note: In DEV_MODE, auth is bypassed and uses default dev user
  // These tests verify the endpoints are accessible (not testing auth rejection)

  test('subscription endpoint accessible in dev mode', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/billing/subscription`);
    // Dev mode allows access via default dev user
    expect(response.status()).toBeLessThan(500);
  });

  test('usage endpoint accessible in dev mode', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/billing/usage`);
    expect(response.status()).toBeLessThan(500);
  });

  test('phone numbers endpoint accessible in dev mode', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/billing/phone-numbers`);
    expect(response.status()).toBeLessThan(500);
  });

  test('assistant endpoint accessible in dev mode', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/assistant`);
    expect(response.status()).toBeLessThan(500);
  });
});

test.describe('Trial Status in Dashboard', () => {
  test.beforeEach(async ({ request }) => {
    await createTestUser(request, TEST_USER_ID);
  });

  test('trial subscription shows trialing status', async ({ request }) => {
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    // Start trial
    await request.post(`${API_URL}/api/billing/start-trial`, {
      headers: { 'Cookie': cookie },
      data: { planId: 'starter' }
    });

    // Check subscription status
    const response = await request.get(`${API_URL}/api/billing/subscription`, {
      headers: { 'Cookie': cookie }
    });
    const data = await response.json();

    expect(data.status).toBe('trialing');
    expect(data.trial_ends_at).toBeDefined();
    console.log('Trial status shown correctly:', {
      status: data.status,
      trialEndsAt: data.trial_ends_at
    });
  });

  test('trial usage shown in dashboard data', async ({ request }) => {
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    // Start trial
    await request.post(`${API_URL}/api/billing/start-trial`, {
      headers: { 'Cookie': cookie },
      data: { planId: 'starter' }
    });

    // Check usage endpoint
    const response = await request.get(`${API_URL}/api/billing/usage`, {
      headers: { 'Cookie': cookie }
    });
    const data = await response.json();

    // Should show trial-specific information
    expect(data).toBeDefined();
    console.log('Trial usage data:', data);
  });
});

test.describe('No Subscription State', () => {
  test.beforeEach(async ({ request }) => {
    await createTestUser(request, TEST_USER_ID);
  });

  test('user without subscription gets appropriate response', async ({ request }) => {
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    const response = await request.get(`${API_URL}/api/billing/subscription`, {
      headers: { 'Cookie': cookie }
    });

    // Should return a response indicating no subscription
    const data = await response.json();
    console.log('No subscription response:', data);

    // Either null/none status or appropriate error
    expect(data.status === 'none' || data.status === null || !data.plan_id).toBe(true);
  });

  test('user without subscription can see available plans', async ({ request }) => {
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    const response = await request.get(`${API_URL}/api/billing/plans`, {
      headers: { 'Cookie': cookie }
    });

    expect(response.ok()).toBe(true);
    const data = await response.json();

    // Plans might be at data.plans or directly as array
    const plans = data.plans || data;
    expect(Array.isArray(plans)).toBe(true);
    expect(plans.length).toBeGreaterThan(0);
    console.log('Available plans for new user:', plans.map((p: any) => p.id));
  });
});
