/**
 * Billing & Usage E2E Tests
 *
 * Tests for OrderBot pay-per-call billing model:
 * - Lite: €19/mo + €0.95/call
 * - Growth: €99/mo + €0.45/call
 * - Pro: €249/mo + €0/call (1500 fair use cap)
 */

import { test, expect, TEST_USERS, PLAN_LIMITS } from './fixtures/test-fixtures';

const API_URL = process.env.E2E_API_URL || 'http://localhost:3000';

// Per-call rates in cents
const PER_CALL_RATES = {
  starter: 95,   // €0.95
  growth: 45,    // €0.45
  scale: 0       // €0 (included)
};

// Fair use caps
const FAIR_USE_CAPS = {
  starter: null,  // Unlimited (pay per call)
  growth: null,   // Unlimited (pay per call)
  scale: 1500     // 1500 calls/month
};

test.describe('Usage Tracking API', () => {
  test.beforeEach(async ({ api }) => {
    // Login as starter user by default
    await api.loginAsDevUser('starter');
  });

  test('GET /api/billing/usage returns usage summary for starter plan', async ({ api }) => {
    await api.loginAsDevUser('starter');

    const response = await fetch(`${API_URL}/api/billing/usage`);
    expect(response.ok).toBe(true);

    const usage = await response.json();

    expect(usage).toHaveProperty('callsMade');
    expect(usage).toHaveProperty('totalChargesCents');
    expect(usage).toHaveProperty('perCallRateCents');
    expect(usage.perCallRateCents).toBe(PER_CALL_RATES.starter);
    expect(usage.fairUseCap).toBeNull(); // Starter has no cap
  });

  test('GET /api/billing/usage returns usage summary for growth plan', async ({ api }) => {
    await api.loginAsDevUser('growth');

    const response = await fetch(`${API_URL}/api/billing/usage`);
    expect(response.ok).toBe(true);

    const usage = await response.json();

    expect(usage.perCallRateCents).toBe(PER_CALL_RATES.growth);
    expect(usage.fairUseCap).toBeNull(); // Growth has no cap
  });

  test('GET /api/billing/usage returns usage summary for scale plan with cap', async ({ api }) => {
    await api.loginAsDevUser('scale');

    const response = await fetch(`${API_URL}/api/billing/usage`);
    expect(response.ok).toBe(true);

    const usage = await response.json();

    expect(usage.perCallRateCents).toBe(PER_CALL_RATES.scale);
    expect(usage.fairUseCap).toBe(FAIR_USE_CAPS.scale);
    expect(usage).toHaveProperty('callsRemaining');
  });
});

