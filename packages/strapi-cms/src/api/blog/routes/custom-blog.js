'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/blogs/featured',
      handler: 'blog.findFeatured',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/blogs/category/:slug',
      handler: 'blog.findByCategory',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/blogs/:id/related',
      handler: 'blog.findRelated',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
