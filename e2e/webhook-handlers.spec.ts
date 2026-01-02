import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:3000';
const TEST_USER_ID = '00000000-0000-0000-0000-000000000111'; // Different from other tests

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

// Helper to simulate webhook
async function simulateWebhook(request: any, eventType: string, userId: string, data?: any) {
  const response = await request.post(`${API_URL}/api/billing/test/simulate-webhook`, {
    data: { eventType, userId, data }
  });
  return response.json();
}

// ============================================
// CHECKOUT COMPLETED WEBHOOK
// ============================================

test.describe('Checkout Completed Webhook', () => {
  test.beforeEach(async ({ request }) => {
    await createTestUser(request, TEST_USER_ID);
  });

  test('checkout.session.completed creates subscription and provisions phone', async ({ request }) => {
    const result = await simulateWebhook(request, 'checkout.session.completed', TEST_USER_ID, {
      planId: 'starter'
    });

    expect(result.success).toBe(true);
    expect(result.result.handled).toBe('checkout.session.completed');
    console.log('Checkout completed webhook handled');

    // Wait a moment for async provisioning
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verify DB state
    const dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.subscription).toBeDefined();
    expect(dbState.subscription.status).toBe('active');
    console.log('Subscription created:', dbState.subscription.plan_id);
  });

  test('checkout creates assistant for new user', async ({ request }) => {
    await simulateWebhook(request, 'checkout.session.completed', TEST_USER_ID, {
      planId: 'growth'
    });

    // Wait for provisioning
    await new Promise(resolve => setTimeout(resolve, 500));

    const dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.assistant).toBeDefined();
    expect(dbState.assistant.name).toBeDefined();
    console.log('Assistant created:', dbState.assistant.name);
  });
});

// ============================================
// SUBSCRIPTION UPDATE WEBHOOK
// ============================================

test.describe('Subscription Update Webhook', () => {
  test.beforeEach(async ({ request }) => {
    await createTestUser(request, TEST_USER_ID);
    await request.post(`${API_URL}/api/billing/test/simulate-checkout`, {
      data: { userId: TEST_USER_ID, planId: 'starter' }
    });
  });

  test('subscription.updated changes plan and status', async ({ request }) => {
    // Simulate upgrade to growth
    const result = await simulateWebhook(request, 'customer.subscription.updated', TEST_USER_ID, {
      planId: 'growth',
      status: 'active'
    });

    expect(result.success).toBe(true);
    expect(result.result.handled).toBe('customer.subscription.updated');

    // Verify plan changed
    const dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.subscription.plan_id).toBe('growth');
    console.log('Plan updated to:', dbState.subscription.plan_id);
  });

  test('subscription.updated with trialing status creates trial usage', async ({ request }) => {
    const trialEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    await simulateWebhook(request, 'customer.subscription.updated', TEST_USER_ID, {
      planId: 'starter',
      status: 'trialing',
      trialEnd: trialEnd.toISOString()
    });

    const dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.subscription.status).toBe('trialing');
    expect(dbState.trialUsage).toBeDefined();
    console.log('Trial status set with usage tracking');
  });

  test('subscription.updated with cancel_at_period_end flag', async ({ request }) => {
    await simulateWebhook(request, 'customer.subscription.updated', TEST_USER_ID, {
      planId: 'starter',
      status: 'active',
      cancelAtPeriodEnd: true
    });

    const dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.subscription.cancel_at_period_end).toBe(true);
    console.log('Cancel at period end set');
  });
});

// ============================================
// SUBSCRIPTION DELETED WEBHOOK
// ============================================

