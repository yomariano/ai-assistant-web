import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:3000';
const TEST_USER_ID = '00000000-0000-0000-0000-000000000055'; // Different from other tests

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

// Helper to simulate a call
async function simulateCall(request: any, userId: string, options: {
  phoneNumber?: string;
  durationSeconds?: number;
  status?: string;
  message?: string;
} = {}) {
  const response = await request.post(`${API_URL}/api/billing/test/simulate-call`, {
    data: { userId, ...options }
  });
  return response.json();
}

// Helper to set usage
async function setUsage(request: any, userId: string, minutesUsed: number, callsMade: number, isTrial = false) {
  await request.post(`${API_URL}/api/billing/test/set-usage`, {
    data: { userId, minutesUsed, callsMade, isTrial }
  });
}

// ============================================
// CALL SIMULATION TESTS
// ============================================

test.describe('Call Simulation', () => {
  test.beforeEach(async ({ request }) => {
    await createTestUser(request, TEST_USER_ID);
    await setupUserWithSubscription(request, TEST_USER_ID, 'starter');
  });

  test('simulated call creates call history record', async ({ request }) => {
    // Simulate a call
    const result = await simulateCall(request, TEST_USER_ID, {
      phoneNumber: '+15559876543',
      durationSeconds: 120,
      message: 'Hello, this is a test call'
    });

    expect(result.success).toBe(true);
    expect(result.call).toBeDefined();
    expect(result.call.phone_number).toBe('+15559876543');
    expect(result.call.duration_seconds).toBe(120);
    expect(result.call.status).toBe('completed');
    console.log('Call simulated:', result.call.id);

    // Verify in DB
    const dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.callHistory.length).toBeGreaterThan(0);
    const lastCall = dbState.callHistory[0];
    expect(lastCall.phone_number).toBe('+15559876543');
    expect(lastCall.status).toBe('completed');
    console.log('Call history verified in DB');
  });

  test('simulated call updates usage tracking', async ({ request }) => {
    // Get initial usage
    let dbState = await getDbState(request, TEST_USER_ID);
    const initialMinutes = dbState.usage?.minutes_used || 0;
    const initialCalls = dbState.usage?.calls_made || 0;

    // Simulate a 3-minute call (180 seconds)
    await simulateCall(request, TEST_USER_ID, {
      durationSeconds: 180
    });

    // Verify usage increased
    dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.usage.minutes_used).toBeGreaterThan(initialMinutes);
    expect(dbState.usage.calls_made).toBeGreaterThan(initialCalls);
    console.log('Usage after call:', {
      minutesUsed: dbState.usage.minutes_used,
      callsMade: dbState.usage.calls_made
    });
  });

  test('multiple calls accumulate in history', async ({ request }) => {
    // Simulate 3 calls
    await simulateCall(request, TEST_USER_ID, { message: 'Call 1' });
    await simulateCall(request, TEST_USER_ID, { message: 'Call 2' });
    await simulateCall(request, TEST_USER_ID, { message: 'Call 3' });

    // Verify all 3 are in history
    const dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.callHistory.length).toBeGreaterThanOrEqual(3);
    console.log('Call history count:', dbState.callHistory.length);
  });

  test('failed call does not update usage', async ({ request }) => {
    // Get initial usage
    let dbState = await getDbState(request, TEST_USER_ID);
    const initialMinutes = dbState.usage?.minutes_used || 0;

    // Simulate a failed call
    await simulateCall(request, TEST_USER_ID, {
      status: 'failed',
      durationSeconds: 0
    });

    // Verify usage did not increase
    dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.usage?.minutes_used || 0).toBe(initialMinutes);
    console.log('Failed call did not affect usage');
  });
});

// ============================================
// USAGE ENFORCEMENT TESTS
// ============================================

