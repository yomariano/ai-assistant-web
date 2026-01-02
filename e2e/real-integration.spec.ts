/**
 * REAL INTEGRATION TEST
 *
 * This test uses REAL Stripe, Telnyx, and Vapi APIs.
 * It will:
 * - Charge a real credit card (test mode)
 * - Purchase a real phone number from Telnyx
 * - Create a real assistant in Vapi
 * - Assign the phone number to the assistant
 *
 * RUN MANUALLY: npx playwright test real-integration.spec.ts
 *
 * COST WARNING: This test purchases a real phone number which has monthly fees.
 * The test cleans up after itself, but failed runs may leave orphaned resources.
 */

import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:3000';
const WEB_URL = 'http://localhost:3001';

// Use a dedicated test user ID for real integration tests
const REAL_TEST_USER_ID = '00000000-0000-0000-0000-000000000999';

// Stripe test card details
const TEST_CARD = {
  number: '4242424242424242',
  expiry: '1228',
  cvc: '123',
  zip: '10001'
};

// Stripe Payment Link for starter plan (1 phone number)
const STARTER_PAYMENT_LINK = 'https://buy.stripe.com/test_eVq4gy46OeB8cvS2zWfQI04';

// Helper to get raw DB state
async function getDbState(request: any, userId: string) {
  const response = await request.get(`${API_URL}/api/billing/test/db-state/${userId}`);
  if (!response.ok()) {
    return null;
  }
  return response.json();
}

// Helper to trigger real provisioning
async function triggerRealProvisioning(request: any, userId: string, planId: string) {
  const response = await request.post(`${API_URL}/api/billing/test/real-provision`, {
    data: { userId, planId }
  });
  return response.json();
}

// Helper to cleanup after test
async function realCleanup(request: any, userId: string) {
  const response = await request.delete(`${API_URL}/api/billing/test/real-cleanup/${userId}`);
  return response.json();
}

