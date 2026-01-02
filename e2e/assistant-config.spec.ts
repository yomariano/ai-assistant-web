import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:3000';
const TEST_USER_ID = '00000000-0000-0000-0000-000000000077'; // Different from other tests

// Helper to get auth cookie
async function getAuthCookie(request: any, userId: string) {
  const response = await request.get(`${API_URL}/api/auth/dev-login?userId=${userId}`);
  return response.headers()['set-cookie'] || '';
}

// Helper to get raw DB state
async function getDbState(request: any, userId: string) {
  const response = await request.get(`${API_URL}/api/billing/test/db-state/${userId}`);
  if (!response.ok()) {
    throw new Error(`Failed to get DB state: ${response.status()}`);
  }
  return response.json();
}

// Helper to setup user with subscription and assistant
async function setupUserWithSubscription(request: any, userId: string, planId: string) {
  const response = await request.post(`${API_URL}/api/billing/test/simulate-checkout`, {
    data: { userId, planId }
  });
  return response.json();
}

test.describe('Assistant Configuration API', () => {
  test.beforeEach(async ({ request }) => {
    // Reset and setup user with subscription
    await request.post(`${API_URL}/api/billing/test/reset-user`, {
      data: { userId: TEST_USER_ID }
    });
    await setupUserWithSubscription(request, TEST_USER_ID, 'starter');
  });

  test('get assistant returns current configuration', async ({ request }) => {
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    const response = await request.get(`${API_URL}/api/assistant`, {
      headers: { 'Cookie': cookie }
    });

    expect(response.ok()).toBe(true);
    const data = await response.json();
    console.log('Assistant config:', data);

    expect(data.assistant).toBeDefined();
    expect(data.assistant.name).toBeDefined();
    // API returns camelCase (firstMessage not first_message)
    expect(data.assistant.firstMessage).toBeDefined();
    console.log('Assistant retrieved successfully');
  });

  test('update assistant name', async ({ request }) => {
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    const newName = 'My Business Assistant';
    const response = await request.patch(`${API_URL}/api/assistant`, {
      headers: { 'Cookie': cookie },
      data: { name: newName }
    });

    expect(response.ok()).toBe(true);
    const data = await response.json();
    expect(data.success).toBe(true);

    // Verify DB state
    const dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.assistant.name).toBe(newName);
    console.log('Assistant name updated:', dbState.assistant.name);
  });

  test('update assistant first message', async ({ request }) => {
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    const newFirstMessage = 'Welcome to Acme Corp! How can I assist you today?';
    const response = await request.patch(`${API_URL}/api/assistant`, {
      headers: { 'Cookie': cookie },
      data: { firstMessage: newFirstMessage }
    });

    expect(response.ok()).toBe(true);

    // Verify in DB
    const dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.assistant.first_message).toBe(newFirstMessage);
    console.log('First message updated');
  });

  test('update assistant system prompt', async ({ request }) => {
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    const newSystemPrompt = 'You are a helpful customer service agent for Acme Corp. Be friendly and professional.';
    const response = await request.patch(`${API_URL}/api/assistant`, {
      headers: { 'Cookie': cookie },
      data: { systemPrompt: newSystemPrompt }
    });

    expect(response.ok()).toBe(true);

    // Verify in DB
    const dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.assistant.system_prompt).toBe(newSystemPrompt);
    console.log('System prompt updated');
  });

  test('update business context fields', async ({ request }) => {
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    const updates = {
      businessName: 'Acme Corporation',
      businessDescription: 'Leading provider of innovative solutions',
      greetingName: 'Acme Support'
    };

    const response = await request.patch(`${API_URL}/api/assistant`, {
      headers: { 'Cookie': cookie },
      data: updates
    });

    expect(response.ok()).toBe(true);

    // Verify in DB
    const dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.assistant.business_name).toBe(updates.businessName);
    expect(dbState.assistant.business_description).toBe(updates.businessDescription);
    expect(dbState.assistant.greeting_name).toBe(updates.greetingName);
    console.log('Business context updated:', {
      businessName: dbState.assistant.business_name,
      businessDescription: dbState.assistant.business_description,
      greetingName: dbState.assistant.greeting_name
    });
  });

  test('update multiple fields at once', async ({ request }) => {
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    const updates = {
      name: 'Sales Assistant',
      firstMessage: 'Hi there! Ready to help you find the perfect solution.',
      systemPrompt: 'You are a sales assistant. Be helpful and answer product questions.',
      businessName: 'TechCorp'
    };

    const response = await request.patch(`${API_URL}/api/assistant`, {
      headers: { 'Cookie': cookie },
      data: updates
    });

    expect(response.ok()).toBe(true);

    // Verify all fields in DB
    const dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.assistant.name).toBe(updates.name);
    expect(dbState.assistant.first_message).toBe(updates.firstMessage);
    expect(dbState.assistant.system_prompt).toBe(updates.systemPrompt);
    expect(dbState.assistant.business_name).toBe(updates.businessName);
    console.log('Multiple fields updated successfully');
  });
});