test.describe('Usage Enforcement - Subscription Status', () => {
  test.beforeEach(async ({ request }) => {
    await createTestUser(request, TEST_USER_ID);
  });

  test('user without subscription cannot make calls', async ({ request }) => {
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    // Try to make a call without subscription
    const response = await request.post(`${API_URL}/api/calls`, {
      headers: { 'Cookie': cookie },
      data: {
        phoneNumber: '+15551234567',
        message: 'Test call'
      }
    });

    // Should be blocked
    expect(response.status()).toBe(402);
    const data = await response.json();
    expect(data.error.code).toBe('NO_SUBSCRIPTION');
    console.log('No subscription block:', data.error.message);
  });

  test('canceled subscription cannot make calls', async ({ request }) => {
    await setupUserWithSubscription(request, TEST_USER_ID, 'starter');
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    // Cancel subscription
    await request.post(`${API_URL}/api/billing/test/simulate-cancellation`, {
      data: { userId: TEST_USER_ID }
    });

    // Try to make a call
    const response = await request.post(`${API_URL}/api/calls`, {
      headers: { 'Cookie': cookie },
      data: {
        phoneNumber: '+15551234567',
        message: 'Test call'
      }
    });

    // Should be blocked
    expect(response.status()).toBe(402);
    const data = await response.json();
    expect(data.error.code).toContain('SUBSCRIPTION');
    console.log('Canceled subscription block:', data.error.message);
  });
});

test.describe('Usage Enforcement - Trial Limits', () => {
  test.beforeEach(async ({ request }) => {
    await createTestUser(request, TEST_USER_ID);
  });

  test('trial user can make calls within limit', async ({ request }) => {
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    // Start trial
    await request.post(`${API_URL}/api/billing/start-trial`, {
      headers: { 'Cookie': cookie },
      data: { planId: 'starter' }
    });

    // Check if calls endpoint exists and returns appropriate response
    const response = await request.post(`${API_URL}/api/calls`, {
      headers: { 'Cookie': cookie },
      data: {
        phoneNumber: '+15551234567',
        message: 'Test call during trial'
      }
    });

    // Trial should allow call (may fail due to VAPI but not due to limits)
    // 402 = payment required (limits), other errors = different issues
    if (response.status() === 402) {
      const data = await response.json();
      expect(data.error.code).not.toBe('TRIAL_CALLS_EXHAUSTED');
    }
    console.log('Trial call response status:', response.status());
  });

  test('trial calls exhausted blocks further calls', async ({ request }) => {
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    // Start trial
    await request.post(`${API_URL}/api/billing/start-trial`, {
      headers: { 'Cookie': cookie },
      data: { planId: 'starter' }
    });

    // Set trial usage to max (default is 3 calls)
    await setUsage(request, TEST_USER_ID, 30, 3, true);

    // Try to make another call
    const response = await request.post(`${API_URL}/api/calls`, {
      headers: { 'Cookie': cookie },
      data: {
        phoneNumber: '+15551234567',
        message: 'Test call after exhausting trial'
      }
    });

    expect(response.status()).toBe(402);
    const data = await response.json();
    expect(data.error.code).toBe('TRIAL_CALLS_EXHAUSTED');
    console.log('Trial exhausted block:', data.error.message);
  });

  test('expired trial blocks calls', async ({ request }) => {
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    // Start trial
    await request.post(`${API_URL}/api/billing/start-trial`, {
      headers: { 'Cookie': cookie },
      data: { planId: 'starter' }
    });

    // Expire the trial
    await request.post(`${API_URL}/api/billing/test/simulate-trial-expiry`, {
      data: { userId: TEST_USER_ID }
    });

    // Try to make a call
    const response = await request.post(`${API_URL}/api/calls`, {
      headers: { 'Cookie': cookie },
      data: {
        phoneNumber: '+15551234567',
        message: 'Test call after trial expired'
      }
    });

    expect(response.status()).toBe(402);
    const data = await response.json();
    expect(data.error.code).toBe('TRIAL_EXPIRED');
    console.log('Trial expired block:', data.error.message);
  });
});

