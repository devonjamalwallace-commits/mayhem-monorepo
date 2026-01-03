'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::page.page', ({ strapi }) => ({
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
   * Get pages for navigation
   */
  async findNavigation(ctx) {
    const site = ctx.state.site;

    if (!site) {
      return ctx.badRequest('X-Site-ID header required');
    }

    const pages = await strapi.db.query('api::page.page').findMany({
      where: {
        site: site.id,
        show_in_navigation: true,
        publishedAt: { $notNull: true },
      },
      select: ['id', 'title', 'slug', 'page_type', 'navigation_order'],
      orderBy: { navigation_order: 'asc' },
    });

    return { data: pages };
  },

  /**
   * Find page by slug
   */
  async findBySlug(ctx) {
    const site = ctx.state.site;
    const { slug } = ctx.params;

    if (!site) {
      return ctx.badRequest('X-Site-ID header required');
    }

    const page = await strapi.db.query('api::page.page').findOne({
      where: {
        site: site.id,
        slug,
        publishedAt: { $notNull: true },
      },
      populate: ['blocks', 'featured_image', 'seo'],
    });

    if (!page) {
      return ctx.notFound('Page not found');
    }

    return { data: page };
  },
}));
