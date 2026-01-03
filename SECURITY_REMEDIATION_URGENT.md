# 🚨 CRITICAL SECURITY REMEDIATION - IMMEDIATE ACTION REQUIRED

**Created:** January 3, 2026
**Priority:** CRITICAL - Production keys exposed in version control

---

## ⚠️ EXPOSED CREDENTIALS FOUND

### Live Stripe Keys (Production)
- **Location:** `mayhemworld-io/.env.production`
- **Key:** `sk_live_51SXGqU...REDACTED` (Full key found in multiple locations)
- **Risk:** Full payment processing access, customer data, charges
- **Also Found In:**
  - `nexus-ai/.env.local.backup`
  - `nexus-ai/set-stripe-secret.ps1`

### Supabase Service Role Keys (4 instances)
**1. Goddesses of ATL**
- **Location:** `Goddess/Goddess/.env`
- **Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...REDACTED`
- **Project:** jzveamoloiozzewviemj

**2. ShotByMayhem**
- **Location:** `shotbymayhem-new/env_dump/` (multiple files)
- **Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...REDACTED`
- **Project:** lhyiqvzgifbpmznljvtp

**3. Mayhemworld**
- **Location:** `mayhemworld-io/.env.production`, `.env.local`, `.env.vercel`
- **Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...REDACTED`
- **Project:** naeqxnuhkzulyghlcdwvw

**4. Nexus AI**
- **Location:** `nexus-ai/.env.local`
- **Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...REDACTED`
- **Project:** kqdcsahmgpclixlodcwx

**Risk:** Full database admin access, bypass RLS, read/write all data

---

## 🔥 IMMEDIATE ACTIONS (Do This NOW)

### Step 1: Rotate All Exposed Keys (15 minutes)

#### Stripe Keys
1. **Login to Stripe Dashboard:** https://dashboard.stripe.com/
2. **Navigate to:** Developers → API keys
3. **Roll the secret key:**
   - Click "Reveal live key"
   - Click "Roll key" button
   - **WARNING:** This will invalidate the old key immediately
   - Copy the new key: `sk_live_NEW_KEY_HERE`
4. **Update production environments:**
   - Vercel (mayhemworld-io): Settings → Environment Variables → `STRIPE_SECRET_KEY`
   - Vercel (nexus-ai): Settings → Environment Variables → `STRIPE_SECRET_KEY`
   - Railway (strapi-cms): Variables → `STRIPE_SECRET_KEY_MAYHEMWORLD`, `STRIPE_SECRET_KEY_NEXUSAI`

#### Supabase Service Role Keys (For Each Project)

**Goddesses of ATL (jzveamoloiozzewviemj):**
1. Go to: https://supabase.com/dashboard/project/jzveamoloiozzewviemj/settings/api
2. Click "Reset service_role secret"
3. Confirm reset (will invalidate old key)
4. Copy new key
5. Update Vercel env vars for Goddess site

**ShotByMayhem (lhyiqvzgifbpmznljvtp):**
1. Go to: https://supabase.com/dashboard/project/lhyiqvzgifbpmznljvtp/settings/api
2. Reset service_role secret
3. Update Vercel env vars for ShotByMayhem site

**Mayhemworld (naeqxnuhkzulyghlcdwvw):**
1. Go to: https://supabase.com/dashboard/project/naeqxnuhkzulyghlcdwvw/settings/api
2. Reset service_role secret
3. Update Vercel env vars for Mayhemworld site

**Nexus AI (kqdcsahmgpclixlodcwx):**
1. Go to: https://supabase.com/dashboard/project/kqdcsahmgpclixlodcwx/settings/api
2. Reset service_role secret
3. Update Vercel and Supabase Edge Function secrets

---

### Step 2: Remove Keys from Git History (30 minutes)

**Option A: BFG Repo-Cleaner (Recommended)**
```bash
# Install BFG
# Windows: choco install bfg
# Mac: brew install bfg

# For each repo:
cd mayhemworld-io
bfg --replace-text ../secrets-to-remove.txt --no-blob-protection
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force

# Repeat for: nexus-ai, Goddess/Goddess, shotbymayhem-new, mayhem-monorepo
```

**Create `secrets-to-remove.txt`:**
```
# Use the actual exposed keys from the grep search results
# Replace each key with ===>REDACTED
# Find keys using: grep -r "sk_live_" . or grep -r "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" .
# Add each found secret on a new line with ===>REDACTED suffix
```

**Option B: Delete and Re-push (Nuclear Option)**
⚠️ Only if repos are not shared/forked
```bash
# Delete .git folder and start fresh
rm -rf .git
git init
git add .
git commit -m "Initial commit with secrets removed"
git remote add origin <url>
git push -u origin main --force
```

---

### Step 3: Add .gitignore Rules (5 minutes)

Add to **ALL** repository `.gitignore` files:

```gitignore
# Environment files with secrets
.env
.env.local
.env.*.local
.env.production
.env.development
.env.staging
.env.vercel
.env.backup*
.env.*backup*

# Backup files that may contain secrets
*.backup
env_dump/
.env.*
**/.env.*

# Firebase service accounts
firebase-service-account.json
*-service-account.json
serviceAccount*.json

# Private keys
*.pem
*.key
*.p12

# Temporary script files with hardcoded secrets
set-*.ps1
deploy-*.ps1
```

---

### Step 4: Delete Exposed Files Immediately

