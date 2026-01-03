# 🚨 STRAPI CMS INTEGRATION - READ THIS FIRST

**IMPORTANT**: This monorepo uses a centralized **Strapi v5 CMS** to manage content across ALL sites. Do NOT create duplicate content management systems or overwrite existing content.

---

## 📊 Architecture Overview

### Centralized Multi-Site CMS
This project uses a **single Strapi instance** managing content for **4 brands**:

1. **Mayhemworld** (`mayhemworld`)
2. **Shot By Mayhem** (`shotbymayhem`)
3. **Goddesses of ATL** (`goddesses-atl`)
4. **Nexus AI** (`nexus-ai`)

All content (articles, products, bookings, services) is filtered by `site_uid` in the database.

---

## 🔗 Strapi Dashboard Access

**Production URL**: https://strapi-cms-production-9494.up.railway.app/admin

**Location**: `packages/strapi-cms/`

**Version**: Strapi v5.6.0 (Community Edition)

**Database**: PostgreSQL (Railway)

---

## 📦 What Content is Managed in Strapi

### 1. **Articles/Blog Posts** (18 total)
- All blog content for ShotByMayhem
- SEO metadata, categories, tags
- **DO NOT** create separate blog systems

### 2. **Products** (10 total)
- **Nexus AI**: 3 subscription plans with Stripe integration
  - `price_1SkzvPLbUdLah3HiLEwIV7wv` (Starter - $0)
  - `price_1SkzvQLbUdLah3Hi06cFSlUF` (Founder - $39)
  - `price_1SkzvQLbUdLah3HiE75vgDSe` (Empire - $129)

- **Mayhemworld Store**: 7 physical products
  - Apparel (t-shirts, hoodies, caps, jackets)
  - Accessories (phone cases, pins)
  - Full inventory management

### 3. **Services** (22 total)
- Video production services
- Photography packages
- Event coverage

### 4. **Case Studies** (10 total)
- Portfolio pieces
- Client work examples

### 5. **Goddesses** (10 total)
- Model profiles
- Event promoters

### 6. **Bookings**
- Event bookings
- Service bookings
- Calendar integration

### 7. **Campaigns**
- Marketing campaigns
- Email/SMS automation

---

## 🔌 API Integration

### Base URL
```
https://strapi-cms-production-9494.up.railway.app/api
```

### Key Endpoints

#### Get Content by Site
```javascript
// Articles for ShotByMayhem
GET /api/articles?filters[site][site_uid][$eq]=shotbymayhem&populate=*

// Products for Nexus AI
GET /api/products?filters[site][site_uid][$eq]=nexus-ai&populate=*

// Products for Mayhemworld
GET /api/products?filters[site][site_uid][$eq]=mayhemworld&populate=*
```

#### Marketing Automation
```javascript
// Send Email
POST /api/marketing/send-email
{
  "to": "user@example.com",
  "subject": "Hello",
  "html": "<p>Message</p>",
  "site_id": 1
}

// Send SMS
POST /api/marketing/send-sms
{
  "to": "+1234567890",
  "body": "Message",
  "site_id": 1
}

// Post to Social Media
POST /api/marketing/post-social
{
  "content": "Post content",
  "platforms": ["instagram", "twitter"],
  "site_id": 1
}
```

#### Commerce
```javascript
// Create Stripe Checkout
POST /api/commerce/create-checkout
{
  "items": [{ "product_id": 1, "quantity": 1 }],
  "site_id": 1
}

// Create Order
POST /api/commerce/create-order
```

#### SEO
```javascript
// Generate Sitemap
GET /api/seo/generate-sitemap?site_uid=mayhemworld

// Auto-generate Meta Tags
POST /api/seo/auto-generate-meta
{
  "content_type": "article",
  "content_id": 1
}
```

#### Media
```javascript
// Optimize Image
POST /api/media/optimize-image

// Generate Thumbnail
POST /api/media/generate-thumbnail
```

---

## 🏗️ Admin Panel Features

### Available in Strapi Dashboard:

1. **Marketing Hub Plugin** 📧
   - Location: Admin sidebar → "Marketing Hub"
   - Send emails, SMS, social posts
   - Site selector for multi-brand campaigns

2. **AI Assistant Plugin** 🤖
   - Location: Admin sidebar → "AI Assistant"
   - Gemini AI integration for content generation

3. **Analytics Dashboard** 📊
   - Content performance
   - Site metrics

---

## ⚠️ CRITICAL: Do NOT Do These Things

### ❌ DO NOT:
1. **Create separate content management systems** for any of the 4 sites
2. **Duplicate product catalogs** in individual Next.js apps
3. **Build custom blog systems** - use Strapi articles
4. **Create separate booking systems** - use Strapi bookings
5. **Hardcode products/services** - fetch from Strapi API
6. **Delete or modify the `packages/strapi-cms` directory** without understanding the full impact
7. **Create conflicting database schemas** in individual apps
8. **Bypass Strapi for content creation** - always use the CMS

### ✅ DO:
1. **Fetch content via Strapi REST API** in your frontend apps
2. **Use the Marketing Hub** for email/SMS campaigns
3. **Check Strapi first** before building any content management feature
4. **Filter by `site_uid`** when querying multi-site content
5. **Use Strapi's media library** for all images/assets
6. **Consult this document** when making architectural decisions

---

## 🔧 Local Development

### Start Strapi Locally
```bash
cd packages/strapi-cms
npm run develop
```

