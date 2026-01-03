'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/pages/navigation',
      handler: 'page.findNavigation',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/pages/slug/:slug',
      handler: 'page.findBySlug',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
