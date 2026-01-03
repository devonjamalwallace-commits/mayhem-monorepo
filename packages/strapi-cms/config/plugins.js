module.exports = ({ env }) => ({
  // Upload - Cloudinary for high-res photography needs
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: {
          folder: env('CLOUDINARY_FOLDER', 'mayhem'),
        },
        uploadStream: {
          folder: env('CLOUDINARY_FOLDER', 'mayhem'),
        },
        delete: {},
      },
    },
  },

  // Email - SendGrid for transactional emails
  email: {
    config: {
      provider: 'sendgrid',
      providerOptions: {
        apiKey: env('SENDGRID_API_KEY'),
      },
      settings: {
        defaultFrom: env('EMAIL_DEFAULT_FROM', 'noreply@mayhemworld.io'),
        defaultReplyTo: env('EMAIL_DEFAULT_REPLY_TO', 'support@mayhemworld.io'),
      },
    },
  },

  // SEO Plugin for meta management
  seo: {
    enabled: true,
  },

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

  // Custom Analytics Dashboard
  'analytics-dashboard': {
    enabled: true,
    resolve: './src/plugins/analytics-dashboard',
  },
});
