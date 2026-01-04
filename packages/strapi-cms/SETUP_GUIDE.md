# Complete Strapi Multi-Site CMS Setup Guide

## 🎯 Quick Start Checklist

- [x] Strapi deployed to Railway
- [x] 5 sites configured
- [x] Cloudinary integration active
- [x] Resend email configured
- [x] CORS enabled for all frontends
- [ ] **Create API Token** ← START HERE
- [ ] **Migrate media to Cloudinary**
- [ ] **Connect frontends**
- [ ] **Test everything**

---

## Step 1: Create Strapi API Token

1. **Go to**: https://strapi-cms-production-9494.up.railway.app/admin
2. **Navigate**: Settings → API Tokens
3. **Click**: "Create new API Token"
4. **Configure**:
   - **Name**: `Media Migration & Frontend Access`
   - **Token duration**: Unlimited
   - **Token type**: Full access
5. **Copy the token** - you won't see it again!

---

## Step 2: Configure Railway Environment

Add the API token to Railway:

```bash
cd packages/strapi-cms
railway variables --set STRAPI_API_TOKEN="your_token_here"
```

---

## Step 3: Migrate Media to Cloudinary

Run the migration script to upload all 130 images:

```bash
cd packages/strapi-cms

# Set the token (use the one you just created)
export STRAPI_API_TOKEN="your_token_here"

# For production (Railway):
export STRAPI_URL="https://strapi-cms-production-9494.up.railway.app"

# Run migration
node scripts/migrate-media.js
```

**What this does**:
- ✅ Finds all 72 images from Mayhemworld
- ✅ Finds all 53 images from ShotByMayhem
- ✅ Finds all 5 images from Nexus AI
- ✅ Uploads to Strapi → Auto-saves to Cloudinary CDN
- ✅ Associates with correct site
- ✅ Organized in folders by site

**Expected output**:
```
🚀 Starting media migration to Cloudinary...

📁 Found 72 images for mayhemworld
  ⬆️  Uploading images/hero-crowd.png... ✅ https://res.cloudinary.com/...
  ⬆️  Uploading images/model-aaliyah.png... ✅ https://res.cloudinary.com/...
  ...

📊 Migration Summary:
   ✅ Uploaded: 130
   ❌ Failed: 0
   📦 Total: 130

✨ All media is now on Cloudinary CDN!
```

---

## Step 4: Verify Cloudinary Integration

1. **Go to**: Strapi Admin → Media Library
2. **Check**: You should see 130 assets
3. **Click any image**: URL should be `https://res.cloudinary.com/dgtfnhtr8/...`
4. **Test upload**: Upload a new image → Verify it goes to Cloudinary

---

## Step 5: Connect Frontends to Strapi

### For Each Frontend Site:

#### A. Install Dependencies

```bash
# In each frontend directory
npm install @apollo/client graphql
```

#### B. Create Environment File

Create `.env.local`:

```bash
# Mayhemworld
NEXT_PUBLIC_STRAPI_URL=https://strapi-cms-production-9494.up.railway.app
NEXT_PUBLIC_STRAPI_GRAPHQL_URL=https://strapi-cms-production-9494.up.railway.app/graphql
STRAPI_API_TOKEN=your_token_here
NEXT_PUBLIC_SITE_UID=mayhemworld
NEXT_PUBLIC_SITE_ID=1
```

```bash
# ShotByMayhem
NEXT_PUBLIC_SITE_UID=shotbymayhem
NEXT_PUBLIC_SITE_ID=2
```

```bash
# Goddesses of ATL
NEXT_PUBLIC_SITE_UID=goddesses-of-atl
NEXT_PUBLIC_SITE_ID=3
```

```bash
# Nexus AI
NEXT_PUBLIC_SITE_UID=nexus-ai
NEXT_PUBLIC_SITE_ID=4
```

```bash
# House of KarléVon
NEXT_PUBLIC_SITE_UID=house-of-karlevon
NEXT_PUBLIC_SITE_ID=5
```

#### C. Set Vercel Environment Variables

For each site in Vercel:

1. Go to: Project Settings → Environment Variables
2. Add all variables from `.env.local`
3. Deploy

#### D. Implement GraphQL Queries

See `FRONTEND_INTEGRATION.md` for complete examples.

---

## Step 6: Test Plugin APIs

### Test AI Assistant

```bash
curl -X POST https://strapi-cms-production-9494.up.railway.app/api/ai-assistant/generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Write a photography tips article",
    "contentType": "article",
    "siteId": 2
  }'
```

### Test Marketing Hub

```bash
curl -X POST https://strapi-cms-production-9494.up.railway.app/api/marketing/send-email \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test from Strapi",
    "html": "<h1>Hello from Marketing Hub</h1>",
    "siteId": 1
  }'
```

---

## Step 7: Content Strategy

### Mayhemworld.io
- **Upload**: Event photos, nightlife images
- **Create**: Blog articles about Atlanta nightlife
- **Add**: Products (merch, tickets)

### ShotByMayhem.com
- **Upload**: Portfolio photos, behind-the-scenes
- **Create**: Photography tutorials (articles)
- **Add**: Service offerings, pricing packages

### Goddesses of ATL
- **Upload**: Goddess profile photos
- **Create**: Member bios, event coverage
- **Add**: Testimonials from members

### Nexus AI
- **Upload**: Product screenshots, UI mockups
- **Create**: Documentation, feature articles
- **Use**: AI Assistant plugin to generate docs

### House of KarléVon
- **Upload**: Product photos, lookbook images
- **Create**: Collection pages, brand story
- **Add**: Products with variants

---

## Troubleshooting

### Media not uploading?
- ✅ Check API token has upload permissions
- ✅ Verify Cloudinary credentials in Railway
- ✅ Check file size (max 10MB per file)

### Frontend can't fetch data?
- ✅ Verify API token in .env
- ✅ Check CORS settings include your domain
- ✅ Test query in GraphQL playground first

### Plugin APIs not working?
- ✅ Check plugin is enabled in config/plugins.js
- ✅ Verify API token has correct permissions
- ✅ Check Railway logs for errors

---

## Monitoring

### Check Strapi Health
```bash
curl https://strapi-cms-production-9494.up.railway.app/_health
```

### View Railway Logs
```bash
cd packages/strapi-cms
railway logs
```

### Cloudinary Dashboard
https://console.cloudinary.com/console/c-dgtfnhtr8/media_library

---

## Next Steps After Setup

1. **Populate Content**: Add articles, products, etc. for each site
2. **Update Frontends**: Replace hardcoded data with Strapi queries
3. **Test AI Features**: Generate content using AI Assistant
4. **Setup Marketing**: Create email templates, SMS campaigns
5. **Monitor Analytics**: Track usage across all sites

---

## Reference URLs

- **Strapi Admin**: https://strapi-cms-production-9494.up.railway.app/admin
- **GraphQL Playground**: https://strapi-cms-production-9494.up.railway.app/graphql
- **API Base**: https://strapi-cms-production-9494.up.railway.app/api
- **Cloudinary Console**: https://console.cloudinary.com

---

## Support Files

- `PLUGIN_API_GUIDE.md` - Complete plugin API documentation
- `FRONTEND_INTEGRATION.md` - GraphQL queries and React examples
- `scripts/migrate-media.js` - Media migration script
- `CRITIQUE.md` - Detailed analysis and recommendations
