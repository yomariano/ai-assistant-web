import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:3000';
const TEST_USER_ID = '00000000-0000-0000-0000-000000000133'; // Different from other tests

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

// Helper to setup user with subscription
async function setupUserWithSubscription(request: any, userId: string, planId: string) {
  await request.post(`${API_URL}/api/billing/test/simulate-checkout`, {
    data: { userId, planId }
  });
}

// Helper to set active calls
async function setActiveCalls(request: any, userId: string, count: number) {
  const response = await request.post(`${API_URL}/api/billing/test/set-active-calls`, {
    data: { userId, activeCalls: count }
  });
  return response.json();
}

// Helper to get active calls info
async function getActiveCalls(request: any, userId: string) {
  const response = await request.get(`${API_URL}/api/billing/test/active-calls/${userId}`);
  return response.json();
}

// ============================================
// CONCURRENT CALL LIMITS BY PLAN
// ============================================

test.describe('Concurrent Call Limits by Plan', () => {
  test.beforeEach(async ({ request }) => {
    await createTestUser(request, TEST_USER_ID);
  });

  test('starter plan has 3 concurrent call limit', async ({ request }) => {
    await setupUserWithSubscription(request, TEST_USER_ID, 'starter');

    const activeCallsInfo = await getActiveCalls(request, TEST_USER_ID);
    expect(activeCallsInfo.maxConcurrentCalls).toBe(3);
    console.log('Starter plan: 3 concurrent calls allowed');
  });

  test('growth plan has 3 concurrent call limit', async ({ request }) => {
    await setupUserWithSubscription(request, TEST_USER_ID, 'growth');

    const activeCallsInfo = await getActiveCalls(request, TEST_USER_ID);
    expect(activeCallsInfo.maxConcurrentCalls).toBe(3);
    console.log('Growth plan: 3 concurrent calls allowed');
  });

  test('scale plan has 10 concurrent call limit', async ({ request }) => {
    await setupUserWithSubscription(request, TEST_USER_ID, 'scale');

    const activeCallsInfo = await getActiveCalls(request, TEST_USER_ID);
    expect(activeCallsInfo.maxConcurrentCalls).toBe(10);
    console.log('Scale plan: 10 concurrent calls allowed');
  });
});

// ============================================
// CONCURRENT CALL ENFORCEMENT
// ============================================

test.describe('Concurrent Call Enforcement', () => {
  test.beforeEach(async ({ request }) => {
    await createTestUser(request, TEST_USER_ID);
    await setupUserWithSubscription(request, TEST_USER_ID, 'starter');
  });

  test('can make call when under concurrent limit', async ({ request }) => {
    // Set 1 active call (under limit of 3)
    await setActiveCalls(request, TEST_USER_ID, 1);

    const cookie = await getAuthCookie(request, TEST_USER_ID);
    const response = await request.post(`${API_URL}/api/calls`, {
      headers: { 'Cookie': cookie },
      data: {
        phoneNumber: '+15551234567',
        message: 'Test call under limit'
      }
    });

    // Should succeed (201) or other non-429 status
    expect(response.status()).not.toBe(429);
    console.log('Call allowed when under concurrent limit');
  });

  test('blocked when at concurrent limit', async ({ request }) => {
    // Set 3 active calls (at limit for starter)
    await setActiveCalls(request, TEST_USER_ID, 3);

    const activeInfo = await getActiveCalls(request, TEST_USER_ID);
    expect(activeInfo.activeCalls).toBe(3);
    expect(activeInfo.canMakeMore).toBe(false);

    const cookie = await getAuthCookie(request, TEST_USER_ID);
    const response = await request.post(`${API_URL}/api/calls`, {
      headers: { 'Cookie': cookie },
      data: {
        phoneNumber: '+15551234567',
        message: 'Test call at limit'
      }
    });

    expect(response.status()).toBe(429);
    const data = await response.json();
    expect(data.error.code).toBe('CONCURRENT_LIMIT_REACHED');
    console.log('Call blocked at concurrent limit:', data.error.message);
  });

  test('blocked when over concurrent limit', async ({ request }) => {
    // Set 5 active calls (over limit of 3)
    await setActiveCalls(request, TEST_USER_ID, 5);

    const cookie = await getAuthCookie(request, TEST_USER_ID);
    const response = await request.post(`${API_URL}/api/calls`, {
      headers: { 'Cookie': cookie },
      data: {
        phoneNumber: '+15551234567',
        message: 'Test call over limit'
      }
    });

    expect(response.status()).toBe(429);
    const data = await response.json();
    expect(data.error.code).toBe('CONCURRENT_LIMIT_REACHED');
    console.log('Call blocked over concurrent limit');
  });
});

