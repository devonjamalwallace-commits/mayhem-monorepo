'use strict';

/**
 * Integration Controller
 * Exposes all integration services via API endpoints
 */

const workosService = require('../../../services/workos');
const n8nService = require('../../../services/n8n');
const geminiService = require('../../../services/gemini');
const notionService = require('../../../services/notion');
const githubService = require('../../../services/github');

module.exports = {
  // ============================================
  // WorkOS Authentication
  // ============================================

  async workosAuthUrl(ctx) {
    const { provider, redirectUri } = ctx.query;
    const siteId = ctx.state.site?.id;

    try {
      const url = workosService.getAuthorizationUrl({
        provider: provider || 'GoogleOAuth',
        redirectUri,
        siteId,
      });

      return { url };
    } catch (error) {
      strapi.log.error('WorkOS auth URL error:', error);
      return ctx.badRequest('Failed to generate auth URL');
    }
  },

  async workosCallback(ctx) {
    const { code, state } = ctx.query;

    if (!code) {
      return ctx.badRequest('Authorization code required');
    }

    try {
      const { profile, accessToken } = await workosService.getProfileAndToken(code);

      // Parse state to get siteId
      let siteId = null;
      if (state) {
        try {
          const stateData = JSON.parse(state);
          siteId = stateData.siteId;
        } catch (e) {
          // State parsing failed, continue without siteId
        }
      }

      // Sync user to Strapi
      const user = await workosService.syncUserToStrapi(profile, siteId);

      // Generate Strapi JWT
      const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: user.id,
      });

      return {
        jwt,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      };
    } catch (error) {
      strapi.log.error('WorkOS callback error:', error);
      return ctx.badRequest('Authentication failed');
    }
  },

  async workosMagicLink(ctx) {
    const { email, redirectUri } = ctx.request.body;
    const siteId = ctx.state.site?.id;

    if (!email) {
      return ctx.badRequest('Email is required');
    }

    try {
      const session = await workosService.createMagicLink({
        email,
        redirectUri,
        siteId,
      });

      await workosService.sendMagicLinkEmail(session.id);

      return { success: true, message: 'Magic link sent' };
    } catch (error) {
      strapi.log.error('WorkOS magic link error:', error);
      return ctx.badRequest('Failed to send magic link');
    }
  },

  // ============================================
  // n8n Automation
  // ============================================

  async n8nTrigger(ctx) {
    const { webhookPath, data } = ctx.request.body;
    const siteId = ctx.state.site?.site_uid;

    if (!webhookPath) {
      return ctx.badRequest('Webhook path is required');
    }

    try {
      const result = await n8nService.triggerWebhook(webhookPath, {
        ...data,
        siteId,
      });

      return { success: true, result };
    } catch (error) {
      strapi.log.error('n8n trigger error:', error);
      return ctx.badRequest('Failed to trigger workflow');
    }
  },

  async n8nWorkflows(ctx) {
    try {
      const workflows = await n8nService.listWorkflows();
      return { data: workflows };
    } catch (error) {
      strapi.log.error('n8n list workflows error:', error);
      return ctx.badRequest('Failed to list workflows');
    }
  },

  // ============================================
  // Gemini AI
  // ============================================

  async geminiGenerate(ctx) {
    const { prompt, options } = ctx.request.body;

    if (!prompt) {
      return ctx.badRequest('Prompt is required');
    }

    try {
      const text = await geminiService.generateText(prompt, options || {});
      return { text };
    } catch (error) {
      strapi.log.error('Gemini generate error:', error);
      return ctx.badRequest('Failed to generate text');
    }
  },

  async geminiSEO(ctx) {
    const { title, content, contentType, siteContext } = ctx.request.body;

    if (!title || !content) {
      return ctx.badRequest('Title and content are required');
    }

    try {
      const seo = await geminiService.generateSEO({
        title,
        content,
        contentType,
        siteContext,
      });

      return { seo };
    } catch (error) {
      strapi.log.error('Gemini SEO error:', error);
      return ctx.badRequest('Failed to generate SEO');
    }
  },

  async geminiExcerpt(ctx) {
    const { content, maxLength } = ctx.request.body;

    if (!content) {
      return ctx.badRequest('Content is required');
    }

    try {
      const excerpt = await geminiService.generateExcerpt(content, maxLength);
      return { excerpt };
    } catch (error) {
      strapi.log.error('Gemini excerpt error:', error);
      return ctx.badRequest('Failed to generate excerpt');
    }
  },

  async geminiProductDescription(ctx) {
    const { name, category, features, targetAudience } = ctx.request.body;

    if (!name) {
      return ctx.badRequest('Product name is required');
    }

    try {
      const description = await geminiService.generateProductDescription({
        name,
        category,
        features,
        targetAudience,
      });

      return { description };
    } catch (error) {
      strapi.log.error('Gemini product description error:', error);
      return ctx.badRequest('Failed to generate description');
    }
  },

  async geminiContentIdeas(ctx) {
    const { topic, contentType, count, siteContext } = ctx.request.body;

    if (!topic) {
      return ctx.badRequest('Topic is required');
    }

    try {
      const ideas = await geminiService.generateContentIdeas({
        topic,
        contentType: contentType || 'blog',
        count: count || 5,
        siteContext,
      });

      return { ideas };
    } catch (error) {
      strapi.log.error('Gemini content ideas error:', error);
      return ctx.badRequest('Failed to generate ideas');
    }
  },

  async geminiAnalyze(ctx) {
    const { content } = ctx.request.body;

    if (!content) {
      return ctx.badRequest('Content is required');
    }

    try {
      const analysis = await geminiService.analyzeContent(content);
      return { analysis };
    } catch (error) {
      strapi.log.error('Gemini analyze error:', error);
      return ctx.badRequest('Failed to analyze content');
    }
  },

  // ============================================
  // Notion
  // ============================================

  async notionSearch(ctx) {
    const { query, pageSize } = ctx.query;

    try {
      const results = await notionService.search(query, { pageSize: parseInt(pageSize) || 10 });
      return { data: results };
    } catch (error) {
      strapi.log.error('Notion search error:', error);
      return ctx.badRequest('Failed to search Notion');
    }
  },

  async notionSyncBlog(ctx) {
    const { blogId, databaseId } = ctx.request.body;

    if (!blogId || !databaseId) {
      return ctx.badRequest('Blog ID and database ID are required');
    }

    try {
      const blog = await strapi.db.query('api::blog.blog').findOne({
        where: { id: blogId },
        populate: ['categories', 'tags'],
      });

      if (!blog) {
        return ctx.notFound('Blog not found');
      }

      const result = await notionService.syncBlogToNotion(blog, databaseId);
      return { success: true, notionPage: result };
    } catch (error) {
      strapi.log.error('Notion sync blog error:', error);
      return ctx.badRequest('Failed to sync blog to Notion');
    }
  },

  async notionImport(ctx) {
    const { pageId } = ctx.request.body;
    const siteId = ctx.state.site?.id;

    if (!pageId) {
      return ctx.badRequest('Notion page ID is required');
    }

    if (!siteId) {
      return ctx.badRequest('X-Site-ID header required');
    }

    try {
      const blog = await notionService.importNotionPageAsBlog(pageId, siteId);
      return { success: true, blog };
    } catch (error) {
      strapi.log.error('Notion import error:', error);
      return ctx.badRequest('Failed to import from Notion');
    }
  },

  // ============================================
  // GitHub
  // ============================================

  async githubRepos(ctx) {
    try {
      const repos = await githubService.listRepositories();
      return { data: repos };
    } catch (error) {
      strapi.log.error('GitHub repos error:', error);
      return ctx.badRequest('Failed to list repositories');
    }
  },

  async githubCreateIssue(ctx) {
    const { owner, repo, title, body, labels } = ctx.request.body;

    if (!owner || !repo || !title) {
      return ctx.badRequest('Owner, repo, and title are required');
    }

    try {
      const issue = await githubService.createIssue(owner, repo, {
        title,
        body,
        labels,
      });

      return { success: true, issue };
    } catch (error) {
      strapi.log.error('GitHub create issue error:', error);
      return ctx.badRequest('Failed to create issue');
    }
  },

  async githubTriggerWorkflow(ctx) {
    const { owner, repo, workflowId, ref, inputs } = ctx.request.body;

    if (!owner || !repo || !workflowId) {
      return ctx.badRequest('Owner, repo, and workflow ID are required');
    }

    try {
      await githubService.triggerWorkflow(owner, repo, workflowId, ref, inputs);
      return { success: true, message: 'Workflow triggered' };
    } catch (error) {
      strapi.log.error('GitHub trigger workflow error:', error);
      return ctx.badRequest('Failed to trigger workflow');
    }
  },
};
