# Mayhem Multi-Site CMS - Features & Integrations

**Powered by Strapi v5** 🚀

## 🎯 Current Setup

### Multi-Site Management
- **4 Sites**: Mayhemworld, ShotByMayhem, Goddesses of ATL, Nexus AI
- **Site Badges**: Color-coded badges in admin panel
  - 🔴 Mayhemworld (Red)
  - 🟠 ShotByMayhem (Orange)
  - 🟡 Goddesses (Gold)
  - 🟣 Nexus AI (Purple)
- **Site Filtering**: Every content type filters by site

### Content Types
- ✅ Articles (Blog posts)
- ✅ Case Studies
- ✅ Services (Pricing packages)
- ✅ Goddesses (Model roster)
- ✅ Testimonials
- ✅ Products
- ✅ Orders (E-commerce)
- ✅ Bookings (Scheduling)
- ✅ Campaigns (Marketing)
- ✅ Subscribers (Email/SMS)
- ✅ Social Posts (Scheduled)
- ✅ Pages
- ✅ Categories

### Migrated Content
- **3 Articles** (1 Mayhemworld, 2 ShotByMayhem)
- **5 Case Studies** (ShotByMayhem)
- **11 Services** (ShotByMayhem pricing)
- **5 Goddesses** (Goddesses of ATL roster)
- **3 Testimonials** (ShotByMayhem)

## 🤖 AI & Automation

### AI Assistant Plugin (NEW!)
Custom Strapi plugin with:
- **Content Generation**: Blog articles, case studies, social posts
- **SEO Generation**: Auto-generate meta tags, descriptions
- **Multi-site Aware**: Generates content specific to each brand
- **One-click AI**: Generate content from simple prompts

### Existing Integrations
- **Gemini AI**: `/api/integration/gemini-generate` - Text generation
- **n8n Workflows**: Automation workflows for bookings, emails
- **WorkOS**: SSO authentication
- **GitHub**: Deployment automation
- **Notion**: Content sync

## 📊 Marketing & Analytics

### ✅ Marketing Automation Hub (COMPLETE)
1. **Email Marketing**
   - ✅ Resend/SendGrid integration
   - ✅ Newsletter automation
   - ✅ Campaign builder
   - ✅ Subscriber management
   - API: `POST /api/marketing/send-email`
   - API: `POST /api/marketing/send-newsletter`
   - API: `POST /api/marketing/create-campaign`

2. **SMS Marketing**
   - ✅ Twilio integration
   - ✅ Booking confirmations
   - ✅ SMS campaigns
   - ✅ Bulk messaging
   - API: `POST /api/marketing/send-sms`
   - API: `POST /api/marketing/send-sms-campaign`

3. **Social Media**
   - ✅ Auto-post to Instagram/Twitter/Facebook via n8n
   - ✅ Content scheduling
   - ✅ Cross-posting to all platforms
   - API: `POST /api/marketing/post-social`
   - API: `POST /api/marketing/schedule-social-post`

### n8n Workflows Available
- ✅ Goddess booking automation
- ✅ AI customer support
- ✅ Email marketing campaigns
- ✅ Social media scheduling
- ✅ Webhook processing

## 🛍️ E-Commerce (COMPLETE)

### ✅ Stripe Integration
- ✅ Product catalog with Stripe sync
- ✅ Checkout sessions
- ✅ Subscription billing
- ✅ Payment intent processing
- ✅ Webhook handling
- ✅ Order management
- API: `POST /api/commerce/checkout`
- API: `POST /api/commerce/subscribe`
- API: `POST /api/commerce/sync-product/:id`
- API: `POST /api/commerce/webhook`
- API: `GET /api/commerce/my-orders`

### ✅ Booking System
- ✅ Goddess/photoshoot bookings
- ✅ Availability checking
- ✅ Time slot generation (9 AM - 11 PM)
- ✅ Calendar integration
- ✅ Payment processing
- ✅ Auto-confirmation emails + SMS
- API: `GET /api/bookings/available-slots/:goddessId`
- API: `POST /api/bookings`

## 🎨 Media Management (COMPLETE)

### ✅ Cloudinary Integration
- ✅ Auto image upload
- ✅ Smart compression & optimization
- ✅ Responsive URL generation
- ✅ WebP conversion
- ✅ CDN delivery
- ✅ Batch optimization
- ✅ Image transformations (hero, card, thumbnail, avatar)
- ✅ Usage stats tracking
- API: `POST /api/media/upload`
- API: `POST /api/media/auto-optimize`
- API: `POST /api/media/responsive-urls`
- API: `POST /api/media/convert-webp`
- API: `POST /api/media/batch-optimize/:siteId`
- API: `GET /api/media/usage-stats`

