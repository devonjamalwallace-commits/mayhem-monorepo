# Mayhem Multi-Site CMS - Features & Integrations

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

### Automation Setup
1. **Email Marketing**
   - SendGrid/Resend integration
   - Newsletter automation via n8n
   - Drip campaigns

2. **SMS Marketing**
   - Twilio integration (already configured)
   - Booking confirmations
   - Event reminders

3. **Social Media**
   - Auto-post to Instagram/Twitter via n8n
   - Content scheduling
   - Cross-posting to all platforms

### n8n Workflows Available
- Goddess booking automation
- AI customer support
- Email marketing campaigns
- Webhook processing

## 🛍️ E-Commerce (Coming Next)

### Planned Features
1. **Stripe Integration**
   - Product catalog
   - Shopping cart
   - Checkout flow
   - Subscription billing

2. **Booking System**
   - Goddess bookings
   - Photo session scheduling
   - Calendar integration
   - Payment processing

3. **Digital Downloads**
   - Photo packages
   - Video files
   - Secure delivery

## 🎨 Media Management

### Image Optimization
- Cloudinary integration (planned)
- Auto-resize images
- WebP conversion
- CDN delivery

### Video Hosting
- Direct upload to Strapi
- Mux integration (optional)
- Video transcoding

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

### Phase 1: AI & SEO (In Progress)
- [x] AI Assistant plugin
- [ ] SEO meta tag generation
- [ ] Sitemap generator
- [ ] Social preview cards

### Phase 2: E-commerce
- [ ] Product content type
- [ ] Stripe checkout integration
- [ ] Order management
- [ ] Inventory tracking

### Phase 3: Booking System
- [ ] Goddess availability calendar
- [ ] Photo session booking
- [ ] Payment integration
- [ ] Email confirmations

### Phase 4: Marketing Automation
- [ ] Email campaign builder
- [ ] SMS campaign builder
- [ ] Social media scheduler
- [ ] Analytics dashboard

### Phase 5: Advanced AI
- [ ] Auto-fill content fields
- [ ] Image caption generation
- [ ] Content recommendations
- [ ] Duplicate content detection

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
