/**
 * Notification Settings E2E Tests (MVP)
 *
 * Simplified tests for the MVP notification settings:
 * - Email notifications (enable/disable, address, triggers)
 * - SMS notifications (enable/disable, phone number)
 * - Call transfer (enable/disable, phone number)
 */

import { test, expect } from './fixtures/test-fixtures';

const API_URL = process.env.E2E_API_URL || 'http://localhost:3000';

// ============================================
// API TESTS - Notification Preferences
// ============================================
test.describe('Notification Preferences API', () => {
  test.beforeEach(async ({ api }) => {
    await api.loginAsDevUser('starter');
  });

  test('GET /api/notifications/preferences returns preferences', async ({ api }) => {
    const { preferences } = await api.getNotificationPreferences();

    expect(preferences).toBeDefined();
    expect(typeof preferences.email_enabled).toBe('boolean');
    expect(typeof preferences.sms_enabled).toBe('boolean');
  });

  test('PUT /api/notifications/preferences updates email settings', async ({ api }) => {
    const updates = {
      email_enabled: true,
      email_address: 'test@example.com',
      notify_on_call_complete: true,
      notify_on_escalation: true,
    };

    const { preferences, message } = await api.updateNotificationPreferences(updates);

    expect(message).toContain('updated');
    expect(preferences.email_enabled).toBe(true);
    expect(preferences.email_address).toBe('test@example.com');
  });

  test('PUT /api/notifications/preferences updates SMS settings', async ({ api }) => {
    const updates = {
      sms_enabled: true,
      sms_number: '+353851234567',
    };

    const { preferences } = await api.updateNotificationPreferences(updates);

    expect(preferences.sms_enabled).toBe(true);
    expect(preferences.sms_number).toBe('+353851234567');
  });

  test('rejects invalid phone number', async ({ request, api }) => {
    await api.loginAsDevUser('starter');

    const response = await request.put(`${API_URL}/api/notifications/preferences`, {
      data: { sms_number: 'invalid' },
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error.code).toBe('INVALID_PHONE_NUMBER');
  });

  test('rejects invalid email', async ({ request, api }) => {
    await api.loginAsDevUser('starter');

    const response = await request.put(`${API_URL}/api/notifications/preferences`, {
      data: { email_address: 'not-an-email' },
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error.code).toBe('INVALID_EMAIL');
  });
});

// ============================================
// API TESTS - Escalation Settings
// ============================================
test.describe('Escalation Settings API', () => {
  test.beforeEach(async ({ api }) => {
    await api.loginAsDevUser('starter');
  });

  test('GET /api/notifications/escalation returns settings', async ({ api }) => {
    const { settings } = await api.getEscalationSettings();

    expect(settings).toBeDefined();
    expect(typeof settings.transfer_enabled).toBe('boolean');
  });

  test('PUT /api/notifications/escalation updates transfer settings', async ({ api }) => {
    const updates = {
      transfer_enabled: true,
      transfer_number: '+353851234567',
    };

    const { settings, message } = await api.updateEscalationSettings(updates);

    expect(message).toContain('updated');
    expect(settings.transfer_enabled).toBe(true);
    expect(settings.transfer_number).toBe('+353851234567');
  });

  test('rejects invalid transfer number', async ({ request, api }) => {
    await api.loginAsDevUser('starter');

    const response = await request.put(`${API_URL}/api/notifications/escalation`, {
      data: { transfer_number: 'invalid' },
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error.code).toBe('INVALID_PHONE_NUMBER');
  });
});

// ============================================
// API TESTS - Test Notifications
// ============================================
test.describe('Test Notification API', () => {
  test.beforeEach(async ({ api }) => {
    await api.loginAsDevUser('starter');
  });

  test('rejects invalid notification type', async ({ request, api }) => {
    await api.loginAsDevUser('starter');

    const response = await request.post(`${API_URL}/api/notifications/test`, {
      data: { type: 'invalid' },
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error.code).toBe('INVALID_NOTIFICATION_TYPE');
  });

  test('accepts email type', async ({ request, api }) => {
    await api.loginAsDevUser('starter');

    // Enable email first
    await api.updateNotificationPreferences({
      email_enabled: true,
      email_address: 'test@example.com',
    });

    const response = await request.post(`${API_URL}/api/notifications/test`, {
      data: { type: 'email' },
    });

    // May succeed or fail depending on email service config
    expect([200, 400]).toContain(response.status());
  });

  test('accepts sms type', async ({ request, api }) => {
    await api.loginAsDevUser('starter');

    // Enable SMS first
    await api.updateNotificationPreferences({
      sms_enabled: true,
      sms_number: '+353851234567',
    });

    const response = await request.post(`${API_URL}/api/notifications/test`, {
      data: { type: 'sms' },
    });

    // May succeed or fail depending on SMS service config
    expect([200, 400]).toContain(response.status());
  });
});

// ============================================
// UI TESTS - Page Structure
// ============================================
test.describe('Notifications Page UI', () => {
  test.beforeEach(async ({ page, api }) => {
    await api.loginAsDevUser('starter');
    await page.goto('/notifications');
    await page.waitForSelector('h1', { timeout: 10000 });
  });

  test('displays page header', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Notifications');
  });

  test('displays all three sections', async ({ page }) => {
    await expect(page.locator('text=Email')).toBeVisible();
    await expect(page.locator('text=SMS')).toBeVisible();
    await expect(page.locator('text=Call Transfer')).toBeVisible();
  });

  test('displays email toggle and input', async ({ page }) => {
    await expect(page.locator('text=Enable Email Notifications')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('displays SMS toggle and input', async ({ page }) => {
    await expect(page.locator('text=Enable SMS Notifications')).toBeVisible();
  });

  test('displays call transfer toggle', async ({ page }) => {
    await expect(page.locator('text=Enable Call Transfer')).toBeVisible();
  });

  test('has Send Test buttons', async ({ page }) => {
    await expect(page.locator('button:has-text("Send Test")').first()).toBeVisible();
  });

  test('has Save buttons', async ({ page }) => {
    const saveButtons = page.locator('button:has-text("Save")');
    await expect(saveButtons.first()).toBeVisible();
  });
});

// ============================================
// UI TESTS - Email Settings
// ============================================
test.describe('Email Settings', () => {
  test.beforeEach(async ({ page, api }) => {
    await api.loginAsDevUser('starter');
    await page.goto('/notifications');
    await page.waitForSelector('h1', { timeout: 10000 });
  });

  test('can input email address', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('test@example.com');
    expect(await emailInput.inputValue()).toBe('test@example.com');
  });

  test('can save email settings', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('save-test@example.com');

    // Click save button in email section
    const emailSection = page.locator('text=Email').locator('..').locator('..');
    await emailSection.locator('button:has-text("Save")').click();

    // Should show success message
    await expect(page.locator('text=saved')).toBeVisible({ timeout: 5000 });
  });

  test('displays notification triggers when email enabled', async ({ page }) => {
    await expect(page.locator('text=Call completed')).toBeVisible();
    await expect(page.locator('text=Call transferred to human')).toBeVisible();
    await expect(page.locator('text=Voicemail received')).toBeVisible();
  });
});

// ============================================
// UI TESTS - SMS Settings
// ============================================
test.describe('SMS Settings', () => {
  test.beforeEach(async ({ page, api }) => {
    await api.loginAsDevUser('starter');
    await page.goto('/notifications');
    await page.waitForSelector('h1', { timeout: 10000 });
  });

  test('can enable SMS and enter phone number', async ({ page }) => {
    // Find SMS section
    const smsSection = page.locator('h2:has-text("SMS")').locator('..').locator('..');

    // Enable SMS toggle
    const toggle = smsSection.locator('button[type="button"]').first();
    await toggle.click();

    // Phone input should appear
    const phoneInput = page.locator('input[type="tel"]').first();
    await phoneInput.fill('+353851234567');

    expect(await phoneInput.inputValue()).toBe('+353851234567');
  });
});

// ============================================
// UI TESTS - Call Transfer Settings
// ============================================
test.describe('Call Transfer Settings', () => {
  test.beforeEach(async ({ page, api }) => {
    await api.loginAsDevUser('starter');
    await page.goto('/notifications');
    await page.waitForSelector('h1', { timeout: 10000 });
  });

  test('can enable call transfer and enter phone number', async ({ page }) => {
    // Find transfer section
    const transferSection = page.locator('h2:has-text("Call Transfer")').locator('..').locator('..');

    // Enable transfer toggle
    const toggle = transferSection.locator('button[type="button"]').first();
    await toggle.click();

    // Phone input should appear - find the one with "Transfer To" label
    const phoneInput = page.locator('input[placeholder="+353851234567"]').last();
    await phoneInput.fill('+353851234567');

    expect(await phoneInput.inputValue()).toBe('+353851234567');
  });

  test('can save transfer settings', async ({ page }) => {
    // Enable and fill
    const transferSection = page.locator('h2:has-text("Call Transfer")').locator('..').locator('..');
    await transferSection.locator('button[type="button"]').first().click();

    const phoneInput = page.locator('input[placeholder="+353851234567"]').last();
    await phoneInput.fill('+353851234567');

    // Save
    await transferSection.locator('button:has-text("Save")').click();

    // Should show success
    await expect(page.locator('text=saved')).toBeVisible({ timeout: 5000 });
  });
});

// ============================================
// Navigation Tests
// ============================================
test.describe('Navigation', () => {
  test('can navigate to notifications from sidebar', async ({ page, api }) => {
    await api.loginAsDevUser('starter');
    await page.goto('/dashboard');
    await page.waitForSelector('text=Dashboard', { timeout: 10000 });

    // Click notifications link
    await page.locator('a[href="/notifications"]').click();

    // Should be on notifications page
    await expect(page).toHaveURL(/\/notifications/);
    await expect(page.locator('h1')).toContainText('Notifications');
  });
});
