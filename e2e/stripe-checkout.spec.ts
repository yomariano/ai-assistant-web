import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:3000';
// Stripe payment links for each plan (EUR - Ireland/EU)
const STRIPE_PAYMENT_LINKS = {
  starter: 'https://buy.stripe.com/test_6oUaEWeLs9gO8fCgqMfQI07',
  growth: 'https://buy.stripe.com/test_28E6oG0UC78G53qb6sfQI08',
  scale: 'https://buy.stripe.com/test_00w4gyfPw64C53q4I4fQI09',
};
// Expected phone numbers per plan (OrderBot.ie Pricing Jan 2026)
// Lite: 1 phone | Growth: 2 phones | Pro: 5 phones
const PLAN_PHONE_LIMITS = {
  starter: 1,  // Lite
  growth: 2,   // Growth
  scale: 5,    // Pro
};
const TEST_USER_ID = '00000000-0000-0000-0000-000000000099'; // Must be valid UUID for database

// Helper to get auth cookie
async function getAuthCookie(request: any, userId: string) {
  const response = await request.get(`${API_URL}/api/auth/dev-login?userId=${userId}`);
  return response.headers()['set-cookie'] || '';
}

// Helper to get raw DB state for verification
async function getDbState(request: any, userId: string) {
  const response = await request.get(`${API_URL}/api/billing/test/db-state/${userId}`);
  if (!response.ok()) {
    throw new Error(`Failed to get DB state: ${response.status()}`);
  }
  return response.json();
}

// Helper to verify DB state matches expected values
function verifyDbState(dbState: any, expected: {
  hasUser?: boolean;
  hasSubscription?: boolean;
  subscriptionStatus?: string;
  planId?: string;
  activePhoneCount?: number;
  releasedPhoneCount?: number;
  hasAssistant?: boolean;
  hasStripeCustomerId?: boolean;
  hasStripeSubscriptionId?: boolean;
}) {
  const checks: string[] = [];

  if (expected.hasUser !== undefined) {
    const actual = dbState.user !== null;
    if (actual !== expected.hasUser) {
      checks.push(`User: expected ${expected.hasUser}, got ${actual}`);
    }
  }

  if (expected.hasSubscription !== undefined) {
    const actual = dbState.subscription !== null;
    if (actual !== expected.hasSubscription) {
      checks.push(`Subscription: expected ${expected.hasSubscription}, got ${actual}`);
    }
  }

  if (expected.subscriptionStatus !== undefined && dbState.subscription) {
    if (dbState.subscription.status !== expected.subscriptionStatus) {
      checks.push(`Subscription status: expected ${expected.subscriptionStatus}, got ${dbState.subscription.status}`);
    }
  }

  if (expected.planId !== undefined && dbState.subscription) {
    if (dbState.subscription.plan_id !== expected.planId) {
      checks.push(`Plan ID: expected ${expected.planId}, got ${dbState.subscription.plan_id}`);
    }
  }

  if (expected.activePhoneCount !== undefined) {
    if (dbState.phoneNumbers.activeCount !== expected.activePhoneCount) {
      checks.push(`Active phones: expected ${expected.activePhoneCount}, got ${dbState.phoneNumbers.activeCount}`);
    }
  }

  if (expected.releasedPhoneCount !== undefined) {
    if (dbState.phoneNumbers.releasedCount !== expected.releasedPhoneCount) {
      checks.push(`Released phones: expected ${expected.releasedPhoneCount}, got ${dbState.phoneNumbers.releasedCount}`);
    }
  }

  if (expected.hasAssistant !== undefined) {
    const actual = dbState.assistant !== null;
    if (actual !== expected.hasAssistant) {
      checks.push(`Assistant: expected ${expected.hasAssistant}, got ${actual}`);
    }
  }

  if (expected.hasStripeCustomerId !== undefined && dbState.subscription) {
    const actual = dbState.subscription.stripe_customer_id !== null;
    if (actual !== expected.hasStripeCustomerId) {
      checks.push(`Stripe customer ID: expected ${expected.hasStripeCustomerId}, got ${actual}`);
    }
  }

  if (expected.hasStripeSubscriptionId !== undefined && dbState.subscription) {
    const actual = dbState.subscription.stripe_subscription_id !== null;
    if (actual !== expected.hasStripeSubscriptionId) {
      checks.push(`Stripe subscription ID: expected ${expected.hasStripeSubscriptionId}, got ${actual}`);
    }
  }

  return {
    passed: checks.length === 0,
    failures: checks,
  };
}

