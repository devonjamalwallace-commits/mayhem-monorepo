# 🔍 Sentry Error Tracking Setup Guide

**Created:** January 3, 2026
**Purpose:** Complete error tracking setup for all 4 production sites

---

## ✅ What's Already Done

1. **Sentry MCP Server Installed** in Claude Code configuration (`.claude.json`)
   - URL: `https://mcp.sentry.dev/mcp`
   - Available MCP tools for error monitoring and AI observability

2. **Sentry Integration Code** exists in:
   - `mayhemworld-io/lib/sentry.ts` - Client-side error tracking

---

## 📊 Required Setup (Per Site)

You need to complete the following for each of your 4 sites:

### Sites to Configure:
1. **Mayhemworld** (mayhemworld.io)
2. **Nexus AI** (deployed on Vercel)
3. **ShotByMayhem** (shotbymayhem-new)
4. **Goddesses of ATL** (Goddess/Goddess)

---

## 🚀 Step-by-Step Setup

### Step 1: Create Sentry Account (5 minutes)

1. **Go to:** https://sentry.io/signup/
2. **Sign up** with your GitHub or email
3. **Choose plan:** Start with Free tier (up to 5,000 errors/month)
4. **Create organization:** Name it "Mayhem Entertainment" or similar

### Step 2: Create Sentry Projects (15 minutes)

Create **4 separate projects** for each site:

**Project 1: Mayhemworld**
- Platform: JavaScript → Next.js
- Project name: `mayhemworld-io`
- Copy the DSN: `https://...@sentry.io/...`

**Project 2: Nexus AI**
- Platform: JavaScript → Next.js
- Project name: `nexus-ai`
- Copy the DSN

**Project 3: ShotByMayhem**
- Platform: JavaScript → Next.js
- Project name: `shotbymayhem`
- Copy the DSN

**Project 4: Goddesses of ATL**
- Platform: JavaScript → Next.js
- Project name: `goddesses-atl`
- Copy the DSN

---

## 🔑 Step 3: Add DSN to Environment Variables

### Mayhemworld (mayhemworld-io)

**Local Development:**
```bash
cd mayhemworld-io
```

Add to `.env.local` (NOT committed):
```env
NEXT_PUBLIC_SENTRY_DSN="https://YOUR_KEY@o4506285742325760.ingest.us.sentry.io/4506285742325761"
NEXT_PUBLIC_ENV="development"
```

**Production (Vercel):**
1. Go to: https://vercel.com/your-team/mayhemworld-io/settings/environment-variables
2. Add:
   - Key: `NEXT_PUBLIC_SENTRY_DSN`
   - Value: Your Mayhemworld Sentry DSN
   - Environment: Production
3. Add:
   - Key: `NEXT_PUBLIC_ENV`
   - Value: `production`
   - Environment: Production

### Nexus AI

**Local Development:**
```bash
cd nexus-ai
```

Add to `.env.local`:
```env
VITE_SENTRY_DSN="https://YOUR_KEY@sentry.io/YOUR_PROJECT_ID"
VITE_ENV="development"
```

**Production (Vercel):**
1. Go to Vercel project settings
2. Add:
   - `VITE_SENTRY_DSN` = Your Nexus AI Sentry DSN
   - `VITE_ENV` = `production`

### ShotByMayhem (shotbymayhem-new)

**Local Development:**
```bash
cd shotbymayhem-new
```

Add to `.env.local`:
```env
NEXT_PUBLIC_SENTRY_DSN="https://YOUR_KEY@sentry.io/YOUR_PROJECT_ID"
```

**Production (Vercel):**
Add `NEXT_PUBLIC_SENTRY_DSN` with your ShotByMayhem Sentry DSN

### Goddesses of ATL

**Local Development:**
```bash
cd Goddess/Goddess
```

Add to `.env.local`:
```env
NEXT_PUBLIC_SENTRY_DSN="https://YOUR_KEY@sentry.io/YOUR_PROJECT_ID"
```

**Production (Vercel):**
Add `NEXT_PUBLIC_SENTRY_DSN` with your Goddesses Sentry DSN

---

## 📦 Step 4: Install Sentry SDK (If Not Installed)

**For sites without Sentry installed:**

```bash
# Mayhemworld, ShotByMayhem, Goddesses (Next.js with App Router)
npm install @sentry/nextjs

# Nexus AI (Vite/React)
npm install @sentry/react
```

---

## 🔧 Step 5: Initialize Sentry (Code Setup)

### Mayhemworld (Already Partially Done)

The code exists in `mayhemworld-io/lib/sentry.ts`. Just need to call it:

**Add to `app/layout.tsx`:**
```typescript
import { initSentry } from '@/lib/sentry';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Initialize Sentry on client
  useEffect(() => {
    initSentry();
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### Nexus AI (Vite/React)

**Create `src/lib/sentry.ts`:**
```typescript
import * as Sentry from "@sentry/react";

export const initSentry = () => {
  if (typeof window === 'undefined') return;

  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn: dsn,
    environment: import.meta.env.VITE_ENV || 'production',
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
};
```

**Call in `src/main.tsx`:**
```typescript
import { initSentry } from './lib/sentry';

