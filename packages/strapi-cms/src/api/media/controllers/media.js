'use strict';

/**
 * Cloudinary Media Manager Controller
 */

module.exports = {
  /**
   * Upload image to Cloudinary
   * POST /api/media/upload
   */
  async upload(ctx) {
    const { file, folder, site_id, options } = ctx.request.body;

    if (!file) {
      return ctx.badRequest('File is required');
    }

    try {
      const result = await strapi.service('cloudinary-media').uploadImage({
        file,
        folder,
        site_id,
        options,
      });

      return ctx.send({ success: true, data: result });
    } catch (error) {
      return ctx.badRequest('Failed to upload image', { error: error.message });
    }
  },

  /**
   * Generate optimized URL
   * POST /api/media/optimize-url
   */
  async optimizeUrl(ctx) {
    const { publicId, options } = ctx.request.body;

    try {
      const url = strapi.service('cloudinary-media').generateOptimizedUrl(publicId, options);
      return ctx.send({ success: true, data: { url } });
    } catch (error) {
      return ctx.badRequest('Failed to generate optimized URL', { error: error.message });
    }
  },

  /**
   * Generate responsive URLs
   * POST /api/media/responsive-urls
   */
  async responsiveUrls(ctx) {
    const { publicId } = ctx.request.body;

    try {
      const urls = strapi.service('cloudinary-media').generateResponsiveUrls(publicId);
      return ctx.send({ success: true, data: urls });
    } catch (error) {
      return ctx.badRequest('Failed to generate responsive URLs', { error: error.message });
    }
  },

  /**
   * Convert to WebP
   * POST /api/media/convert-webp
   */
  async convertWebP(ctx) {
    const { publicId } = ctx.request.body;

    try {
      const result = await strapi.service('cloudinary-media').convertToWebP(publicId);
      return ctx.send({ success: true, data: result });
    } catch (error) {
      return ctx.badRequest('Failed to convert to WebP', { error: error.message });
    }
  },

  /**
   * Auto-optimize image
   * POST /api/media/auto-optimize
   */
  async autoOptimize(ctx) {
    const { publicId, options } = ctx.request.body;

    try {
      const url = await strapi.service('cloudinary-media').autoOptimize(publicId, options);
      return ctx.send({ success: true, data: { url } });
    } catch (error) {
      return ctx.badRequest('Failed to auto-optimize image', { error: error.message });
    }
  },

  /**
   * Delete image
   * DELETE /api/media/:publicId
   */
  async delete(ctx) {
    const { publicId } = ctx.params;

    try {
      const result = await strapi.service('cloudinary-media').deleteImage(publicId);
      return ctx.send({ success: true, data: result });
    } catch (error) {
      return ctx.badRequest('Failed to delete image', { error: error.message });
    }
  },

  /**
   * Get image metadata
   * GET /api/media/metadata/:publicId
   */
  async getMetadata(ctx) {
    const { publicId } = ctx.params;

    try {
      const metadata = await strapi.service('cloudinary-media').getImageMetadata(publicId);
      return ctx.send({ success: true, data: metadata });
    } catch (error) {
      return ctx.badRequest('Failed to get image metadata', { error: error.message });
    }
  },

  /**
   * Batch optimize all images for a site
   * POST /api/media/batch-optimize/:siteId
   */
  async batchOptimize(ctx) {
    const { siteId } = ctx.params;

    try {
      const results = await strapi.service('cloudinary-media').batchOptimizeSite(siteId);
      return ctx.send({ success: true, data: results });
    } catch (error) {
      return ctx.badRequest('Failed to batch optimize images', { error: error.message });
    }
  },

  /**
   * Process existing image URL
   * POST /api/media/process-existing
   */
  async processExisting(ctx) {
    const { imageUrl, site_id } = ctx.request.body;

    try {
      const result = await strapi.service('cloudinary-media').processExistingImage(imageUrl, site_id);
      return ctx.send({ success: true, data: result });
    } catch (error) {
      return ctx.badRequest('Failed to process existing image', { error: error.message });
    }
  },

  /**
   * Generate transformations
   * POST /api/media/transformations
   */
  async transformations(ctx) {
    const { publicId } = ctx.request.body;

    try {
      const transformations = strapi.service('cloudinary-media').generateTransformations(publicId);
      return ctx.send({ success: true, data: transformations });
    } catch (error) {
      return ctx.badRequest('Failed to generate transformations', { error: error.message });
    }
  },

  /**
   * Get usage stats
   * GET /api/media/usage-stats
   */
  async usageStats(ctx) {
    try {
      const stats = await strapi.service('cloudinary-media').getUsageStats();
      return ctx.send({ success: true, data: stats });
    } catch (error) {
      return ctx.badRequest('Failed to get usage stats', { error: error.message });
    }
  },
};
