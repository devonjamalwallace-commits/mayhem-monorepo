/**
 * Marketing Automation Service
 * Email, SMS, and Social Media automation
 */

const fetch = require('node-fetch');
const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

module.exports = {
  /**
   * Send email via Resend/SendGrid
   */
  async sendEmail({ to, subject, html, from, site_id }) {
    const provider = process.env.EMAIL_PROVIDER || 'resend';

    try {
      if (provider === 'resend') {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: from || process.env.EMAIL_FROM_ADDRESS,
            to: Array.isArray(to) ? to : [to],
            subject,
            html,
          }),
        });

        return await response.json();
      }

      // SendGrid implementation
      if (provider === 'sendgrid') {
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        return await sgMail.send({
          to,
          from: from || process.env.EMAIL_FROM_ADDRESS,
          subject,
          html,
        });
      }
    } catch (error) {
      strapi.log.error('Email sending error:', error);
      throw error;
    }
  },

  /**
   * Send SMS via Twilio
   */
  async sendSMS({ to, body, site_id }) {
    try {
      const message = await twilio.messages.create({
        body,
        from: process.env.TWILIO_PHONE_NUMBER,
        to,
      });

      strapi.log.info(`SMS sent: ${message.sid}`);
      return message;
    } catch (error) {
      strapi.log.error('SMS sending error:', error);
      throw error;
    }
  },

  /**
   * Post to social media via n8n
   */
  async postToSocial({ content, image, platforms, site_id }) {
    const n8nUrl = process.env.N8N_WEBHOOK_URL;

    if (!n8nUrl) {
      throw new Error('n8n webhook URL not configured');
    }

    try {
      const response = await fetch(`${n8nUrl}/social-media-post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          image,
          platforms, // ['instagram', 'twitter', 'facebook']
          site_id,
          timestamp: new Date().toISOString(),
        }),
      });

      return await response.json();
    } catch (error) {
      strapi.log.error('Social media posting error:', error);
      throw error;
    }
  },

  /**
   * Create email campaign
   */
  async createCampaign({ name, subject, template, recipients, site_id, schedule_date }) {
    const campaign = await strapi.documents('api::campaign.campaign').create({
      data: {
        name,
        subject,
        template,
        recipient_count: recipients.length,
        status: schedule_date ? 'scheduled' : 'draft',
        schedule_date,
        site: site_id,
      },
    });

    // If scheduled, trigger via n8n
    if (schedule_date && process.env.N8N_WEBHOOK_URL) {
      await fetch(`${process.env.N8N_WEBHOOK_URL}/schedule-campaign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign_id: campaign.id,
          schedule_date,
          recipients,
        }),
      });
    }

    return campaign;
  },

  /**
   * Send newsletter to subscribers
   */
  async sendNewsletter({ subject, content, site_id }) {
    // Get all subscribers for this site
    const subscribers = await strapi.db.query('api::subscriber.subscriber').findMany({
      where: { site: site_id, status: 'subscribed' },
    });

    const results = [];

    for (const subscriber of subscribers) {
      try {
        await this.sendEmail({
          to: subscriber.email,
          subject,
          html: content,
          site_id,
        });

        results.push({ email: subscriber.email, sent: true });
      } catch (error) {
        strapi.log.error(`Failed to send to ${subscriber.email}:`, error);
        results.push({ email: subscriber.email, sent: false, error: error.message });
      }
    }

    return results;
  },

  /**
   * Send SMS campaign
   */
  async sendSMSCampaign({ message, recipients, site_id }) {
    const results = [];

    for (const phone of recipients) {
      try {
        await this.sendSMS({ to: phone, body: message, site_id });
        results.push({ phone, sent: true });
      } catch (error) {
        strapi.log.error(`Failed to send SMS to ${phone}:`, error);
        results.push({ phone, sent: false, error: error.message });
      }
    }

    return results;
  },

  /**
   * Schedule social media posts
   */
  async scheduleSocialPost({ content, image, platforms, publish_date, site_id }) {
    const post = await strapi.documents('api::social-post.social-post').create({
      data: {
        content,
        image,
        platforms,
        publish_date,
        status: 'scheduled',
        site: site_id,
      },
    });

    // Trigger n8n workflow for scheduling
    if (process.env.N8N_WEBHOOK_URL) {
      await fetch(`${process.env.N8N_WEBHOOK_URL}/schedule-social-post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: post.id, publish_date }),
      });
    }

    return post;
  },

  /**
   * Auto-post new blog article to social media
   */
  async autoPostArticle(article) {
    const excerpt = article.excerpt || article.content?.substring(0, 250);
    const url = `${article.site.domain}/blog/${article.slug}`;

    await this.postToSocial({
      content: `${article.title}\n\n${excerpt}...\n\nRead more: ${url}`,
      image: article.coverImage,
      platforms: ['twitter', 'facebook', 'linkedin'],
      site_id: article.site.id,
    });
  },

  /**
   * Send booking confirmation
   */
  async sendBookingConfirmation(booking) {
    const { customer_email, customer_name, event_date, booking_number } = booking;

    const html = `
      <h1>Booking Confirmed!</h1>
      <p>Hi ${customer_name},</p>
      <p>Your booking has been confirmed.</p>
      <p><strong>Booking #:</strong> ${booking_number}</p>
      <p><strong>Date:</strong> ${new Date(event_date).toLocaleString()}</p>
      <p>We'll send you a reminder 24 hours before your appointment.</p>
    `;

    await this.sendEmail({
      to: customer_email,
      subject: `Booking Confirmed - ${booking_number}`,
      html,
      site_id: booking.site.id,
    });

    // Also send SMS if phone provided
    if (booking.customer_phone) {
      await this.sendSMS({
        to: booking.customer_phone,
        body: `Your booking ${booking_number} is confirmed for ${new Date(event_date).toLocaleDateString()}. See you then!`,
        site_id: booking.site.id,
      });
    }
  },

  /**
   * Send order confirmation
   */
  async sendOrderConfirmation(order) {
    const { customer_email, order_number, total, currency } = order;

    const html = `
      <h1>Order Received!</h1>
      <p>Thank you for your order.</p>
      <p><strong>Order #:</strong> ${order_number}</p>
      <p><strong>Total:</strong> ${currency} ${total}</p>
      <p>We'll send you tracking information once your order ships.</p>
    `;

    await this.sendEmail({
      to: customer_email,
      subject: `Order Confirmation - ${order_number}`,
      html,
      site_id: order.site.id,
    });
  },
};
