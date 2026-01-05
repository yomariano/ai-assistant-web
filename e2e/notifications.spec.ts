/**
 * Notification Settings E2E Tests
 *
 * Tests for the notification settings page:
 * - Email notification preferences
 * - SMS notification preferences
 * - Call escalation settings
 * - API endpoints for notifications
 */

import { test, expect, TEST_USERS } from './fixtures/test-fixtures';

const API_URL = process.env.E2E_API_URL || 'http://localhost:3000';

// ============================================
// API TESTS - Notification Preferences
// ============================================
test.describe('Notification Preferences API', () => {
  test.beforeEach(async ({ api }) => {
    await api.loginAsDevUser('starter');
  });

  test('GET /api/notifications/preferences returns default preferences', async ({ api }) => {
    const { preferences } = await api.getNotificationPreferences();

    expect(preferences).toBeDefined();
    expect(typeof preferences.email_enabled).toBe('boolean');
    expect(typeof preferences.sms_enabled).toBe('boolean');
    expect(preferences.timezone).toBeDefined();
  });

  test('PUT /api/notifications/preferences updates email settings', async ({ api }) => {
    const updates = {
      email_enabled: true,
      email_address: 'test-update@example.com',
      notify_on_call_complete: true,
      notify_on_message_taken: false,
    };

    const { preferences, message } = await api.updateNotificationPreferences(updates);

    expect(message).toContain('updated');
    expect(preferences.email_enabled).toBe(true);
    expect(preferences.email_address).toBe('test-update@example.com');
    expect(preferences.notify_on_call_complete).toBe(true);
    expect(preferences.notify_on_message_taken).toBe(false);
  });

  test('PUT /api/notifications/preferences updates SMS settings', async ({ api }) => {
    const updates = {
      sms_enabled: true,
      sms_number: '+353851234567',
      business_hours_only: true,
    };

    const { preferences } = await api.updateNotificationPreferences(updates);

    expect(preferences.sms_enabled).toBe(true);
    expect(preferences.sms_number).toBe('+353851234567');
    expect(preferences.business_hours_only).toBe(true);
  });

  test('PUT /api/notifications/preferences rejects invalid phone number', async ({ request, api }) => {
    await api.loginAsDevUser('starter');

    const response = await request.put(`${API_URL}/api/notifications/preferences`, {
      data: {
        sms_enabled: true,
        sms_number: 'invalid-number',
      },
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error.code).toBe('INVALID_PHONE_NUMBER');
  });

  test('PUT /api/notifications/preferences rejects invalid email', async ({ request, api }) => {
    await api.loginAsDevUser('starter');

    const response = await request.put(`${API_URL}/api/notifications/preferences`, {
      data: {
        email_enabled: true,
        email_address: 'not-an-email',
      },
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

  test('GET /api/notifications/escalation returns default settings', async ({ api }) => {
    const { settings } = await api.getEscalationSettings();

    expect(settings).toBeDefined();
    expect(typeof settings.transfer_enabled).toBe('boolean');
    expect(settings.transfer_method).toBeDefined();
    expect(Array.isArray(settings.trigger_keywords)).toBe(true);
  });

  test('PUT /api/notifications/escalation updates transfer settings', async ({ api }) => {
    const updates = {
      transfer_enabled: true,
      transfer_number: '+353851234567',
      transfer_method: 'warm_transfer',
    };

    const { settings, message } = await api.updateEscalationSettings(updates);

    expect(message).toContain('updated');
    expect(settings.transfer_enabled).toBe(true);
    expect(settings.transfer_number).toBe('+353851234567');
    expect(settings.transfer_method).toBe('warm_transfer');
  });

  test('PUT /api/notifications/escalation updates business hours', async ({ api }) => {
    const updates = {
      business_hours_only: true,
      business_hours_start: '10:00',
      business_hours_end: '20:00',
      business_days: [1, 2, 3, 4, 5, 6],
    };

    const { settings } = await api.updateEscalationSettings(updates);

    expect(settings.business_hours_only).toBe(true);
    expect(settings.business_hours_start).toBe('10:00');
    expect(settings.business_hours_end).toBe('20:00');
    expect(settings.business_days).toEqual([1, 2, 3, 4, 5, 6]);
  });

  test('PUT /api/notifications/escalation updates after hours action', async ({ api }) => {
    const updates = {
      after_hours_action: 'sms_alert',
      after_hours_message: 'We are closed. Leave a message!',
    };

    const { settings } = await api.updateEscalationSettings(updates);

    expect(settings.after_hours_action).toBe('sms_alert');
    expect(settings.after_hours_message).toBe('We are closed. Leave a message!');
  });

  test('PUT /api/notifications/escalation rejects invalid transfer method', async ({ request, api }) => {
    await api.loginAsDevUser('starter');

    const response = await request.put(`${API_URL}/api/notifications/escalation`, {
      data: {
        transfer_method: 'invalid_method',
      },
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error.code).toBe('INVALID_TRANSFER_METHOD');
  });

  test('PUT /api/notifications/escalation rejects invalid after hours action', async ({ request, api }) => {
    await api.loginAsDevUser('starter');

    const response = await request.put(`${API_URL}/api/notifications/escalation`, {
      data: {
        after_hours_action: 'invalid_action',
      },
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error.code).toBe('INVALID_AFTER_HOURS_ACTION');
  });

  test('PUT /api/notifications/escalation validates trigger keywords is array', async ({ request, api }) => {
    await api.loginAsDevUser('starter');

    const response = await request.put(`${API_URL}/api/notifications/escalation`, {
      data: {
        trigger_keywords: 'not-an-array',
      },
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error.code).toBe('INVALID_TRIGGER_KEYWORDS');
  });
});

// ============================================
// API TESTS - Test Notifications
// ============================================
test.describe('Test Notification API', () => {
  test.beforeEach(async ({ api }) => {
    await api.loginAsDevUser('starter');
  });

  test('POST /api/notifications/test requires valid type', async ({ request, api }) => {
    await api.loginAsDevUser('starter');

    const response = await request.post(`${API_URL}/api/notifications/test`, {
      data: { type: 'invalid' },
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error.code).toBe('INVALID_NOTIFICATION_TYPE');
  });

  test('POST /api/notifications/test accepts email type', async ({ request, api }) => {
    await api.loginAsDevUser('starter');

    // First enable email notifications with a valid address
    await api.updateNotificationPreferences({
      email_enabled: true,
      email_address: 'test@example.com',
    });

    const response = await request.post(`${API_URL}/api/notifications/test`, {
      data: { type: 'email' },
    });

    // May succeed or fail depending on email service config, but should be 200 or 400
    expect([200, 400]).toContain(response.status());
  });

  test('POST /api/notifications/test accepts sms type', async ({ request, api }) => {
    await api.loginAsDevUser('starter');

    // First enable SMS notifications with a valid number
    await api.updateNotificationPreferences({
      sms_enabled: true,
      sms_number: '+353851234567',
    });

    const response = await request.post(`${API_URL}/api/notifications/test`, {
      data: { type: 'sms' },
    });

    // May succeed or fail depending on SMS service config, but should be 200 or 400
    expect([200, 400]).toContain(response.status());
  });
});

// ============================================
// UI TESTS - Notification Settings Page
// ============================================
test.describe('Notification Settings UI', () => {
  test.beforeEach(async ({ page, api }) => {
    await api.loginAsDevUser('starter');
    await page.goto('/notifications');
    await page.waitForSelector('text=Notification Settings', { timeout: 10000 });
  });

  test('should display notification settings page', async ({ page }) => {
    // Verify page header
    await expect(page.locator('h1')).toContainText('Notification Settings');

    // Verify all three sections are present
    await expect(page.locator('text=Email Notifications')).toBeVisible();
    await expect(page.locator('text=SMS Notifications')).toBeVisible();
    await expect(page.locator('text=Call Escalation')).toBeVisible();
  });

  test('should display email notification settings', async ({ page }) => {
    // Verify email settings elements
    await expect(page.locator('text=Enable Email Notifications')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('text=Call completed with order')).toBeVisible();
    await expect(page.locator('text=Message taken from customer')).toBeVisible();
    await expect(page.locator('text=Call escalated to human')).toBeVisible();
    await expect(page.locator('text=Voicemail received')).toBeVisible();
  });

  test('should display SMS notification settings', async ({ page }) => {
    // Verify SMS settings elements
    await expect(page.locator('text=Enable SMS Notifications')).toBeVisible();
    await expect(page.locator('input[type="tel"]').first()).toBeVisible();
    await expect(page.locator('text=Business Hours Only').first()).toBeVisible();
  });

  test('should display call escalation settings', async ({ page }) => {
    // Verify escalation settings elements
    await expect(page.locator('text=Enable Call Transfer')).toBeVisible();
    await expect(page.locator('text=Transfer Phone Number')).toBeVisible();
    await expect(page.locator('text=Transfer Method')).toBeVisible();
  });

  test('should have Send Test Email button', async ({ page }) => {
    const testEmailButton = page.locator('button:has-text("Send Test Email")');
    await expect(testEmailButton).toBeVisible();
  });

  test('should have Send Test SMS button', async ({ page }) => {
    const testSmsButton = page.locator('button:has-text("Send Test SMS")');
    await expect(testSmsButton).toBeVisible();
  });

  test('should have Save buttons for each section', async ({ page }) => {
    // Email section save button
    await expect(page.locator('button:has-text("Save Email Settings")')).toBeVisible();

    // SMS section save button
    await expect(page.locator('button:has-text("Save SMS Settings")')).toBeVisible();

    // Escalation section save button
    await expect(page.locator('button:has-text("Save Escalation Settings")')).toBeVisible();
  });
});

// ============================================
// UI TESTS - Email Settings Interactions
// ============================================
test.describe('Email Settings Interactions', () => {
  test.beforeEach(async ({ page, api }) => {
    await api.loginAsDevUser('starter');
    await page.goto('/notifications');
    await page.waitForSelector('text=Notification Settings', { timeout: 10000 });
  });

  test('should toggle email notifications', async ({ page }) => {
    // Find the email toggle (first toggle on the page)
    const emailToggle = page.locator('button[type="button"]').first();

    // Click to toggle
    const initialState = await emailToggle.getAttribute('class');
    await emailToggle.click();

    // Verify state changed (class should change)
    const newState = await emailToggle.getAttribute('class');
    expect(newState).not.toBe(initialState);
  });

  test('should input email address', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('restaurant@example.com');

    expect(await emailInput.inputValue()).toBe('restaurant@example.com');
  });

  test('should save email settings', async ({ page }) => {
    // Fill in email
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('test-save@example.com');

    // Click save
    await page.locator('button:has-text("Save Email Settings")').click();

    // Should show success message
    await expect(page.locator('text=saved successfully')).toBeVisible({ timeout: 5000 });
  });
});

// ============================================
// UI TESTS - SMS Settings Interactions
// ============================================
test.describe('SMS Settings Interactions', () => {
  test.beforeEach(async ({ page, api }) => {
    await api.loginAsDevUser('starter');
    await page.goto('/notifications');
    await page.waitForSelector('text=Notification Settings', { timeout: 10000 });
  });

  test('should input phone number for SMS', async ({ page }) => {
    // Find SMS phone input (second tel input, under SMS section)
    const phoneInputs = page.locator('input[type="tel"]');
    const smsPhoneInput = phoneInputs.first();

    await smsPhoneInput.fill('+353851234567');
    expect(await smsPhoneInput.inputValue()).toBe('+353851234567');
  });
});

// ============================================
// UI TESTS - Escalation Settings Interactions
// ============================================
test.describe('Escalation Settings Interactions', () => {
  test.beforeEach(async ({ page, api }) => {
    await api.loginAsDevUser('starter');
    await page.goto('/notifications');
    await page.waitForSelector('text=Notification Settings', { timeout: 10000 });
  });

  test('should toggle call transfer', async ({ page }) => {
    // Find the escalation section
    const escalationSection = page.locator('text=Enable Call Transfer').locator('..');

    // The toggle should be nearby
    const transferToggle = escalationSection.locator('button[type="button"]');

    // Click to enable
    await transferToggle.click();

    // After enabling, transfer number field should be interactive
    const transferNumberInput = page.locator('input[placeholder="+353851234567"]').last();
    await expect(transferNumberInput).toBeEnabled();
  });

  test('should select transfer method', async ({ page }) => {
    // First enable transfer
    const escalationSection = page.locator('text=Enable Call Transfer').locator('..');
    await escalationSection.locator('button[type="button"]').click();

    // Find transfer method dropdown
    const transferMethodSelect = page.locator('select').first();
    await transferMethodSelect.selectOption('blind_transfer');

    expect(await transferMethodSelect.inputValue()).toBe('blind_transfer');
  });

  test('should save escalation settings', async ({ page }) => {
    // Enable transfer
    const escalationSection = page.locator('text=Enable Call Transfer').locator('..');
    await escalationSection.locator('button[type="button"]').click();

    // Fill transfer number
    const transferInputs = page.locator('input[placeholder="+353851234567"]');
    await transferInputs.last().fill('+353851234567');

    // Click save
    await page.locator('button:has-text("Save Escalation Settings")').click();

    // Should show success message
    await expect(page.locator('text=saved successfully')).toBeVisible({ timeout: 5000 });
  });
});

// ============================================
// Navigation Tests
// ============================================
test.describe('Navigation', () => {
  test.beforeEach(async ({ page, api }) => {
    await api.loginAsDevUser('starter');
  });

  test('sidebar should have Notifications link', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForSelector('text=Dashboard', { timeout: 10000 });

    // Find notifications link in sidebar
    const notificationsLink = page.locator('a[href="/notifications"]');
    await expect(notificationsLink).toBeVisible();
    await expect(notificationsLink).toContainText('Notifications');
  });

  test('clicking Notifications link should navigate to settings', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForSelector('text=Dashboard', { timeout: 10000 });

    // Click notifications link
    await page.locator('a[href="/notifications"]').click();

    // Should be on notifications page
    await expect(page).toHaveURL(/\/notifications/);
    await expect(page.locator('h1')).toContainText('Notification Settings');
  });
});

// ============================================
// Cross-Plan Tests
// ============================================
test.describe('Notifications across plans', () => {
  test('starter plan user can access notification settings', async ({ page, api }) => {
    await api.loginAsDevUser('starter');
    await page.goto('/notifications');
    await expect(page.locator('h1')).toContainText('Notification Settings');
  });

  test('growth plan user can access notification settings', async ({ page, api }) => {
    await api.loginAsDevUser('growth');
    await page.goto('/notifications');
    await expect(page.locator('h1')).toContainText('Notification Settings');
  });

  test('scale plan user can access notification settings', async ({ page, api }) => {
    await api.loginAsDevUser('scale');
    await page.goto('/notifications');
    await expect(page.locator('h1')).toContainText('Notification Settings');
  });
});