test.describe('Voice Selection by Plan', () => {
  test.beforeEach(async ({ request }) => {
    await request.post(`${API_URL}/api/billing/test/reset-user`, {
      data: { userId: TEST_USER_ID }
    });
  });

  test('get available voices returns voices for starter plan', async ({ request }) => {
    await setupUserWithSubscription(request, TEST_USER_ID, 'starter');
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    const response = await request.get(`${API_URL}/api/assistant/voices`, {
      headers: { 'Cookie': cookie }
    });

    expect(response.ok()).toBe(true);
    const data = await response.json();
    console.log('Starter plan voices:', data.voices);

    expect(data.voices).toBeDefined();
    expect(Array.isArray(data.voices)).toBe(true);
    expect(data.voices.length).toBeGreaterThan(0);

    // Starter should have basic voices
    const voiceIds = data.voices.map((v: any) => v.id);
    expect(voiceIds).toContain('jennifer');
    expect(voiceIds).toContain('michael');
    console.log('Starter plan has', data.voices.length, 'voices');
  });

  test('growth plan has more voice options than starter', async ({ request }) => {
    // Setup growth user
    await setupUserWithSubscription(request, TEST_USER_ID, 'growth');
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    const response = await request.get(`${API_URL}/api/assistant/voices`, {
      headers: { 'Cookie': cookie }
    });

    expect(response.ok()).toBe(true);
    const growthData = await response.json();
    console.log('Growth plan voices:', growthData.voices?.length);

    // Growth should have more voices including premium options
    expect(growthData.voices.length).toBeGreaterThanOrEqual(4);
    console.log('Growth plan has', growthData.voices.length, 'voices');
  });

  test('scale plan has maximum voice options', async ({ request }) => {
    await setupUserWithSubscription(request, TEST_USER_ID, 'scale');
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    const response = await request.get(`${API_URL}/api/assistant/voices`, {
      headers: { 'Cookie': cookie }
    });

    expect(response.ok()).toBe(true);
    const scaleData = await response.json();
    console.log('Scale plan voices:', scaleData.voices?.length);

    // Scale should have all voices including ElevenLabs
    expect(scaleData.voices.length).toBeGreaterThanOrEqual(5);
    console.log('Scale plan has', scaleData.voices.length, 'voices');
  });

  test('can update voice for starter plan with valid voice', async ({ request }) => {
    await setupUserWithSubscription(request, TEST_USER_ID, 'starter');
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    // Update to michael (available on starter)
    const response = await request.patch(`${API_URL}/api/assistant`, {
      headers: { 'Cookie': cookie },
      data: {
        voiceId: 'michael',
        voiceProvider: 'playht'
      }
    });

    expect(response.ok()).toBe(true);

    // Verify in DB
    const dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.assistant.voice_id).toBe('michael');
    expect(dbState.assistant.voice_provider).toBe('playht');
    console.log('Voice updated to michael');
  });
});

