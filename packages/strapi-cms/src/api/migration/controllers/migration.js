'use strict';

/**
 * Migration Controller
 * Trigger content migration via API
 */

module.exports = {
  async migrateAll(ctx) {
    try {
      const { migrate } = require('../../../scripts/migrate-all-content');

      const results = await migrate();

      return ctx.send({
        success: true,
        message: 'Content migration completed successfully',
        data: results
      });
    } catch (error) {
      strapi.log.error('Migration error:', error);
      return ctx.badRequest('Migration failed', { error: error.message });
    }
  },

  async status(ctx) {
    try {
      const articles = await strapi.db.query('api::article.article').count();
      const products = await strapi.db.query('api::product.product').count();
      const caseStudies = await strapi.db.query('api::case-study.case-study').count();
      const services = await strapi.db.query('api::service.service').count();
      const goddesses = await strapi.db.query('api::goddess.goddess').count();

      return ctx.send({
        success: true,
        data: {
          articles,
          products,
          caseStudies,
          services,
          goddesses,
        }
      });
    } catch (error) {
      return ctx.badRequest('Failed to get status', { error: error.message });
    }
  }
};
