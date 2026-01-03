'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::tag.tag', ({ strapi }) => ({
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
}));
