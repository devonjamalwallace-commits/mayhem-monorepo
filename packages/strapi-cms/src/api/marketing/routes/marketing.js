module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/marketing/send-email',
      handler: 'marketing.sendEmail',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/marketing/send-sms',
      handler: 'marketing.sendSMS',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/marketing/post-social',
      handler: 'marketing.postToSocial',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/marketing/create-campaign',
      handler: 'marketing.createCampaign',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/marketing/send-newsletter',
      handler: 'marketing.sendNewsletter',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/marketing/send-sms-campaign',
      handler: 'marketing.sendSMSCampaign',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/marketing/schedule-social-post',
      handler: 'marketing.scheduleSocialPost',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
