'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::category.category', ({ strapi }) => ({
  async create(ctx) {
    const site = ctx.state.site;

    if (!site) {
      return ctx.badRequest('X-Site-ID header required');
    }

    if (!ctx.request.body?.data) {
      return ctx.badRequest('Request body must contain data object');
    }

    ctx.request.body.data.site = site.id;

    const response = await super.create(ctx);
    return response;
  },

  /**
   * Get category tree with nested children
   */
  async findTree(ctx) {
    const site = ctx.state.site;

    if (!site) {
      return ctx.badRequest('X-Site-ID header required');
    }

    const categories = await strapi.db.query('api::category.category').findMany({
      where: { site: site.id, parent: null },
      populate: {
        children: {
          populate: {
            children: true,
          },
        },
        image: true,
      },
      orderBy: { display_order: 'asc' },
    });

    return { data: categories };
  },
}));
