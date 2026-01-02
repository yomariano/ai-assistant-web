import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:3000';
const TEST_USER_ID = '00000000-0000-0000-0000-000000000088'; // Different from stripe tests

// Helper to get auth cookie
async function getAuthCookie(request: any, userId: string) {
  const response = await request.get(`${API_URL}/api/auth/dev-login?userId=${userId}`);
  return response.headers()['set-cookie'] || '';
}

// Helper to get raw DB state
async function getDbState(request: any, userId: string) {
  const response = await request.get(`${API_URL}/api/billing/test/db-state/${userId}`);
  if (!response.ok()) {
    throw new Error(`Failed to get DB state: ${response.status()}`);
  }
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

test.describe('Trial Flow', () => {
  test.beforeEach(async ({ request }) => {
    // Reset and create test user before each test
    await createTestUser(request, TEST_USER_ID);
  });

  test('start trial creates subscription with trialing status', async ({ request }) => {
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    // Start trial for starter plan
    const trialResponse = await request.post(`${API_URL}/api/billing/start-trial`, {
      headers: { 'Cookie': cookie },
      data: { planId: 'starter' }
    });

    expect(trialResponse.ok()).toBe(true);
    const trialData = await trialResponse.json();
    console.log('Trial started:', trialData);

    expect(trialData.message).toBe('Trial started successfully');
    expect(trialData.subscription.status).toBe('trialing');
    expect(trialData.subscription.plan_id).toBe('starter');
    expect(trialData.trialEndsAt).toBeDefined();
    expect(trialData.trialCalls).toBeGreaterThan(0);

    // Verify subscription endpoint returns trial info
    const subResponse = await request.get(`${API_URL}/api/billing/subscription`, {
      headers: { 'Cookie': cookie }
    });
    const subData = await subResponse.json();
    expect(subData.status).toBe('trialing');
    expect(subData.plan_id).toBe('starter');
    console.log('Subscription verified as trialing');

    // Verify DB state
    const dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.subscription).not.toBeNull();
    expect(dbState.subscription.status).toBe('trialing');
    expect(dbState.subscription.trial_starts_at).toBeDefined();
    expect(dbState.subscription.trial_ends_at).toBeDefined();
    console.log('DB state verified: trial subscription created');
  });

  test('trial usage tracking initializes correctly', async ({ request }) => {
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    // Start trial
    await request.post(`${API_URL}/api/billing/start-trial`, {
      headers: { 'Cookie': cookie },
      data: { planId: 'starter' }
    });

    // Check usage endpoint
    const usageResponse = await request.get(`${API_URL}/api/billing/usage`, {
      headers: { 'Cookie': cookie }
    });

    expect(usageResponse.ok()).toBe(true);
    const usageData = await usageResponse.json();
    console.log('Trial usage:', usageData);

    // Trial usage should show initial state (minutesUsed, callsMade at top level)
    expect(usageData.minutesUsed).toBeDefined();
    expect(usageData.callsMade).toBeDefined();
    expect(usageData.minutesUsed).toBe(0);
    expect(usageData.callsMade).toBe(0);
    console.log('Trial usage tracking initialized');
  });

  test('cannot start trial if already has subscription', async ({ request }) => {
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    // Start first trial
    const firstTrialResponse = await request.post(`${API_URL}/api/billing/start-trial`, {
      headers: { 'Cookie': cookie },
      data: { planId: 'starter' }
    });
    expect(firstTrialResponse.ok()).toBe(true);

    // Try to start another trial - should fail
    const secondTrialResponse = await request.post(`${API_URL}/api/billing/start-trial`, {
      headers: { 'Cookie': cookie },
      data: { planId: 'growth' }
    });

    expect(secondTrialResponse.ok()).toBe(false);
    expect(secondTrialResponse.status()).toBe(400);
    const errorData = await secondTrialResponse.json();
    expect(errorData.error.message).toContain('already have a subscription');
    console.log('Duplicate trial prevention verified');
  });

  test('trial for growth plan allows growth plan features', async ({ request }) => {
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    // Start trial for growth plan
    const trialResponse = await request.post(`${API_URL}/api/billing/start-trial`, {
      headers: { 'Cookie': cookie },
      data: { planId: 'growth' }
    });

    expect(trialResponse.ok()).toBe(true);
    const trialData = await trialResponse.json();
    expect(trialData.subscription.plan_id).toBe('growth');

    // Verify subscription shows growth plan
    const subResponse = await request.get(`${API_URL}/api/billing/subscription`, {
      headers: { 'Cookie': cookie }
    });
    const subData = await subResponse.json();
    expect(subData.plan_id).toBe('growth');
    expect(subData.status).toBe('trialing');
    console.log('Growth trial verified');
  });

  test('trial subscription shows correct trial end date', async ({ request }) => {
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    const beforeTrial = new Date();

    // Start trial
    const trialResponse = await request.post(`${API_URL}/api/billing/start-trial`, {
      headers: { 'Cookie': cookie },
      data: { planId: 'starter' }
    });

    const trialData = await trialResponse.json();
    const trialEndsAt = new Date(trialData.trialEndsAt);

    // Trial should end in the future (default 3 days based on env)
    expect(trialEndsAt.getTime()).toBeGreaterThan(beforeTrial.getTime());

    // Trial end should be within reasonable range (1-30 days from now)
    const maxTrialEnd = new Date(beforeTrial.getTime() + 30 * 24 * 60 * 60 * 1000);
    expect(trialEndsAt.getTime()).toBeLessThan(maxTrialEnd.getTime());

    console.log('Trial end date:', trialEndsAt.toISOString());
    console.log('Trial duration verified');
  });
});