test.describe('Subscription Deleted Webhook', () => {
  test.beforeEach(async ({ request }) => {
    await createTestUser(request, TEST_USER_ID);
    await request.post(`${API_URL}/api/billing/test/simulate-checkout`, {
      data: { userId: TEST_USER_ID, planId: 'starter' }
    });
  });

  test('subscription.deleted cancels subscription', async ({ request }) => {
    const result = await simulateWebhook(request, 'customer.subscription.deleted', TEST_USER_ID, {});

    expect(result.success).toBe(true);
    expect(result.result.handled).toBe('customer.subscription.deleted');

    // Wait for async cleanup
    await new Promise(resolve => setTimeout(resolve, 500));

    const dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.subscription.status).toBe('canceled');
    console.log('Subscription canceled');
  });

  test('subscription.deleted releases phone numbers', async ({ request }) => {
    // Get initial phone count
    let dbState = await getDbState(request, TEST_USER_ID);
    const initialPhoneCount = dbState.phoneNumbers.activeCount;
    expect(initialPhoneCount).toBeGreaterThan(0);

    // Delete subscription
    await simulateWebhook(request, 'customer.subscription.deleted', TEST_USER_ID, {});
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verify phones released
    dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.phoneNumbers.activeCount).toBe(0);
    expect(dbState.phoneNumbers.releasedCount).toBeGreaterThan(0);
    console.log('Phone numbers released:', dbState.phoneNumbers.releasedCount);
  });

  test('subscription.deleted deletes assistant', async ({ request }) => {
    // Verify assistant exists
    let dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.assistant).toBeDefined();
    expect(dbState.assistant.status).not.toBe('deleted');

    // Delete subscription
    await simulateWebhook(request, 'customer.subscription.deleted', TEST_USER_ID, {});
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verify assistant marked as deleted (soft delete)
    dbState = await getDbState(request, TEST_USER_ID);
    // Assistant can be null or have status 'deleted'
    if (dbState.assistant) {
      expect(dbState.assistant.status).toBe('deleted');
    }
    console.log('Assistant deleted/marked as deleted');
  });
});

// ============================================
// INVOICE WEBHOOKS
// ============================================

test.describe('Invoice Webhooks', () => {
  test.beforeEach(async ({ request }) => {
    await createTestUser(request, TEST_USER_ID);
    await request.post(`${API_URL}/api/billing/test/simulate-checkout`, {
      data: { userId: TEST_USER_ID, planId: 'starter' }
    });
  });

  test('invoice.payment_failed sets subscription to past_due', async ({ request }) => {
    const result = await simulateWebhook(request, 'invoice.payment_failed', TEST_USER_ID, {});

    expect(result.success).toBe(true);
    expect(result.result.newStatus).toBe('past_due');

    const dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.subscription.status).toBe('past_due');
    console.log('Subscription set to past_due');
  });

  test('invoice.payment_succeeded reactivates subscription', async ({ request }) => {
    // First set to past_due
    await simulateWebhook(request, 'invoice.payment_failed', TEST_USER_ID, {});

    // Then simulate successful payment
    const result = await simulateWebhook(request, 'invoice.payment_succeeded', TEST_USER_ID, {});

    expect(result.success).toBe(true);
    expect(result.result.newStatus).toBe('active');

    const dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.subscription.status).toBe('active');
    console.log('Subscription reactivated');
  });

  test('past_due subscription blocks calls', async ({ request }) => {
    // Set to past_due
    await simulateWebhook(request, 'invoice.payment_failed', TEST_USER_ID, {});

    // Get auth cookie
    const authResponse = await request.get(`${API_URL}/api/auth/dev-login?userId=${TEST_USER_ID}`);
    const cookie = authResponse.headers()['set-cookie'] || '';

    // Try to make a call
    const callResponse = await request.post(`${API_URL}/api/calls`, {
      headers: { 'Cookie': cookie },
      data: {
        phoneNumber: '+15551234567',
        message: 'Test call'
      }
    });

    expect(callResponse.status()).toBe(402);
    const data = await callResponse.json();
    expect(data.error.code).toContain('SUBSCRIPTION');
    console.log('Past due subscription blocked call:', data.error.message);
  });
});

// ============================================
// WEBHOOK ERROR HANDLING
// ============================================

test.describe('Webhook Error Handling', () => {
  test.beforeEach(async ({ request }) => {
    await createTestUser(request, TEST_USER_ID);
  });

  test('invalid event type returns error', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/billing/test/simulate-webhook`, {
      data: {
        eventType: 'invalid.event.type',
        userId: TEST_USER_ID
      }
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error.message).toContain('Unsupported event type');
    console.log('Invalid event type rejected');
  });

  test('missing userId returns error', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/billing/test/simulate-webhook`, {
      data: { eventType: 'checkout.session.completed' }
    });

    expect(response.status()).toBe(400);
    console.log('Missing userId rejected');
  });
});
