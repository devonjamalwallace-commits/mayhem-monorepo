'use strict';

module.exports = {
  routes: [
    // ============================================
    // WorkOS Authentication
    // ============================================
    {
      method: 'GET',
      path: '/auth/workos/url',
      handler: 'integration.workosAuthUrl',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/auth/workos/callback',
      handler: 'integration.workosCallback',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/auth/workos/magic-link',
      handler: 'integration.workosMagicLink',
      config: {
        auth: false,
        policies: [],
      },
    },

    // ============================================
    // n8n Automation
    // ============================================
    {
      method: 'POST',
      path: '/integration/n8n/trigger',
      handler: 'integration.n8nTrigger',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/integration/n8n/workflows',
      handler: 'integration.n8nWorkflows',
      config: {
        policies: [],
      },
    },

    // ============================================
    // Gemini AI
    // ============================================
    {
      method: 'POST',
      path: '/integration/ai/generate',
      handler: 'integration.geminiGenerate',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/integration/ai/seo',
      handler: 'integration.geminiSEO',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/integration/ai/excerpt',
      handler: 'integration.geminiExcerpt',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/integration/ai/product-description',
      handler: 'integration.geminiProductDescription',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/integration/ai/content-ideas',
      handler: 'integration.geminiContentIdeas',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/integration/ai/analyze',
      handler: 'integration.geminiAnalyze',
      config: {
        policies: [],
      },
    },

    // ============================================
    // Notion
    // ============================================
    {
      method: 'GET',
      path: '/integration/notion/search',
      handler: 'integration.notionSearch',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/integration/notion/sync-blog',
      handler: 'integration.notionSyncBlog',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/integration/notion/import',
      handler: 'integration.notionImport',
      config: {
        policies: [],
      },
    },

    // ============================================
    // GitHub
    // ============================================
    {
      method: 'GET',
      path: '/integration/github/repos',
      handler: 'integration.githubRepos',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/integration/github/issues',
      handler: 'integration.githubCreateIssue',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/integration/github/trigger-workflow',
      handler: 'integration.githubTriggerWorkflow',
      config: {
        policies: [],
      },
    },
  ],
};