```bash
# mayhemworld-io
cd mayhemworld-io
git rm --cached .env.production
git rm --cached .env.local
git rm --cached .env.vercel
git commit -m "Remove exposed environment files"
git push

# nexus-ai
cd nexus-ai
git rm --cached .env.local.backup
git rm --cached set-stripe-secret.ps1
git rm --cached update-stripe-test.ps1
git commit -m "Remove exposed secrets"
git push

# Goddess/Goddess
cd Goddess/Goddess
git rm --cached .env
git rm --cached .env.backup.20251229
git commit -m "Remove exposed environment files"
git push

# shotbymayhem-new
cd shotbymayhem-new
git rm --cached -r env_dump/
git commit -m "Remove env dump directory"
git push
```

---

## 🔐 PROPER SECRETS MANAGEMENT GOING FORWARD

### Vercel Projects (Next.js sites)

**Environment Variable Hierarchy:**
```
Production → Use Vercel UI to set secrets
Preview → Can inherit from production or use separate values
Development → Use .env.local (NOT committed)
```

**How to Add Secrets in Vercel:**
1. Go to project settings: https://vercel.com/your-team/project-name/settings/environment-variables
2. Click "Add New"
3. Key: `STRIPE_SECRET_KEY`
4. Value: `sk_live_NEW_KEY_HERE`
5. Environment: Production
6. Save

**Accessing in Code:**
```typescript
// Server-side only
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Client-side (public keys only)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
```

### Railway (Strapi CMS)

**How to Add Secrets:**
1. Go to: https://railway.app/project/strapi-cms-production-9494
2. Click "Variables" tab
3. Add:
   - `STRIPE_SECRET_KEY_MAYHEMWORLD=sk_live_NEW_KEY`
   - `STRIPE_SECRET_KEY_NEXUSAI=sk_live_NEW_KEY`
4. Click "Deploy" to apply

### Supabase Edge Functions

**Set secrets via CLI:**
```bash
cd nexus-ai
npx supabase secrets set STRIPE_SECRET_KEY=sk_live_NEW_KEY_HERE
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=NEW_SERVICE_ROLE_KEY
```

**Access in function:**
```typescript
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});
```

---

## 📋 CHECKLIST

### Immediate (Within 1 Hour)
- [ ] Rotate Stripe live key
- [ ] Update Stripe key in Vercel (mayhemworld-io)
- [ ] Update Stripe key in Vercel (nexus-ai)
- [ ] Update Stripe key in Railway (strapi-cms)
- [ ] Rotate Goddesses Supabase service role key
- [ ] Rotate ShotByMayhem Supabase service role key
- [ ] Rotate Mayhemworld Supabase service role key
- [ ] Rotate Nexus AI Supabase service role key
- [ ] Update all Supabase keys in Vercel

### Short Term (Today)
- [ ] Delete `.env.production` from mayhemworld-io
- [ ] Delete `env_dump/` from shotbymayhem-new
- [ ] Delete `.env` from Goddess/Goddess
- [ ] Delete `.env.local.backup` from nexus-ai
- [ ] Delete `set-stripe-secret.ps1` from nexus-ai
- [ ] Update `.gitignore` in all 5 repos
- [ ] Commit and push gitignore changes

### Medium Term (This Week)
- [ ] Run BFG to clean git history
- [ ] Force push cleaned repos
- [ ] Verify no secrets in `git log`
- [ ] Set up secret scanning (see below)
- [ ] Document proper env var workflow for team

### Ongoing
- [ ] Never commit `.env*` files
- [ ] Always use platform secret managers
- [ ] Rotate keys quarterly
- [ ] Monitor Stripe for unusual activity

---

## 🛡️ PREVENT FUTURE EXPOSURES

### 1. Pre-commit Hook (Blocks commits with secrets)

Install `git-secrets`:
```bash
# Mac
brew install git-secrets

# Windows
# Download from https://github.com/awslabs/git-secrets
```

**Setup for each repo:**
```bash
cd mayhemworld-io
git secrets --install
git secrets --register-aws
git secrets --add 'sk_live_[A-Za-z0-9]+'
git secrets --add 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+'
git secrets --add 'STRIPE_SECRET_KEY.*=.*sk_'
git secrets --add 'SUPABASE_SERVICE_ROLE_KEY.*=.*eyJ'
```

### 2. GitHub Secret Scanning

Enable on all repos:
1. Go to: https://github.com/USERNAME/REPO/settings/security_analysis
2. Enable "Secret scanning"
3. Enable "Push protection" (blocks pushes with secrets)

### 3. Environment Variable Template

Create `.env.example` in each repo:
```bash
# Stripe (use Vercel/Railway env vars for real values)
STRIPE_SECRET_KEY=sk_test_... # Test key for local dev
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Supabase (use Vercel env vars for real values)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... # Anon key is safe to commit
SUPABASE_SERVICE_ROLE_KEY=<get-from-vercel> # NEVER commit this
```

---

## 📞 SUPPORT

If you need help rotating keys:
- **Stripe:** https://support.stripe.com/ (Live chat available)
- **Supabase:** https://supabase.com/dashboard/support (Support tickets)
- **Vercel:** https://vercel.com/help (Contact support)

---

## 🔍 VERIFY REMEDIATION

After completing all steps:

```bash
# Check no secrets in recent commits
cd mayhemworld-io
git log --all --full-history -- .env.production

# Should show file deletion, not contents
```

**Test Production:**
1. Try a test Stripe payment on mayhemworld.io
2. Verify Supabase auth works on all sites
3. Check Vercel deployment logs for errors

---

**Last Updated:** January 3, 2026
**Status:** 🔴 CRITICAL - Action Required Immediately
