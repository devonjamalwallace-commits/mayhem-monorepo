module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/migration/run',
      handler: 'migration.migrateAll',
      config: {
        policies: [],
        middlewares: [],
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/migration/run',
      handler: 'migration.migrateAll',
      config: {
        policies: [],
        middlewares: [],
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/migration/status',
      handler: 'migration.status',
      config: {
        auth: false,
      },
    },
  ],
};
