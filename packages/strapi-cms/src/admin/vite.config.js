import { mergeConfig } from 'vite';

export default (config) => {
  return mergeConfig(config, {
    resolve: {
      alias: {
        // Add plugin aliases so they can be imported properly
        '@ai-assistant': '/src/plugins/ai-assistant/admin/src',
        '@marketing-hub': '/src/plugins/marketing-hub/admin/src',
        '@analytics-dashboard': '/src/plugins/analytics-dashboard/admin/src',
      },
    },
    optimizeDeps: {
      // Tell Vite to pre-bundle plugin dependencies
      include: [
        '@strapi/design-system',
        '@strapi/icons',
      ],
    },
  });
};
