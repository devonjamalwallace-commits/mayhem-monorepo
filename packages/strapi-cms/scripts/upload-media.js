/**
 * Upload Media to Strapi
 * Uploads product images and site media to Strapi's media library
 */

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

// Base paths - use absolute paths
const HOME_DIR = process.env.HOME || process.env.USERPROFILE || '';
const MAYHEM_IO_PUBLIC = path.join(HOME_DIR, 'mayhemworld-io/public/images');
const SHOT_BY_MAYHEM_PUBLIC = path.join(HOME_DIR, 'shotbymayhem-new/public');

// Image mappings
const productImages = [
  {
    source: path.join(MAYHEM_IO_PUBLIC, 'store/hoodie-model.png'),
    name: 'hoodie-model.png',
    alt: "Atlanta's Finest Hoodie",
    folder: 'products/mayhemworld'
  },
  {
    source: path.join(MAYHEM_IO_PUBLIC, 'store/cap-model.png'),
    name: 'cap-model.png',
    alt: 'Mayhem World Fitted Cap',
    folder: 'products/mayhemworld'
  },
  {
    source: path.join(MAYHEM_IO_PUBLIC, 'store/jacket-model.png'),
    name: 'jacket-model.png',
    alt: 'Team Lead Varsity Jacket',
    folder: 'products/mayhemworld'
  },
  {
    source: path.join(MAYHEM_IO_PUBLIC, 'store/bomber-model.png'),
    name: 'bomber-model.png',
    alt: 'Legend Status Bomber',
    folder: 'products/mayhemworld'
  },
];

const siteImages = [
  {
    source: path.join(MAYHEM_IO_PUBLIC, 'mayhem-logo.png'),
    name: 'mayhem-logo.png',
    alt: 'Mayhem World Logo',
    folder: 'logos'
  },
  {
    source: path.join(MAYHEM_IO_PUBLIC, 'hero-crowd.png'),
    name: 'hero-crowd.png',
    alt: 'Nightlife Crowd',
    folder: 'hero'
  },
];

async function uploadImage(imagePath, fileName, altText, folder, strapiUrl, token) {
  if (!fs.existsSync(imagePath)) {
    console.log(`⚠️  Skipping ${fileName} - file not found`);
    return null;
  }

  const formData = new FormData();
  formData.append('files', fs.createReadStream(imagePath), fileName);
  formData.append('fileInfo', JSON.stringify({
    name: fileName,
    alternativeText: altText,
    caption: altText,
    folder: folder
  }));

  try {
    const response = await fetch(`${strapiUrl}/api/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`❌ Failed to upload ${fileName}:`, error);
      return null;
    }

    const data = await response.json();
    console.log(`✅ Uploaded: ${fileName}`);
    return data[0];
  } catch (error) {
    console.error(`❌ Error uploading ${fileName}:`, error.message);
    return null;
  }
}

async function uploadAllMedia() {
  const strapiUrl = process.env.STRAPI_URL || 'http://localhost:1337';
  const token = process.env.STRAPI_TOKEN; // Optional auth token

  console.log('🚀 Starting media upload to Strapi...\n');
  console.log(`Target: ${strapiUrl}`);
  console.log(`Base paths:`);
  console.log(`  HOME_DIR: ${HOME_DIR}`);
  console.log(`  MAYHEM_IO: ${MAYHEM_IO_PUBLIC}`);
  console.log(``);

  // Upload product images
  console.log('📦 Uploading product images...');
  let uploadedProducts = 0;
  for (const img of productImages) {
    const result = await uploadImage(
      img.source,
      img.name,
      img.alt,
      img.folder,
      strapiUrl,
      token
    );
    if (result) uploadedProducts++;
  }

  // Upload site images
  console.log('\n🖼️  Uploading site images...');
  let uploadedSite = 0;
  for (const img of siteImages) {
    const result = await uploadImage(
      img.source,
      img.name,
      img.alt,
      img.folder,
      strapiUrl,
      token
    );
    if (result) uploadedSite++;
  }

  console.log('\n✨ Upload complete!');
  console.log(`- Product images: ${uploadedProducts}/${productImages.length}`);
  console.log(`- Site images: ${uploadedSite}/${siteImages.length}`);
}

// Run if called directly
if (require.main === module) {
  uploadAllMedia()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('❌ Upload failed:', err);
      process.exit(1);
    });
}

module.exports = { uploadAllMedia };
