# 🚂 Railway Deployment Guide - Strapi Multi-Site CMS

**Updated:** January 3, 2026
**Status:** CRITICAL FIXES APPLIED

---

## 🚨 Critical Fixes Applied

### Problem: Media Not Showing
**Root Cause:** Media was being uploaded to Railway's ephemeral filesystem, which gets wiped on every deployment/restart.

**Solution Applied:**
- ✅ Installed `@strapi/provider-upload-cloudinary`
- ✅ Configured Cloudinary as the upload provider in `config/plugins.js`
- ✅ All media now uploads directly to Cloudinary CDN (permanent storage)

### Problem: AI Assistant Not Visible
**Root Cause:** Admin panel wasn't rebuilt after plugin installation.

**Solution Applied:**
- ✅ Ran `npm run build` to rebuild admin panel
- ✅ AI Assistant plugin now appears in Strapi admin menu

### Problem: CORS Blocking Frontend Requests
**Root Cause:** No explicit CORS configuration for frontend domains.

**Solution Applied:**
- ✅ Added all frontend domains to CORS whitelist in `config/middlewares.js`
- ✅ Configured Cloudinary CDN in Content Security Policy

---

## 📋 Railway Environment Variables (REQUIRED)

You **MUST** set these in Railway dashboard for media to work:

### Go to Railway Dashboard:
1. Open: https://railway.app/dashboard
2. Select your Strapi project
3. Go to **Variables** tab
4. Add the following:

### Cloudinary Configuration (CRITICAL)
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_FOLDER=mayhem
```

**Get these from:** https://cloudinary.com/console/settings/
- Sign up for free account if you don't have one
- Copy credentials from dashboard
- Paste into Railway

### Database (Already Set)
```env
DATABASE_CLIENT=postgres
DATABASE_URL=your-railway-postgres-url
```

### Strapi Keys (Already Set)
```env
APP_KEYS=your-app-keys
API_TOKEN_SALT=your-token-salt
ADMIN_JWT_SECRET=your-admin-secret
TRANSFER_TOKEN_SALT=your-transfer-salt
JWT_SECRET=your-jwt-secret
```

### Optional Services
```env
# Email (Resend or SendGrid)
RESEND_API_KEY=re_...
# or
SENDGRID_API_KEY=SG...

# SMS (Twilio)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...

# AI (Gemini)
GEMINI_API_KEY=AIzaSyC...

# Notion
NOTION_API_KEY=ntn_...
NOTION_DATABASE_ID=...

# Stripe (Per Site)
STRIPE_SECRET_KEY_MAYHEMWORLD=sk_live_...
STRIPE_SECRET_KEY_NEXUSAI=sk_live_...
STRIPE_SECRET_KEY_GODDESSES=sk_live_...
STRIPE_SECRET_KEY_SHOTBYMAYHEM=sk_live_...
STRIPE_SECRET_KEY_HOUSEOFKARLEVON=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# WorkOS (Auth)
WORKOS_API_KEY=sk_...
WORKOS_CLIENT_ID=client_...
WORKOS_REDIRECT_URI=https://your-strapi-url.railway.app/api/auth/workos/callback

# n8n (Automation)
N8N_HOST=https://n8n.mayhemworld.io
N8N_API_KEY=...
N8N_WEBHOOK_URL=https://n8n.mayhemworld.io/webhook
```

---

## 🚀 Deployment Steps

### Step 1: Commit Changes to Git

```bash
cd C:/Users/devon/mayhem-monorepo/packages/strapi-cms

# Stage changes
git add config/plugins.js config/middlewares.js package.json package-lock.json

# Commit
git commit -m "🔧 Fix media storage with Cloudinary + enable CORS for frontends"

# Push to trigger Railway deployment
git push origin main
```

### Step 2: Set Cloudinary Variables in Railway

**IMMEDIATELY after pushing**, go to Railway dashboard:

1. **Variables tab** → Add:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `CLOUDINARY_FOLDER` = `mayhem`

2. Click **Save** → Railway will automatically redeploy

### Step 3: Verify Deployment

After Railway finishes deploying:

1. **Check logs:** Look for "Server started on port 1337"
2. **Visit admin:** `https://strapi-cms-production-9494.up.railway.app/admin`
3. **Login** with your admin credentials
4. **Look for AI Assistant** in the left sidebar menu

---

## 📸 Testing Media Upload

### Test in Strapi Admin:

1. Go to **Media Library** in Strapi admin
2. Click **Upload Files**
3. Upload a test image
4. After upload, **right-click the image → Open in new tab**
5. **Verify URL contains:** `res.cloudinary.com/your-cloud-name/`

