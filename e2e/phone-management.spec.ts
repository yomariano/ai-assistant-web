import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:3000';
const TEST_USER_ID = '00000000-0000-0000-0000-000000000122'; // Different from other tests

// Helper to get raw DB state
async function getDbState(request: any, userId: string) {
  const response = await request.get(`${API_URL}/api/billing/test/db-state/${userId}`);
  if (!response.ok()) {
    throw new Error(`Failed to get DB state: ${response.status()}`);
  }
  return response.json();
}

// Helper to get auth cookie
async function getAuthCookie(request: any, userId: string) {
  const response = await request.get(`${API_URL}/api/auth/dev-login?userId=${userId}`);
  return response.headers()['set-cookie'] || '';
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

// Helper to add phone number
async function addPhoneNumber(request: any, userId: string, options?: { phoneNumber?: string; label?: string }) {
  const response = await request.post(`${API_URL}/api/billing/test/add-phone-number`, {
    data: { userId, ...options }
  });
  return response;
}

// Helper to remove phone number
async function removePhoneNumber(request: any, userId: string, options?: { phoneId?: string; phoneNumber?: string }) {
  const response = await request.post(`${API_URL}/api/billing/test/remove-phone-number`, {
    data: { userId, ...options }
  });
  return response;
}

// ============================================
// PHONE NUMBER LIMITS BY PLAN
// ============================================

test.describe('Phone Number Limits by Plan', () => {
  test.beforeEach(async ({ request }) => {
    await createTestUser(request, TEST_USER_ID);
  });

  test('starter plan allows 1 phone number', async ({ request }) => {
    await setupUserWithSubscription(request, TEST_USER_ID, 'starter');

    const dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.phoneNumbers.activeCount).toBe(1);
    console.log('Starter plan: 1 phone number provisioned');
  });

  test('growth plan allows 2 phone numbers', async ({ request }) => {
    await setupUserWithSubscription(request, TEST_USER_ID, 'growth');

    const dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.phoneNumbers.activeCount).toBe(2);
    console.log('Growth plan: 2 phone numbers provisioned');
  });

  test('scale plan allows 5 phone numbers', async ({ request }) => {
    await setupUserWithSubscription(request, TEST_USER_ID, 'scale');

    const dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.phoneNumbers.activeCount).toBe(5);
    console.log('Scale plan: 5 phone numbers provisioned');
  });
});

// ============================================
// ADDING PHONE NUMBERS
// ============================================

test.describe('Adding Phone Numbers', () => {
  test.beforeEach(async ({ request }) => {
    await createTestUser(request, TEST_USER_ID);
  });

  test('can add phone number within plan limit', async ({ request }) => {
    await setupUserWithSubscription(request, TEST_USER_ID, 'growth');

    // Growth gets 2 numbers. Remove one first to test adding.
    await removePhoneNumber(request, TEST_USER_ID);

    let dbState = await getDbState(request, TEST_USER_ID);
    const countBefore = dbState.phoneNumbers.activeCount;
    expect(countBefore).toBe(1);

    // Add one back
    const response = await addPhoneNumber(request, TEST_USER_ID, {
      phoneNumber: '+15559998888',
      label: 'New Phone'
    });

    expect(response.ok()).toBe(true);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.phone.phone_number).toBe('+15559998888');

    dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.phoneNumbers.activeCount).toBe(2);
    console.log('Phone number added successfully');
  });

  test('cannot add phone number beyond plan limit', async ({ request }) => {
    await setupUserWithSubscription(request, TEST_USER_ID, 'starter');

    // Starter has 1 number. Try to add another.
    const response = await addPhoneNumber(request, TEST_USER_ID);

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error.code).toBe('PHONE_LIMIT_REACHED');
    console.log('Phone limit enforced:', data.error.message);
  });

  test('cannot add phone without subscription', async ({ request }) => {
    const response = await addPhoneNumber(request, TEST_USER_ID);

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error.code).toBe('NO_SUBSCRIPTION');
    console.log('No subscription blocked add');
  });

  test('added phone is linked to assistant', async ({ request }) => {
    await setupUserWithSubscription(request, TEST_USER_ID, 'growth');

    // Remove one to make room
    await removePhoneNumber(request, TEST_USER_ID);

    // Add new phone
    const response = await addPhoneNumber(request, TEST_USER_ID);
    expect(response.ok()).toBe(true);

    const dbState = await getDbState(request, TEST_USER_ID);
    const latestPhone = dbState.phoneNumbers.active[dbState.phoneNumbers.active.length - 1];

    expect(latestPhone.assistant_id).toBe(dbState.assistant.id);
    console.log('New phone linked to assistant');
  });
});

