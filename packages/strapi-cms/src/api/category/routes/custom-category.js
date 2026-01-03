'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/categories/tree',
      handler: 'category.findTree',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
