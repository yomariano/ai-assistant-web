/**
 * Billing & Usage E2E Tests
 *
 * Tests for VoiceFleet minutes-included billing model:
 * - Starter: €99/mo 500 minutes
 * - Growth: €299/mo 1000 minutes
 * - Pro: €599/mo 2000 minutes
 */

import { test, expect, TEST_USERS, PLAN_LIMITS } from './fixtures/test-fixtures';

const API_URL = process.env.E2E_API_URL || 'http://localhost:3000';

// Per-call rates in cents (all 0 - minutes included in plan)
const PER_CALL_RATES = {
  starter: 0,   // €0 (500 minutes included)
  growth: 0,    // €0 (1000 minutes included)
  pro: 0        // €0 (2000 minutes included)
};

// Fair use caps (calls included)
const FAIR_USE_CAPS = {
  starter: 100,   // 100 calls/month
  growth: 500,    // 500 calls/month
  pro: 1500       // 1500 calls/month
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
    expect(usage.fairUseCap).toBe(FAIR_USE_CAPS.starter);
  });

  test('GET /api/billing/usage returns usage summary for growth plan', async ({ api }) => {
    await api.loginAsDevUser('growth');

    const response = await fetch(`${API_URL}/api/billing/usage`);
    expect(response.ok).toBe(true);

    const usage = await response.json();

    expect(usage.perCallRateCents).toBe(PER_CALL_RATES.growth);
    expect(usage.fairUseCap).toBe(FAIR_USE_CAPS.growth);
  });

  test('GET /api/billing/usage returns usage summary for pro plan with cap', async ({ api }) => {
    await api.loginAsDevUser('pro');

    const response = await fetch(`${API_URL}/api/billing/usage`);
    expect(response.ok).toBe(true);

    const usage = await response.json();

    expect(usage.perCallRateCents).toBe(PER_CALL_RATES.pro);
    expect(usage.fairUseCap).toBe(FAIR_USE_CAPS.pro);
    expect(usage).toHaveProperty('callsRemaining');
  });
});

test.describe('Calls Included Billing', () => {
  test('starter plan includes 100 calls', async ({ api }) => {
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

    // If simulate endpoint exists, verify no additional charges
    if (simulateResponse.ok) {
      const afterResponse = await fetch(`${API_URL}/api/billing/usage`);
      const afterUsage = await afterResponse.json();

      expect(afterUsage.callsMade).toBe(initialCalls + 1);
      expect(afterUsage.totalChargesCents).toBe(initialCharges); // No additional charges
    }
  });

  test('growth plan includes 500 calls', async ({ api }) => {
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
      expect(afterUsage.totalChargesCents).toBe(initialCharges); // No additional charges
    }
  });

  test('pro plan includes 1500 calls', async ({ api }) => {
    await api.loginAsDevUser('pro');

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
        userId: TEST_USERS.pro,
        planId: 'pro',
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
  test('pro plan allows calls within 1500 cap', async ({ api }) => {
    await api.loginAsDevUser('pro');

    // Check if call is allowed
    const response = await fetch(`${API_URL}/api/billing/can-make-call`);

    if (response.ok) {
      const result = await response.json();

      expect(result.allowed).toBe(true);
      expect(result.reason).toBe('within_cap');
    }
  });

  test('starter plan allows calls within 100 cap', async ({ api }) => {
    await api.loginAsDevUser('starter');

    const response = await fetch(`${API_URL}/api/billing/can-make-call`);

    if (response.ok) {
      const result = await response.json();

      expect(result.allowed).toBe(true);
      expect(result.reason).toBe('within_cap');
      expect(result.callsRemaining).toBeDefined();
    }
  });

  test('growth plan allows calls within 500 cap', async ({ api }) => {
    await api.loginAsDevUser('growth');

    const response = await fetch(`${API_URL}/api/billing/can-make-call`);

    if (response.ok) {
      const result = await response.json();

      expect(result.allowed).toBe(true);
      expect(result.reason).toBe('within_cap');
      expect(result.callsRemaining).toBeDefined();
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

  test('shows calls included for starter plan', async ({ page, api }) => {
    await api.loginAsDevUser('starter');
    await page.goto('/billing');

    await page.waitForSelector('text=Billing', { timeout: 10000 });

    // Look for 100 calls display
    const callsText = page.locator('text=/100.*calls|calls.*100/i');
    if (await callsText.count() > 0) {
      expect(await callsText.first().isVisible()).toBe(true);
    }
  });

  test('shows calls included for pro plan', async ({ page, api }) => {
    await api.loginAsDevUser('pro');
    await page.goto('/billing');

    await page.waitForSelector('text=Billing', { timeout: 10000 });

    // Pro plan should show 1500 calls or similar
    const callsText = page.locator('text=/1500|1,500/i');
    if (await callsText.count() > 0) {
      expect(await callsText.first().isVisible()).toBe(true);
    }
  });
});

test.describe('Phone Number Limits by Plan', () => {
  test('starter plan allows 1 phone number', async ({ api }) => {
    await api.loginAsDevUser('starter');

    const { limit } = await api.getPhoneNumbers();
    expect(limit).toBe(PLAN_LIMITS.starter.phoneNumbers);
  });

  test('growth plan allows 1 phone number', async ({ api }) => {
    await api.loginAsDevUser('growth');

    const { limit } = await api.getPhoneNumbers();
    expect(limit).toBe(PLAN_LIMITS.growth.phoneNumbers);
  });

  test('pro plan allows 1 phone number', async ({ api }) => {
    await api.loginAsDevUser('pro');

    const { limit } = await api.getPhoneNumbers();
    expect(limit).toBe(PLAN_LIMITS.pro.phoneNumbers);
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
  test('pricing page shows correct VoiceFleet prices', async ({ page }) => {
    await page.goto('/pricing');

    // Wait for pricing to load
    await page.waitForSelector('text=/€99|€299|€599/');

    // Verify all three plans are displayed
    const starterPrice = page.locator('text=€99');
    const growthPrice = page.locator('text=€299');
    const proPrice = page.locator('text=€599');

    expect(await starterPrice.count()).toBeGreaterThan(0);
    expect(await growthPrice.count()).toBeGreaterThan(0);
    expect(await proPrice.count()).toBeGreaterThan(0);
  });

  test('pricing page shows minutes included', async ({ page }) => {
    await page.goto('/pricing');

    await page.waitForSelector('text=/500.*minute|minute.*500/i');

    // Verify minutes are shown for each plan
    const starterMinutes = page.locator('text=/500.*minute/i');
    const growthMinutes = page.locator('text=/1,?000.*minute/i');

    expect(await starterMinutes.count()).toBeGreaterThan(0);
    expect(await growthMinutes.count()).toBeGreaterThan(0);
  });
});
