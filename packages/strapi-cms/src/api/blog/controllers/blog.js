'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::blog.blog', ({ strapi }) => ({
  /**
   * Override create to auto-assign site from header
   */
  async create(ctx) {
    const site = ctx.state.site;

    if (!site) {
      return ctx.badRequest('X-Site-ID header required for creating blogs');
    }

    if (!ctx.request.body?.data) {
      return ctx.badRequest('Request body must contain data object');
    }

    // Inject site relation
    ctx.request.body.data.site = site.id;

    const response = await super.create(ctx);
    return response;
  },

  /**
   * Get featured blogs for a site
   */
  async findFeatured(ctx) {
    const site = ctx.state.site;
    const limit = parseInt(ctx.query.limit) || 5;

    if (!site) {
      return ctx.badRequest('X-Site-ID header required');
    }

    const blogs = await strapi.db.query('api::blog.blog').findMany({
      where: {
        site: site.id,
        featured: true,
        publishedAt: { $notNull: true },
      },
      populate: ['featured_image', 'author', 'categories'],
      orderBy: { publishedAt: 'desc' },
      limit,
    });

    return { data: blogs };
  },

  /**
   * Get blogs by category
   */
  async findByCategory(ctx) {
    const site = ctx.state.site;
    const { slug } = ctx.params;

    if (!site) {
      return ctx.badRequest('X-Site-ID header required');
    }

    const category = await strapi.db.query('api::category.category').findOne({
      where: { slug, site: site.id },
    });

    if (!category) {
      return ctx.notFound('Category not found');
    }

    const blogs = await strapi.db.query('api::blog.blog').findMany({
      where: {
        site: site.id,
        categories: { id: category.id },
        publishedAt: { $notNull: true },
      },
      populate: ['featured_image', 'author', 'categories'],
      orderBy: { publishedAt: 'desc' },
    });

    return { data: blogs, category };
  },

  /**
   * Get related blogs
   */
  async findRelated(ctx) {
    const site = ctx.state.site;
    const { id } = ctx.params;
    const limit = parseInt(ctx.query.limit) || 3;

    if (!site) {
      return ctx.badRequest('X-Site-ID header required');
    }

    const currentBlog = await strapi.db.query('api::blog.blog').findOne({
      where: { id, site: site.id },
      populate: ['categories', 'tags'],
    });

    if (!currentBlog) {
      return ctx.notFound('Blog not found');
    }

    const categoryIds = currentBlog.categories?.map((c) => c.id) || [];
    const tagIds = currentBlog.tags?.map((t) => t.id) || [];

    // Find blogs that share categories or tags
    const relatedBlogs = await strapi.db.query('api::blog.blog').findMany({
      where: {
        id: { $ne: currentBlog.id },
        site: site.id,
        publishedAt: { $notNull: true },
        $or: [
          { categories: { id: { $in: categoryIds } } },
          { tags: { id: { $in: tagIds } } },
        ],
      },
      populate: ['featured_image', 'categories'],
      orderBy: { publishedAt: 'desc' },
      limit,
    });

    return { data: relatedBlogs };
  },
}));
