export default {
  config: {
    // Add site colors
    theme: {
      colors: {
        primary100: '#f0f0ff',
        primary200: '#d9d9ff',
        primary500: '#6366F1',
        primary600: '#5558E3',
        primary700: '#4A4DD6',
      },
    },
    // Custom site badges in list views
    translations: {
      en: {
        'app.components.LeftMenu.navbrand.title': 'Mayhem Multi-Site CMS',
        'app.components.LeftMenu.navbrand.workplace': 'Dashboard',
      },
    },
    // Customize admin panel
    tutorials: false,
    notifications: { releases: false },
  },
  register(app) {
    // Plugin registration
    // Note: Custom plugins (AI Assistant, Marketing Hub, Analytics) are accessible via API only
    // See PLUGIN_API_GUIDE.md for API endpoints
  },

  bootstrap(app) {
    console.log('Mayhem CMS Admin Loaded');

    // Add site badge colors
    const siteBadges = {
      'mayhemworld': { color: '#DC2626', name: 'Mayhemworld' },
      'shotbymayhem': { color: '#F59E0B', name: 'ShotByMayhem' },
      'goddesses-of-atl': { color: '#D4AF37', name: 'Goddesses' },
      'nexus-ai': { color: '#6366F1', name: 'Nexus AI' },
    };

    // Inject custom CSS for site badges
    const style = document.createElement('style');
    style.innerHTML = `
      /* Site badges in content manager */
      [data-site-badge]::before {
        content: attr(data-site-name);
        display: inline-block;
        padding: 2px 8px;
        margin-right: 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        background: var(--badge-color);
        color: white;
      }

      /* Mayhemworld - Red */
      [data-site="mayhemworld"]::before {
        --badge-color: #DC2626;
        content: "MAYHEM";
      }

      /* ShotByMayhem - Orange */
      [data-site="shotbymayhem"]::before {
        --badge-color: #F59E0B;
        content: "SHOT";
      }

      /* Goddesses - Gold */
      [data-site="goddesses-of-atl"]::before {
        --badge-color: #D4AF37;
        content: "GODDESSES";
      }

      /* Nexus AI - Purple */
      [data-site="nexus-ai"]::before {
        --badge-color: #6366F1;
        content: "NEXUS";
      }
    `;
    document.head.appendChild(style);
  },
};