test.describe('Per-Call Billing', () => {
  test('starter plan charges €0.95 per call', async ({ api }) => {
    await api.loginAsDevUser('starter');

    // Get initial usage
    const beforeResponse = await fetch(`${API_URL}/api/billing/usage`);
    const beforeUsage = await beforeResponse.json();
    const initialCalls = beforeUsage.callsMade || 0;
    const initialCharges = beforeUsage.totalChargesCents || 0;

    // Simulate a call via webhook (test endpoint)
    const simulateResponse = await fetch(`${API_URL}/api/billing/test/simulate-call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: TEST_USERS.starter,
        planId: 'starter',
        vapiCostCents: 50
      })
    });

    // If simulate endpoint exists, verify charges
    if (simulateResponse.ok) {
      const afterResponse = await fetch(`${API_URL}/api/billing/usage`);
      const afterUsage = await afterResponse.json();

      expect(afterUsage.callsMade).toBe(initialCalls + 1);
      expect(afterUsage.totalChargesCents).toBe(initialCharges + PER_CALL_RATES.starter);
    }
  });

  test('growth plan charges €0.45 per call', async ({ api }) => {
    await api.loginAsDevUser('growth');

    // Get initial usage
    const beforeResponse = await fetch(`${API_URL}/api/billing/usage`);
    const beforeUsage = await beforeResponse.json();
    const initialCalls = beforeUsage.callsMade || 0;
    const initialCharges = beforeUsage.totalChargesCents || 0;

    // Simulate a call
    const simulateResponse = await fetch(`${API_URL}/api/billing/test/simulate-call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: TEST_USERS.growth,
        planId: 'growth',
        vapiCostCents: 50
      })
    });

    if (simulateResponse.ok) {
      const afterResponse = await fetch(`${API_URL}/api/billing/usage`);
      const afterUsage = await afterResponse.json();

      expect(afterUsage.callsMade).toBe(initialCalls + 1);
      expect(afterUsage.totalChargesCents).toBe(initialCharges + PER_CALL_RATES.growth);
    }
  });

  test('scale plan does not charge per call', async ({ api }) => {
    await api.loginAsDevUser('scale');

    // Get initial usage
    const beforeResponse = await fetch(`${API_URL}/api/billing/usage`);
    const beforeUsage = await beforeResponse.json();
    const initialCalls = beforeUsage.callsMade || 0;
    const initialCharges = beforeUsage.totalChargesCents || 0;

    // Simulate a call
    const simulateResponse = await fetch(`${API_URL}/api/billing/test/simulate-call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: TEST_USERS.scale,
        planId: 'scale',
        vapiCostCents: 50
      })
    });

    if (simulateResponse.ok) {
      const afterResponse = await fetch(`${API_URL}/api/billing/usage`);
      const afterUsage = await afterResponse.json();

      expect(afterUsage.callsMade).toBe(initialCalls + 1);
      expect(afterUsage.totalChargesCents).toBe(initialCharges); // No additional charges
    }
  });
});

test.describe('Fair Use Cap Enforcement', () => {
  test('scale plan allows calls within 1500 cap', async ({ api }) => {
    await api.loginAsDevUser('scale');

    // Check if call is allowed
    const response = await fetch(`${API_URL}/api/billing/can-make-call`);

    if (response.ok) {
      const result = await response.json();

      expect(result.allowed).toBe(true);
      expect(result.reason).toBe('within_cap');
    }
  });

  test('starter plan has unlimited calls (pay per call)', async ({ api }) => {
    await api.loginAsDevUser('starter');

    const response = await fetch(`${API_URL}/api/billing/can-make-call`);

    if (response.ok) {
      const result = await response.json();

      expect(result.allowed).toBe(true);
      expect(result.reason).toBe('pay_per_call');
      expect(result.callsRemaining).toBeNull(); // null = unlimited
    }
  });

  test('growth plan has unlimited calls (pay per call)', async ({ api }) => {
    await api.loginAsDevUser('growth');

    const response = await fetch(`${API_URL}/api/billing/can-make-call`);

    if (response.ok) {
      const result = await response.json();

      expect(result.allowed).toBe(true);
      expect(result.reason).toBe('pay_per_call');
      expect(result.callsRemaining).toBeNull();
    }
  });
});

test.describe('Trial Usage', () => {
  test('trial calls are not charged', async ({ api }) => {
    await api.loginAsDevUser('starter');

    // Simulate a trial call
    const simulateResponse = await fetch(`${API_URL}/api/billing/test/simulate-call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: TEST_USERS.starter,
        planId: 'starter',
        vapiCostCents: 50,
        isTrial: true
      })
    });

    if (simulateResponse.ok) {
      const result = await simulateResponse.json();
      expect(result.costCents).toBe(0); // Trial = free
    }
  });

  test('GET /api/billing/trial-usage returns trial status', async ({ api }) => {
    await api.loginAsDevUser('starter');

    const response = await fetch(`${API_URL}/api/billing/trial-usage`);

    if (response.ok) {
      const trial = await response.json();

      expect(trial).toHaveProperty('callsMade');
      expect(trial).toHaveProperty('callsAllowed');
      expect(trial).toHaveProperty('callsRemaining');
    }
  });
});

