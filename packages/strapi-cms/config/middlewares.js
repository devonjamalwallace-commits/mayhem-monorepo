module.exports = [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'https:',
            'res.cloudinary.com', // Cloudinary CDN
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'res.cloudinary.com', // Cloudinary CDN
          ],
          'script-src': ["'self'", "'unsafe-inline'"],
          'style-src': ["'self'", "'unsafe-inline'"],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:5173',
        'https://mayhemworld.io',
        'https://www.mayhemworld.io',
        'https://shotbymayhem.com',
        'https://www.shotbymayhem.com',
        'https://goddessesofatl.com',
        'https://www.goddessesofatl.com',
        'https://*.vercel.app', // All Vercel preview/production deployments
      ],
      headers: '*',
      keepHeaderOnError: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
