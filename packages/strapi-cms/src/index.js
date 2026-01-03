'use strict';

// Migration data
const shotByMayhemMDXPosts = [
  {
    title: "$500 Home Studio Setup for Content Creators",
    slug: "500-dollar-home-studio-setup",
    excerpt: "Build a professional content creation studio on a budget with our complete equipment guide and setup tips.",
    content: "Complete guide to building a home studio for under $500. Includes camera, lighting, audio, and backdrop recommendations with specific product links and setup instructions.",
    category: "Equipment",
    tags: ["studio setup", "budget gear", "home studio", "equipment"],
    published: true,
  },
  {
    title: "AI Filmmaking Workflow: Veo vs Runway ML",
    slug: "ai-filmmaking-workflow-veo-runway",
    excerpt: "Compare the latest AI video generation tools and learn how to integrate them into your creative workflow.",
    content: "Deep dive into AI-powered video generation using Veo and Runway ML. Includes workflow examples, quality comparisons, and practical use cases for content creators.",
    category: "AI & Technology",
    tags: ["AI", "filmmaking", "Runway ML", "Veo"],
    published: true,
  },
  {
    title: "Camera Wars: FX3 vs A7S III vs RED",
    slug: "camera-wars-fx3-vs-a7siii-vs-red",
    excerpt: "Which cinema camera is right for your production? We break down specs, image quality, and real-world performance.",
    content: "Comprehensive comparison of Sony FX3, A7S III, and RED cameras. Real-world tests covering low-light performance, color science, and pricing analysis.",
    category: "Equipment",
    tags: ["cameras", "Sony FX3", "A7S III", "RED", "cinematography"],
    published: true,
  },
  {
    title: "Color Grading for Social Media: The Complete Guide",
    slug: "color-grading-social-media-guide",
    excerpt: "Master color grading specifically for Instagram, TikTok, and YouTube with platform-specific techniques.",
    content: "Platform-specific color grading guide covering Instagram, TikTok, and YouTube. Includes LUT recommendations, mobile workflow, and color consistency tips.",
    category: "Post-Production",
    tags: ["color grading", "social media", "Instagram", "TikTok"],
    published: true,
  },
  {
    title: "Facial Expressions: Beyond the Smile",
    slug: "facial-expressions-beyond-the-smile",
    excerpt: "Elevate your portrait photography by mastering the art of capturing genuine emotion and connection.",
    content: "Advanced portrait photography guide focusing on directing facial expressions. Covers emotional connection, microexpressions, and creating authentic moments.",
    category: "Photography",
    tags: ["portraits", "facial expressions", "posing", "emotions"],
    published: true,
  },
  {
    title: "Hand Placement Masterclass for Portrait Photography",
    slug: "hand-placement-masterclass",
    excerpt: "Learn professional hand positioning techniques that transform ordinary portraits into magazine-worthy images.",
    content: "Complete guide to hand placement in portrait photography. Visual examples of flattering hand positions, common mistakes to avoid, and styling tips.",
    category: "Photography",
    tags: ["portraits", "posing", "hands", "styling"],
    published: true,
  },
  {
    title: "Lighting Dark Skin: A Cinema Guide",
    slug: "lighting-dark-skin-cinema-guide",
    excerpt: "Professional techniques for beautifully lighting darker skin tones in video and photography.",
    content: "Expert guide to lighting dark skin tones properly. Covers key-to-fill ratios, color temperature, backlight techniques, and common mistakes to avoid.",
    category: "Lighting",
    tags: ["lighting", "cinematography", "dark skin", "diversity"],
    published: true,
  },
  {
    title: "Music Video Budget Breakdown 2025",
    slug: "music-video-budget-breakdown-2025",
    excerpt: "Real numbers from actual music video productions. Know what to expect at every budget level.",
    content: "Detailed music video budget breakdowns from $500 to $50k. Includes crew rates, equipment costs, location fees, and post-production expenses for Atlanta market.",
    category: "Business",
    tags: ["music videos", "budgets", "pricing", "Atlanta"],
    published: true,
  },
  {
    title: "OnlyFans Premium Content Strategy for Creators",
    slug: "onlyfans-premium-content-strategy",
    excerpt: "Maximize your earnings with strategic content planning, pricing tiers, and subscriber retention tactics.",
    content: "Comprehensive OnlyFans strategy guide covering content planning, pricing psychology, subscriber retention, and brand safety. Includes monthly content calendars.",
    category: "Business",
    tags: ["OnlyFans", "content strategy", "monetization", "creators"],
    published: true,
  },
  {
    title: "Posing Guide for Curvy Body Types",
    slug: "posing-guide-curvy-body-types",
    excerpt: "Flattering poses and angles that celebrate curves and create stunning, confident portraits.",
    content: "Body-positive posing guide for plus-size and curvy models. Covers flattering angles, outfit selection, and confidence-building techniques.",
    category: "Photography",
    tags: ["posing", "plus size", "body positive", "portraits"],
    published: true,
  },
  {
    title: "Understanding Video Codecs: H.264, H.265, ProRes Guide 2025",
    slug: "understanding-video-codecs-guide-2025",
    excerpt: "Decode the confusion around video codecs and learn which format to use for every situation.",
    content: "Technical guide to video codecs covering H.264, H.265, ProRes, and DNxHD. Includes file size comparisons, quality analysis, and delivery recommendations.",
    category: "Post-Production",
    tags: ["codecs", "video editing", "technical", "delivery"],
    published: true,
  },
  {
    title: "Viral Reels Pacing Guide 2025",
    slug: "viral-reels-pacing-guide-2025",
    excerpt: "Master the rhythm and pacing that makes Reels go viral with data-backed editing techniques.",
    content: "Data-driven guide to Instagram Reels pacing. Analyzes viral reels for cut frequency, hook timing, and retention optimization. Includes editing templates.",
    category: "Social Media",
    tags: ["Reels", "Instagram", "viral", "editing"],
    published: true,
  },
];