initSentry();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### ShotByMayhem & Goddesses

Follow the same pattern as Mayhemworld (they're both Next.js):
1. Create `lib/sentry.ts` with initialization code
2. Call `initSentry()` in `app/layout.tsx`

---

## 🧪 Step 6: Test Error Tracking

**Add a test error button** to verify setup:

```typescript
// Add to any page for testing
<button onClick={() => {
  throw new Error("Sentry test error - this is intentional!");
}}>
  Test Sentry Error
</button>
```

1. Click the button in development
2. Check Sentry dashboard for the error
3. Remove the test button after verification

---

## 🔐 Step 7: Connect Sentry MCP to Your Account

The Sentry MCP server is now available in Claude Code. To connect it:

1. **Restart Claude Code** to load the new MCP server
2. **Run:** `claude` in terminal
3. **In Claude Code, ask:** "Connect to my Sentry account"
4. **Follow OAuth flow** to authenticate

**Or authenticate via command:**
```bash
# The MCP server will prompt for OAuth on first use
# No manual token needed - OAuth handles it automatically
```

---

## 🎯 What You Get with Sentry MCP

Once connected, you can ask Claude Code to:

- **View recent errors:** "Show me the latest errors in production"
- **Analyze issues:** "What's causing the checkout errors?"
- **Get fix suggestions:** "How can I fix issue #12345?"
- **Monitor trends:** "Show error trends for the last week"
- **Trigger Seer AI:** Use Sentry's AI to auto-analyze issues

---

## 📊 Sentry Features You'll Have

### Error Monitoring
- Real-time error tracking
- Stack traces with source maps
- User impact metrics
- Error grouping and deduplication

### Performance Monitoring
- Transaction traces
- Slow API calls
- Database query performance
- Frontend load times

### Session Replay
- Video recordings of user sessions where errors occurred
- See exactly what the user was doing
- Debug visual issues

### AI-Powered Insights
- Seer AI auto-suggests fixes
- Root cause analysis
- Similar issue detection
- Commit tracking (which deploy introduced the bug)

---

## 🚨 Important Notes

### DSN is Public (Safe to Commit)
The `NEXT_PUBLIC_SENTRY_DSN` is safe to commit because:
- It only allows sending errors TO Sentry
- Cannot read data from Sentry
- Rate-limited per-client

However, for consistency with other env vars, we keep it in `.env.local`.

### Server-Side vs Client-Side
- **Client-side:** Use `NEXT_PUBLIC_SENTRY_DSN` (what we set up above)
- **Server-side:** Use `SENTRY_DSN` (for API routes, serverless functions)

For full-stack monitoring, you'd set both.

---

## 📋 Checklist

### Sentry Account Setup
- [ ] Create Sentry account at https://sentry.io
- [ ] Create organization
- [ ] Create 4 projects (Mayhemworld, Nexus AI, ShotByMayhem, Goddesses)
- [ ] Copy DSNs for each project

### Environment Variables
- [ ] Mayhemworld: Add `NEXT_PUBLIC_SENTRY_DSN` to Vercel
- [ ] Nexus AI: Add `VITE_SENTRY_DSN` to Vercel
- [ ] ShotByMayhem: Add `NEXT_PUBLIC_SENTRY_DSN` to Vercel
- [ ] Goddesses: Add `NEXT_PUBLIC_SENTRY_DSN` to Vercel

### Code Integration
- [ ] Mayhemworld: Call `initSentry()` in layout
- [ ] Nexus AI: Install SDK + create sentry.ts + initialize
- [ ] ShotByMayhem: Install SDK + create sentry.ts + initialize
- [ ] Goddesses: Install SDK + create sentry.ts + initialize

### Testing
- [ ] Test error tracking in each site (development)
- [ ] Deploy to production
- [ ] Verify errors appear in Sentry dashboard

### MCP Connection
- [ ] Restart Claude Code
- [ ] Authenticate Sentry MCP via OAuth
- [ ] Test: Ask Claude "Show me recent Sentry errors"

---

## 📞 Support

**Sentry Documentation:** https://docs.sentry.io/platforms/javascript/guides/nextjs/

**Sentry MCP Documentation:** https://docs.sentry.io/product/sentry-mcp/

**Common Issues:**
- **Errors not showing up:** Check DSN is correct, verify initialization is called
- **Too many errors:** Adjust sample rates in `Sentry.init()`
- **Missing source maps:** Configure your build to upload source maps to Sentry

---

**Last Updated:** January 3, 2026
**Status:** 🟡 MCP Server Installed - User Setup Required

**Sources:**
- [Sentry MCP Server](https://docs.sentry.io/product/sentry-mcp/)
- [GitHub - getsentry/sentry-mcp-stdio](https://github.com/getsentry/sentry-mcp-stdio)
- [Sentry Blog: MCP Server Launch](https://blog.sentry.io/yes-sentry-has-an-mcp-server-and-its-pretty-good/)