If URL contains Cloudinary, **media is working! ✅**

### Test from Frontend:

Add a test article in Strapi with a cover image:

1. **Content Manager** → **Articles** → **Create new entry**
2. Fill in:
   - Title: "Test Media Upload"
   - Slug: "test-media"
   - Site: Select one of your sites
   - Cover Image: Upload a test image
3. **Publish**

Then fetch from your frontend:
```javascript
fetch('https://strapi-cms-production-9494.up.railway.app/api/articles?filters[site][uid][$eq]=mayhemworld&populate=*')
  .then(res => res.json())
  .then(data => console.log(data.data[0].attributes.coverImage))
```

Image URL should be from Cloudinary.

---

## 🔍 AI Assistant Plugin

After deployment, the AI Assistant should appear in Strapi admin:

**Location:** Left sidebar → "AI Assistant"

**What it does:**
- AI-powered content generation using Gemini
- Content suggestions and automation
- Requires `GEMINI_API_KEY` environment variable

**To use:**
1. Set `GEMINI_API_KEY` in Railway
2. Reload Strapi admin
3. Click "AI Assistant" in sidebar

---

## 🌐 CORS Configuration

The following domains are now whitelisted:

### Development:
- `http://localhost:3000` (Mayhemworld, ShotByMayhem, Goddesses)
- `http://localhost:3001`
- `http://localhost:5173` (Nexus AI - Vite)

### Production:
- `https://mayhemworld.io` + `www.mayhemworld.io`
- `https://shotbymayhem.com` + `www.shotbymayhem.com`
- `https://goddessesofatl.com` + `www.goddessesofatl.com`
- `https://*.vercel.app` (All Vercel deployments)

**To add new domains:**

Edit `packages/strapi-cms/config/middlewares.js` and add to the `origin` array:

```javascript
origin: [
  // ... existing domains ...
  'https://newsite.com',
  'https://www.newsite.com',
],
```

Then commit and push to redeploy.

---

## 🐛 Troubleshooting

### Media Not Uploading

**Symptoms:** Upload fails or images show broken links

**Fix:**
1. Check Railway variables: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` are set
2. Check Cloudinary dashboard for upload errors
3. Verify folder `mayhem` exists in Cloudinary (it will be auto-created)

### AI Assistant Not Showing

**Symptoms:** No "AI Assistant" menu item

**Fix:**
1. Run `npm run build` locally
2. Commit `build/` folder (if it exists)
3. Push to Railway
4. Or wait for Railway to run build automatically

### CORS Errors in Browser Console

**Symptoms:** `Access-Control-Allow-Origin` errors when fetching from frontend

**Fix:**
1. Add your domain to `config/middlewares.js` → `origin` array
2. Commit and push
3. Verify domain spelling (https vs http, www vs non-www)

### 500 Error on Strapi Admin

**Symptoms:** Can't login to admin panel

**Fix:**
1. Check Railway logs for errors
2. Verify all required env vars are set
3. Check database connection (`DATABASE_URL`)
4. Restart Railway service

---

## 📊 Railway Dashboard Links

**Main Dashboard:** https://railway.app/dashboard

**Strapi Project:** https://railway.app/project/strapi-cms-production-9494

**Deployment Logs:** Project → Deployments → Click latest deployment

**Environment Variables:** Project → Variables

**Settings:** Project → Settings

---

## 🔐 Security Notes

### What's Safe to Commit:
- ✅ `config/plugins.js` (uses env vars)
- ✅ `config/middlewares.js` (no secrets)
- ✅ `build/` folder (compiled admin panel)

### NEVER Commit:
- ❌ `.env` file (contains secrets)
- ❌ Cloudinary credentials
- ❌ Database URLs with passwords
- ❌ API keys

### Railway Auto-Deploys On:
- Git push to `main` branch
- Environment variable changes
- Manual redeploy trigger

---

## 📞 Next Steps

1. **Set Cloudinary credentials** in Railway (REQUIRED for media)
2. **Push this commit** to trigger deployment
3. **Test media upload** in Strapi admin
4. **Verify AI Assistant** appears in sidebar
5. **Test frontend API calls** to confirm CORS works

---

**Deployment URL:** https://strapi-cms-production-9494.up.railway.app

**Admin Panel:** https://strapi-cms-production-9494.up.railway.app/admin

**API Endpoint:** https://strapi-cms-production-9494.up.railway.app/api

**GraphQL Playground:** https://strapi-cms-production-9494.up.railway.app/graphql

---

**Last Updated:** January 3, 2026
**Status:** ✅ Ready to Deploy - Media fix critical