const nexusAIProducts = [
  {
    name: "Starter",
    slug: "starter-plan",
    description: "Perfect for trying out Nexus AI",
    short_description: "50 AI credits per month",
    price: 0,
    compare_at_price: 0,
    currency: "USD",
    product_type: "subscription",
    stripe_product_id: "prod_starter",
    stripe_price_id: "price_1SkzvPLbUdLah3HiLEwIV7wv",
    sku: "NEXUS-STARTER",
    status: "active",
    features: [
      "50 AI credits/month",
      "Basic AI models",
      "Community support",
      "Web access"
    ],
    meta_title: "Starter Plan - Nexus AI",
    meta_description: "Try Nexus AI with 50 free credits per month",
  },
  {
    name: "Founder",
    slug: "founder-plan",
    description: "For serious creators and entrepreneurs",
    short_description: "500 AI credits per month",
    price: 39,
    compare_at_price: 0,
    currency: "USD",
    product_type: "subscription",
    stripe_product_id: "prod_founder",
    stripe_price_id: "price_1SkzvQLbUdLah3Hi06cFSlUF",
    sku: "NEXUS-FOUNDER",
    status: "active",
    featured: false,
    features: [
      "500 AI credits/month",
      "Advanced AI models",
      "Priority support",
      "API access",
      "Custom branding"
    ],
    meta_title: "Founder Plan - Nexus AI",
    meta_description: "Scale your business with 500 AI credits per month and advanced features",
  },
  {
    name: "Empire",
    slug: "empire-plan",
    description: "For agencies and power users",
    short_description: "2,500 AI credits per month",
    price: 129,
    compare_at_price: 199,
    currency: "USD",
    product_type: "subscription",
    stripe_product_id: "prod_empire",
    stripe_price_id: "price_1SkzvQLbUdLah3HiE75vgDSe",
    sku: "NEXUS-EMPIRE",
    status: "active",
    featured: true,
    features: [
      "2,500 AI credits/month",
      "All AI models",
      "Dedicated support",
      "API access",
      "White-label options",
      "Team collaboration",
      "Priority processing"
    ],
    meta_title: "Empire Plan - Nexus AI (Most Popular)",
    meta_description: "Maximum power with 2,500 AI credits and enterprise features",
  },
];

