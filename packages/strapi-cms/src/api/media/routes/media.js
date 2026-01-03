module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/media/upload',
      handler: 'media.upload',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/media/optimize-url',
      handler: 'media.optimizeUrl',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/media/responsive-urls',
      handler: 'media.responsiveUrls',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/media/convert-webp',
      handler: 'media.convertWebP',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/media/auto-optimize',
      handler: 'media.autoOptimize',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/media/:publicId',
      handler: 'media.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/media/metadata/:publicId',
      handler: 'media.getMetadata',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/media/batch-optimize/:siteId',
      handler: 'media.batchOptimize',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/media/process-existing',
      handler: 'media.processExisting',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/media/transformations',
      handler: 'media.transformations',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/media/usage-stats',
      handler: 'media.usageStats',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
