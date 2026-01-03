'use strict';

/**
 * SEO Tools Controller
 */

module.exports = {
  /**
   * Generate sitemap for a site
   * GET /api/seo/sitemap/:siteId
   */
  async generateSitemap(ctx) {
    const { siteId } = ctx.params;

    try {
      const result = await strapi.service('seo-tools').generateSitemap(siteId);

      ctx.set('Content-Type', 'application/xml');
      return result.sitemap;
    } catch (error) {
      return ctx.badRequest('Failed to generate sitemap', { error: error.message });
    }
  },

  /**
   * Generate meta tags
   * POST /api/seo/meta-tags
   */
  async generateMetaTags(ctx) {
    const { contentType, contentId, siteId } = ctx.request.body;

    try {
      const content = await strapi.documents(`api::${contentType}.${contentType}`).findOne({
        documentId: contentId,
        populate: ['site'],
      });

      const site = await strapi.db.query('api::site.site').findOne({
        where: { id: siteId || content.site?.id },
      });

      const metaTags = await strapi.service('seo-tools').generateMetaTags({
        contentType,
        content,
        site,
      });

      return ctx.send({ success: true, data: metaTags });
    } catch (error) {
      return ctx.badRequest('Failed to generate meta tags', { error: error.message });
    }
  },

  /**
   * Generate structured data
   * POST /api/seo/structured-data
   */
  async generateStructuredData(ctx) {
    const { contentType, contentId, siteId } = ctx.request.body;

    try {
      const content = await strapi.documents(`api::${contentType}.${contentType}`).findOne({
        documentId: contentId,
        populate: ['site'],
      });

      const site = await strapi.db.query('api::site.site').findOne({
        where: { id: siteId || content.site?.id },
      });

      const structuredData = await strapi.service('seo-tools').generateStructuredData({
        contentType,
        content,
        site,
      });

      return ctx.send({ success: true, data: structuredData });
    } catch (error) {
      return ctx.badRequest('Failed to generate structured data', { error: error.message });
    }
  },

  /**
   * Generate social preview cards
   * POST /api/seo/social-preview
   */
  async generateSocialPreview(ctx) {
    const { contentType, contentId, siteId } = ctx.request.body;

    try {
      const content = await strapi.documents(`api::${contentType}.${contentType}`).findOne({
        documentId: contentId,
        populate: ['site'],
      });

      const site = await strapi.db.query('api::site.site').findOne({
        where: { id: siteId || content.site?.id },
      });

      const socialPreview = await strapi.service('seo-tools').generateSocialPreview({
        contentType,
        content,
        site,
      });

      return ctx.send({ success: true, data: socialPreview });
    } catch (error) {
      return ctx.badRequest('Failed to generate social preview', { error: error.message });
    }
  },

  /**
   * Auto-generate all SEO for content
   * POST /api/seo/auto-generate
   */
  async autoGenerateSEO(ctx) {
    const { contentType, contentId } = ctx.request.body;

    try {
      const seoData = await strapi.service('seo-tools').autoGenerateSEO({
        contentType,
        contentId,
      });

      const validation = strapi.service('seo-tools').validateSEO(seoData);

      return ctx.send({
        success: true,
        data: seoData,
        validation,
      });
    } catch (error) {
      return ctx.badRequest('Failed to auto-generate SEO', { error: error.message });
    }
  },

  /**
   * Validate SEO
   * POST /api/seo/validate
   */
  async validateSEO(ctx) {
    const { metaTags } = ctx.request.body;

    try {
      const validation = strapi.service('seo-tools').validateSEO(metaTags);
      return ctx.send({ success: true, data: validation });
    } catch (error) {
      return ctx.badRequest('Failed to validate SEO', { error: error.message });
    }
  },

  /**
   * Generate robots.txt
   * GET /api/seo/robots-txt/:siteId
   */
  async generateRobotsTxt(ctx) {
    const { siteId } = ctx.params;

    try {
      const robotsTxt = await strapi.service('seo-tools').generateRobotsTxt(siteId);

      ctx.set('Content-Type', 'text/plain');
      return robotsTxt;
    } catch (error) {
      return ctx.badRequest('Failed to generate robots.txt', { error: error.message });
    }
  },
};
