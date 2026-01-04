module.exports = ({ env }) => ({
  // GraphQL API
  graphql: {
    enabled: true,
    config: {
      endpoint: '/graphql',
      shadowCRUD: true,
      playgroundAlways: false,
      depthLimit: 10,
      amountLimit: 100,
    },
  },

  // Cloudinary Upload Provider - CRITICAL for media storage
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_CLOUD_NAME'),
        api_key: env('CLOUDINARY_API_KEY'),
        api_secret: env('CLOUDINARY_API_SECRET'),
      },
      actionOptions: {
        upload: {
          folder: env('CLOUDINARY_FOLDER', 'mayhem'),
          resource_type: 'auto',
        },
        uploadStream: {
          folder: env('CLOUDINARY_FOLDER', 'mayhem'),
          resource_type: 'auto',
        },
        delete: {},
      },
    },
  },

  // AI Assistant Plugin
  'ai-assistant': {
    enabled: true,
    resolve: './src/plugins/ai-assistant',
  },

  // Marketing Hub Plugin
  'marketing-hub': {
    enabled: true,
    resolve: './src/plugins/marketing-hub',
  },

  // Analytics Dashboard Plugin
  'analytics-dashboard': {
    enabled: true,
    resolve: './src/plugins/analytics-dashboard',
  },
});
