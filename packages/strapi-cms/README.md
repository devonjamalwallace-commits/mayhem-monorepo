# Mayhem Multi-Site CMS

A powerful, feature-rich **Strapi v5** headless CMS managing 4 brands with WordPress-surpassing capabilities.

## 🌟 Overview

This is a centralized Strapi v5 CMS that powers:
- **Mayhemworld** - Photography portfolio & blog
- **ShotByMayhem** - Photography services & booking
- **Goddesses of ATL** - Model roster & booking
- **Nexus AI** - AI products & services

## ✨ Features

### 🎨 Multi-Site Management
- Color-coded site badges in admin (Red, Orange, Gold, Purple)
- Every content type has site filtering
- Unified management across all brands

### 💼 E-Commerce System
- Full Stripe integration
- Product catalog with auto-sync to Stripe
- Checkout sessions & subscription billing
- Order management & webhooks
- User order history

**API Endpoints:**
```
POST /api/commerce/checkout
POST /api/commerce/subscribe
POST /api/commerce/sync-product/:id
POST /api/commerce/webhook
GET /api/commerce/my-orders
GET /api/commerce/orders/:id
```

### 📅 Booking System
- Goddess & photoshoot bookings
- Real-time availability checking
- Time slot generation (9 AM - 11 PM)
- Auto-confirmation emails + SMS
- Payment processing via Stripe

**API Endpoints:**
```
GET /api/bookings/available-slots/:goddessId?date=YYYY-MM-DD
POST /api/bookings
```

### 📧 Marketing Automation
- Email marketing (Resend/SendGrid)
- SMS campaigns (Twilio)
- Social media posting (Instagram/Twitter/Facebook via n8n)
- Newsletter management
- Campaign builder
- Subscriber management

**API Endpoints:**
```
POST /api/marketing/send-email
POST /api/marketing/send-sms
POST /api/marketing/post-social
POST /api/marketing/create-campaign
POST /api/marketing/send-newsletter
POST /api/marketing/send-sms-campaign
POST /api/marketing/schedule-social-post
```

### 🔍 SEO Tools
- Auto-generate sitemaps
- Meta tag generation
- Structured data (Schema.org JSON-LD)
- Social preview cards (Open Graph + Twitter)
- SEO validation & scoring
- Robots.txt generation

**API Endpoints:**
```
GET /api/seo/sitemap/:siteId
POST /api/seo/meta-tags
POST /api/seo/structured-data
POST /api/seo/social-preview
POST /api/seo/auto-generate
POST /api/seo/validate
GET /api/seo/robots-txt/:siteId
```

### 🖼️ Media Management (Cloudinary)
- Auto image upload & optimization
- Smart compression
- Responsive URL generation
- WebP conversion
- CDN delivery
- Batch optimization
- Image transformations (hero, card, thumbnail, avatar)

**API Endpoints:**
```
POST /api/media/upload
POST /api/media/auto-optimize
POST /api/media/responsive-urls
POST /api/media/convert-webp
POST /api/media/batch-optimize/:siteId
GET /api/media/usage-stats
POST /api/media/transformations
```

### 🤖 AI Assistant
- Custom Strapi plugin
- Content generation (articles, case studies, social posts)
- SEO generation
- Multi-site aware
- Uses existing Gemini API

## 📦 Content Types

- **Articles** - Blog posts
- **Case Studies** - Client success stories
- **Services** - Pricing packages
- **Goddesses** - Model roster
- **Testimonials** - Client reviews
- **Products** - E-commerce items
- **Orders** - Purchase records
- **Bookings** - Appointments
- **Campaigns** - Marketing campaigns
- **Subscribers** - Email/SMS contacts
- **Social Posts** - Scheduled posts
- **Pages** - Static pages
- **Categories** - Content organization

## 🚀 Deployment

- **Platform**: Railway
- **Database**: PostgreSQL (Render)
- **URL**: https://strapi-cms-production-9494.up.railway.app
- **Admin**: https://strapi-cms-production-9494.up.railway.app/admin

