'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::site.site', ({ strapi }) => ({
  /**
   * Get current site configuration based on X-Site-ID header
   */
  async findCurrent(ctx) {
    const site = ctx.state.site;

    if (!site) {
      return ctx.badRequest('X-Site-ID header required');
    }

    const fullSite = await strapi.db.query('api::site.site').findOne({
      where: { id: site.id },
      populate: ['logo', 'favicon', 'seo', 'analytics', 'social_links', 'email_config'],
    });

    return { data: fullSite };
  },

  /**
   * Get site with all related content counts
   */
  async findWithStats(ctx) {
    const site = ctx.state.site;

    if (!site) {
      return ctx.badRequest('X-Site-ID header required');
    }

    const [fullSite, blogCount, productCount, pageCount] = await Promise.all([
      strapi.db.query('api::site.site').findOne({
        where: { id: site.id },
        populate: ['logo', 'favicon', 'seo'],
      }),
      strapi.db.query('api::blog.blog').count({ where: { site: site.id } }),
      strapi.db.query('api::product.product').count({ where: { site: site.id } }),
      strapi.db.query('api::page.page').count({ where: { site: site.id } }),
    ]);

    return {
      data: fullSite,
      stats: {
        blogs: blogCount,
        products: productCount,
        pages: pageCount,
      },
    };
  },
}));
