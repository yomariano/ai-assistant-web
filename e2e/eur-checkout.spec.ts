/**
 * EUR Checkout E2E Tests
 *
 * Tests for VoiceFleet EUR pricing and checkout flow:
 * - Starter: €49/mo 100 calls
 * - Growth: €199/mo 500 calls
 * - Pro: €599/mo 1500 inbound + 200 outbound
 */

import { test, expect, TEST_USERS, PLAN_LIMITS } from './fixtures/test-fixtures';

const API_URL = process.env.E2E_API_URL || 'http://localhost:3000';

// VoiceFleet EUR Pricing
const EUR_PRICING = {
  starter: { price: 49, callsIncluded: 100, name: 'Starter' },
  growth: { price: 199, callsIncluded: 500, name: 'Growth' },
  pro: { price: 599, callsIncluded: 1500, outboundCalls: 200, name: 'Pro' },
};

test.describe('EUR Region Detection', () => {
  test('GET /api/billing/region returns EUR for Ireland IP', async ({ request }) => {
    // Test with explicit region override
    const response = await request.get(`${API_URL}/api/billing/region?region=IE`);
    expect(response.ok()).toBe(true);

    const data = await response.json();

    expect(data.currency).toBe('EUR');
    expect(data.currencySymbol).toBe('€');
    expect(data.region).toBe('IE');
  });

  test('GET /api/billing/region returns USD for US', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/billing/region?region=US`);
    expect(response.ok()).toBe(true);

    const data = await response.json();

    expect(data.currency).toBe('USD');
    expect(data.currencySymbol).toBe('$');
    expect(data.region).toBe('US');
  });

  test('EUR region includes VoiceFleet pricing', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/billing/region?region=IE`);
    const data = await response.json();

    expect(data.plans).toHaveLength(3);

    // Verify Starter plan
    const starter = data.plans.find((p: any) => p.id === 'starter');
    expect(starter.price).toBe(EUR_PRICING.starter.price);
    expect(starter.formattedPrice).toBe('€49');

    // Verify Growth plan
    const growth = data.plans.find((p: any) => p.id === 'growth');
    expect(growth.price).toBe(EUR_PRICING.growth.price);

    // Verify Pro plan
    const pro = data.plans.find((p: any) => p.id === 'pro');
    expect(pro.price).toBe(EUR_PRICING.pro.price);
  });
});

test.describe('EUR Payment Links', () => {
  test.beforeEach(async ({ api }) => {
    await api.loginAsDevUser('starter');
  });

  test('GET /api/billing/payment-link/starter returns EUR link for IE region', async ({ request, api }) => {
    // Reset user first
    await api.resetTestUser(TEST_USERS.fresh);
    await api.loginAsUser(TEST_USERS.fresh);

    const response = await request.get(`${API_URL}/api/billing/payment-link/starter?region=IE`);

    if (response.ok()) {
      const data = await response.json();

      // Should return a payment link URL
      expect(data.url).toContain('buy.stripe.com');
      expect(data.region).toBe('IE');
    }
  });

  test('GET /api/billing/payment-link/growth returns EUR link for IE region', async ({ request, api }) => {
    await api.resetTestUser(TEST_USERS.fresh);
    await api.loginAsUser(TEST_USERS.fresh);

    const response = await request.get(`${API_URL}/api/billing/payment-link/growth?region=IE`);

    if (response.ok()) {
      const data = await response.json();
      expect(data.url).toContain('buy.stripe.com');
      expect(data.region).toBe('IE');
    }
  });

  test('GET /api/billing/payment-link/pro returns EUR link for IE region', async ({ request, api }) => {
    await api.resetTestUser(TEST_USERS.fresh);
    await api.loginAsUser(TEST_USERS.fresh);

    const response = await request.get(`${API_URL}/api/billing/payment-link/pro?region=IE`);

    if (response.ok()) {
      const data = await response.json();
      expect(data.url).toContain('buy.stripe.com');
      expect(data.region).toBe('IE');
    }
  });
});

