module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'change-this-secret'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'change-this-salt'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'change-this-salt'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
});
