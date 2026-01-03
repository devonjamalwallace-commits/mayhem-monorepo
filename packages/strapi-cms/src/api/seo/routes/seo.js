module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/seo/sitemap/:siteId',
      handler: 'seo.generateSitemap',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/seo/meta-tags',
      handler: 'seo.generateMetaTags',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/seo/structured-data',
      handler: 'seo.generateStructuredData',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/seo/social-preview',
      handler: 'seo.generateSocialPreview',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/seo/auto-generate',
      handler: 'seo.autoGenerateSEO',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/seo/validate',
      handler: 'seo.validateSEO',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/seo/robots-txt/:siteId',
      handler: 'seo.generateRobotsTxt',
      config: {
        auth: false,
      },
    },
  ],
};