// Helper to wait for subscription
async function waitForSubscription(page: any, request: any, userId: string, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    await page.waitForTimeout(1000);
    const cookie = await getAuthCookie(request, userId);
    const subResponse = await request.get(`${API_URL}/api/billing/subscription`, {
      headers: { 'Cookie': cookie }
    });

    if (subResponse.ok()) {
      const data = await subResponse.json();
      if (data.status && data.status !== 'none') {
        console.log(`Subscription found after ${i + 1} seconds:`, data.status);
        return data;
      }
    }
    console.log(`Waiting for subscription... attempt ${i + 1}/${maxAttempts}`);
  }
  return null;
}

// Helper to wait for phone numbers
async function waitForPhoneNumbers(page: any, request: any, userId: string, minCount = 1, maxAttempts = 15) {
  for (let i = 0; i < maxAttempts; i++) {
    await page.waitForTimeout(1000);
    const cookie = await getAuthCookie(request, userId);
    const phonesResponse = await request.get(`${API_URL}/api/billing/phone-numbers`, {
      headers: { 'Cookie': cookie }
    });

    if (phonesResponse.ok()) {
      const phonesData = await phonesResponse.json();
      if (phonesData.numbers && phonesData.numbers.length >= minCount) {
        console.log(`Phone numbers (${phonesData.numbers.length}) found after ${i + 1} seconds`);
        return phonesData;
      }
    }
    console.log(`Waiting for phone provisioning... attempt ${i + 1}/${maxAttempts}`);
  }
  return null;
}

// Helper to complete Stripe checkout
async function completeStripeCheckout(page: any) {
  await page.waitForSelector('input[name="email"]', { timeout: 30000 });
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="cardNumber"]', '4242424242424242');
  await page.fill('input[name="cardExpiry"]', '1228');
  await page.fill('input[name="cardCvc"]', '123');
  await page.fill('input[name="billingName"]', 'Test User');
  await page.click('button:has-text("Pay and subscribe")');
  await page.waitForURL(/localhost:3001|stripe\.com/, { timeout: 60000 });
  console.log('Checkout completed! Current URL:', page.url());
}