test.describe('Trial to Paid Conversion', () => {
  const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/test_eVq4gy46OeB8cvS2zWfQI04';

  test.beforeEach(async ({ request }) => {
    await createTestUser(request, TEST_USER_ID);
  });

  test('trial user can upgrade to paid subscription', async ({ page, request }) => {
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    // Step 1: Start trial
    const trialResponse = await request.post(`${API_URL}/api/billing/start-trial`, {
      headers: { 'Cookie': cookie },
      data: { planId: 'starter' }
    });
    expect(trialResponse.ok()).toBe(true);
    console.log('Trial started');

    // Verify trial status
    let subResponse = await request.get(`${API_URL}/api/billing/subscription`, {
      headers: { 'Cookie': cookie }
    });
    let subData = await subResponse.json();
    expect(subData.status).toBe('trialing');

    // Step 2: Complete Stripe checkout (simulates upgrade)
    const checkoutUrl = `${STRIPE_PAYMENT_LINK}?client_reference_id=${TEST_USER_ID}`;
    await page.goto(checkoutUrl);

    // Fill checkout form
    await page.waitForSelector('input[name="email"]', { timeout: 30000 });
    await page.fill('input[name="email"]', 'trial-upgrade@test.local');
    await page.fill('input[name="cardNumber"]', '4242424242424242');
    await page.fill('input[name="cardExpiry"]', '1228');
    await page.fill('input[name="cardCvc"]', '123');
    await page.fill('input[name="billingName"]', 'Trial User');
    await page.click('button:has-text("Pay and subscribe")');
    await page.waitForURL(/localhost:3001|stripe\.com/, { timeout: 60000 });
    console.log('Checkout completed');

    // Step 3: Wait for webhook to process and verify upgrade
    for (let i = 0; i < 30; i++) {
      await page.waitForTimeout(1000);
      subResponse = await request.get(`${API_URL}/api/billing/subscription`, {
        headers: { 'Cookie': cookie }
      });
      subData = await subResponse.json();
      if (subData.status === 'active') {
        break;
      }
      console.log(`Waiting for subscription activation... attempt ${i + 1}/30`);
    }

    expect(subData.status).toBe('active');
    expect(subData.stripe_subscription_id).toBeDefined();
    console.log('Trial converted to paid subscription');

    // Verify DB state
    const dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.subscription.status).toBe('active');
    expect(dbState.subscription.stripe_customer_id).not.toBeNull();
    console.log('DB state verified: subscription active with Stripe IDs');
  });
});

test.describe('Trial Usage Tracking', () => {
  test.beforeEach(async ({ request }) => {
    await createTestUser(request, TEST_USER_ID);
  });

  test('trial usage tracks calls and minutes', async ({ request }) => {
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    // Start trial
    await request.post(`${API_URL}/api/billing/start-trial`, {
      headers: { 'Cookie': cookie },
      data: { planId: 'starter' }
    });

    // Simulate usage
    const simulateResponse = await request.post(`${API_URL}/api/billing/test/simulate-trial-usage`, {
      data: {
        userId: TEST_USER_ID,
        callsMade: 2,
        minutesUsed: 5
      }
    });
    expect(simulateResponse.ok()).toBe(true);

    // Verify DB state
    const dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.trialUsage).not.toBeNull();
    expect(dbState.trialUsage.calls_made).toBe(2);
    expect(dbState.trialUsage.minutes_used).toBe(5);
    console.log('Trial usage tracked:', dbState.trialUsage);
  });

  test('trial usage updates incrementally', async ({ request }) => {
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    // Start trial
    await request.post(`${API_URL}/api/billing/start-trial`, {
      headers: { 'Cookie': cookie },
      data: { planId: 'starter' }
    });

    // First usage
    await request.post(`${API_URL}/api/billing/test/simulate-trial-usage`, {
      data: { userId: TEST_USER_ID, callsMade: 1, minutesUsed: 2 }
    });

    let dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.trialUsage.calls_made).toBe(1);

    // Second usage (update)
    await request.post(`${API_URL}/api/billing/test/simulate-trial-usage`, {
      data: { userId: TEST_USER_ID, callsMade: 3, minutesUsed: 8 }
    });

    dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.trialUsage.calls_made).toBe(3);
    expect(dbState.trialUsage.minutes_used).toBe(8);
    console.log('Trial usage updated correctly');
  });
});

test.describe('Trial Expiration', () => {
  test.beforeEach(async ({ request }) => {
    await createTestUser(request, TEST_USER_ID);
  });

  test('expired trial is detected correctly', async ({ request }) => {
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    // Start trial
    await request.post(`${API_URL}/api/billing/start-trial`, {
      headers: { 'Cookie': cookie },
      data: { planId: 'starter' }
    });

    // Simulate trial expiry
    const expiryResponse = await request.post(`${API_URL}/api/billing/test/simulate-trial-expiry`, {
      data: { userId: TEST_USER_ID }
    });
    expect(expiryResponse.ok()).toBe(true);
    console.log('Trial expiry simulated');

    // Verify DB shows expired trial end date
    const dbState = await getDbState(request, TEST_USER_ID);
    const trialEndDate = new Date(dbState.subscription.trial_ends_at);
    const now = new Date();
    expect(trialEndDate.getTime()).toBeLessThan(now.getTime());
    console.log('Trial end date is in the past:', trialEndDate.toISOString());
  });
});
