# 🤖 AI AGENT SECURITY RULES - READ THIS FIRST

**Target Audience:** All AI agents (Claude, GPT, Copilot, etc.) working on this codebase

**Purpose:** Prevent accidental exposure of secrets, credentials, and sensitive data

---

## 🚨 CRITICAL RULES - NEVER VIOLATE THESE

### Rule 1: NEVER Output Complete API Keys or Secrets

**NEVER do this:**
```markdown
The Stripe key is: sk_live_FULL_KEY_WOULD_BE_HERE_NEVER_SHOW_THIS
```

**ALWAYS do this:**
```markdown
The Stripe key is: sk_live_51xxx...REDACTED
```

**Applies to:**
- Stripe keys (`sk_live_`, `pk_live_`, `sk_test_`, `pk_test_`)
- Supabase service role keys (JWT tokens starting with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`)
- Database connection strings (`postgres://user:password@host/db`)
- Twilio credentials (`AC...`, auth tokens)
- SendGrid API keys (`SG...`)
- WorkOS API keys
- Firebase service account keys
- n8n API keys
- ANY string that looks like a password or secret

---

### Rule 2: NEVER Create Files with Secrets in Content

**NEVER do this:**
```bash
# DON'T create scripts with hardcoded secrets
echo 'export STRIPE_KEY=sk_live_...' > setup.sh

# DON'T write documentation with real keys
cat > README.md << EOF
API Key: sk_live_51SXGqU...
EOF
```

**ALWAYS do this:**
```bash
# Use placeholders in examples
echo 'export STRIPE_KEY=sk_live_YOUR_KEY_HERE' > setup.sh.example

# Use redacted examples in docs
cat > README.md << EOF
API Key: sk_live_...REDACTED (get from Stripe dashboard)
EOF
```

---

### Rule 3: NEVER Commit Environment Files

**Files that must NEVER be committed:**
- `.env`
- `.env.local`
- `.env.production`
- `.env.development`
- `.env.staging`
- `.env.vercel`
- `.env.backup`
- `.env.*` (any variation)
- `env_dump/` (directory)
- `*-service-account.json`
- `serviceAccount*.json`
- `credentials.json`
- `*-credentials.json`
- `direct_url.txt`
- `pooler_url.txt`
- `*_url.txt`
- Any PowerShell script with `set-*.ps1`, `deploy-*.ps1`

**These are blocked by `.gitignore` - if you try to commit them, STOP and ask the user.**

---

### Rule 4: NEVER Read Secrets from Files into Documentation

**NEVER do this:**
```bash
# Don't read .env and copy to docs
cat .env > SETUP_GUIDE.md  # ❌ WRONG

# Don't grep secrets and display them
grep "API_KEY" .env  # ❌ WRONG if you paste the output
```

**ALWAYS do this:**
```bash
# Reference the file, don't expose contents
echo "See .env.example for required variables"

# Show structure, not values
grep "API_KEY" .env.example  # ✅ SAFE (example file has placeholders)
```

---

### Rule 5: When Creating Security Documentation, Use Redacted Examples

**Template for documenting exposed secrets:**
```markdown
## Exposed Credentials

**Stripe Live Key:**
- Location: `mayhemworld-io/.env.production`
- Key: `sk_live_51SXGqU...REDACTED`
- Project ID: Reference only, never the full key

**Supabase Service Role:**
- Location: `Goddess/Goddess/.env`
- Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...REDACTED`
- Project: `jzveamoloiozzewviemj` (project ID is safe)
```

---

## 🛡️ SAFE PRACTICES FOR AI AGENTS

### ✅ DO:
1. **Use placeholders in examples:**
   ```env
   STRIPE_SECRET_KEY=sk_live_YOUR_KEY_HERE
   SUPABASE_SERVICE_ROLE_KEY=eyJ...GET_FROM_DASHBOARD
   ```

2. **Reference files without reading them:**
   ```markdown
   Configure your `.env.local` file with the keys from the dashboard.
   ```

3. **Use `.env.example` files:**
   ```bash
   cp .env.example .env.local
   # Then: Edit .env.local and add your real keys
   ```

4. **Truncate/redact when showing structure:**
   ```bash
   # Show first 10 chars only
   STRIPE_KEY=sk_live_51SXGqU...
   ```

5. **Ask the user instead of exposing:**
   ```
   I found credentials in .env. Should I:
   a) Reference the file without exposing
   b) Create a .env.example with placeholders
   ```

### ❌ DON'T:
1. ❌ Read `.env` files and paste contents
2. ❌ Create documentation with full API keys
3. ❌ Write scripts with hardcoded credentials
4. ❌ Commit any file with secrets
5. ❌ Use `echo`, `cat`, or `grep` to display secrets
6. ❌ Create PowerShell scripts with real keys
7. ❌ Take screenshots that might contain secrets
8. ❌ Log secrets to console output

---

## 🔍 How to Identify Secrets

### Patterns that indicate secrets:

**Stripe:**
- `sk_live_` or `sk_test_` followed by 99+ characters
- `pk_live_` or `pk_test_` followed by 99+ characters

**Supabase (JWT):**
- Starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.`
- Three parts separated by `.`
- Base64-encoded