test.describe('Real Integration Test - Full Flow', () => {
  // Always cleanup before and after
  test.beforeEach(async ({ request }) => {
    console.log('Cleaning up before test...');
    await realCleanup(request, REAL_TEST_USER_ID);

    // Create fresh test user
    await request.post(`${API_URL}/api/billing/test/create-test-user`, {
      data: { userId: REAL_TEST_USER_ID }
    });
  });

  test.afterEach(async ({ request }) => {
    console.log('Cleaning up after test...');
    await realCleanup(request, REAL_TEST_USER_ID);
  });

  test('Complete flow: Stripe checkout -> Real Telnyx number -> Vapi assignment', async ({ page, request }) => {
    test.setTimeout(180000); // 3 minutes for full flow

    // ========================================
    // STEP 1: Reset and prepare
    // ========================================
    console.log('\n=== STEP 1: Preparing test user ===');

    let dbState = await getDbState(request, REAL_TEST_USER_ID);
    expect(dbState).toBeDefined();
    console.log('Test user created');

    // ========================================
    // STEP 2: Stripe Checkout
    // ========================================
    console.log('\n=== STEP 2: Stripe Checkout ===');

    const checkoutUrl = `${STARTER_PAYMENT_LINK}?client_reference_id=${REAL_TEST_USER_ID}`;
    await page.goto(checkoutUrl);

    // Wait for Stripe checkout page to load
    await page.waitForSelector('input[name="email"]', { timeout: 30000 });

    // Fill in checkout form using same pattern as stripe-checkout.spec.ts
    await page.fill('input[name="email"]', `test-${Date.now()}@example.com`);
    console.log('Email filled');

    await page.fill('input[name="cardNumber"]', TEST_CARD.number);
    console.log('Card number filled');

    await page.fill('input[name="cardExpiry"]', TEST_CARD.expiry);
    console.log('Expiry filled');

    await page.fill('input[name="cardCvc"]', TEST_CARD.cvc);
    console.log('CVC filled');

    await page.fill('input[name="billingName"]', 'Test User');
    console.log('Billing name filled');

    // Submit payment
    await page.click('button:has-text("Pay and subscribe")');
    console.log('Payment submitted');

    // Wait for redirect (Stripe redirects after successful payment)
    await page.waitForURL(url => !url.toString().includes('checkout.stripe.com'), { timeout: 60000 });
    console.log('Checkout completed! URL:', page.url());

    // ========================================
    // STEP 3: Wait for Stripe webhook
    // ========================================
    console.log('\n=== STEP 3: Waiting for Stripe webhook ===');

    let subscriptionFound = false;
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 1000));
      dbState = await getDbState(request, REAL_TEST_USER_ID);

      if (dbState?.subscription?.status === 'active') {
        subscriptionFound = true;
        console.log(`Subscription activated after ${i + 1} seconds`);
        break;
      }
      console.log(`Waiting for subscription... attempt ${i + 1}/30`);
    }

    expect(subscriptionFound).toBe(true);
    expect(dbState.subscription.plan_id).toBe('starter');
    expect(dbState.subscription.stripe_subscription_id).toBeDefined();
    console.log('Subscription verified:', {
      planId: dbState.subscription.plan_id,
      stripeSubId: dbState.subscription.stripe_subscription_id
    });

    // ========================================
    // STEP 4: Trigger REAL provisioning
    // ========================================
    console.log('\n=== STEP 4: Real Telnyx/Vapi Provisioning ===');

    const provisionResult = await triggerRealProvisioning(request, REAL_TEST_USER_ID, 'starter');
    console.log('Provisioning result:', JSON.stringify(provisionResult, null, 2));

    expect(provisionResult.success).toBe(true);
    expect(provisionResult.result.provisioned).toBe(1);
    expect(provisionResult.result.numbers).toHaveLength(1);

    const provisionedNumber = provisionResult.result.numbers[0];
    expect(provisionedNumber.phoneNumber).toMatch(/^\+1\d{10}$/);
    expect(provisionedNumber.telnyxId).toBeDefined();
    expect(provisionedNumber.vapiId).toBeDefined();
    expect(provisionedNumber.assistantId).toBeDefined();

    console.log('REAL phone number provisioned:', {
      phoneNumber: provisionedNumber.phoneNumber,
      telnyxId: provisionedNumber.telnyxId,
      vapiId: provisionedNumber.vapiId
    });

    // ========================================
    // STEP 5: Verify in Database
    // ========================================
    console.log('\n=== STEP 5: Verifying Database State ===');

    dbState = await getDbState(request, REAL_TEST_USER_ID);

    // Verify subscription
    expect(dbState.subscription.status).toBe('active');
    expect(dbState.subscription.plan_id).toBe('starter');

    // Verify assistant
    expect(dbState.assistant).toBeDefined();
    expect(dbState.assistant.vapi_assistant_id).toBeDefined();
    expect(dbState.assistant.vapi_assistant_id).not.toContain('mock');
    expect(dbState.assistant.vapi_assistant_id).not.toContain('test');

    // Verify phone number
    expect(dbState.phoneNumbers.activeCount).toBe(1);
    const phone = dbState.phoneNumbers.active[0];
    expect(phone.phone_number).toBe(provisionedNumber.phoneNumber);
    expect(phone.telnyx_id).not.toContain('mock');
    expect(phone.vapi_id).not.toContain('mock');
    expect(phone.assistant_id).toBe(dbState.assistant.id);

    console.log('Database verification passed:', {
      subscription: dbState.subscription.plan_id,
      assistantVapiId: dbState.assistant.vapi_assistant_id,
      phoneNumber: phone.phone_number,
      phoneTelnyxId: phone.telnyx_id,
      phoneVapiId: phone.vapi_id
    });

    // ========================================
    // STEP 6: Cleanup (automatic in afterEach)
    // ========================================
    console.log('\n=== STEP 6: Test Complete - Cleanup will run in afterEach ===');
    console.log('\n========================================');
    console.log('REAL INTEGRATION TEST PASSED!');
    console.log('========================================\n');
  });
});

test.describe('Real Integration - Cleanup Only', () => {
  test.skip('Manual cleanup of orphaned resources', async ({ request }) => {
    // Run this test manually if a previous test failed and left orphaned resources
    // Change test.skip to test to enable

    console.log('Running manual cleanup...');
    const result = await realCleanup(request, REAL_TEST_USER_ID);
    console.log('Cleanup result:', result);
    expect(result.success).toBe(true);
  });
});
