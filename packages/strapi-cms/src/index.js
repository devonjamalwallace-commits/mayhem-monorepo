'use strict';

module.exports = {
  register() {},
  async bootstrap({ strapi }) {
    // Auto-run content migration on first startup
    const { migrate } = require('./scripts/migrate-all-content');

    try {
      // Set global.strapi for migration script
      global.strapi = strapi;

      // Check if migration is needed (less than 10 articles means not fully migrated)
      const articleCount = await strapi.db.query('api::article.article').count();

      strapi.log.info(`📊 Current article count: ${articleCount}`);

      if (articleCount < 10) {
        strapi.log.info('🔄 Running automatic content migration...');
        const results = await migrate();
        strapi.log.info(`✅ Content migration completed: ${JSON.stringify(results)}`);
      } else {
        strapi.log.info('✨ Content already migrated, skipping...');
      }
    } catch (error) {
      strapi.log.error('❌ Auto-migration error:', error);
      strapi.log.error(error.stack);
      // Don't fail startup if migration fails
    }
  },
};