## 🔍 SEO Tools (COMPLETE)

### ✅ SEO Automation
- ✅ Auto-generate sitemaps
- ✅ Meta tag generation
- ✅ Structured data (Schema.org JSON-LD)
- ✅ Social preview cards (Open Graph + Twitter)
- ✅ SEO validation & scoring
- ✅ Robots.txt generation
- API: `GET /api/seo/sitemap/:siteId`
- API: `POST /api/seo/meta-tags`
- API: `POST /api/seo/structured-data`
- API: `POST /api/seo/social-preview`
- API: `POST /api/seo/auto-generate`
- API: `POST /api/seo/validate`
- API: `GET /api/seo/robots-txt/:siteId`

## 🔧 Technical Features

### API
- **REST API**: `/api/articles`, `/api/goddesses`, etc.
- **GraphQL**: `/graphql` endpoint
- **Authentication**: Bearer token (JWT)
- **Site Filtering**: `?filters[site][site_uid][$eq]=mayhemworld`

### Performance
- Cached queries
- Optimized database indexes
- CDN-ready assets

### Security
- API token authentication
- CORS configured
- Content Security Policy
- Role-based access control

## 🚀 Deployment

- **Platform**: Railway
- **Database**: PostgreSQL (Render)
- **URL**: https://strapi-cms-production-9494.up.railway.app
- **Admin**: https://strapi-cms-production-9494.up.railway.app/admin

## 📝 Next Steps

### ✅ Phase 1: AI & SEO (COMPLETE)
- [x] AI Assistant plugin
- [x] SEO meta tag generation
- [x] Sitemap generator
- [x] Social preview cards
- [x] Structured data

### ✅ Phase 2: E-commerce (COMPLETE)
- [x] Product content type
- [x] Stripe checkout integration
- [x] Order management
- [x] Subscription billing
- [x] Webhook processing

### ✅ Phase 3: Booking System (COMPLETE)
- [x] Goddess availability calendar
- [x] Photo session booking
- [x] Payment integration
- [x] Email + SMS confirmations
- [x] Time slot generation

### ✅ Phase 4: Marketing Automation (COMPLETE)
- [x] Email campaign builder
- [x] SMS campaign builder
- [x] Social media scheduler
- [x] Subscriber management
- [x] n8n workflow integration

### ✅ Phase 5: Media Management (COMPLETE)
- [x] Cloudinary integration
- [x] Image optimization
- [x] WebP conversion
- [x] Responsive URLs
- [x] Batch processing

### 🚀 Phase 6: Frontend Integration (Next)
- [ ] Update site code to fetch from Strapi
- [ ] Implement ISR (Incremental Static Regeneration)
- [ ] Replace hardcoded content with API calls
- [ ] Add webhook revalidation
- [ ] SEO meta tag integration

### 🎯 Phase 7: Advanced AI (Future)
- [ ] Auto-fill content fields
- [ ] Image caption generation
- [ ] Content recommendations
- [ ] Duplicate content detection
- [ ] AI-powered analytics

## 🎯 How to Use

### Accessing Admin Panel
1. Go to https://strapi-cms-production-9494.up.railway.app/admin
2. Log in with your credentials
3. See AI Assistant in left menu (✨ icon)

### Creating Content
1. Select content type (Article, Goddess, etc.)
2. Choose site from dropdown
3. Fill in fields or use AI Assistant
4. Publish

### Using AI Assistant
1. Click "AI Assistant" in menu
2. Select site and content type
3. Enter prompt (e.g., "Write about nightclub photography")
4. Click "Generate Content"
5. Copy result to your content

### API Usage (Frontend)
```javascript
// Fetch Mayhemworld articles
const res = await fetch(
  `${STRAPI_URL}/api/articles?filters[site][site_uid][$eq]=mayhemworld`,
  { headers: { 'Authorization': `Bearer ${STRAPI_API_TOKEN}` }}
);
const articles = await res.json();
```

## 💡 Tips

1. **Use AI for drafts**: Generate content quickly, then refine
2. **Tag content properly**: Use site field to keep content organized
3. **Preview before publishing**: Use draft mode
4. **Leverage n8n**: Automate repetitive tasks
5. **Monitor analytics**: Track which content performs best

## 🆘 Support

- Documentation: https://docs.strapi.io
- Issues: Contact Mayhem Team
- n8n Workflows: https://n8n.srv1105812.hstgr.cloud
