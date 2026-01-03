'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/products/status/:status',
      handler: 'product.findByStatus',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/products/featured',
      handler: 'product.findFeatured',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/products/:id/sync-stripe',
      handler: 'product.syncWithStripe',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