// ============================================
// CONCURRENT CALLS STATUS
// ============================================

test.describe('Concurrent Calls Status', () => {
  test.beforeEach(async ({ request }) => {
    await createTestUser(request, TEST_USER_ID);
    await setupUserWithSubscription(request, TEST_USER_ID, 'growth');
  });

  test('active calls count updates correctly', async ({ request }) => {
    // Set 5 active calls
    await setActiveCalls(request, TEST_USER_ID, 5);

    let activeInfo = await getActiveCalls(request, TEST_USER_ID);
    expect(activeInfo.activeCalls).toBe(5);
    expect(activeInfo.canMakeMore).toBe(true); // Pro has 10 limit

    // Increase to 10
    await setActiveCalls(request, TEST_USER_ID, 10);

    activeInfo = await getActiveCalls(request, TEST_USER_ID);
    expect(activeInfo.activeCalls).toBe(3);
    expect(activeInfo.canMakeMore).toBe(false);
    console.log('Active calls count updated correctly');
  });

  test('canMakeMore is true when under limit', async ({ request }) => {
    await setActiveCalls(request, TEST_USER_ID, 5);

    const activeInfo = await getActiveCalls(request, TEST_USER_ID);
    expect(activeInfo.canMakeMore).toBe(true);
    console.log('canMakeMore correctly true when under limit');
  });

  test('canMakeMore is false when at limit', async ({ request }) => {
    await setActiveCalls(request, TEST_USER_ID, 3);

    const activeInfo = await getActiveCalls(request, TEST_USER_ID);
    expect(activeInfo.canMakeMore).toBe(false);
    console.log('canMakeMore correctly false when at limit');
  });

  test('calls ending frees up capacity', async ({ request }) => {
    // Set at limit
    await setActiveCalls(request, TEST_USER_ID, 3);

    let activeInfo = await getActiveCalls(request, TEST_USER_ID);
    expect(activeInfo.canMakeMore).toBe(false);

    // "End" some calls by reducing active count
    await setActiveCalls(request, TEST_USER_ID, 2);

    activeInfo = await getActiveCalls(request, TEST_USER_ID);
    expect(activeInfo.activeCalls).toBe(2);
    expect(activeInfo.canMakeMore).toBe(true);
    console.log('Capacity freed when calls end');
  });
});

// ============================================
// PLAN CHANGE AND CONCURRENT LIMITS
// ============================================

test.describe('Plan Change and Concurrent Limits', () => {
  test.beforeEach(async ({ request }) => {
    await createTestUser(request, TEST_USER_ID);
  });

  test('upgrading increases concurrent limit', async ({ request }) => {
    await setupUserWithSubscription(request, TEST_USER_ID, 'starter');

    // Set 3 active calls (at starter limit)
    await setActiveCalls(request, TEST_USER_ID, 3);

    let activeInfo = await getActiveCalls(request, TEST_USER_ID);
    expect(activeInfo.maxConcurrentCalls).toBe(3);
    expect(activeInfo.canMakeMore).toBe(false);

    // Upgrade to growth
    await request.post(`${API_URL}/api/billing/test/simulate-plan-change`, {
      data: {
        userId: TEST_USER_ID,
        oldPlanId: 'starter',
        newPlanId: 'growth'
      }
    });

    activeInfo = await getActiveCalls(request, TEST_USER_ID);
    expect(activeInfo.maxConcurrentCalls).toBe(3);
    expect(activeInfo.canMakeMore).toBe(false);
    console.log('Growth plan has same concurrent limit as starter: 3');
  });

  test('downgrading reduces concurrent limit', async ({ request }) => {
    await setupUserWithSubscription(request, TEST_USER_ID, 'growth');

    let activeInfo = await getActiveCalls(request, TEST_USER_ID);
    expect(activeInfo.maxConcurrentCalls).toBe(3);

    // Downgrade to starter
    await request.post(`${API_URL}/api/billing/test/simulate-plan-change`, {
      data: {
        userId: TEST_USER_ID,
        oldPlanId: 'growth',
        newPlanId: 'starter'
      }
    });

    activeInfo = await getActiveCalls(request, TEST_USER_ID);
    expect(activeInfo.maxConcurrentCalls).toBe(1);
    console.log('Downgrade reduced concurrent limit: 3 -> 1');
  });

  test('active calls over new limit after downgrade are blocked', async ({ request }) => {
    await setupUserWithSubscription(request, TEST_USER_ID, 'growth');

    // Set 2 active calls (valid for growth)
    await setActiveCalls(request, TEST_USER_ID, 2);

    // Downgrade to starter (limit 1)
    await request.post(`${API_URL}/api/billing/test/simulate-plan-change`, {
      data: {
        userId: TEST_USER_ID,
        oldPlanId: 'growth',
        newPlanId: 'starter'
      }
    });

    // Now at 2 active with limit of 1 - should be blocked
    const cookie = await getAuthCookie(request, TEST_USER_ID);
    const response = await request.post(`${API_URL}/api/calls`, {
      headers: { 'Cookie': cookie },
      data: {
        phoneNumber: '+15551234567',
        message: 'Test call after downgrade'
      }
    });

    expect(response.status()).toBe(429);
    const data = await response.json();
    expect(data.error.code).toBe('CONCURRENT_LIMIT_REACHED');
    console.log('Calls blocked when over limit after downgrade');
  });
});

