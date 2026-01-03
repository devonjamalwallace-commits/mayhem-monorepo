'use strict';

/**
 * n8n Integration Service
 * Trigger workflows and manage automations via n8n self-hosted instance
 */

const axios = require('axios');

let n8nClient = null;

function getClient() {
  if (!n8nClient) {
    const host = process.env.N8N_HOST;
    const apiKey = process.env.N8N_API_KEY;

    if (!host || !apiKey) {
      throw new Error('N8N_HOST and N8N_API_KEY environment variables are required');
    }

    n8nClient = axios.create({
      baseURL: host,
      headers: {
        'X-N8N-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }
  return n8nClient;
}

module.exports = {
  /**
   * Trigger a webhook workflow
   */
  async triggerWebhook(webhookPath, data = {}) {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!webhookUrl) {
      throw new Error('N8N_WEBHOOK_URL environment variable is required');
    }

    const response = await axios.post(`${webhookUrl}/${webhookPath}`, data, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
    });

    return response.data;
  },

  /**
   * List all workflows
   */
  async listWorkflows() {
    const client = getClient();
    const response = await client.get('/api/v1/workflows');
    return response.data.data;
  },

  /**
   * Get workflow by ID
   */
  async getWorkflow(workflowId) {
    const client = getClient();
    const response = await client.get(`/api/v1/workflows/${workflowId}`);
    return response.data;
  },

  /**
   * Activate/Deactivate workflow
   */
  async setWorkflowActive(workflowId, active) {
    const client = getClient();
    const response = await client.patch(`/api/v1/workflows/${workflowId}`, {
      active,
    });
    return response.data;
  },

  /**
   * Execute a workflow manually
   */
  async executeWorkflow(workflowId, data = {}) {
    const client = getClient();
    const response = await client.post(`/api/v1/workflows/${workflowId}/execute`, {
      data,
    });
    return response.data;
  },

  /**
   * Get workflow executions
   */
  async getExecutions(workflowId, options = {}) {
    const client = getClient();
    const params = new URLSearchParams();

    if (workflowId) params.append('workflowId', workflowId);
    if (options.status) params.append('status', options.status);
    if (options.limit) params.append('limit', options.limit);

    const response = await client.get(`/api/v1/executions?${params.toString()}`);
    return response.data.data;
  },

  // ============================================
  // Pre-built Workflow Triggers for Strapi Events
  // ============================================

  /**
   * Trigger new order workflow
   */
  async triggerNewOrder(orderData, siteId) {
    return this.triggerWebhook('strapi/new-order', {
      ...orderData,
      siteId,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Trigger new blog published workflow
   */
  async triggerBlogPublished(blogData, siteId) {
    return this.triggerWebhook('strapi/blog-published', {
      ...blogData,
      siteId,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Trigger new user signup workflow
   */
  async triggerUserSignup(userData, siteId) {
    return this.triggerWebhook('strapi/user-signup', {
      ...userData,
      siteId,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Trigger contact form submission workflow
   */
  async triggerContactForm(formData, siteId) {
    return this.triggerWebhook('strapi/contact-form', {
      ...formData,
      siteId,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Trigger inventory low stock alert
   */
  async triggerLowStock(productData, siteId) {
    return this.triggerWebhook('strapi/low-stock', {
      ...productData,
      siteId,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Sync content to external platforms
   */
  async triggerContentSync(contentType, contentData, siteId) {
    return this.triggerWebhook('strapi/content-sync', {
      contentType,
      data: contentData,
      siteId,
      timestamp: new Date().toISOString(),
    });
  },
};