// ============================================
// REMOVING PHONE NUMBERS
// ============================================

test.describe('Removing Phone Numbers', () => {
  test.beforeEach(async ({ request }) => {
    await createTestUser(request, TEST_USER_ID);
    await setupUserWithSubscription(request, TEST_USER_ID, 'growth');
  });

  test('can remove phone number by ID', async ({ request }) => {
    let dbState = await getDbState(request, TEST_USER_ID);
    const phoneToRemove = dbState.phoneNumbers.active[0];
    const countBefore = dbState.phoneNumbers.activeCount;

    const response = await removePhoneNumber(request, TEST_USER_ID, {
      phoneId: phoneToRemove.id
    });

    expect(response.ok()).toBe(true);
    const data = await response.json();
    expect(data.remainingCount).toBe(countBefore - 1);

    dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.phoneNumbers.activeCount).toBe(countBefore - 1);
    expect(dbState.phoneNumbers.releasedCount).toBe(1);
    console.log('Phone removed by ID');
  });

  test('can remove phone number by phone number', async ({ request }) => {
    let dbState = await getDbState(request, TEST_USER_ID);
    const phoneToRemove = dbState.phoneNumbers.active[1];

    const response = await removePhoneNumber(request, TEST_USER_ID, {
      phoneNumber: phoneToRemove.phone_number
    });

    expect(response.ok()).toBe(true);
    console.log('Phone removed by number:', phoneToRemove.phone_number);
  });

  test('removing without params removes a phone', async ({ request }) => {
    let dbState = await getDbState(request, TEST_USER_ID);
    const initialCount = dbState.phoneNumbers.activeCount;

    await removePhoneNumber(request, TEST_USER_ID);

    dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.phoneNumbers.activeCount).toBe(initialCount - 1);
    console.log('Phone removed:', initialCount, '->', dbState.phoneNumbers.activeCount);
  });

  test('released phones are tracked separately', async ({ request }) => {
    await removePhoneNumber(request, TEST_USER_ID);
    await removePhoneNumber(request, TEST_USER_ID);

    const dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.phoneNumbers.activeCount).toBe(1);
    expect(dbState.phoneNumbers.releasedCount).toBe(2);
    console.log('Released phones tracked:', dbState.phoneNumbers.releasedCount);
  });
});

// ============================================
// PLAN UPGRADES AND PHONE NUMBERS
// ============================================

test.describe('Plan Upgrades and Phone Numbers', () => {
  test.beforeEach(async ({ request }) => {
    await createTestUser(request, TEST_USER_ID);
    await setupUserWithSubscription(request, TEST_USER_ID, 'starter');
  });

  test('upgrade from starter to growth adds 1 phone', async ({ request }) => {
    let dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.phoneNumbers.activeCount).toBe(1);

    // Simulate upgrade
    await request.post(`${API_URL}/api/billing/test/simulate-plan-change`, {
      data: {
        userId: TEST_USER_ID,
        oldPlanId: 'starter',
        newPlanId: 'growth'
      }
    });

    dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.phoneNumbers.activeCount).toBe(2);
    console.log('Upgrade added phones: 1 -> 2');
  });

  test('upgrade from growth to scale adds 3 phones', async ({ request }) => {
    // First upgrade to growth
    await request.post(`${API_URL}/api/billing/test/simulate-plan-change`, {
      data: {
        userId: TEST_USER_ID,
        oldPlanId: 'starter',
        newPlanId: 'growth'
      }
    });

    let dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.phoneNumbers.activeCount).toBe(2);

    // Then upgrade to scale
    await request.post(`${API_URL}/api/billing/test/simulate-plan-change`, {
      data: {
        userId: TEST_USER_ID,
        oldPlanId: 'growth',
        newPlanId: 'scale'
      }
    });

    dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.phoneNumbers.activeCount).toBe(5);
    console.log('Upgrade added phones: 2 -> 5');
  });
});

// ============================================
// PLAN DOWNGRADES AND PHONE NUMBERS
// ============================================