**Local URL**: http://localhost:1337/admin

### Environment Variables Required
```env
# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi

# App Keys
APP_KEYS=<generated>
API_TOKEN_SALT=<generated>
ADMIN_JWT_SECRET=<generated>
TRANSFER_TOKEN_SALT=<generated>
JWT_SECRET=<generated>

# Third-party Services
TWILIO_ACCOUNT_SID=<optional>
TWILIO_AUTH_TOKEN=<optional>
SENDGRID_API_KEY=<optional>
CLOUDINARY_CLOUD_NAME=<optional>
CLOUDINARY_API_KEY=<optional>
CLOUDINARY_API_SECRET=<optional>

# Stripe (per site)
STRIPE_SECRET_KEY_MAYHEMWORLD=<required>
STRIPE_SECRET_KEY_NEXUSAI=<required>
STRIPE_SECRET_KEY_SHOTBYMAYHEM=<optional>
STRIPE_SECRET_KEY_GODDESSES=<optional>

# n8n Webhook
N8N_WEBHOOK_URL=<optional>
```

---

## 📁 Frontend Integration Examples

### Next.js Example (Mayhemworld)
```typescript
// app/store/page.tsx
async function getProducts() {
  const res = await fetch(
    'https://strapi-cms-production-9494.up.railway.app/api/products' +
    '?filters[site][site_uid][$eq]=mayhemworld' +
    '&populate=*',
    { next: { revalidate: 60 } }
  );
  return res.json();
}

export default async function StorePage() {
  const { data: products } = await getProducts();

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Blog Example (ShotByMayhem)
```typescript
// app/blog/page.tsx
async function getArticles() {
  const res = await fetch(
    'https://strapi-cms-production-9494.up.railway.app/api/articles' +
    '?filters[site][site_uid][$eq]=shotbymayhem' +
    '&filters[published][$eq]=true' +
    '&sort=publishedAt:desc' +
    '&populate=*',
    { next: { revalidate: 60 } }
  );
  return res.json();
}
```

---

## 🚀 Deployment

**Platform**: Railway
**Trigger**: Automatic on push to `main` branch
**Build Command**: `npm install && npm run build`
**Start Command**: `npm start`

### Auto-Migration on Startup
Strapi automatically runs content migration on startup if:
- Articles < 10 OR Products < 5

This ensures all content is loaded on first deployment.

---

## 📚 Content Schema

### Site
```typescript
{
  name: string;              // "Mayhemworld"
  site_uid: string;          // "mayhemworld" (unique)
  domain: string;            // "mayhemworld.io"
  logo: Media;
  primary_color: string;     // "#FF0080"
  secondary_color: string;   // "#8B5CF6"
}
```

### Article
```typescript
{
  title: string;
  slug: string;
  excerpt: string;
  content: text;             // Markdown/Rich text
  category: string;
  tags: string[];
  author: string;
  published: boolean;
  publishedAt: datetime;
  site: relation → Site;
  seo: component;            // Meta title, description, keywords
}
```

### Product
```typescript
{
  name: string;
  slug: string;
  description: text;
  short_description: string;
  price: decimal;
  compare_at_price: decimal;
  currency: string;          // "USD"
  product_type: enum;        // "physical", "digital", "subscription"
  sku: string;
  stripe_product_id: string;
  stripe_price_id: string;
  inventory_quantity: integer;
  manage_inventory: boolean;
  status: enum;              // "active", "draft", "archived"
  featured: boolean;
  site: relation → Site;
  images: Media[];
  features: json;            // Array of feature strings
  seo: component;
}
```

---

## 🔐 Authentication & Permissions

### Public Endpoints (No Auth)
- GET `/api/articles`
- GET `/api/products`
- GET `/api/services`
- GET `/api/case-studies`
- GET `/api/migration/status`

### Protected Endpoints (Require Auth)
- POST `/api/marketing/*`
- POST `/api/commerce/*`
- POST `/api/bookings`
- POST `/api/upload`

---

## 🆘 Troubleshooting

### "Content not showing up"
1. Check if content exists in Strapi admin
2. Verify `site_uid` filter matches exactly
3. Check `published` field is true
4. Ensure `populate=*` to get relations

### "Products missing Stripe integration"
1. Verify `stripe_price_id` is set in product
2. Check environment variables for Stripe keys
3. Confirm site has correct Stripe account configured

### "Images not loading"
1. Media must be uploaded through Strapi admin
2. Use Strapi's media library, not local Next.js public folder
3. Images are served from Strapi's `/uploads` directory

---

## 📞 Questions?

If you need to:
- Add new content types → Use Strapi Content-Type Builder
- Modify existing content → Use Strapi admin panel
- Add new API endpoints → Create custom routes in `src/api/`
- Integrate with frontend → Follow examples above

**Always check Strapi first before building custom solutions.**

---

## 📝 Migration History

### Initial Setup (Jan 2026)
- Upgraded from Strapi v4 to v5
- Migrated 18 blog articles (ShotByMayhem)
- Migrated 10 products (3 Nexus AI + 7 Mayhemworld)
- Added Marketing Hub plugin
- Added AI Assistant plugin
- Configured multi-site architecture

### Auto-Migration Features
- Runs on Strapi startup
- Idempotent (safe to run multiple times)
- Checks article/product counts before running
- Located in `src/index.js` bootstrap function

---

**Last Updated**: January 3, 2026
**Strapi Version**: 5.6.0
**Node Version**: 18.20.8