const mayhemworldProducts = [
  {
    name: "Mayhem Logo T-Shirt - Black",
    slug: "mayhem-logo-tshirt-black",
    description: "Premium cotton tee with iconic Mayhem World logo. Ultra-soft, perfect fit.",
    short_description: "Premium cotton tee",
    price: 34,
    currency: "USD",
    product_type: "physical",
    sku: "MW-TSHIRT-001",
    status: "active",
    inventory_quantity: 100,
    manage_inventory: true,
    meta_title: "Mayhem Logo T-Shirt - Black",
    meta_description: "Premium cotton tee with iconic Mayhem World logo",
  },
  {
    name: "Atlanta's Finest Hoodie",
    slug: "atlantas-finest-hoodie",
    description: "Premium heavyweight hoodie. Represent ATL nightlife in style.",
    short_description: "Premium heavyweight hoodie",
    price: 69,
    currency: "USD",
    product_type: "physical",
    sku: "MW-HOODIE-001",
    status: "active",
    featured: true,
    inventory_quantity: 75,
    manage_inventory: true,
    meta_title: "Atlanta's Finest Hoodie - Mayhem World",
    meta_description: "Premium heavyweight hoodie representing ATL nightlife",
  },
  {
    name: "Mayhem World Fitted Cap",
    slug: "mayhem-world-fitted-cap",
    description: "Classic snapback with embroidered logo. One size fits all.",
    short_description: "Classic snapback",
    price: 32,
    currency: "USD",
    product_type: "physical",
    sku: "MW-CAP-001",
    status: "active",
    inventory_quantity: 150,
    manage_inventory: true,
    meta_title: "Mayhem World Fitted Cap",
    meta_description: "Classic snapback with embroidered Mayhem logo",
  },
  {
    name: "Team Lead Varsity Jacket",
    slug: "team-lead-varsity-jacket",
    description: "Premium varsity jacket for top promoters. Leather sleeves, wool body.",
    short_description: "Premium varsity jacket",
    price: 149,
    currency: "USD",
    product_type: "physical",
    sku: "MW-JACKET-001",
    status: "active",
    inventory_quantity: 25,
    manage_inventory: true,
    meta_title: "Team Lead Varsity Jacket - Mayhem World",
    meta_description: "Premium varsity jacket for top promoters with leather sleeves",
  },
  {
    name: "Legend Status Bomber",
    slug: "legend-status-bomber",
    description: "Elite bomber jacket. For those who reached legend rank.",
    short_description: "Elite bomber jacket",
    price: 179,
    currency: "USD",
    product_type: "physical",
    sku: "MW-BOMBER-001",
    status: "active",
    featured: true,
    inventory_quantity: 20,
    manage_inventory: true,
    meta_title: "Legend Status Bomber - Mayhem World",
    meta_description: "Elite bomber jacket for legend rank promoters",
  },
  {
    name: "Mayhem Phone Case",
    slug: "mayhem-phone-case",
    description: "Protective case with gradient logo. iPhone & Samsung models.",
    short_description: "Protective phone case",
    price: 24,
    currency: "USD",
    product_type: "physical",
    sku: "MW-CASE-001",
    status: "active",
    inventory_quantity: 200,
    manage_inventory: true,
    meta_title: "Mayhem Phone Case",
    meta_description: "Protective case with gradient Mayhem logo",
  },
  {
    name: "Enamel Pin Set - Rank Badges",
    slug: "enamel-pin-set-rank-badges",
    description: "Collectible enamel pins representing all promoter ranks.",
    short_description: "Collectible enamel pins",
    price: 22,
    currency: "USD",
    product_type: "physical",
    sku: "MW-PINS-001",
    status: "active",
    inventory_quantity: 150,
    manage_inventory: true,
    meta_title: "Enamel Pin Set - Rank Badges",
    meta_description: "Collectible enamel pins for all promoter ranks",
  },
];

module.exports = {
  register() {},
  async bootstrap({ strapi }) {
    try {
      // Check if migration is needed
      const articleCount = await strapi.db.query('api::article.article').count();

      strapi.log.info(`📊 Current article count: ${articleCount}`);

      if (articleCount < 10) {
        strapi.log.info('🔄 Running automatic content migration...');

        // Get sites
        const sites = await strapi.db.query('api::site.site').findMany({});
        const shotbymayhem = sites.find(s => s.site_uid === 'shotbymayhem');
        const nexusai = sites.find(s => s.site_uid === 'nexus-ai');
        const mayhemworld = sites.find(s => s.site_uid === 'mayhemworld');

        if (!shotbymayhem || !nexusai || !mayhemworld) {
          strapi.log.error('❌ Required sites not found. Skipping migration.');
          return;
        }

        // Migrate articles
        let newArticles = 0;
        for (const post of shotByMayhemMDXPosts) {
          const exists = await strapi.db.query('api::article.article').findOne({
            where: { slug: post.slug, site: shotbymayhem.id }
          });

          if (!exists) {
            await strapi.documents('api::article.article').create({
              data: {
                ...post,
                site: shotbymayhem.id,
                author: 'Shot By Mayhem',
                publishedAt: new Date(),
              }
            });
            newArticles++;
          }
        }

        // Migrate Nexus AI products
        let newProducts = 0;
        for (const product of nexusAIProducts) {
          const exists = await strapi.db.query('api::product.product').findOne({
            where: { slug: product.slug, site: nexusai.id }
          });

          if (!exists) {
            await strapi.documents('api::product.product').create({
              data: {
                ...product,
                site: nexusai.id,
                inventory_quantity: 999999,
                manage_inventory: false,
              }
            });
            newProducts++;
          }
        }

        // Migrate Mayhemworld store products
        for (const product of mayhemworldProducts) {
          const exists = await strapi.db.query('api::product.product').findOne({
            where: { slug: product.slug, site: mayhemworld.id }
          });

          if (!exists) {
            await strapi.documents('api::product.product').create({
              data: {
                ...product,
                site: mayhemworld.id,
              }
            });
            newProducts++;
          }
        }

        strapi.log.info(`✅ Migration complete: ${newArticles} articles, ${newProducts} products`);
      } else {
        strapi.log.info('✨ Content already migrated, skipping...');
      }
    } catch (error) {
      strapi.log.error('❌ Auto-migration error:', error);
      // Don't fail startup
    }
  },
};
