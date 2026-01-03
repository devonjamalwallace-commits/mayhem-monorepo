'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/sites/current',
      handler: 'site.findCurrent',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/sites/stats',
      handler: 'site.findWithStats',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
