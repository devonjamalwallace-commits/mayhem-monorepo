'use strict';

/**
 * Commerce Controller
 * Handles e-commerce operations (checkout, orders, products)
 */

const stripeService = require('../../../services/stripe-commerce');

module.exports = {
  /**
   * Create checkout session
   * POST /api/commerce/checkout
   */
  async createCheckout(ctx) {
    const { line_items, customer_email, success_url, cancel_url } = ctx.request.body;
    const siteId = ctx.state.site?.id;

    if (!line_items || !customer_email) {
      return ctx.badRequest('Missing required fields');
    }

    try {
      const session = await stripeService.createCheckoutSession({
        line_items,
        customer_email,
        success_url: success_url || `${process.env.PUBLIC_URL}/checkout/success`,
        cancel_url: cancel_url || `${process.env.PUBLIC_URL}/checkout/cancel`,
        site_id: siteId,
      });

      return { sessionId: session.id, url: session.url };
    } catch (error) {
      strapi.log.error('Checkout error:', error);
      return ctx.badRequest('Failed to create checkout session');
    }
  },

  /**
   * Create subscription checkout
   * POST /api/commerce/subscribe
   */
  async createSubscription(ctx) {
    const { price_id, customer_email, success_url, cancel_url } = ctx.request.body;
    const siteId = ctx.state.site?.id;

    if (!price_id || !customer_email) {
      return ctx.badRequest('Missing required fields');
    }

    try {
      const session = await stripeService.createSubscriptionCheckout({
        price_id,
        customer_email,
        success_url: success_url || `${process.env.PUBLIC_URL}/subscribe/success`,
        cancel_url: cancel_url || `${process.env.PUBLIC_URL}/subscribe/cancel`,
        site_id: siteId,
      });

      return { sessionId: session.id, url: session.url };
    } catch (error) {
      strapi.log.error('Subscription error:', error);
      return ctx.badRequest('Failed to create subscription');
    }
  },

  /**
   * Sync product to Stripe
   * POST /api/commerce/sync-product/:id
   */
  async syncProduct(ctx) {
    const { id } = ctx.params;

    try {
      const product = await stripeService.getProduct(id);
      if (!product) {
        return ctx.notFound('Product not found');
      }

      const result = await stripeService.syncProductToStripe(product);
      return { success: true, stripe: result };
    } catch (error) {
      strapi.log.error('Product sync error:', error);
      return ctx.badRequest('Failed to sync product');
    }
  },

  /**
   * Stripe webhook handler
   * POST /api/commerce/webhook
   */
  async webhook(ctx) {
    const sig = ctx.request.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
      return ctx.badRequest('Webhook secret not configured');
    }

    try {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      const event = stripe.webhooks.constructEvent(
        ctx.request.body[Symbol.for('unparsedBody')],
        sig,
        endpointSecret
      );

      await stripeService.handleWebhook(event);
      return { received: true };
    } catch (error) {
      strapi.log.error('Webhook error:', error);
      return ctx.badRequest(`Webhook Error: ${error.message}`);
    }
  },

  /**
   * Get orders for current user
   * GET /api/commerce/my-orders
   */
  async getMyOrders(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in');
    }

    try {
      const orders = await strapi.db.query('api::order.order').findMany({
        where: { user: user.id },
        orderBy: { createdAt: 'desc' },
        limit: 50,
      });

      return { data: orders };
    } catch (error) {
      strapi.log.error('Get orders error:', error);
      return ctx.badRequest('Failed to fetch orders');
    }
  },

  /**
   * Get order by ID
   * GET /api/commerce/orders/:id
   */
  async getOrder(ctx) {
    const { id } = ctx.params;

    try {
      const order = await strapi.entityService.findOne('api::order.order', id, {
        populate: ['site'],
      });

      if (!order) {
        return ctx.notFound('Order not found');
      }

      // Check if user owns this order
      const user = ctx.state.user;
      if (user && order.user?.id !== user.id) {
        return ctx.forbidden('Access denied');
      }

      return { data: order };
    } catch (error) {
      strapi.log.error('Get order error:', error);
      return ctx.badRequest('Failed to fetch order');
    }
  },
};
