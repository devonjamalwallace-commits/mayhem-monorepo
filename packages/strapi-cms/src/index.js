'use strict';

const { seed } = require('../scripts/seed');

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   */
  register(/* { strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   */
  async bootstrap({ strapi }) {
    // Check if we should run seed (only on first boot)
    const siteCount = await strapi.db.query('api::site.site').count();

    if (siteCount === 0) {
      console.log('No sites found, running seed...');
      await seed(strapi);
    }
  },
};