## 🔧 Environment Variables

### Required
```bash
# Strapi
PUBLIC_URL=https://strapi-cms-production-9494.up.railway.app
DATABASE_URL=postgresql://...
ADMIN_JWT_SECRET=...
API_TOKEN_SALT=...
APP_KEYS=...
JWT_SECRET=...

# Stripe E-commerce
STRIPE_SECRET_KEY=sk_...
STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Resend or SendGrid)
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_...
EMAIL_FROM_ADDRESS=noreply@yourdomain.com

# SMS (Twilio)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...

# n8n Automation
N8N_WEBHOOK_URL=https://n8n.srv1105812.hstgr.cloud

# Cloudinary Media
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# AI (Gemini)
GEMINI_API_KEY=...
```

## 📖 Usage

### Admin Panel
1. Go to https://strapi-cms-production-9494.up.railway.app/admin
2. Log in with your credentials
3. Use color-coded badges to identify which site you're managing

### API Usage (Frontend)

#### Fetch articles for a site
```javascript
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

const res = await fetch(
  `${STRAPI_URL}/api/articles?filters[site][site_uid][$eq]=mayhemworld&populate=*`,
  {
    headers: {
      'Authorization': `Bearer ${STRAPI_TOKEN}`
    }
  }
);
const { data } = await res.json();
```

#### Create a booking
```javascript
const booking = await fetch(`${STRAPI_URL}/api/bookings`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${STRAPI_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    data: {
      booking_type: 'goddess',
      customer_name: 'John Doe',
      customer_email: 'john@example.com',
      customer_phone: '+15551234567',
      event_date: '2025-01-15T18:00:00Z',
      duration_hours: 2,
      total_price: 500,
      goddess: 1, // Goddess ID
      site: 3 // Site ID
    }
  })
});
```

#### Send marketing email
```javascript
const result = await fetch(`${STRAPI_URL}/api/marketing/send-email`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${STRAPI_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    to: 'customer@example.com',
    subject: 'New Blog Post!',
    html: '<h1>Check out our latest article</h1>',
    site_id: 1
  })
});
```

#### Generate SEO
```javascript
const seo = await fetch(`${STRAPI_URL}/api/seo/auto-generate`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${STRAPI_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    contentType: 'article',
    contentId: 1
  })
});
```

#### Optimize image with Cloudinary
```javascript
const optimized = await fetch(`${STRAPI_URL}/api/media/auto-optimize`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${STRAPI_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    publicId: 'site-1/my-image',
    options: { width: 1200, quality: 'auto' }
  })
});
```

## 🔌 Integrations

- **Stripe** - Payment processing
- **Twilio** - SMS messaging
- **Resend/SendGrid** - Email delivery
- **Cloudinary** - Image optimization & CDN
- **n8n** - Workflow automation
- **Gemini AI** - Content generation
- **GitHub** - Deployment automation
- **Notion** - Content sync (optional)
- **WorkOS** - SSO authentication

## 📊 Statistics

- **4 Sites** managed
- **13 Content Types**
- **27+ API Endpoints**
- **5 Major Feature Suites**
- **WordPress-surpassing** capabilities

## 🛠️ Development

### Install dependencies
```bash
cd packages/strapi-cms
pnpm install
```

### Run locally
```bash
pnpm develop
```

### Build for production
```bash
pnpm build
pnpm start
```

### Seed initial data
```bash
pnpm seed
```

## 🎯 What Makes This Special

✅ **Multi-site** - Manage 4 brands from one CMS
✅ **E-commerce** - Full Stripe integration like WooCommerce
✅ **Booking** - Calendar-based scheduling with payments
✅ **Marketing** - Email + SMS + Social automation
✅ **SEO** - Auto-generate everything
✅ **Media** - Cloudinary optimization & CDN
✅ **AI** - Content generation & auto-fill
✅ **n8n** - Workflow automation

## 📄 License

MIT

## 👤 Author

Mayhem Team

---

**Ready to exceed WordPress?** This CMS has everything you need and more! 🚀
