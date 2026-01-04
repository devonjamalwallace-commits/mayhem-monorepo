const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_TOKEN) {
  console.error('❌ STRAPI_API_TOKEN environment variable required');
  process.exit(1);
}

// Media file mappings: [source_path, site_uid, folder]
const mediaFiles = [
  // Mayhemworld images
  { site: 'mayhemworld', base: 'C:/Users/devon/mayhemworld-io/public', pattern: '**/*.{jpg,jpeg,png,gif,webp}' },
  // Nexus AI images
  { site: 'nexus-ai', base: 'C:/Users/devon/nexus-ai/public', pattern: '**/*.{jpg,jpeg,png,gif,webp}' },
  // ShotByMayhem images
  { site: 'shotbymayhem', base: 'C:/Users/devon/shotbymayhem-new/public', pattern: '**/*.{jpg,jpeg,png,gif,webp}' },
];

async function getSiteId(siteUid) {
  const response = await fetch(`${STRAPI_URL}/api/sites?filters[site_uid][$eq]=${siteUid}`, {
    headers: {
      'Authorization': `Bearer ${STRAPI_TOKEN}`,
    },
  });
  const data = await response.json();
  return data.data?.[0]?.id;
}

async function uploadFile(filePath, siteId, siteName) {
  const formData = new FormData();
  const fileStream = fs.createReadStream(filePath);
  const fileName = path.basename(filePath);

  formData.append('files', fileStream, fileName);
  formData.append('path', `${siteName}`);
  if (siteId) {
    formData.append('ref', 'api::site.site');
    formData.append('refId', siteId);
    formData.append('field', 'media');
  }

  try {
    const response = await fetch(`${STRAPI_URL}/api/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Upload failed: ${error}`);
    }

    const result = await response.json();
    return result[0];
  } catch (error) {
    console.error(`❌ Failed to upload ${fileName}:`, error.message);
    return null;
  }
}

function findImages(baseDir) {
  const images = [];

  function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        walk(filePath);
      } else if (/\.(jpg|jpeg|png|gif|webp)$/i.test(file)) {
        images.push(filePath);
      }
    }
  }

  if (fs.existsSync(baseDir)) {
    walk(baseDir);
  }

  return images;
}

async function migrateMedia() {
  console.log('🚀 Starting media migration to Cloudinary...\n');

  let totalUploaded = 0;
  let totalFailed = 0;

  for (const config of mediaFiles) {
    const baseDir = path.resolve(__dirname, config.base);
    const images = findImages(baseDir);

    if (images.length === 0) {
      console.log(`⚠️  No images found for ${config.site} in ${baseDir}`);
      continue;
    }

    console.log(`📁 Found ${images.length} images for ${config.site}`);

    const siteId = await getSiteId(config.site);
    if (!siteId) {
      console.log(`⚠️  Site ${config.site} not found in Strapi, skipping...`);
      continue;
    }

    for (const imagePath of images) {
      const fileName = path.relative(baseDir, imagePath);
      process.stdout.write(`  ⬆️  Uploading ${fileName}...`);

      const result = await uploadFile(imagePath, siteId, config.site);

      if (result) {
        console.log(` ✅ ${result.url}`);
        totalUploaded++;
      } else {
        console.log(` ❌`);
        totalFailed++;
      }

      // Rate limit: wait 100ms between uploads
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('');
  }

  console.log('\n📊 Migration Summary:');
  console.log(`   ✅ Uploaded: ${totalUploaded}`);
  console.log(`   ❌ Failed: ${totalFailed}`);
  console.log(`   📦 Total: ${totalUploaded + totalFailed}`);
  console.log('\n✨ All media is now on Cloudinary CDN!');
}

migrateMedia().catch(error => {
  console.error('💥 Migration failed:', error);
  process.exit(1);
});