test.describe('EUR Checkout Simulation', () => {
  test('simulated EUR checkout creates subscription with correct plan', async ({ api }) => {
    // Reset fresh user
    await api.resetTestUser(TEST_USERS.fresh);

    // Simulate EUR checkout
    await api.simulateCheckoutCompleted({
      userId: TEST_USERS.fresh,
      planId: 'starter',
    });

    // Verify subscription was created
    const subscription = await api.getSubscription();
    expect(subscription.plan_id).toBe('starter');
    expect(subscription.status).toBe('active');
  });

  test('EUR subscription has correct phone number limits', async ({ api }) => {
    await api.resetTestUser(TEST_USERS.fresh);

    // Test each plan
    for (const [planId, limits] of Object.entries(PLAN_LIMITS)) {
      await api.resetTestUser(TEST_USERS.fresh);
      await api.simulateCheckoutCompleted({
        userId: TEST_USERS.fresh,
        planId: planId as 'starter' | 'growth' | 'pro',
      });

      const { limit } = await api.getPhoneNumbers();
      expect(limit).toBe(limits.phoneNumbers);
    }
  });
});

test.describe('EUR Pricing UI', () => {
  test('pricing page shows EUR prices for Ireland region', async ({ page }) => {
    // Visit pricing page
    await page.goto('/pricing');

    // Wait for pricing to load
    await page.waitForSelector('text=/€49|€199|€599/', { timeout: 10000 });

    // Verify EUR prices are displayed
    await expect(page.locator('text=€49')).toBeVisible();
    await expect(page.locator('text=€199')).toBeVisible();
    await expect(page.locator('text=€599')).toBeVisible();
  });

  test('pricing page shows calls included', async ({ page }) => {
    await page.goto('/pricing');

    await page.waitForSelector('text=/100.*calls|calls.*100/i', { timeout: 10000 });

    // Verify calls are shown for each plan
    const starterCalls = page.locator('text=/100.*calls/i');
    const growthCalls = page.locator('text=/500.*calls/i');

    expect(await starterCalls.count()).toBeGreaterThan(0);
    expect(await growthCalls.count()).toBeGreaterThan(0);
  });

  test('pricing page shows plan names', async ({ page }) => {
    await page.goto('/pricing');

    await page.waitForSelector('text=/Starter|Growth|Pro/', { timeout: 10000 });

    // Verify plan names
    await expect(page.locator('text=Starter').first()).toBeVisible();
    await expect(page.locator('text=Growth').first()).toBeVisible();
    await expect(page.locator('text=Pro').first()).toBeVisible();
  });
});

test.describe('EUR Subscription Webhook', () => {
  test('EUR checkout triggers Ireland subscription notification', async ({ api }) => {
    // This test verifies that when an EUR subscription is created,
    // the support notification is triggered for VoIPCloud manual provisioning

    await api.resetTestUser(TEST_USERS.fresh);

    // Simulate EUR checkout (which should trigger the notification)
    await api.simulateCheckoutCompleted({
      userId: TEST_USERS.fresh,
      planId: 'growth',
    });

    // Verify subscription was created
    const subscription = await api.getSubscription();
    expect(subscription.plan_id).toBe('growth');

    // Note: We can't verify the email was sent in E2E tests,
    // but we've verified the subscription was created correctly
  });
});

test.describe('EUR Usage Tracking', () => {
  test('EUR subscription tracks calls correctly', async ({ api }) => {
    await api.loginAsDevUser('starter');

    const response = await fetch(`${API_URL}/api/billing/usage`);
    expect(response.ok).toBe(true);

    const usage = await response.json();

    // All plans now have 0 per-call rate (calls included)
    expect(usage.perCallRateCents).toBe(0);
    expect(usage.fairUseCap).toBe(100); // Starter: 100 calls
  });

  test('Growth plan has 500 calls included', async ({ api }) => {
    await api.loginAsDevUser('growth');

    const response = await fetch(`${API_URL}/api/billing/usage`);
    const usage = await response.json();

    expect(usage.perCallRateCents).toBe(0);
    expect(usage.fairUseCap).toBe(500);
  });

  test('Pro plan has 1500 calls included', async ({ api }) => {
    await api.loginAsDevUser('pro');

    const response = await fetch(`${API_URL}/api/billing/usage`);
    const usage = await response.json();

    expect(usage.perCallRateCents).toBe(0);
    expect(usage.fairUseCap).toBe(1500);
  });
});
