# AI Assistant Web

Frontend SaaS dashboard for the AI Voice Assistant, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- User authentication (login/register)
- Dashboard with stats overview
- Make AI-powered phone calls
- Save calls for quick reuse
- Schedule calls for later
- Call history
- Profile settings

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Axios** - API client
- **date-fns** - Date formatting
- **Lucide React** - Icons

## Prerequisites

- Node.js 18+
- Backend API running (ai-assistant-api)

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd ai-assistant-web
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages (login, register)
│   ├── (dashboard)/       # Protected dashboard pages
│   └── layout.tsx         # Root layout
├── components/
│   ├── layout/            # Layout components (Sidebar, etc.)
│   └── ui/                # Reusable UI components
├── lib/
│   ├── api.ts             # API client
│   └── store.ts           # Zustand stores
├── hooks/                 # Custom React hooks
└── types/                 # TypeScript types
```

## Pages

| Path | Description |
|------|-------------|
| `/login` | Login page |
| `/register` | Registration page |
| `/dashboard` | Main dashboard with stats |
| `/call` | New call form |
| `/agenda` | Saved calls list |
| `/scheduled` | Scheduled calls list |
| `/history` | Call history |
| `/settings` | Profile settings |

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

## License

MIT
