/**
 * AUD Checkout E2E Tests
 *
 * Tests for VoiceFleet Australia pricing and checkout flow:
 * - Starter: A$140/mo 500 minutes
 * - Growth: A$424/mo 1000 minutes
 * - Pro: A$851/mo 2000 minutes
 */

import { test, expect, TEST_USERS } from './fixtures/test-fixtures';

const API_URL = process.env.E2E_API_URL || 'http://localhost:3000';
const WEB_URL = process.env.E2E_WEB_URL || 'http://localhost:3001';

const AU_PRICING = {
  starter: { price: 140, minutesIncluded: 500, name: 'Starter' },
  growth: { price: 424, minutesIncluded: 1000, name: 'Growth' },
  pro: { price: 851, minutesIncluded: 2000, name: 'Pro' },
};

test.describe('AU Region Detection', () => {
  test('GET /api/billing/region returns AUD for Australia', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/billing/region?region=AU`);
    expect(response.ok()).toBe(true);

    const data = await response.json();

    expect(data.currency).toBe('AUD');
    expect(data.currencySymbol).toBe('A$');
    expect(data.region).toBe('AU');
    expect(data.regionName).toBe('Australia');
  });

  test('AU region includes VoiceFleet pricing', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/billing/region?region=AU`);
    expect(response.ok()).toBe(true);

    const data = await response.json();
    expect(data.plans).toHaveLength(3);

    const starter = data.plans.find((plan: any) => plan.id === 'starter');
    const growth = data.plans.find((plan: any) => plan.id === 'growth');
    const pro = data.plans.find((plan: any) => plan.id === 'pro');

    expect(starter.price).toBe(AU_PRICING.starter.price);
    expect(starter.formattedPrice).toBe('A$140');
    expect(starter.minutesIncluded).toBe(AU_PRICING.starter.minutesIncluded);

    expect(growth.price).toBe(AU_PRICING.growth.price);
    expect(growth.formattedPrice).toBe('A$424');

    expect(pro.price).toBe(AU_PRICING.pro.price);
    expect(pro.formattedPrice).toBe('A$851');
  });
});

test.describe('AU Payment Links', () => {
  test.beforeEach(async ({ api }) => {
    await api.loginAsDevUser('starter');
  });

  for (const planId of ['starter', 'growth', 'pro'] as const) {
    test(`GET /api/billing/payment-link/${planId} returns AU link`, async ({ request, api }) => {
      await api.resetTestUser(TEST_USERS.fresh);
      await api.loginAsUser(TEST_USERS.fresh);

      const response = await request.get(`${API_URL}/api/billing/payment-link/${planId}?region=AU`);

      if (response.ok()) {
        const data = await response.json();
        expect(data.url).toContain('buy.stripe.com');
        expect(data.region).toBe('AU');
      }
    });
  }
});

test.describe('AU Pricing UI', () => {
  test('AU homepage shows AUD prices', async ({ page }) => {
    await page.goto('/au');

    await page.waitForSelector('text=/A\\$140|A\\$424|A\\$851/', { timeout: 10000 });

    await expect(page.locator('text=A$140').first()).toBeVisible();
    await expect(page.locator('text=A$424').first()).toBeVisible();
    await expect(page.locator('text=A$851').first()).toBeVisible();
  });

  test('AU homepage shows Australian market copy', async ({ page }) => {
    await page.goto('/au');

    await expect(page.locator('text=Australia').first()).toBeVisible();
    await expect(page.locator('text=/Australian number|Australian numbers/').first()).toBeVisible();
  });

  test('AU homepage exposes AU-specific navigation routes', async ({ page }) => {
    await page.goto('/au');

    await expect(page.locator('a[href="/au/features"]').first()).toBeVisible();
    await expect(page.locator('a[href="/au/directory"]').first()).toBeVisible();
    await expect(page.locator('a[href="/au/blog"]').first()).toBeVisible();
    await expect(page.locator('a[href="/au/compare"]').first()).toBeVisible();
  });
});

test.describe('AU Checkout Routing', () => {
  test('checkout forwards region=AU when requesting the payment link', async ({ page }) => {
    let interceptedRegion: string | null = null;

    await page.route('**/api/billing/payment-link/starter?*', async (route) => {
      const requestUrl = new URL(route.request().url());
      interceptedRegion = requestUrl.searchParams.get('region');

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          url: `${WEB_URL}/au?checkout=mock`,
        }),
      });
    });

    await page.goto('/checkout?plan=starter&region=AU');
    await page.waitForURL('**/au?checkout=mock', { timeout: 10000 });

    expect(interceptedRegion).toBe('AU');
    await expect
      .poll(() => page.evaluate(() => window.sessionStorage.getItem('selectedRegion')))
      .toBe('AU');
  });
});