test.describe('Plan Downgrades and Phone Numbers', () => {
  test.beforeEach(async ({ request }) => {
    await createTestUser(request, TEST_USER_ID);
    await setupUserWithSubscription(request, TEST_USER_ID, 'growth');
  });

  test('downgrade from growth to starter releases 1 phone', async ({ request }) => {
    let dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.phoneNumbers.activeCount).toBe(2);

    // Simulate downgrade
    await request.post(`${API_URL}/api/billing/test/simulate-plan-change`, {
      data: {
        userId: TEST_USER_ID,
        oldPlanId: 'growth',
        newPlanId: 'starter'
      }
    });

    dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.phoneNumbers.activeCount).toBe(1);
    expect(dbState.phoneNumbers.releasedCount).toBe(1);
    console.log('Downgrade released phones: 2 -> 1');
  });

  test('downgrade releases newest phones first', async ({ request }) => {
    let dbState = await getDbState(request, TEST_USER_ID);
    const oldestPhone = dbState.phoneNumbers.active[0];

    // Downgrade to starter (keeps 1 phone)
    await request.post(`${API_URL}/api/billing/test/simulate-plan-change`, {
      data: {
        userId: TEST_USER_ID,
        oldPlanId: 'growth',
        newPlanId: 'starter'
      }
    });

    dbState = await getDbState(request, TEST_USER_ID);
    const remainingPhone = dbState.phoneNumbers.active[0];

    // The oldest phone should be kept
    expect(remainingPhone.id).toBe(oldestPhone.id);
    console.log('Oldest phone retained on downgrade');
  });
});

// ============================================
// PHONE NUMBERS API ENDPOINT
// ============================================

test.describe('Phone Numbers API Endpoint', () => {
  test.beforeEach(async ({ request }) => {
    await createTestUser(request, TEST_USER_ID);
    await setupUserWithSubscription(request, TEST_USER_ID, 'growth');
  });

  test('phone-numbers endpoint returns correct data', async ({ request }) => {
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    const response = await request.get(`${API_URL}/api/billing/phone-numbers`, {
      headers: { 'Cookie': cookie }
    });

    expect(response.ok()).toBe(true);
    const data = await response.json();

    expect(data.numbers).toBeDefined();
    expect(data.count).toBe(2);
    expect(data.maxAllowed).toBe(2);
    expect(data.canAddMore).toBe(false);
    console.log('Phone numbers endpoint returned:', data.count, 'numbers');
  });

  test('phone-numbers shows canAddMore correctly', async ({ request }) => {
    // Remove one phone to make room
    await removePhoneNumber(request, TEST_USER_ID);

    const cookie = await getAuthCookie(request, TEST_USER_ID);
    const response = await request.get(`${API_URL}/api/billing/phone-numbers`, {
      headers: { 'Cookie': cookie }
    });

    const data = await response.json();
    expect(data.count).toBe(2);
    expect(data.canAddMore).toBe(true);
    console.log('canAddMore is true when under limit');
  });

  test('phone numbers include assistant_id', async ({ request }) => {
    const cookie = await getAuthCookie(request, TEST_USER_ID);
    const response = await request.get(`${API_URL}/api/billing/phone-numbers`, {
      headers: { 'Cookie': cookie }
    });

    const data = await response.json();
    const allHaveAssistant = data.numbers.every((n: any) => n.assistant_id);
    expect(allHaveAssistant).toBe(true);
    console.log('All phones linked to assistant');
  });
});

// ============================================
// CANCELLATION AND PHONE NUMBERS
// ============================================

test.describe('Cancellation and Phone Numbers', () => {
  test.beforeEach(async ({ request }) => {
    await createTestUser(request, TEST_USER_ID);
    await setupUserWithSubscription(request, TEST_USER_ID, 'scale');
  });

  test('cancellation releases all phone numbers', async ({ request }) => {
    let dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.phoneNumbers.activeCount).toBe(5);

    // Cancel subscription
    await request.post(`${API_URL}/api/billing/test/simulate-cancellation`, {
      data: { userId: TEST_USER_ID }
    });

    dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.phoneNumbers.activeCount).toBe(0);
    expect(dbState.phoneNumbers.releasedCount).toBe(5);
    console.log('All 5 phones released on cancellation');
  });
});
