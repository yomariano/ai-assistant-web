# VoiceFleet Test Flows

This directory contains comprehensive XML test flows for the VoiceFleet application. These flows document user journeys, feature testing, and expected behaviors.

## Test Flow Files

### 1. Ireland Signup Flow (`01_ireland_signup_flow.xml`)
**Priority:** Critical | **Duration:** ~5 minutes

Tests the complete signup process for Irish users with EUR pricing and VoIPCloud number provisioning.

**Key Areas:**
- Landing page verification
- EUR pricing display
- Google OAuth signup
- Stripe EUR checkout
- VoIPCloud pool provisioning
- Phone number assignment
- Subscription verification

**Prerequisites:**
- VoIPCloud pool has available numbers
- Stripe webhook configured for EUR
- VAPI_VOIPCLOUD_CREDENTIAL_ID set

---

### 2. Template Selection Flow (`02_template_selection_flow.xml`)
**Priority:** High | **Duration:** ~3 minutes

Tests the industry template selector feature across all 6 templates.

**Key Areas:**
- Template display and selection
- Template preview modal
- Key guidelines display
- Sample greeting with placeholders
- System prompt generation
- Template application
- Configuration population

**Templates Tested:**
- General Business
- Medical & Dental
- Legal & Accounting
- Trades & Services
- Hospitality
- Property & Real Estate

---

### 3. Assistant Configuration Flow (`03_assistant_configuration_flow.xml`)
**Priority:** High | **Duration:** ~4 minutes

Tests complete AI assistant configuration including business identity, voice selection, greeting customization, and behavior settings.

**Key Areas:**
- Business information fields
- Voice selection (Jennifer/Michael)
- Voice preview playback
- Greeting customization
- System prompt editing
- Regenerate from Business Info
- Configuration persistence
- Vapi integration

---

### 4. Onboarding Flow (`04_onboarding_flow.xml`)
**Priority:** High | **Duration:** ~2 minutes

Tests the onboarding modal that appears after signup with call forwarding instructions.

**Key Areas:**
- Modal appearance timing
- Phone number display
- Copy phone number functionality
- Call forwarding instructions
- Help resources
- Visual aids
- Modal dismissal
- Onboarding completion tracking
- Mobile responsiveness

**Variations:**
- Ireland-specific content
- US-specific content

---

### 5. Billing Management Flow (`05_billing_management_flow.xml`)
**Priority:** Critical | **Duration:** ~5 minutes

Tests billing page, usage tracking, subscription management, and payment updates.

**Key Areas:**
- Current plan display
- Usage tracking (calls, charges)
- Pay-per-call billing
- Stripe Customer Portal integration
- Plan upgrade/downgrade
- Subscription cancellation
- Invoice history
- Payment failure handling

**Edge Cases:**
- Payment failed scenarios
- Trial ending notifications
- Usage limit warnings

---

### 6. End-to-End User Journey (`06_end_to_end_user_journey.xml`)
**Priority:** Critical | **Duration:** ~10 minutes

Complete user journey from landing to first call with realistic persona.

**Phases:**
1. **Discovery** (2m) - Landing page to pricing
2. **Signup** (2m) - OAuth and payment
3. **Onboarding** (2m) - Welcome modal and instructions
4. **Configuration** (3m) - Template selection and customization
5. **Call Forwarding** (External) - User sets up forwarding
6. **First Call** (1m) - Test call and verification

**Persona:** Dr. Mary O'Connor (Dublin Dental Care)

**Metrics Tracked:**
- Conversion points
- Drop-off risks
- Time-to-first-call

---

### 7. Call History & Messages Flow (`07_call_history_messages_flow.xml`)
**Priority:** High | **Duration:** ~4 minutes

Tests viewing call history, recordings, transcripts, and message management.

**Key Areas:**
- Call history list
- Call details modal
- Recording playback
- Transcript viewing
- Message management
- Search and filters
- Date range filtering
- Export functionality
- Bulk actions

**Features:**
- Call notes
- Callback reminders
- Analytics

---

## Using Test Flows

### Manual Testing
1. Open the relevant XML file
2. Follow steps sequentially
3. Verify expected results at each step
4. Document any discrepancies

### Automated Testing
These XML flows can be converted to automated tests using tools like:
- Playwright
- Cypress
- Selenium

### Example Conversion (Playwright):

```javascript
// Based on 01_ireland_signup_flow.xml Step 1
test('Navigate to landing page', async ({ page }) => {
  await page.goto('https://voicefleet.ai');

  await expect(page).toHaveTitle(/VoiceFleet/);
  await expect(page.locator('text=AI Receptionist for Irish Businesses')).toBeVisible();
  await expect(page.locator('text=+353 1 234 5678')).toBeVisible();
});
```

## Test Data

Test flows use variables for test data:
- `${testEmail}` - Test user email
- `${userId}` - Generated user ID
- `${phoneNumber}` - Assigned phone number
- `${businessName}` - Business name

## Environment Setup

Required environment variables:
```bash
VAPI_VOIPCLOUD_CREDENTIAL_ID=your-credential-id
STRIPE_WEBHOOK_SECRET=your-webhook-secret
DEV_MODE=true
```

## Teardown

Each flow includes teardown steps to clean up test data:
- Delete test users
- Release pool numbers
- Reset database state

## Test Flow Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<testFlow id="flow_id" version="1.0">
  <metadata>
    <name>Flow Name</name>
    <description>Description</description>
    <priority>critical|high|medium|low</priority>
    <estimatedDuration>Xm</estimatedDuration>
    <tags>...</tags>
  </metadata>

  <prerequisites>...</prerequisites>
  <testData>...</testData>

  <steps>
    <step id="N" type="navigation|interaction|verification">
      <action>Action description</action>
      <expectedResult>...</expectedResult>
    </step>
  </steps>

  <teardown>...</teardown>
  <notes>...</notes>
</testFlow>
```

## Priority Levels

- **Critical:** Core user journeys, payment flows
- **High:** Key features, configuration
- **Medium:** Secondary features
- **Low:** Nice-to-have features

## Contributing

When adding new test flows:
1. Follow XML structure convention
2. Include clear expected results
3. Add prerequisites
4. Document test data needs
5. Include teardown steps
6. Update this README

## Test Coverage

| Feature | Test Flow | Status |
|---------|-----------|--------|
| Ireland Signup | 01 | ✅ |
| Template Selection | 02 | ✅ |
| Assistant Config | 03 | ✅ |
| Onboarding | 04 | ✅ |
| Billing | 05 | ✅ |
| E2E Journey | 06 | ✅ |
| Call History | 07 | ✅ |

## Running Tests

### Full Suite
```bash
npm run test:flows
```

### Individual Flow
```bash
npm run test:flow -- 01_ireland_signup_flow
```

### With Coverage
```bash
npm run test:flows:coverage
```

## Reporting Issues

When a test fails:
1. Note the step ID
2. Capture screenshot
3. Include browser/environment info
4. Document expected vs actual behavior
5. Create issue with `test-flow` label

## Future Test Flows

Planned additions:
- Multi-location business flow
- Team member management
- Advanced analytics dashboard
- Integration testing (Zapier, etc.)
- Mobile app flows
