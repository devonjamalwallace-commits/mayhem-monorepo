'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::product.product', ({ strapi }) => ({
  /**
   * Override create to auto-assign site from header
   */
  async create(ctx) {
    const site = ctx.state.site;

    if (!site) {
      return ctx.badRequest('X-Site-ID header required for creating products');
    }

    // Ensure request body exists
    if (!ctx.request.body?.data) {
      return ctx.badRequest('Request body must contain data object');
    }

    // Inject site relation
    ctx.request.body.data.site = site.id;

    // Generate SKU if not provided
    if (!ctx.request.body.data.sku) {
      const prefix = site.site_uid.substring(0, 3).toUpperCase();
      const timestamp = Date.now().toString(36).toUpperCase();
      ctx.request.body.data.sku = `${prefix}-${timestamp}`;
    }

    const response = await super.create(ctx);
    return response;
  },

  /**
   * Get products by status (active, archived, etc)
   */
  async findByStatus(ctx) {
    const site = ctx.state.site;
    const { status } = ctx.params;

    if (!site) {
      return ctx.badRequest('X-Site-ID header required');
    }

    const validStatuses = ['draft', 'active', 'archived'];
    if (!validStatuses.includes(status)) {
      return ctx.badRequest(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const products = await strapi.db.query('api::product.product').findMany({
      where: {
        site: site.id,
        status,
      },
      populate: ['images', 'categories', 'tags', 'variants', 'seo'],
      orderBy: { createdAt: 'desc' },
    });

    return { data: products };
  },

  /**
   * Get featured products for a site
   */
  async findFeatured(ctx) {
    const site = ctx.state.site;

    if (!site) {
      return ctx.badRequest('X-Site-ID header required');
    }

    const products = await strapi.db.query('api::product.product').findMany({
      where: {
        site: site.id,
        featured: true,
        status: 'active',
      },
      populate: ['images', 'categories'],
      orderBy: { createdAt: 'desc' },
      limit: 10,
    });

    return { data: products };
  },

  /**
   * Sync product with Stripe
   */
  async syncWithStripe(ctx) {
    const site = ctx.state.site;
    const { id } = ctx.params;

    if (!site) {
      return ctx.badRequest('X-Site-ID header required');
    }

    const product = await strapi.db.query('api::product.product').findOne({
      where: { id, site: site.id },
    });

    if (!product) {
      return ctx.notFound('Product not found');
    }

    // TODO: Implement Stripe sync logic
    // This would connect to the store's Stripe account and sync product

    return { data: product, message: 'Stripe sync initiated' };
  },
}));
