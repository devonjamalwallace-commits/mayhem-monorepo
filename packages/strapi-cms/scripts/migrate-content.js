/**
 * Content Migration Script
 * Imports existing content from site files into Strapi
 */

const STRAPI_URL = 'https://strapi-cms-production-9494.up.railway.app';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

if (!API_TOKEN) {
  console.error('Please set STRAPI_API_TOKEN environment variable');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_TOKEN}`
};

// Site configurations
const sites = [
  { name: 'Mayhemworld', site_uid: 'mayhemworld', domain: 'mayhemworld.io', primary_color: '#FF0000', secondary_color: '#FFD700' },
  { name: 'ShotByMayhem', site_uid: 'shotbymayhem', domain: 'shotbymayhem.com', primary_color: '#DC2626', secondary_color: '#F59E0B' },
  { name: 'Goddesses of ATL', site_uid: 'goddesses-of-atl', domain: 'goddessesofatl.com', primary_color: '#D4AF37', secondary_color: '#1a1a1a' },
  { name: 'Nexus AI', site_uid: 'nexus-ai', domain: 'nexusbuildai.com', primary_color: '#6366F1', secondary_color: '#10B981' }
];

// Blog articles from Mayhemworld
const mayhemArticles = [
  {
    slug: "how-to-become-nightclub-promoter-complete-guide",
    title: "How to Become a Nightclub Promoter: The Complete Guide for 2025",
    excerpt: "Learn everything you need to know about becoming a successful nightclub promoter, from building your network to maximizing your earnings.",
    content: `<h2>What Does a Nightclub Promoter Do?</h2><p>A nightclub promoter is responsible for attracting guests to venues by organizing events, managing guest lists, and utilizing marketing strategies to ensure successful and well-attended events.</p><h2>Essential Skills for Nightclub Promoters</h2><h3>1. Marketing and Sales</h3><p>Successful promoters excel at designing promotional materials and leveraging social media platforms to attract customers.</p><h3>2. Networking</h3><p>Building relationships with venue owners, artists, DJs, and potential clients is crucial.</p><h3>3. Financial Management</h3><p>Managing budgets, negotiating contracts, and estimating event profitability are essential skills.</p>`,
    coverImage: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1200",
    category: "Career Guide",
    author: "Mayhem Team",
    readTime: "12 min read",
    tags: ["nightlife", "promoter", "career", "events"]
  }
];

// Articles from ShotByMayhem
const shotbymayhemArticles = [
  {
    slug: "atlanta-music-video-production-guide",
    title: "Atlanta Music Video Production: Budget, Crew, and Delivery Guide",
    excerpt: "Breakdown of Atlanta music video production—budgets, permits, crew roles, lighting setups, timelines, and delivery formats.",
    content: `<h2>Budgets that match the concept</h2><p>Atlanta budgets typically span $3k–$25k. Performance-driven videos lean lighter on art/locations while narrative or set builds allocate more to art direction and lighting.</p><h2>Crew roles that actually move the needle</h2><p>A tight Atlanta unit is Director + DP + 1st AC, Gaffer + swing, Key Grip, Art/Wardrobe, HMU, and a PA.</p>`,
    coverImage: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200",
    category: "Music Video",
    author: "Shot by Mayhem",
    readTime: "7 min read",
    tags: ["music video", "production", "atlanta", "filmmaking"],
    keywords: ["Atlanta music video production", "music video budget", "music video crew roles"],
    audience: "Artists and labels planning a video in Atlanta",
    location: "Atlanta, GA"
  },
  {
    slug: "luxury-portrait-pricing-and-deliverables",
    title: "Luxury Portrait Pricing: What Influences Rate, Retouching, and Deliverables",
    excerpt: "How premium portrait pricing is built—time, team, lighting, retouching, licensing, and how to compare quotes fairly.",
    content: `<h2>What goes into portrait pricing</h2><p>Premium portrait sessions account for prep time, shooting, retouching, and licensing. Each factor influences the final quote.</p>`,
    coverImage: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1200",
    category: "Portraits",
    author: "Shot by Mayhem",
    readTime: "6 min read",
    tags: ["portraits", "pricing", "photography"],
    keywords: ["portrait pricing", "portrait retouching", "headshot rates"],
    audience: "Executives and talent booking premium portraits"
  }
];

// Case studies from ShotByMayhem
const caseStudies = [
  {
    clientName: "Luxury Atlanta Homes",
    industry: "Real Estate",
    projectType: "Property Photography & Video Tours",
    challenge: "High-end properties weren't receiving enough qualified inquiries despite premium listings.",
    solution: "Professional twilight photography, drone footage, and cinematic video tours showcasing luxury amenities.",
    results: ["Increased inquiries by 340%", "Average time-on-market reduced by 45 days", "Selling prices increased 8% above asking"],
    testimonial: "Shot by Mayhem transformed how we present properties. The cinematic quality photography has become our competitive advantage.",
    clientRole: "Real Estate Broker",
    beforeImage: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800",
    afterImage: "/images/case-study-real-estate.png",
    metrics: [{ label: "Inquiries Increase", value: "+340%" }, { label: "Days on Market", value: "-45" }]
  },
  {
    clientName: "DRIP Atlanta",
    industry: "Fashion",
    projectType: "Lookbook & Social Content",
    challenge: "New streetwear brand needed to establish credibility and drive online sales.",
    solution: "High-fashion editorial shoot with professional models, styled locations, and content optimized for Instagram.",
    results: ["Instagram following grew from 800 to 15K in 3 months", "Conversion rate increased by 67%", "Average order value up $45"],
    testimonial: "The content quality made us look like a million-dollar brand from day one. Our sales exploded after launching with these images.",
    clientRole: "Brand Founder",
    beforeImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800",
    afterImage: "/images/case-study-streetwear.png",
    metrics: [{ label: "Follower Growth", value: "+1,775%" }, { label: "Conversion Rate", value: "+67%" }]
  },
  {
    clientName: "Diamond Events Co.",
    industry: "Events",
    projectType: "Corporate Event Coverage",
    challenge: "Company events lacked professional documentation for marketing and investor presentations.",
    solution: "Full-day coverage with multiple angles, highlight reels, and professional photo editing for corporate materials.",
    results: ["Event attendance increased 120% year-over-year", "Marketing materials ROI up 200%", "Secured 2 major corporate sponsors"],
    testimonial: "The video content paid for itself 10x over. We use it in pitches, social media, and investor decks.",
    clientRole: "Event Director",
    beforeImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800",
    afterImage: "/images/case-study-event-culture.png",
    metrics: [{ label: "Attendance Growth", value: "+120%" }, { label: "Marketing ROI", value: "+200%" }]
  },
  {
    clientName: "TechStart Atlanta",
    industry: "Corporate",
    projectType: "Team Headshots & Office Culture",
    challenge: "Tech startup needed to appear more established for Series A fundraising.",
    solution: "Professional headshots for all team members, office culture photography, and executive portraits.",
    results: ["Successfully raised $4.2M Series A", "LinkedIn engagement up 280%", "Hired 12 top-tier engineers"],
    testimonial: "Investors commented on how professional our team looked. The photography definitely helped us close the round.",
    clientRole: "CEO & Founder",
    beforeImage: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800",
    afterImage: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800",
    metrics: [{ label: "Capital Raised", value: "$4.2M" }, { label: "LinkedIn Growth", value: "+280%" }]
  },
  {
    clientName: "Rising Hip-Hop Artist",
    industry: "Music",
    projectType: "Music Video Production",
    challenge: "Independent artist needed viral content to get label attention.",
    solution: "Cinematic music video with creative direction, professional lighting, and color grading.",
    results: ["Video reached 2.1M views in 30 days", "Signed to major label", "Spotify streams increased 400%"],
    testimonial: "That video changed my life. Label executives were calling within a week. Mayhem made me look like I already made it.",
    clientRole: "Recording Artist",
    beforeImage: "https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?w=800",
    afterImage: "/images/hiphop-artist-1.png",
    metrics: [{ label: "Views (30 days)", value: "2.1M" }, { label: "Stream Growth", value: "+400%" }]
  }
];

// Services/Pricing from ShotByMayhem
const services = [
  { name: "Portrait Session", category: "Photography", price: "$299", features: ["1 Hour Session", "1 Location", "15 Edited Photos", "Online Gallery"], popular: true, order: 1 },
  { name: "Headshots", category: "Photography", price: "$199", features: ["30 Min Session", "1 Look", "3 Retouched Photos", "High Res Files"], popular: false, order: 2 },
  { name: "Events", category: "Photography", price: "$399", features: ["2 Hours Coverage", "Unlimited Photos", "Basic Editing", "24hr Turnaround"], popular: false, order: 3 },
  { name: "Content Day", category: "Photography", price: "$999", features: ["4 Hours", "Multiple Locations", "30+ Photos", "3 Short Reels"], popular: false, order: 4 },
  { name: "Music Video", category: "Music Videos & Film", price: "$799", features: ["1 Location", "4K Quality", "Basic Editing", "Color Grading"], popular: true, order: 5 },
  { name: "Reels/Short Content", category: "Music Videos & Film", price: "$299", features: ["3 Short Videos", "Trendy Edits", "Music Sync", "Vertical Format"], popular: false, order: 6 },
  { name: "Lyric Video", category: "Music Videos & Film", price: "$299", features: ["Custom Typography", "Motion Backgrounds", "Full Song", "4K Export"], popular: false, order: 7 },
  { name: "Commercial", category: "Music Videos & Film", price: "$999", features: ["Script Assistance", "Professional Audio", "Voiceover", "Rights Included"], popular: false, order: 8 },
  { name: "Creator", category: "Memberships", price: "$397/mo", features: ["1 Photo Session/mo", "2 Reels/mo", "Priority Booking", "10% Off Add-ons"], popular: false, order: 9 },
  { name: "Artist", category: "Memberships", price: "$697/mo", features: ["1 Music Video/qtr", "2 Photo Sessions/mo", "Social Media Consult", "15% Off Add-ons"], popular: true, order: 10 },
  { name: "Brand", category: "Memberships", price: "$1,497/mo", features: ["Weekly Content", "4 Reels/mo", "Product Photos", "Strategy Call"], popular: false, order: 11 }
];

// Goddesses roster
const goddesses = [
  { name: "Divine Angel", slug: "divine-angel", title: "The Icon", image: "/images/goddesses/divine-angel.png", height: "5'9\"", location: "Atlanta, GA", specialties: ["Brand Activations", "Nightlife"], experience: "4 years", instagram: "@divine.angel", availability: "available", featured: true, bio: "Divine Angel brings magnetic presence to every event with her sophisticated charm and professional etiquette." },
  { name: "Valencia Rose", slug: "valencia-rose", title: "The Bombshell", image: "/images/goddesses/valencia-rose.png", height: "5'6\"", location: "Buckhead, GA", specialties: ["Club Hosting", "VIP Services"], experience: "5 years", instagram: "@valencia.rose", availability: "limited", featured: true, bio: "Unapologetically confident with curves that command attention. Valencia is the ultimate nightlife muse." },
  { name: "Cleo Sol", slug: "cleo-sol", title: "The Golden Hour", image: "/images/goddesses/cleo-sol.png", height: "5'8\"", location: "Atlanta, GA", specialties: ["Music Videos", "Fashion"], experience: "4 years", instagram: "@cleo.sol", availability: "available", featured: true, bio: "Radiating pure luxury and melanin magic. Cleo turns every moment into a cinematic experience." },
  { name: "Nova Sky", slug: "nova-sky", title: "The Muse", image: "/images/goddesses/nova-sky.png", height: "5'10\"", location: "Sandy Springs, GA", specialties: ["Corporate Events", "Trade Shows"], experience: "6 years", instagram: "@nova.sky", availability: "booked", featured: true, bio: "Platinum perfection with an editorial edge. Nova brings high-fashion energy to any setting." },
  { name: "Zara Ali", slug: "zara-ali", title: "The Wildcard", image: "/images/goddesses/zara-ali.png", height: "5'9\"", location: "Atlanta, GA", specialties: ["Swimwear", "Editorial"], experience: "3 years", instagram: "@zara.ali", availability: "booked", featured: true, bio: "Playful, energetic, and impossible to ignore. Zara brings a vibrant splash of color to the scene." }
];

// Testimonials from ShotByMayhem
const testimonials = [
  { name: "Marcus Johnson", role: "Hip-Hop Artist", content: "Shot by Mayhem captured my vision perfectly. The music video went viral and helped me get signed!", rating: 5, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200" },
  { name: "Taylor Greene", role: "Content Creator", content: "The monthly content package has been a game-changer for my brand. Professional quality every time.", rating: 5, image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200" },
  { name: "Diamond Events", role: "Event Company", content: "We trust Mayhem for all our event coverage. Their eye for capturing moments is unmatched.", rating: 5, image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200" }
];

async function createSites() {
  console.log('Creating sites...');
  const siteIds = {};

  for (const site of sites) {
    try {
      const res = await fetch(`${STRAPI_URL}/api/sites`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ data: site })
      });
      const data = await res.json();
      if (data.data) {
        siteIds[site.site_uid] = data.data.id;
        console.log(`  ✓ Created site: ${site.name}`);
      } else {
        console.log(`  ⚠ Site may exist: ${site.name}`, data.error?.message || '');
      }
    } catch (err) {
      console.error(`  ✗ Error creating site ${site.name}:`, err.message);
    }
  }

  return siteIds;
}

async function importArticles(siteIds) {
  console.log('\nImporting articles...');

  // Mayhemworld articles
  for (const article of mayhemArticles) {
    try {
      const res = await fetch(`${STRAPI_URL}/api/articles`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ data: { ...article, site: siteIds['mayhemworld'] } })
      });
      const data = await res.json();
      if (data.data) {
        console.log(`  ✓ Imported: ${article.title.substring(0, 50)}...`);
      } else {
        console.log(`  ⚠ Error: ${article.title.substring(0, 30)}...`, data.error?.message || '');
      }
    } catch (err) {
      console.error(`  ✗ Error:`, err.message);
    }
  }

  // ShotByMayhem articles
  for (const article of shotbymayhemArticles) {
    try {
      const res = await fetch(`${STRAPI_URL}/api/articles`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ data: { ...article, site: siteIds['shotbymayhem'] } })
      });
      const data = await res.json();
      if (data.data) {
        console.log(`  ✓ Imported: ${article.title.substring(0, 50)}...`);
      } else {
        console.log(`  ⚠ Error: ${article.title.substring(0, 30)}...`, data.error?.message || '');
      }
    } catch (err) {
      console.error(`  ✗ Error:`, err.message);
    }
  }
}

async function importCaseStudies(siteIds) {
  console.log('\nImporting case studies...');

  for (const study of caseStudies) {
    try {
      const res = await fetch(`${STRAPI_URL}/api/case-studies`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ data: { ...study, site: siteIds['shotbymayhem'] } })
      });
      const data = await res.json();
      if (data.data) {
        console.log(`  ✓ Imported: ${study.clientName}`);
      } else {
        console.log(`  ⚠ Error: ${study.clientName}`, data.error?.message || '');
      }
    } catch (err) {
      console.error(`  ✗ Error:`, err.message);
    }
  }
}

async function importServices(siteIds) {
  console.log('\nImporting services...');

  for (const service of services) {
    try {
      const res = await fetch(`${STRAPI_URL}/api/services`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ data: { ...service, site: siteIds['shotbymayhem'] } })
      });
      const data = await res.json();
      if (data.data) {
        console.log(`  ✓ Imported: ${service.name}`);
      } else {
        console.log(`  ⚠ Error: ${service.name}`, data.error?.message || '');
      }
    } catch (err) {
      console.error(`  ✗ Error:`, err.message);
    }
  }
}

async function importGoddesses(siteIds) {
  console.log('\nImporting goddesses...');

  for (const goddess of goddesses) {
    try {
      const res = await fetch(`${STRAPI_URL}/api/goddesses`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ data: { ...goddess, site: siteIds['goddesses-of-atl'] } })
      });
      const data = await res.json();
      if (data.data) {
        console.log(`  ✓ Imported: ${goddess.name}`);
      } else {
        console.log(`  ⚠ Error: ${goddess.name}`, data.error?.message || '');
      }
    } catch (err) {
      console.error(`  ✗ Error:`, err.message);
    }
  }
}

async function importTestimonials(siteIds) {
  console.log('\nImporting testimonials...');

  for (const testimonial of testimonials) {
    try {
      const res = await fetch(`${STRAPI_URL}/api/testimonials`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ data: { ...testimonial, site: siteIds['shotbymayhem'] } })
      });
      const data = await res.json();
      if (data.data) {
        console.log(`  ✓ Imported: ${testimonial.name}`);
      } else {
        console.log(`  ⚠ Error: ${testimonial.name}`, data.error?.message || '');
      }
    } catch (err) {
      console.error(`  ✗ Error:`, err.message);
    }
  }
}

async function main() {
  console.log('=== Starting Content Migration ===\n');

  const siteIds = await createSites();

  // If sites already exist, try to get their IDs
  if (Object.keys(siteIds).length === 0) {
    console.log('\nFetching existing site IDs...');
    const res = await fetch(`${STRAPI_URL}/api/sites`, { headers });
    const data = await res.json();
    if (data.data) {
      for (const site of data.data) {
        siteIds[site.attributes.site_uid] = site.id;
      }
    }
  }

  console.log('Site IDs:', siteIds);

  await importArticles(siteIds);
  await importCaseStudies(siteIds);
  await importServices(siteIds);
  await importGoddesses(siteIds);
  await importTestimonials(siteIds);

  console.log('\n=== Migration Complete ===');
}

main().catch(console.error);
