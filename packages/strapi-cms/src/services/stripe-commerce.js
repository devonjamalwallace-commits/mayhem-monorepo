/**
 * Stripe E-Commerce Service
 * Handles product sync, checkout, and order processing
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = {
  /**
   * Sync product to Stripe
   */
  async syncProductToStripe(product) {
    try {
      // Create or update Stripe product
      const stripeProduct = await stripe.products.create({
        name: product.name,
        description: product.short_description || product.description?.substring(0, 500),
        images: product.images?.map(img => img.url) || [],
        metadata: {
          strapi_id: product.id,
          site_id: product.site?.id,
        },
      });

      // Create price
      const stripePrice = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: Math.round(product.price * 100), // Convert to cents
        currency: product.currency.toLowerCase(),
        metadata: {
          strapi_product_id: product.id,
        },
      });

      // Update product with Stripe IDs
      await strapi.entityService.update('api::product.product', product.id, {
        data: {
          stripe_product_id: stripeProduct.id,
          stripe_price_id: stripePrice.id,
        },
      });

      return { stripeProduct, stripePrice };
    } catch (error) {
      strapi.log.error('Stripe product sync error:', error);
      throw error;
    }
  },

  /**
   * Create checkout session
   */
  async createCheckoutSession({ line_items, customer_email, success_url, cancel_url, site_id, metadata = {} }) {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: line_items.map(item => ({
          price: item.stripe_price_id,
          quantity: item.quantity,
        })),
        mode: 'payment',
        success_url,
        cancel_url,
        customer_email,
        metadata: {
          site_id,
          ...metadata,
        },
        shipping_address_collection: {
          allowed_countries: ['US', 'CA', 'GB', 'AU'],
        },
      });

      return session;
    } catch (error) {
      strapi.log.error('Checkout session creation error:', error);
      throw error;
    }
  },

  /**
   * Create subscription checkout
   */
  async createSubscriptionCheckout({ price_id, customer_email, success_url, cancel_url, site_id }) {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{ price: price_id, quantity: 1 }],
        mode: 'subscription',
        success_url,
        cancel_url,
        customer_email,
        metadata: { site_id },
      });

      return session;
    } catch (error) {
      strapi.log.error('Subscription checkout error:', error);
      throw error;
    }
  },

  /**
   * Handle webhook events
   */
  async handleWebhook(event) {
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutCompleted(event.data.object);
          break;

        case 'payment_intent.succeeded':
          await this.handlePaymentSucceeded(event.data.object);
          break;

        case 'payment_intent.payment_failed':
          await this.handlePaymentFailed(event.data.object);
          break;

        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdate(event.data.object);
          break;

        default:
          strapi.log.info(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      strapi.log.error('Webhook handling error:', error);
      throw error;
    }
  },

  /**
   * Handle successful checkout
   */
  async handleCheckoutCompleted(session) {
    const { customer_email, amount_total, currency, metadata, payment_intent } = session;

    // Create order in Strapi
    const order = await strapi.entityService.create('api::order.order', {
      data: {
        order_number: `ORD-${Date.now()}`,
        customer_email,
        total: amount_total / 100,
        currency: currency.toUpperCase(),
        status: 'processing',
        payment_status: 'paid',
        stripe_session_id: session.id,
        stripe_payment_intent_id: payment_intent,
        site: metadata.site_id,
        line_items: session.line_items || [],
      },
    });

    // Send confirmation email via n8n
    if (process.env.N8N_WEBHOOK_URL) {
      await fetch(`${process.env.N8N_WEBHOOK_URL}/order-confirmation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order, customer_email }),
      });
    }

    return order;
  },

  /**
   * Handle payment succeeded
   */
  async handlePaymentSucceeded(paymentIntent) {
    const { id, amount, currency, metadata } = paymentIntent;

    await strapi.db.query('api::order.order').updateMany({
      where: { stripe_payment_intent_id: id },
      data: { payment_status: 'paid', status: 'processing' },
    });
  },

  /**
   * Handle payment failed
   */
  async handlePaymentFailed(paymentIntent) {
    const { id } = paymentIntent;

    await strapi.db.query('api::order.order').updateMany({
      where: { stripe_payment_intent_id: id },
      data: { payment_status: 'failed', status: 'cancelled' },
    });
  },

  /**
   * Handle subscription updates
   */
  async handleSubscriptionUpdate(subscription) {
    // Update user subscription status
    const { customer, status, current_period_end } = subscription;

    strapi.log.info(`Subscription ${status} for customer ${customer}`);
    // Add subscription management logic here
  },

  /**
   * Get product by ID with Stripe info
   */
  async getProduct(productId) {
    return await strapi.entityService.findOne('api::product.product', productId, {
      populate: ['images', 'site', 'categories'],
    });
  },

  /**
   * Create product from admin
   */
  async createProduct(productData, siteId) {
    const product = await strapi.entityService.create('api::product.product', {
      data: { ...productData, site: siteId },
    });

    // Auto-sync to Stripe if enabled
    if (process.env.AUTO_SYNC_STRIPE === 'true') {
      await this.syncProductToStripe(product);
    }

    return product;
  },
};
