# OrderBot Web

Frontend for OrderBot.ie - AI Voice Assistant for Restaurants.

> See the main [README.md](../README.md) for full project documentation.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Run development server
npm run dev
```

App runs at http://localhost:3001

## Tech Stack

- **Next.js 15** - App Router
- **TypeScript**
- **Tailwind CSS**
- **Zustand** - State management
- **Playwright** - E2E testing

## Pages

| Path | Description |
|------|-------------|
| `/` | VoiceFleet landing page |
| `/pricing` | OrderBot pricing (€19/€99/€249) |
| `/login` | Authentication |
| `/dashboard` | Main dashboard |
| `/notifications` | Email/SMS/escalation settings |
| `/assistant` | AI assistant configuration |
| `/billing` | Subscription management |
| `/history` | Call history |
| `/settings` | Profile settings |

## Key Components

| Component | Location | Description |
|-----------|----------|-------------|
| **VoiceFleet Landing** | `components/voicefleet/` | Landing page sections |
| **PricingSection** | `components/voicefleet/PricingSection.tsx` | OrderBot pricing display |
| **Notifications Page** | `app/(dashboard)/notifications/page.tsx` | Email/SMS settings UI |
| **Sidebar** | `components/layout/Sidebar.tsx` | Dashboard navigation |

## API Client

Located in `src/lib/api.ts`:

```typescript
// Available API modules
authApi        // Authentication
userApi        // User profile
billingApi     // Subscriptions, usage
notificationsApi  // Email/SMS/escalation settings
assistantApi   // AI assistant config
```

## E2E Testing

```bash
# Run all E2E tests
npx playwright test

# Run specific tests
npx playwright test notifications.spec.ts
npx playwright test eur-checkout.spec.ts

# Run with UI
npx playwright test --ui
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