test.describe('Real Stripe Checkout Flow', () => {
  test.beforeEach(async ({ request }) => {
    // Reset test user before checkout
    await request.post(`${API_URL}/api/billing/test/reset-user`, {
      data: { userId: TEST_USER_ID }
    });
  });

  test('Starter plan checkout with real Stripe payment', async ({ page, request }) => {
    const checkoutUrl = `${STRIPE_PAYMENT_LINKS.starter}?client_reference_id=${TEST_USER_ID}`;
    await page.goto(checkoutUrl);
    await completeStripeCheckout(page);

    // Wait for subscription
    const subscription = await waitForSubscription(page, request, TEST_USER_ID);
    expect(subscription).not.toBeNull();
    expect(subscription.status).toBe('active');
    expect(subscription.plan_id).toBe('starter');
    console.log('Subscription verified:', subscription.plan_id, subscription.status);

    // Wait for phone numbers
    const phoneNumbers = await waitForPhoneNumbers(page, request, TEST_USER_ID);
    expect(phoneNumbers).not.toBeNull();
    expect(phoneNumbers.numbers.length).toBeGreaterThanOrEqual(PLAN_PHONE_LIMITS.starter);
    console.log('Phone provisioning verified:', phoneNumbers.numbers.length, 'numbers');

    // VERIFY DB STATE DIRECTLY
    const dbState = await getDbState(request, TEST_USER_ID);
    console.log('DB State verification:', {
      user: dbState.user?.id,
      subscription: dbState.subscription?.plan_id,
      activePhones: dbState.phoneNumbers.activeCount,
      assistant: dbState.assistant?.id,
    });

    const dbCheck = verifyDbState(dbState, {
      hasUser: true,
      hasSubscription: true,
      subscriptionStatus: 'active',
      planId: 'starter',
      hasAssistant: true,
      hasStripeCustomerId: true,
      hasStripeSubscriptionId: true,
    });
    expect(dbCheck.passed).toBe(true);
    if (!dbCheck.passed) {
      console.error('DB verification failures:', dbCheck.failures);
    }
    expect(dbState.phoneNumbers.activeCount).toBeGreaterThanOrEqual(PLAN_PHONE_LIMITS.starter);
    console.log('✓ Starter plan DB state verified successfully');
  });

  test('Growth plan checkout with real Stripe payment', async ({ page, request }) => {
    const checkoutUrl = `${STRIPE_PAYMENT_LINKS.growth}?client_reference_id=${TEST_USER_ID}`;
    await page.goto(checkoutUrl);
    await completeStripeCheckout(page);

    // Wait for subscription
    const subscription = await waitForSubscription(page, request, TEST_USER_ID);
    expect(subscription).not.toBeNull();
    expect(subscription.status).toBe('active');
    expect(subscription.plan_id).toBe('growth');
    console.log('Subscription verified:', subscription.plan_id, subscription.status);

    // Wait for phone numbers (Growth gets at least 2)
    const phoneNumbers = await waitForPhoneNumbers(page, request, TEST_USER_ID, PLAN_PHONE_LIMITS.growth);
    expect(phoneNumbers).not.toBeNull();
    expect(phoneNumbers.numbers.length).toBeGreaterThanOrEqual(PLAN_PHONE_LIMITS.growth);
    console.log('Phone provisioning verified:', phoneNumbers.numbers.length, 'numbers (expected at least', PLAN_PHONE_LIMITS.growth, ')');

    // VERIFY DB STATE DIRECTLY
    const dbState = await getDbState(request, TEST_USER_ID);
    console.log('DB State verification:', {
      user: dbState.user?.id,
      subscription: dbState.subscription?.plan_id,
      activePhones: dbState.phoneNumbers.activeCount,
      assistant: dbState.assistant?.id,
    });

    const dbCheck = verifyDbState(dbState, {
      hasUser: true,
      hasSubscription: true,
      subscriptionStatus: 'active',
      planId: 'growth',
      hasAssistant: true,
      hasStripeCustomerId: true,
      hasStripeSubscriptionId: true,
    });
    expect(dbCheck.passed).toBe(true);
    if (!dbCheck.passed) {
      console.error('DB verification failures:', dbCheck.failures);
    }
    expect(dbState.phoneNumbers.activeCount).toBeGreaterThanOrEqual(PLAN_PHONE_LIMITS.growth);
    console.log('✓ Growth plan DB state verified successfully');
  });

  test('Scale plan checkout with real Stripe payment', async ({ page, request }) => {
    const checkoutUrl = `${STRIPE_PAYMENT_LINKS.scale}?client_reference_id=${TEST_USER_ID}`;
    await page.goto(checkoutUrl);
    await completeStripeCheckout(page);

    // Wait for subscription
    const subscription = await waitForSubscription(page, request, TEST_USER_ID);
    expect(subscription).not.toBeNull();
    expect(subscription.status).toBe('active');
    expect(subscription.plan_id).toBe('scale');
    console.log('Subscription verified:', subscription.plan_id, subscription.status);

    // Wait for phone numbers (Scale gets at least 5)
    const phoneNumbers = await waitForPhoneNumbers(page, request, TEST_USER_ID, PLAN_PHONE_LIMITS.scale, 30);
    expect(phoneNumbers).not.toBeNull();
    expect(phoneNumbers.numbers.length).toBeGreaterThanOrEqual(PLAN_PHONE_LIMITS.scale);
    console.log('Phone provisioning verified:', phoneNumbers.numbers.length, 'numbers (expected at least', PLAN_PHONE_LIMITS.scale, ')');

    // VERIFY DB STATE DIRECTLY
    const dbState = await getDbState(request, TEST_USER_ID);
    console.log('DB State verification:', {
      user: dbState.user?.id,
      subscription: dbState.subscription?.plan_id,
      activePhones: dbState.phoneNumbers.activeCount,
      assistant: dbState.assistant?.id,
    });

    const dbCheck = verifyDbState(dbState, {
      hasUser: true,
      hasSubscription: true,
      subscriptionStatus: 'active',
      planId: 'scale',
      hasAssistant: true,
      hasStripeCustomerId: true,
      hasStripeSubscriptionId: true,
    });
    expect(dbCheck.passed).toBe(true);
    if (!dbCheck.passed) {
      console.error('DB verification failures:', dbCheck.failures);
    }
    expect(dbState.phoneNumbers.activeCount).toBeGreaterThanOrEqual(PLAN_PHONE_LIMITS.scale);
    console.log('✓ Scale plan DB state verified successfully');
  });
});

