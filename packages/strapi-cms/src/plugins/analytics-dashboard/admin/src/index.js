import { prefixPluginTranslations } from '@strapi/helper-plugin';
import pluginPkg from '../../package.json';
import PluginIcon from './components/PluginIcon';

const pluginId = 'analytics-dashboard';
const name = pluginPkg.strapi.name;

export default {
  register(app) {
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: 'Analytics Dashboard',
      },
      Component: async () => {
        const component = await import('./pages/App');
        return component;
      },
      permissions: [],
    });

    app.registerPlugin({
      id: pluginId,
      initializer: () => null,
      isReady: true,
      name,
    });
  },

  bootstrap() {},

  async registerTrads({ locales }) {
    return Promise.resolve([]);
  },
};
