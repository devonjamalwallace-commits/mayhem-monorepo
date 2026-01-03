module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/commerce/checkout',
      handler: 'commerce.createCheckout',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/commerce/subscribe',
      handler: 'commerce.createSubscription',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/commerce/sync-product/:id',
      handler: 'commerce.syncProduct',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/commerce/webhook',
      handler: 'commerce.webhook',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/commerce/my-orders',
      handler: 'commerce.getMyOrders',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/commerce/orders/:id',
      handler: 'commerce.getOrder',
      config: {
        auth: false,
      },
    },
  ],
};