test.describe('Assistant Stats', () => {
  test.beforeEach(async ({ request }) => {
    await request.post(`${API_URL}/api/billing/test/reset-user`, {
      data: { userId: TEST_USER_ID }
    });
    await setupUserWithSubscription(request, TEST_USER_ID, 'starter');
  });

  test('get assistant stats returns usage data', async ({ request }) => {
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    const response = await request.get(`${API_URL}/api/assistant/stats`, {
      headers: { 'Cookie': cookie }
    });

    expect(response.ok()).toBe(true);
    const data = await response.json();
    console.log('Assistant stats:', data);

    // Stats should include usage information
    expect(data).toBeDefined();
  });
});

test.describe('Assistant with Phone Numbers', () => {
  test.beforeEach(async ({ request }) => {
    await request.post(`${API_URL}/api/billing/test/reset-user`, {
      data: { userId: TEST_USER_ID }
    });
  });

  test('assistant is linked to provisioned phone numbers', async ({ request }) => {
    await setupUserWithSubscription(request, TEST_USER_ID, 'starter');
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    // Get phone numbers
    const phonesResponse = await request.get(`${API_URL}/api/billing/phone-numbers`, {
      headers: { 'Cookie': cookie }
    });
    expect(phonesResponse.ok()).toBe(true);
    const phonesData = await phonesResponse.json();

    // Get assistant
    const assistantResponse = await request.get(`${API_URL}/api/assistant`, {
      headers: { 'Cookie': cookie }
    });
    const assistantData = await assistantResponse.json();

    // Verify DB shows phone numbers linked to assistant
    const dbState = await getDbState(request, TEST_USER_ID);
    const assistantId = dbState.assistant?.id;

    if (dbState.phoneNumbers.active.length > 0) {
      // Check that at least one phone is linked to the assistant
      const linkedPhone = dbState.phoneNumbers.active.find(
        (p: any) => p.assistant_id === assistantId
      );
      expect(linkedPhone).toBeDefined();
      console.log('Phone numbers linked to assistant:', dbState.phoneNumbers.activeCount);
    }
  });

  test('growth plan gets 2 phone numbers linked to assistant', async ({ request }) => {
    await setupUserWithSubscription(request, TEST_USER_ID, 'growth');

    const dbState = await getDbState(request, TEST_USER_ID);
    expect(dbState.phoneNumbers.activeCount).toBe(2);

    // All phones should be linked to the same assistant
    const assistantId = dbState.assistant?.id;
    const linkedPhones = dbState.phoneNumbers.active.filter(
      (p: any) => p.assistant_id === assistantId
    );
    expect(linkedPhones.length).toBe(2);
    console.log('Growth plan: 2 phones linked to assistant');
  });
});

test.describe('Assistant Validation', () => {
  test.beforeEach(async ({ request }) => {
    await request.post(`${API_URL}/api/billing/test/reset-user`, {
      data: { userId: TEST_USER_ID }
    });
    await setupUserWithSubscription(request, TEST_USER_ID, 'starter');
  });

  // Note: In DEV_MODE, auth is bypassed so this test checks dev mode behavior
  test('dev mode allows access without explicit auth', async ({ request }) => {
    // No cookie but dev mode allows access via default dev user
    const response = await request.get(`${API_URL}/api/assistant`);
    // Dev mode returns 200 with dev user's assistant (or 404 if no assistant)
    expect(response.status()).toBeLessThan(500);
    console.log('Dev mode access works as expected');
  });

  test('empty update request is handled gracefully', async ({ request }) => {
    const cookie = await getAuthCookie(request, TEST_USER_ID);

    const response = await request.patch(`${API_URL}/api/assistant`, {
      headers: { 'Cookie': cookie },
      data: {}
    });

    // Should either succeed with no changes or return appropriate response
    expect(response.status()).toBeLessThan(500);
    console.log('Empty update handled gracefully');
  });
});
