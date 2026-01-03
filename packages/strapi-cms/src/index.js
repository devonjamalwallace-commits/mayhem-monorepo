'use strict';

module.exports = {
  register() {},
  async bootstrap({ strapi }) {
    // Auto-run content migration on first startup
    const { migrate } = require('./scripts/migrate-all-content');

    try {
      // Check if migration is needed (less than 10 articles means not fully migrated)
      const articleCount = await strapi.db.query('api::article.article').count();

      if (articleCount < 10) {
        strapi.log.info('🔄 Running automatic content migration...');
        const results = await migrate();
        strapi.log.info('✅ Content migration completed:', results);
      } else {
        strapi.log.info('✨ Content already migrated, skipping...');
      }
    } catch (error) {
      strapi.log.error('❌ Auto-migration error:', error.message);
      // Don't fail startup if migration fails
    }
  },
};
