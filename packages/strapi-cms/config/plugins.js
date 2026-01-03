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
});
