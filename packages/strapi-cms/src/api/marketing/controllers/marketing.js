'use strict';

/**
 * Marketing Automation Controller
 */

module.exports = {
  /**
   * Send email
   * POST /api/marketing/send-email
   */
  async sendEmail(ctx) {
    const { to, subject, html, from, site_id } = ctx.request.body;

    try {
      const result = await strapi.service('marketing-automation').sendEmail({
        to,
        subject,
        html,
        from,
        site_id,
      });

      return ctx.send({ success: true, data: result });
    } catch (error) {
      return ctx.badRequest('Failed to send email', { error: error.message });
    }
  },

  /**
   * Send SMS
   * POST /api/marketing/send-sms
   */
  async sendSMS(ctx) {
    const { to, body, site_id } = ctx.request.body;

    try {
      const result = await strapi.service('marketing-automation').sendSMS({
        to,
        body,
        site_id,
      });

      return ctx.send({ success: true, data: result });
    } catch (error) {
      return ctx.badRequest('Failed to send SMS', { error: error.message });
    }
  },

  /**
   * Post to social media
   * POST /api/marketing/post-social
   */
  async postToSocial(ctx) {
    const { content, image, platforms, site_id } = ctx.request.body;

    try {
      const result = await strapi.service('marketing-automation').postToSocial({
        content,
        image,
        platforms,
        site_id,
      });

      return ctx.send({ success: true, data: result });
    } catch (error) {
      return ctx.badRequest('Failed to post to social media', { error: error.message });
    }
  },

  /**
   * Create campaign
   * POST /api/marketing/create-campaign
   */
  async createCampaign(ctx) {
    const { name, subject, template, recipients, site_id, schedule_date } = ctx.request.body;

    try {
      const campaign = await strapi.service('marketing-automation').createCampaign({
        name,
        subject,
        template,
        recipients,
        site_id,
        schedule_date,
      });

      return ctx.send({ success: true, data: campaign });
    } catch (error) {
      return ctx.badRequest('Failed to create campaign', { error: error.message });
    }
  },

  /**
   * Send newsletter to all subscribers
   * POST /api/marketing/send-newsletter
   */
  async sendNewsletter(ctx) {
    const { subject, content, site_id } = ctx.request.body;

    try {
      const results = await strapi.service('marketing-automation').sendNewsletter({
        subject,
        content,
        site_id,
      });

      return ctx.send({
        success: true,
        data: results,
        summary: {
          total: results.length,
          sent: results.filter(r => r.sent).length,
          failed: results.filter(r => !r.sent).length,
        }
      });
    } catch (error) {
      return ctx.badRequest('Failed to send newsletter', { error: error.message });
    }
  },

  /**
   * Send SMS campaign
   * POST /api/marketing/send-sms-campaign
   */
  async sendSMSCampaign(ctx) {
    const { message, recipients, site_id } = ctx.request.body;

    try {
      const results = await strapi.service('marketing-automation').sendSMSCampaign({
        message,
        recipients,
        site_id,
      });

      return ctx.send({
        success: true,
        data: results,
        summary: {
          total: results.length,
          sent: results.filter(r => r.sent).length,
          failed: results.filter(r => !r.sent).length,
        }
      });
    } catch (error) {
      return ctx.badRequest('Failed to send SMS campaign', { error: error.message });
    }
  },

  /**
   * Schedule social post
   * POST /api/marketing/schedule-social-post
   */
  async scheduleSocialPost(ctx) {
    const { content, image, platforms, publish_date, site_id } = ctx.request.body;

    try {
      const post = await strapi.service('marketing-automation').scheduleSocialPost({
        content,
        image,
        platforms,
        publish_date,
        site_id,
      });

      return ctx.send({ success: true, data: post });
    } catch (error) {
      return ctx.badRequest('Failed to schedule social post', { error: error.message });
    }
  },
};