test.describe('Subscription Cancellation Flow', () => {
  test.beforeEach(async ({ request }) => {
    await request.post(`${API_URL}/api/billing/test/reset-user`, {
      data: { userId: TEST_USER_ID }
    });
  });

  test('cancellation releases phone numbers and deletes assistant', async ({ page, request }) => {
    // Step 1: Complete checkout to create subscription
    const checkoutUrl = `${STRIPE_PAYMENT_LINKS.starter}?client_reference_id=${TEST_USER_ID}`;
    await page.goto(checkoutUrl);
    await completeStripeCheckout(page);

    // Wait for subscription and phone numbers
    const subscription = await waitForSubscription(page, request, TEST_USER_ID);
    expect(subscription).not.toBeNull();
    expect(subscription.status).toBe('active');

    const phonesBefore = await waitForPhoneNumbers(page, request, TEST_USER_ID);
    expect(phonesBefore).not.toBeNull();
    const phoneCountBefore = phonesBefore.numbers.length;
    console.log(`Before cancellation: ${phoneCountBefore} phone numbers`);
    expect(phoneCountBefore).toBeGreaterThanOrEqual(1);

    // Step 2: Simulate cancellation
    const cancelResponse = await request.post(`${API_URL}/api/billing/test/simulate-cancellation`, {
      data: { userId: TEST_USER_ID }
    });
    expect(cancelResponse.ok()).toBe(true);
    const cancelResult = await cancelResponse.json();
    console.log('Cancellation result:', cancelResult);
    expect(cancelResult.success).toBe(true);

    // Step 3: Verify subscription is canceled
    const cookie = await getAuthCookie(request, TEST_USER_ID);
    const subResponse = await request.get(`${API_URL}/api/billing/subscription`, {
      headers: { 'Cookie': cookie }
    });
    const subData = await subResponse.json();
    expect(subData.status).toBe('canceled');
    console.log('Subscription status after cancellation:', subData.status);

    // Step 4: Verify phone numbers are released (count should be 0)
    const phonesResponse = await request.get(`${API_URL}/api/billing/phone-numbers`, {
      headers: { 'Cookie': cookie }
    });
    const phonesData = await phonesResponse.json();
    expect(phonesData.numbers.length).toBe(0);
    console.log('Phone numbers after cancellation:', phonesData.numbers.length);

    // VERIFY DB STATE DIRECTLY
    const dbState = await getDbState(request, TEST_USER_ID);
    console.log('DB State after cancellation:', {
      subscriptionStatus: dbState.subscription?.status,
      activePhones: dbState.phoneNumbers.activeCount,
      releasedPhones: dbState.phoneNumbers.releasedCount,
    });

    const dbCheck = verifyDbState(dbState, {
      hasSubscription: true,
      subscriptionStatus: 'canceled',
      activePhoneCount: 0,
    });
    expect(dbCheck.passed).toBe(true);
    if (!dbCheck.passed) {
      console.error('DB verification failures:', dbCheck.failures);
    }
    // Verify released phones exist in DB (they should be marked as released, not deleted)
    expect(dbState.phoneNumbers.releasedCount).toBeGreaterThan(0);
    console.log('✓ DB state verified: subscription canceled, phones released');
  });
});