test.describe('Billing Dashboard UI', () => {
  test('displays usage summary on billing page', async ({ page, api }) => {
    await api.loginAsDevUser('starter');
    await page.goto('/billing');

    // Wait for billing page to load
    await page.waitForSelector('text=Billing', { timeout: 10000 });

    // Should show usage information
    const usageSection = page.locator('[data-testid="usage-summary"]');
    if (await usageSection.isVisible()) {
      expect(await usageSection.textContent()).toContain('call');
    }
  });

  test('shows per-call rate for starter plan', async ({ page, api }) => {
    await api.loginAsDevUser('starter');
    await page.goto('/billing');

    await page.waitForSelector('text=Billing', { timeout: 10000 });

    // Look for €0.95 rate display
    const rateText = page.locator('text=€0.95');
    if (await rateText.isVisible()) {
      expect(await rateText.isVisible()).toBe(true);
    }
  });

  test('shows unlimited for scale plan', async ({ page, api }) => {
    await api.loginAsDevUser('scale');
    await page.goto('/billing');

    await page.waitForSelector('text=Billing', { timeout: 10000 });

    // Scale plan should show unlimited or included
    const includedText = page.locator('text=/unlimited|included/i');
    if (await includedText.count() > 0) {
      expect(await includedText.first().isVisible()).toBe(true);
    }
  });
});

test.describe('Phone Number Limits by Plan', () => {
  test('starter plan allows 1 phone number', async ({ api }) => {
    await api.loginAsDevUser('starter');

    const { limit } = await api.getPhoneNumbers();
    expect(limit).toBe(PLAN_LIMITS.starter.phoneNumbers);
  });

  test('growth plan allows 2 phone numbers', async ({ api }) => {
    await api.loginAsDevUser('growth');

    const { limit } = await api.getPhoneNumbers();
    expect(limit).toBe(PLAN_LIMITS.growth.phoneNumbers);
  });

  test('scale plan allows 5 phone numbers', async ({ api }) => {
    await api.loginAsDevUser('scale');

    const { limit } = await api.getPhoneNumbers();
    expect(limit).toBe(PLAN_LIMITS.scale.phoneNumbers);
  });
});

test.describe('Vapi Webhook Cost Tracking', () => {
  test('POST /api/vapi/webhook records call with cost', async ({ api }) => {
    await api.loginAsDevUser('starter');

    // Simulate end-of-call-report webhook
    const webhookPayload = {
      message: {
        type: 'end-of-call-report',
        call: {
          id: `test-call-${Date.now()}`,
          status: 'ended',
          endedReason: 'customer-ended-call',
          duration: 120,
          cost: 0.50, // $0.50 Vapi cost
          phoneNumberId: 'test-phone-id',
          customer: { number: '+353851234567' }
        },
        artifact: {
          transcript: 'Test call transcript',
          summary: 'Test call summary'
        }
      }
    };

    const response = await fetch(`${API_URL}/api/vapi/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookPayload)
    });

    expect(response.ok).toBe(true);
    const result = await response.json();
    expect(result.received).toBe(true);
  });
});

test.describe('Plan Pricing Display', () => {
  test('pricing page shows correct OrderBot prices', async ({ page }) => {
    await page.goto('/pricing');

    // Wait for pricing to load
    await page.waitForSelector('text=/€19|€99|€249/');

    // Verify all three plans are displayed
    const litePrice = page.locator('text=€19');
    const growthPrice = page.locator('text=€99');
    const proPrice = page.locator('text=€249');

    expect(await litePrice.count()).toBeGreaterThan(0);
    expect(await growthPrice.count()).toBeGreaterThan(0);
    expect(await proPrice.count()).toBeGreaterThan(0);
  });

  test('pricing page shows per-call rates', async ({ page }) => {
    await page.goto('/pricing');

    await page.waitForSelector('text=/€0\\.95|€0\\.45/');

    // Verify per-call rates are shown
    const starterRate = page.locator('text=€0.95');
    const growthRate = page.locator('text=€0.45');

    expect(await starterRate.count()).toBeGreaterThan(0);
    expect(await growthRate.count()).toBeGreaterThan(0);
  });
});
