'use strict';

/**
 * Seed script to create initial sites
 * Run with: node scripts/seed.js
 */

const sites = [
  {
    name: 'Mayhemworld.io',
    site_uid: 'mayhemworld-io',
    domain: 'mayhemworld.io',
    description: 'General Hub & Personal Brand - The central hub for all Mayhem brands',
    primary_color: '#000000',
    secondary_color: '#ffffff',
    status: 'active',
  },
  {
    name: 'Nexus AI',
    site_uid: 'nexus-ai',
    domain: 'nexus-ai.io',
    description: 'AI Technology & SaaS Solutions - Cutting-edge AI tools and services',
    primary_color: '#6366f1',
    secondary_color: '#1e1b4b',
    status: 'active',
  },
  {
    name: 'Goddesses of ATL',
    site_uid: 'goddesses-of-atl',
    domain: 'goddessesofatl.com',
    description: 'Lifestyle & Community - Empowering women in Atlanta and beyond',
    primary_color: '#ec4899',
    secondary_color: '#fdf2f8',
    status: 'active',
  },
  {
    name: 'ShotByMayhem',
    site_uid: 'shotbymayhem',
    domain: 'shotbymayhem.com',
    description: 'Photography & Creative Services - Professional photography and visual content',
    primary_color: '#f59e0b',
    secondary_color: '#1f2937',
    status: 'active',
  },
];

async function seed(strapi) {
  console.log('🌱 Starting seed...');

  for (const siteData of sites) {
    // Check if site already exists
    const existing = await strapi.db.query('api::site.site').findOne({
      where: { site_uid: siteData.site_uid },
    });

    if (existing) {
      console.log(`⏭️  Site "${siteData.name}" already exists, skipping...`);
      continue;
    }

    // Create the site
    const site = await strapi.db.query('api::site.site').create({
      data: siteData,
    });

    console.log(`✅ Created site: ${site.name} (${site.site_uid})`);

    // Create a sample category for each site
    await strapi.db.query('api::category.category').create({
      data: {
        name: 'General',
        slug: 'general',
        description: 'General content',
        site: site.id,
        display_order: 0,
      },
    });

    console.log(`   └─ Created "General" category`);
  }

  console.log('🎉 Seed completed!');
}

module.exports = { seed, sites };
