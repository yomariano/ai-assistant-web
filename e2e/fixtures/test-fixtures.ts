import { test as base, expect } from '@playwright/test';
import * as api from '../helpers/api';

// Test user IDs (must match seedDevUsers.js)
export const TEST_USERS = {
  starter: '00000000-0000-0000-0000-000000000001',
  growth: '00000000-0000-0000-0000-000000000002',
  scale: '00000000-0000-0000-0000-000000000003',
  // Fresh user for new subscription tests
  fresh: '00000000-0000-0000-0000-000000000099',
};

// Plan limits for verification
export const PLAN_LIMITS = {
  starter: { phoneNumbers: 1, minutesIncluded: 30 },
  growth: { phoneNumbers: 2, minutesIncluded: 100 },
  scale: { phoneNumbers: 5, minutesIncluded: 300 },
};

// Extended test fixture with helpers
export const test = base.extend<{
  api: typeof api;
  testUser: { id: string; plan: 'starter' | 'growth' | 'scale' };
}>({
  // Expose API helpers to tests
  api: async ({}, use) => {
    await use(api);
  },

  // Default test user (starter plan)
  testUser: async ({}, use) => {
    await use({ id: TEST_USERS.starter, plan: 'starter' });
  },
});

export { expect };

/**
 * Helper to login via UI
 */
export async function loginViaUI(page: any, plan: 'starter' | 'growth' | 'scale' = 'starter') {
  // In dev mode, we can directly navigate to dashboard
  // The dev login will happen automatically
  await api.loginAsDevUser(plan);
  await page.goto('/dashboard');
  await page.waitForSelector('text=Dashboard', { timeout: 10000 });
}

/**
 * Helper to verify phone numbers in dashboard
 */
export async function verifyPhoneNumbers(page: any, expectedCount: number) {
  await page.goto('/assistant');
  await page.waitForSelector('text=AI Assistant', { timeout: 10000 });

  // Count phone number entries
  const phoneCards = await page.locator('[data-testid="phone-number"]').count();
  expect(phoneCards).toBe(expectedCount);
}

/**
 * Helper to verify subscription status
 */
export async function verifySubscription(page: any, expectedPlan: string) {
  await page.goto('/billing');
  await page.waitForSelector('text=Billing', { timeout: 10000 });

  // Check plan badge
  const planBadge = page.locator(`text=${expectedPlan}`).first();
  await expect(planBadge).toBeVisible();
}