test.describe('Usage Enforcement - Plan Limits', () => {
  test.beforeEach(async ({ request }) => {
    await createTestUser(request, TEST_USER_ID);
    await setupUserWithSubscription(request, TEST_USER_ID, 'starter');
  });

  test('usage tracking shows correct plan limits', async ({ request }) => {
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    const response = await request.get(`${API_URL}/api/billing/usage`, {
      headers: { 'Cookie': cookie }
    });

    expect(response.ok()).toBe(true);
    const data = await response.json();

    // Starter plan: 30 minutes, 1 phone, 10 min/call max
    expect(data.minutesIncluded).toBe(30);
    expect(data.planLimits.phoneNumbers).toBe(1);
    expect(data.maxMinutesPerCall).toBe(10);
    console.log('Plan limits verified:', data.planLimits);
  });

  test('usage shows overage when exceeded', async ({ request }) => {
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    // Set usage above plan limit (starter = 30 minutes)
    await setUsage(request, TEST_USER_ID, 40, 10);

    const response = await request.get(`${API_URL}/api/billing/usage`, {
      headers: { 'Cookie': cookie }
    });

    const data = await response.json();
    expect(data.minutesUsed).toBe(40);
    expect(data.overage.minutes).toBe(10); // 40 - 30 = 10 overage
    expect(data.percentUsed).toBeGreaterThan(100);
    console.log('Overage detected:', data.overage);
  });

  test('growth plan has higher limits than starter', async ({ request }) => {
    await createTestUser(request, TEST_USER_ID);
    await setupUserWithSubscription(request, TEST_USER_ID, 'growth');
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    const response = await request.get(`${API_URL}/api/billing/usage`, {
      headers: { 'Cookie': cookie }
    });

    const data = await response.json();

    // Growth plan: 100 minutes, 2 phones, 15 min/call max
    expect(data.minutesIncluded).toBe(100);
    expect(data.planLimits.phoneNumbers).toBe(2);
    expect(data.maxMinutesPerCall).toBe(15);
    console.log('Growth plan limits verified');
  });
});

// ============================================
// CALL HISTORY TESTS
// ============================================

test.describe('Call History API', () => {
  test.beforeEach(async ({ request }) => {
    await createTestUser(request, TEST_USER_ID);
    await setupUserWithSubscription(request, TEST_USER_ID, 'starter');
  });

  test('call history endpoint returns user calls', async ({ request }) => {
    // Create some calls
    await simulateCall(request, TEST_USER_ID, { message: 'Call 1', phoneNumber: '+15551111111' });
    await simulateCall(request, TEST_USER_ID, { message: 'Call 2', phoneNumber: '+15552222222' });

    const cookie = await getAuthCookie(request, TEST_USER_ID);
    const response = await request.get(`${API_URL}/api/history`, {
      headers: { 'Cookie': cookie }
    });

    expect(response.ok()).toBe(true);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThanOrEqual(2);
    console.log('Call history returned:', data.length, 'calls');
  });

  test('call history includes call details', async ({ request }) => {
    await simulateCall(request, TEST_USER_ID, {
      phoneNumber: '+15559999999',
      durationSeconds: 180,
      message: 'Detailed test call'
    });

    const cookie = await getAuthCookie(request, TEST_USER_ID);
    const response = await request.get(`${API_URL}/api/history`, {
      headers: { 'Cookie': cookie }
    });

    const data = await response.json();
    const call = data[0];

    expect(call.phoneNumber).toBe('+15559999999');
    expect(call.durationSeconds).toBe(180);
    expect(call.message).toBe('Detailed test call');
    expect(call.status).toBe('completed');
    expect(call.createdAt).toBeDefined();
    console.log('Call details verified');
  });

  test('call history pagination works', async ({ request }) => {
    // Create 5 calls
    for (let i = 0; i < 5; i++) {
      await simulateCall(request, TEST_USER_ID, { message: `Call ${i + 1}` });
    }

    const cookie = await getAuthCookie(request, TEST_USER_ID);

    // Get first 2
    const response1 = await request.get(`${API_URL}/api/history?limit=2&offset=0`, {
      headers: { 'Cookie': cookie }
    });
    const data1 = await response1.json();
    expect(data1.length).toBe(2);

    // Get next 2
    const response2 = await request.get(`${API_URL}/api/history?limit=2&offset=2`, {
      headers: { 'Cookie': cookie }
    });
    const data2 = await response2.json();
    expect(data2.length).toBe(2);

    // First and second page should have different calls
    expect(data1[0].id).not.toBe(data2[0].id);
    console.log('Pagination verified');
  });

  test('call history filters by status', async ({ request }) => {
    // Create calls with different statuses
    await simulateCall(request, TEST_USER_ID, { status: 'completed' });
    await simulateCall(request, TEST_USER_ID, { status: 'failed' });

    const cookie = await getAuthCookie(request, TEST_USER_ID);

    // Filter by completed
    const response = await request.get(`${API_URL}/api/history?status=completed`, {
      headers: { 'Cookie': cookie }
    });

    const data = await response.json();
    const allCompleted = data.every((call: any) => call.status === 'completed');
    expect(allCompleted).toBe(true);
    console.log('Status filter verified');
  });

  test('call history ordered by most recent first', async ({ request }) => {
    // Create calls with slight delay
    await simulateCall(request, TEST_USER_ID, { message: 'Older call' });
    await new Promise(resolve => setTimeout(resolve, 100));
    await simulateCall(request, TEST_USER_ID, { message: 'Newer call' });

    const cookie = await getAuthCookie(request, TEST_USER_ID);
    const response = await request.get(`${API_URL}/api/history`, {
      headers: { 'Cookie': cookie }
    });

    const data = await response.json();
    expect(data[0].message).toBe('Newer call');
    expect(data[1].message).toBe('Older call');
    console.log('Order verified: most recent first');
  });
});

