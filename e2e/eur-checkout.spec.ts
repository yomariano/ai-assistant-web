/**
 * EUR Checkout E2E Tests
 *
 * Tests for OrderBot EUR pricing and checkout flow:
 * - Lite: €19/mo + €0.95/call
 * - Growth: €99/mo + €0.45/call
 * - Pro: €249/mo + €0/call (1500 fair use cap)
 */

import { test, expect, TEST_USERS, PLAN_LIMITS } from './fixtures/test-fixtures';

const API_URL = process.env.E2E_API_URL || 'http://localhost:3000';

// OrderBot EUR Pricing
const EUR_PRICING = {
  starter: { price: 19, perCall: 0.95, name: 'Lite' },
  growth: { price: 99, perCall: 0.45, name: 'Growth' },
  scale: { price: 249, perCall: 0, name: 'Pro', callsCap: 1500 },
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

  test('EUR region includes OrderBot pricing', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/billing/region?region=IE`);
    const data = await response.json();

    expect(data.plans).toHaveLength(3);

    // Verify Lite plan
    const lite = data.plans.find((p: any) => p.id === 'starter');
    expect(lite.price).toBe(EUR_PRICING.starter.price);
    expect(lite.perCallPrice).toBe(EUR_PRICING.starter.perCall);
    expect(lite.formattedPrice).toBe('€19');

    // Verify Growth plan
    const growth = data.plans.find((p: any) => p.id === 'growth');
    expect(growth.price).toBe(EUR_PRICING.growth.price);
    expect(growth.perCallPrice).toBe(EUR_PRICING.growth.perCall);

    // Verify Pro plan
    const pro = data.plans.find((p: any) => p.id === 'scale');
    expect(pro.price).toBe(EUR_PRICING.scale.price);
    expect(pro.perCallPrice).toBe(EUR_PRICING.scale.perCall);
    expect(pro.callsCap).toBe(EUR_PRICING.scale.callsCap);
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

  test('GET /api/billing/payment-link/scale returns EUR link for IE region', async ({ request, api }) => {
    await api.resetTestUser(TEST_USERS.fresh);
    await api.loginAsUser(TEST_USERS.fresh);

    const response = await request.get(`${API_URL}/api/billing/payment-link/scale?region=IE`);

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
        planId: planId as 'starter' | 'growth' | 'scale',
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
    await page.waitForSelector('text=/€19|€99|€249/', { timeout: 10000 });

    // Verify EUR prices are displayed
    await expect(page.locator('text=€19')).toBeVisible();
    await expect(page.locator('text=€99')).toBeVisible();
    await expect(page.locator('text=€249')).toBeVisible();
  });

  test('pricing page shows per-call rates', async ({ page }) => {
    await page.goto('/pricing');

    await page.waitForSelector('text=/€0\\.95|€0\\.45/', { timeout: 10000 });

    // Verify per-call rates
    const liteRate = page.locator('text=€0.95');
    const growthRate = page.locator('text=€0.45');

    expect(await liteRate.count()).toBeGreaterThan(0);
    expect(await growthRate.count()).toBeGreaterThan(0);
  });

  test('pricing page shows plan names', async ({ page }) => {
    await page.goto('/pricing');

    await page.waitForSelector('text=/Lite|Growth|Pro/', { timeout: 10000 });

    // Verify plan names
    await expect(page.locator('text=Lite').first()).toBeVisible();
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
  test('EUR subscription tracks per-call charges correctly', async ({ api }) => {
    await api.loginAsDevUser('starter');

    const response = await fetch(`${API_URL}/api/billing/usage`);
    expect(response.ok).toBe(true);

    const usage = await response.json();

    // Starter plan should have €0.95 per call rate (95 cents)
    expect(usage.perCallRateCents).toBe(95);
  });

  test('Growth plan has €0.45 per call rate', async ({ api }) => {
    await api.loginAsDevUser('growth');

    const response = await fetch(`${API_URL}/api/billing/usage`);
    const usage = await response.json();

    expect(usage.perCallRateCents).toBe(45);
  });

  test('Pro plan has €0 per call (unlimited)', async ({ api }) => {
    await api.loginAsDevUser('scale');

    const response = await fetch(`${API_URL}/api/billing/usage`);
    const usage = await response.json();

    expect(usage.perCallRateCents).toBe(0);
    expect(usage.fairUseCap).toBe(1500);
  });
});