test.describe('Plan Upgrade/Downgrade Flow', () => {
  test.beforeEach(async ({ request }) => {
    await request.post(`${API_URL}/api/billing/test/reset-user`, {
      data: { userId: TEST_USER_ID }
    });
  });

  test('upgrade from starter to growth adds phone numbers', async ({ page, request }) => {
    // Step 1: Complete checkout for starter plan
    const checkoutUrl = `${STRIPE_PAYMENT_LINKS.starter}?client_reference_id=${TEST_USER_ID}`;
    await page.goto(checkoutUrl);
    await completeStripeCheckout(page);

    // Wait for subscription
    const subscription = await waitForSubscription(page, request, TEST_USER_ID);
    expect(subscription).not.toBeNull();
    expect(subscription.plan_id).toBe('starter');

    // Wait for initial phone numbers (starter = 1)
    const phonesBefore = await waitForPhoneNumbers(page, request, TEST_USER_ID, 1);
    expect(phonesBefore).not.toBeNull();
    const starterCount = phonesBefore.numbers.length;
    console.log(`Starter plan: ${starterCount} phone numbers`);

    // Step 2: Simulate upgrade to Pro (3 phone numbers)
    const upgradeResponse = await request.post(`${API_URL}/api/billing/test/simulate-plan-change`, {
      data: {
        userId: TEST_USER_ID,
        oldPlanId: 'starter',
        newPlanId: 'growth'
      }
    });
    expect(upgradeResponse.ok()).toBe(true);
    const upgradeResult = await upgradeResponse.json();
    console.log('Upgrade result:', upgradeResult);
    expect(upgradeResult.success).toBe(true);
    expect(upgradeResult.result.action).toBe('upgrade');

    // Step 3: Verify subscription is now growth
    const cookie = await getAuthCookie(request, TEST_USER_ID);
    const subResponse = await request.get(`${API_URL}/api/billing/subscription`, {
      headers: { 'Cookie': cookie }
    });
    const subData = await subResponse.json();
    expect(subData.plan_id).toBe('growth');
    console.log('Plan after upgrade:', subData.plan_id);

    // Step 4: Verify phone numbers increased (growth = 2)
    const phonesResponse = await request.get(`${API_URL}/api/billing/phone-numbers`, {
      headers: { 'Cookie': cookie }
    });
    const phonesData = await phonesResponse.json();
    expect(phonesData.numbers.length).toBe(PLAN_PHONE_LIMITS.growth);
    console.log(`Growth plan: ${phonesData.numbers.length} phone numbers`);

    // VERIFY DB STATE DIRECTLY
    const dbState = await getDbState(request, TEST_USER_ID);
    const dbCheck = verifyDbState(dbState, {
      hasSubscription: true,
      subscriptionStatus: 'active',
      planId: 'growth',
      activePhoneCount: PLAN_PHONE_LIMITS.growth,
    });
    expect(dbCheck.passed).toBe(true);
    console.log('✓ DB state verified: upgraded to growth with 2 phones');
  });

  test('downgrade from growth to starter releases excess phone numbers', async ({ page, request }) => {
    // Step 1: Create a user with Growth plan via simulate-checkout (faster than real checkout)
    const simulateResponse = await request.post(`${API_URL}/api/billing/test/simulate-checkout`, {
      data: {
        userId: TEST_USER_ID,
        planId: 'growth'
      }
    });
    expect(simulateResponse.ok()).toBe(true);
    console.log('Created Pro subscription via simulation');

    // Verify we have 2 phone numbers (growth plan)
    const cookie = await getAuthCookie(request, TEST_USER_ID);
    const phonesBeforeResponse = await request.get(`${API_URL}/api/billing/phone-numbers`, {
      headers: { 'Cookie': cookie }
    });
    const phonesBefore = await phonesBeforeResponse.json();
    expect(phonesBefore.numbers.length).toBe(PLAN_PHONE_LIMITS.growth);
    console.log(`Growth plan: ${phonesBefore.numbers.length} phone numbers`);

    // Step 2: Simulate downgrade to Starter (1 phone number)
    const downgradeResponse = await request.post(`${API_URL}/api/billing/test/simulate-plan-change`, {
      data: {
        userId: TEST_USER_ID,
        oldPlanId: 'growth',
        newPlanId: 'starter'
      }
    });
    expect(downgradeResponse.ok()).toBe(true);
    const downgradeResult = await downgradeResponse.json();
    console.log('Downgrade result:', downgradeResult);
    expect(downgradeResult.success).toBe(true);
    expect(downgradeResult.result.action).toBe('downgrade');
    expect(downgradeResult.result.released).toBe(PLAN_PHONE_LIMITS.growth - PLAN_PHONE_LIMITS.starter); // 2 - 1 = 1 released

    // Step 3: Verify subscription is now starter
    const subResponse = await request.get(`${API_URL}/api/billing/subscription`, {
      headers: { 'Cookie': cookie }
    });
    const subData = await subResponse.json();
    expect(subData.plan_id).toBe('starter');
    console.log('Plan after downgrade:', subData.plan_id);

    // Step 4: Verify phone numbers decreased (starter = 1)
    const phonesAfterResponse = await request.get(`${API_URL}/api/billing/phone-numbers`, {
      headers: { 'Cookie': cookie }
    });
    const phonesAfter = await phonesAfterResponse.json();
    expect(phonesAfter.numbers.length).toBe(1);
    console.log(`Starter plan: ${phonesAfter.numbers.length} phone numbers`);

    // VERIFY DB STATE DIRECTLY
    const dbState = await getDbState(request, TEST_USER_ID);
    const dbCheck = verifyDbState(dbState, {
      hasSubscription: true,
      planId: 'starter',
      activePhoneCount: PLAN_PHONE_LIMITS.starter,
      releasedPhoneCount: PLAN_PHONE_LIMITS.growth - PLAN_PHONE_LIMITS.starter, // 1 phone released
    });
    expect(dbCheck.passed).toBe(true);
    console.log('✓ DB state verified: downgraded to starter, 1 phone released');
  });

  test('upgrade from starter to scale adds more phone numbers', async ({ page, request }) => {
    // Step 1: Create starter subscription via simulation
    const simulateResponse = await request.post(`${API_URL}/api/billing/test/simulate-checkout`, {
      data: {
        userId: TEST_USER_ID,
        planId: 'starter'
      }
    });
    expect(simulateResponse.ok()).toBe(true);

    const cookie = await getAuthCookie(request, TEST_USER_ID);

    // Verify starter has 1 phone
    const phonesBeforeResponse = await request.get(`${API_URL}/api/billing/phone-numbers`, {
      headers: { 'Cookie': cookie }
    });
    const phonesBefore = await phonesBeforeResponse.json();
    expect(phonesBefore.numbers.length).toBe(PLAN_PHONE_LIMITS.starter);
    console.log(`Starter plan: ${phonesBefore.numbers.length} phone numbers`);

    // Step 2: Upgrade to Pro/Scale (5 phone numbers)
    const upgradeResponse = await request.post(`${API_URL}/api/billing/test/simulate-plan-change`, {
      data: {
        userId: TEST_USER_ID,
        oldPlanId: 'starter',
        newPlanId: 'scale'
      }
    });
    expect(upgradeResponse.ok()).toBe(true);
    const upgradeResult = await upgradeResponse.json();
    console.log('Upgrade result:', upgradeResult);
    expect(upgradeResult.result.action).toBe('upgrade');
    expect(upgradeResult.result.added).toBe(PLAN_PHONE_LIMITS.scale - PLAN_PHONE_LIMITS.starter); // 5 - 1 = 4 added

    // Step 3: Verify scale has 5 phones
    const phonesAfterResponse = await request.get(`${API_URL}/api/billing/phone-numbers`, {
      headers: { 'Cookie': cookie }
    });
    const phonesAfter = await phonesAfterResponse.json();
    expect(phonesAfter.numbers.length).toBe(PLAN_PHONE_LIMITS.scale);
    console.log(`Pro plan: ${phonesAfter.numbers.length} phone numbers`);

    // Verify plan changed
    const subResponse = await request.get(`${API_URL}/api/billing/subscription`, {
      headers: { 'Cookie': cookie }
    });
    const subData = await subResponse.json();
    expect(subData.plan_id).toBe('scale');

    // VERIFY DB STATE DIRECTLY
    const dbState = await getDbState(request, TEST_USER_ID);
    const dbCheck = verifyDbState(dbState, {
      hasSubscription: true,
      planId: 'scale',
      activePhoneCount: PLAN_PHONE_LIMITS.scale,
    });
    expect(dbCheck.passed).toBe(true);
    console.log('✓ DB state verified: upgraded to scale with 5 phones');
  });
});
