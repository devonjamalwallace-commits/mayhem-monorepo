/**
 * Cloudinary Media Manager Service
 * Image optimization, auto-resize, format conversion, CDN delivery
 */

const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = {
  /**
   * Upload image to Cloudinary
   */
  async uploadImage({ file, folder, site_id, options = {} }) {
    try {
      const result = await cloudinary.uploader.upload(file, {
        folder: folder || `site-${site_id}`,
        resource_type: 'auto',
        transformation: options.transformation || [],
        ...options,
      });

      return {
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        cloudinary_id: result.asset_id,
      };
    } catch (error) {
      strapi.log.error('Cloudinary upload error:', error);
      throw error;
    }
  },

  /**
   * Generate optimized image URL with transformations
   */
  generateOptimizedUrl(publicId, options = {}) {
    const {
      width,
      height,
      crop = 'limit',
      quality = 'auto',
      format = 'auto',
      gravity = 'auto',
      effect,
    } = options;

    const transformation = {
      quality,
      fetch_format: format,
    };

    if (width) transformation.width = width;
    if (height) transformation.height = height;
    if (crop) transformation.crop = crop;
    if (gravity) transformation.gravity = gravity;
    if (effect) transformation.effect = effect;

    return cloudinary.url(publicId, transformation);
  },

  /**
   * Generate responsive image URLs
   */
  generateResponsiveUrls(publicId) {
    const sizes = [
      { name: 'thumbnail', width: 150, height: 150, crop: 'fill' },
      { name: 'small', width: 320 },
      { name: 'medium', width: 640 },
      { name: 'large', width: 1024 },
      { name: 'xlarge', width: 1920 },
    ];

    return sizes.reduce((urls, size) => {
      urls[size.name] = this.generateOptimizedUrl(publicId, size);
      return urls;
    }, {});
  },

  /**
   * Convert image to WebP
   */
  async convertToWebP(publicId) {
    try {
      const webpUrl = cloudinary.url(publicId, {
        fetch_format: 'webp',
        quality: 'auto',
      });

      return {
        url: webpUrl,
        format: 'webp',
      };
    } catch (error) {
      strapi.log.error('WebP conversion error:', error);
      throw error;
    }
  },

  /**
   * Auto-optimize image (smart compression, format selection)
   */
  async autoOptimize(publicId, options = {}) {
    const transformations = {
      quality: 'auto:best',
      fetch_format: 'auto',
      flags: 'progressive',
    };

    if (options.width) transformations.width = options.width;
    if (options.height) transformations.height = options.height;
    if (options.crop) transformations.crop = options.crop;

    return cloudinary.url(publicId, transformations);
  },

  /**
   * Delete image from Cloudinary
   */
  async deleteImage(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      strapi.log.error('Cloudinary delete error:', error);
      throw error;
    }
  },

  /**
   * Get image metadata
   */
  async getImageMetadata(publicId) {
    try {
      const result = await cloudinary.api.resource(publicId, {
        image_metadata: true,
        colors: true,
      });

      return {
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
        created_at: result.created_at,
        colors: result.colors,
        predominant: result.predominant,
        metadata: result.image_metadata,
      };
    } catch (error) {
      strapi.log.error('Cloudinary metadata error:', error);
      throw error;
    }
  },

  /**
   * Batch optimize images for a site
   */
  async batchOptimizeSite(site_id) {
    try {
      // Get all media for this site
      const articles = await strapi.db.query('api::article.article').findMany({
        where: { site: site_id },
      });

      const caseStudies = await strapi.db.query('api::case-study.case-study').findMany({
        where: { site: site_id },
      });

      const goddesses = await strapi.db.query('api::goddess.goddess').findMany({
        where: { site: site_id },
      });

      const results = [];

      // Optimize article images
      for (const article of articles) {
        if (article.coverImage) {
          const optimized = await this.processExistingImage(article.coverImage, site_id);
          results.push({
            type: 'article',
            id: article.id,
            image: 'coverImage',
            ...optimized,
          });
        }
      }

      // Optimize case study images
      for (const study of caseStudies) {
        if (study.beforeImage) {
          const optimized = await this.processExistingImage(study.beforeImage, site_id);
          results.push({
            type: 'case-study',
            id: study.id,
            image: 'beforeImage',
            ...optimized,
          });
        }
        if (study.afterImage) {
          const optimized = await this.processExistingImage(study.afterImage, site_id);
          results.push({
            type: 'case-study',
            id: study.id,
            image: 'afterImage',
            ...optimized,
          });
        }
      }

      // Optimize goddess images
      for (const goddess of goddesses) {
        if (goddess.image) {
          const optimized = await this.processExistingImage(goddess.image, site_id);
          results.push({
            type: 'goddess',
            id: goddess.id,
            image: 'image',
            ...optimized,
          });
        }
      }

      return {
        total: results.length,
        results,
      };
    } catch (error) {
      strapi.log.error('Batch optimization error:', error);
      throw error;
    }
  },

  /**
   * Process existing image URL (fetch and upload to Cloudinary if not already there)
   */
  async processExistingImage(imageUrl, site_id) {
    // Check if already on Cloudinary
    if (imageUrl.includes('cloudinary.com')) {
      // Extract public_id from URL
      const publicId = this.extractPublicId(imageUrl);
      return {
        original: imageUrl,
        optimized: this.autoOptimize(publicId),
        responsive: this.generateResponsiveUrls(publicId),
        webp: await this.convertToWebP(publicId),
      };
    }

    // Upload to Cloudinary
    const uploaded = await this.uploadImage({
      file: imageUrl,
      site_id,
      options: {
        quality: 'auto:best',
        fetch_format: 'auto',
      },
    });

    return {
      original: imageUrl,
      cloudinary: uploaded,
      optimized: this.autoOptimize(uploaded.public_id),
      responsive: this.generateResponsiveUrls(uploaded.public_id),
      webp: await this.convertToWebP(uploaded.public_id),
    };
  },

  /**
   * Extract Cloudinary public_id from URL
   */
  extractPublicId(url) {
    const match = url.match(/\/v\d+\/(.+?)\.(jpg|png|gif|webp|jpeg)/i);
    return match ? match[1] : null;
  },

  /**
   * Generate image transformations for different use cases
   */
  generateTransformations(publicId) {
    return {
      hero: cloudinary.url(publicId, {
        width: 1920,
        height: 1080,
        crop: 'fill',
        quality: 'auto:best',
        fetch_format: 'auto',
      }),
      card: cloudinary.url(publicId, {
        width: 400,
        height: 300,
        crop: 'fill',
        quality: 'auto',
        fetch_format: 'auto',
      }),
      thumbnail: cloudinary.url(publicId, {
        width: 150,
        height: 150,
        crop: 'thumb',
        gravity: 'face',
        quality: 'auto',
        fetch_format: 'auto',
      }),
      avatar: cloudinary.url(publicId, {
        width: 200,
        height: 200,
        crop: 'fill',
        gravity: 'face',
        radius: 'max',
        quality: 'auto',
        fetch_format: 'auto',
      }),
      blur: cloudinary.url(publicId, {
        effect: 'blur:1000',
        quality: 'auto',
      }),
      grayscale: cloudinary.url(publicId, {
        effect: 'grayscale',
        quality: 'auto',
      }),
    };
  },

  /**
   * Get Cloudinary usage stats
   */
  async getUsageStats() {
    try {
      const usage = await cloudinary.api.usage();
      return {
        credits: usage.credits,
        used_percent: usage.used_percent,
        limit: usage.limit,
        transformations: usage.transformations,
        bandwidth: usage.bandwidth,
        storage: usage.storage,
      };
    } catch (error) {
      strapi.log.error('Cloudinary usage error:', error);
      throw error;
    }
  },
};