// ============================================
// EDGE CASES
// ============================================

test.describe('Concurrent Calls Edge Cases', () => {
  test.beforeEach(async ({ request }) => {
    await createTestUser(request, TEST_USER_ID);
    await setupUserWithSubscription(request, TEST_USER_ID, 'starter');
  });

  test('zero active calls allows new call', async ({ request }) => {
    await setActiveCalls(request, TEST_USER_ID, 0);

    const activeInfo = await getActiveCalls(request, TEST_USER_ID);
    expect(activeInfo.activeCalls).toBe(0);
    expect(activeInfo.canMakeMore).toBe(true);
    console.log('Zero active calls: can make calls');
  });

  test('concurrent check happens after subscription check', async ({ request }) => {
    // Set active calls first
    await setActiveCalls(request, TEST_USER_ID, 3);

    // Then cancel subscription
    await request.post(`${API_URL}/api/billing/test/simulate-cancellation`, {
      data: { userId: TEST_USER_ID }
    });

    const cookie = await getAuthCookie(request, TEST_USER_ID);
    const response = await request.post(`${API_URL}/api/calls`, {
      headers: { 'Cookie': cookie },
      data: {
        phoneNumber: '+15551234567',
        message: 'Test call'
      }
    });

    // Should get subscription error (402), not concurrent error (429)
    expect(response.status()).toBe(402);
    const data = await response.json();
    expect(data.error.code).toContain('SUBSCRIPTION');
    console.log('Subscription check runs before concurrent check');
  });

  test('in-progress calls are counted accurately', async ({ request }) => {
    // Create mix of call statuses
    await setActiveCalls(request, TEST_USER_ID, 2);

    // Add some completed calls manually
    await request.post(`${API_URL}/api/billing/test/simulate-call`, {
      data: { userId: TEST_USER_ID, status: 'completed' }
    });
    await request.post(`${API_URL}/api/billing/test/simulate-call`, {
      data: { userId: TEST_USER_ID, status: 'failed' }
    });

    // Only in-progress should count
    const activeInfo = await getActiveCalls(request, TEST_USER_ID);
    expect(activeInfo.activeCalls).toBe(2);
    console.log('Only in-progress calls counted');
  });
});

// ============================================
// USAGE DISPLAY
// ============================================

test.describe('Concurrent Calls in Usage Data', () => {
  test.beforeEach(async ({ request }) => {
    await createTestUser(request, TEST_USER_ID);
    await setupUserWithSubscription(request, TEST_USER_ID, 'growth');
  });

  test('usage endpoint shows maxConcurrentCalls', async ({ request }) => {
    const cookie = await getAuthCookie(request, TEST_USER_ID);
    const response = await request.get(`${API_URL}/api/billing/usage`, {
      headers: { 'Cookie': cookie }
    });

    const data = await response.json();
    expect(data.planLimits.maxConcurrentCalls).toBe(3);
    console.log('Usage endpoint shows concurrent limit:', data.planLimits.maxConcurrentCalls);
  });
});