test.describe('Call History - Specific Call', () => {
  test.beforeEach(async ({ request }) => {
    await createTestUser(request, TEST_USER_ID);
    await setupUserWithSubscription(request, TEST_USER_ID, 'starter');
  });

  test('get specific call by ID', async ({ request }) => {
    // Create a call and get its ID
    const result = await simulateCall(request, TEST_USER_ID, {
      phoneNumber: '+15553334444',
      message: 'Specific call test'
    });
    const callId = result.call.id;

    const cookie = await getAuthCookie(request, TEST_USER_ID);
    const response = await request.get(`${API_URL}/api/history/${callId}`, {
      headers: { 'Cookie': cookie }
    });

    expect(response.ok()).toBe(true);
    const data = await response.json();
    expect(data.id).toBe(callId);
    expect(data.phoneNumber).toBe('+15553334444');
    console.log('Specific call retrieved:', callId);
  });

  test('cannot access another user call', async ({ request }) => {
    // Create a call for test user
    const result = await simulateCall(request, TEST_USER_ID, {});
    const callId = result.call.id;

    // Try to access with different user
    const otherUserId = '00000000-0000-0000-0000-000000000001'; // dev user
    const cookie = await getAuthCookie(request, otherUserId);

    const response = await request.get(`${API_URL}/api/history/${callId}`, {
      headers: { 'Cookie': cookie }
    });

    // Should be 404 or 403 (not found for this user)
    expect(response.status()).toBeGreaterThanOrEqual(400);
    console.log('Cross-user access blocked');
  });
});

test.describe('Usage Summary in Dashboard', () => {
  test.beforeEach(async ({ request }) => {
    await createTestUser(request, TEST_USER_ID);
    await setupUserWithSubscription(request, TEST_USER_ID, 'starter');
  });

  test('usage summary reflects simulated calls', async ({ request }) => {
    // Simulate some calls
    await simulateCall(request, TEST_USER_ID, { durationSeconds: 60 });  // 1 min
    await simulateCall(request, TEST_USER_ID, { durationSeconds: 120 }); // 2 min
    await simulateCall(request, TEST_USER_ID, { durationSeconds: 90 });  // 2 min (rounded up)

    const cookie = await getAuthCookie(request, TEST_USER_ID);
    const response = await request.get(`${API_URL}/api/billing/usage`, {
      headers: { 'Cookie': cookie }
    });

    const data = await response.json();
    expect(data.callsMade).toBeGreaterThanOrEqual(3);
    expect(data.minutesUsed).toBeGreaterThanOrEqual(5); // 1+2+2 = 5 minutes minimum
    console.log('Usage summary:', {
      calls: data.callsMade,
      minutes: data.minutesUsed
    });
  });

  test('usage percentage calculated correctly', async ({ request }) => {
    // Set usage to 15 minutes (50% of starter's 30 minutes)
    await setUsage(request, TEST_USER_ID, 15, 5);

    const cookie = await getAuthCookie(request, TEST_USER_ID);
    const response = await request.get(`${API_URL}/api/billing/usage`, {
      headers: { 'Cookie': cookie }
    });

    const data = await response.json();
    expect(data.percentUsed).toBe(50);
    expect(data.minutesRemaining).toBe(15);
    console.log('Usage percentage:', data.percentUsed + '%');
  });
});
