'use strict';

/**
 * WorkOS Integration Service
 * Handles authentication with WorkOS for SSO, MFA, and User Management
 */

const { WorkOS } = require('@workos-inc/node');

let workosClient = null;

function getClient() {
  if (!workosClient) {
    const apiKey = process.env.WORKOS_API_KEY;
    if (!apiKey) {
      throw new Error('WORKOS_API_KEY environment variable is required');
    }
    workosClient = new WorkOS(apiKey);
  }
  return workosClient;
}

module.exports = {
  /**
   * Get authorization URL for SSO login
   */
  getAuthorizationUrl({ provider, redirectUri, state, siteId }) {
    const workos = getClient();
    const clientId = process.env.WORKOS_CLIENT_ID;

    return workos.sso.getAuthorizationUrl({
      clientId,
      redirectUri: redirectUri || process.env.WORKOS_REDIRECT_URI,
      provider, // 'GoogleOAuth' | 'MicrosoftOAuth' | 'GitHubOAuth'
      state: JSON.stringify({ siteId, ...state }),
    });
  },

  /**
   * Exchange authorization code for user profile
   */
  async getProfileAndToken(code) {
    const workos = getClient();
    const clientId = process.env.WORKOS_CLIENT_ID;

    const { profile, accessToken } = await workos.sso.getProfileAndToken({
      code,
      clientId,
    });

    return {
      profile: {
        id: profile.id,
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        rawAttributes: profile.rawAttributes,
        idpId: profile.idpId,
        connectionId: profile.connectionId,
        connectionType: profile.connectionType,
        organizationId: profile.organizationId,
      },
      accessToken,
    };
  },

  /**
   * Create Magic Link for passwordless authentication
   */
  async createMagicLink({ email, redirectUri, siteId }) {
    const workos = getClient();

    const magicLink = await workos.passwordless.createSession({
      email,
      type: 'MagicLink',
      redirectUri: redirectUri || process.env.WORKOS_REDIRECT_URI,
      state: JSON.stringify({ siteId }),
    });

    return magicLink;
  },

  /**
   * Send Magic Link email
   */
  async sendMagicLinkEmail(sessionId) {
    const workos = getClient();
    return workos.passwordless.sendSession(sessionId);
  },

  /**
   * Verify Magic Link session
   */
  async verifyMagicLink(code) {
    const workos = getClient();
    return workos.passwordless.getSession(code);
  },

  /**
   * List organization members
   */
  async listOrganizationMembers(organizationId, options = {}) {
    const workos = getClient();

    return workos.userManagement.listUsers({
      organizationId,
      ...options,
    });
  },

  /**
   * Create or sync user in Strapi from WorkOS profile
   */
  async syncUserToStrapi(profile, siteId) {
    const existingUser = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { email: profile.email },
    });

    if (existingUser) {
      // Update existing user
      return strapi.db.query('plugin::users-permissions.user').update({
        where: { id: existingUser.id },
        data: {
          workos_id: profile.id,
          firstName: profile.firstName || existingUser.firstName,
          lastName: profile.lastName || existingUser.lastName,
          confirmed: true,
        },
      });
    }

    // Create new user
    const defaultRole = await strapi.db.query('plugin::users-permissions.role').findOne({
      where: { type: 'authenticated' },
    });

    return strapi.db.query('plugin::users-permissions.user').create({
      data: {
        username: profile.email.split('@')[0],
        email: profile.email,
        workos_id: profile.id,
        firstName: profile.firstName,
        lastName: profile.lastName,
        confirmed: true,
        role: defaultRole?.id,
        sites: siteId ? [siteId] : [],
      },
    });
  },
};