**Database URLs:**
- `postgres://username:password@host:port/database`
- Contains `@` and password before it

**Generic API Keys:**
- Long alphanumeric strings (32+ characters)
- Associated with words like: `secret`, `key`, `token`, `password`, `auth`
- Often base64 or hex encoded

**Service Accounts (JSON):**
- Files ending in `-service-account.json`
- Contains `private_key` with `-----BEGIN PRIVATE KEY-----`

---

## 📋 Checklist Before Committing/Sharing

Before creating any file, documentation, or running commands, ask yourself:

- [ ] Does this contain any API keys? → Redact them
- [ ] Does this contain passwords? → Use placeholders
- [ ] Does this contain database URLs? → Redact credentials
- [ ] Am I reading from `.env*` files? → Don't expose the contents
- [ ] Am I creating a script with secrets? → Use environment variables instead
- [ ] Would GitHub secret scanning block this? → Then don't create it
- [ ] Could this be used to access production systems? → Treat as secret

---

## 🚨 What to Do If You Accidentally Expose a Secret

1. **IMMEDIATELY STOP** what you're doing
2. **DO NOT COMMIT** the file
3. **TELL THE USER:** "I accidentally exposed a secret in [location]. We need to rotate this key."
4. **DELETE** the file or content with the secret
5. **RECOMMEND KEY ROTATION** to the user

---

## 🎯 Examples of Safe Documentation

### ✅ GOOD - Redacted Example:
```markdown
## Stripe Configuration

You'll need to add your Stripe keys to Vercel:

1. Go to https://dashboard.stripe.com/apikeys
2. Copy your live secret key (starts with `sk_live_`)
3. In Vercel: Settings → Environment Variables
4. Add: `STRIPE_SECRET_KEY` = your key from step 2

Current exposed key: `sk_live_51xxx...REDACTED` (must be rotated)
```

### ❌ BAD - Exposed Secret:
```markdown
## Stripe Configuration

Add this to Vercel:
STRIPE_SECRET_KEY=sk_live_ACTUAL_FULL_KEY_EXPOSED_HERE_BAD
```

---

## 📞 Questions to Ask Yourself

**Before running `grep`, `cat`, or `echo` on any file:**
> "Will this output contain secrets that I'll then paste into documentation?"

**Before creating a script:**
> "Am I hardcoding any credentials instead of using environment variables?"

**Before committing any file:**
> "Is this file in `.gitignore`? If so, why am I trying to commit it?"

**Before writing documentation:**
> "Am I showing the structure of secrets, or am I exposing actual values?"

---

## 🔧 Tools to Prevent Secret Exposure

### 1. Git Secrets (Pre-commit Hook)
Run this in each repo:
```bash
bash .git-secrets-config.sh
```

This will block commits with secrets BEFORE they reach GitHub.

### 2. GitHub Secret Scanning
Already enabled on all repos. Will block pushes with secrets.

### 3. .gitignore
Already configured to block all `.env*` files and credentials.

---

## 🎓 Training Examples

### Example 1: User asks "What's my Stripe key?"

**❌ BAD Response:**
```
Your Stripe key is: sk_live_FULL_KEY_EXPOSED_HERE
```

**✅ GOOD Response:**
```
I found Stripe keys in your .env files, but I can't display them for security.

To view your key:
1. Run: `cat .env.local | grep STRIPE_SECRET_KEY`
2. Or check: https://dashboard.stripe.com/apikeys

The key starts with `sk_live_51xxx...`
```

### Example 2: User asks "Create a setup script"

**❌ BAD:**
```bash
# setup.sh
export STRIPE_KEY=sk_live_51SXGqU...full-key-here
export DB_URL=postgres://user:password123@host/db
```

**✅ GOOD:**
```bash
# setup.sh.example
export STRIPE_KEY=sk_live_YOUR_KEY_HERE
export DB_URL=postgres://username:password@host:5432/database

# Copy this file and add your real credentials:
# cp setup.sh.example setup.sh
# Then edit setup.sh with your actual keys
```

---

## 🎯 Summary for AI Agents

**Golden Rule:** When in doubt, REDACT. It's better to under-share than to expose a secret.

**If you find yourself about to:**
- Display an API key → STOP, redact it
- Read a `.env` file → STOP, reference it instead
- Commit a credentials file → STOP, it's blocked anyway
- Create docs with secrets → STOP, use placeholders

**Remember:**
- Users can always get their own keys from dashboards
- Placeholders in examples are better than real keys
- Environment variables should stay in environment, not in code
- If GitHub would block it, don't create it

---

**This document should be read by EVERY AI agent before working on this codebase.**

**Last Updated:** January 3, 2026
**Applies to:** All 5 repositories in the Mayhem multi-site architecture
