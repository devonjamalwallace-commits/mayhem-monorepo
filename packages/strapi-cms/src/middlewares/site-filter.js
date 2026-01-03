'use strict';

/**
 * Site Filter Middleware
 * Automatically filters all API requests by X-Site-ID header
 *
 * IMPROVED: Proper URL parsing that handles query strings
 * IMPROVED: Better error handling with detailed logging
 * IMPROVED: Caching of site lookups to reduce DB queries
 */

// Simple in-memory cache for site lookups (5 minute TTL)
const siteCache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

function getCachedSite(siteUid) {
  const cached = siteCache.get(siteUid);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.site;
  }
  siteCache.delete(siteUid);
  return null;
}

function setCachedSite(siteUid, site) {
  siteCache.set(siteUid, { site, timestamp: Date.now() });
}

module.exports = (config, { strapi }) => {
  // Content types that should be filtered by site
  const contentTypesWithSite = new Set([
    'blogs',
    'products',
    'pages',
    'categories',
    'tags',
  ]);

  return async (ctx, next) => {
    const siteId = ctx.request.headers['x-site-id'];

    // Parse URL properly - remove query string before analyzing path
    const urlPath = ctx.request.url.split('?')[0];

    // Skip middleware for non-API routes
    if (
      urlPath.startsWith('/admin') ||
      urlPath.startsWith('/_health') ||
      urlPath.startsWith('/uploads') ||
      urlPath.startsWith('/graphql') ||
      !urlPath.startsWith('/api')
    ) {
      return await next();
    }

    // If X-Site-ID header is present, add site filter to query
    if (siteId) {
      try {
        // Check cache first
        let site = getCachedSite(siteId);

        if (!site) {
          // Find the site by site_uid
          site = await strapi.db.query('api::site.site').findOne({
            where: { site_uid: siteId, status: 'active' },
          });

          if (site) {
            setCachedSite(siteId, site);
          }
        }

        if (!site) {
          strapi.log.warn(`Invalid site identifier requested: ${siteId}`);
          return ctx.badRequest('Invalid or inactive site identifier');
        }

        // Store site in context for use in controllers and policies
        ctx.state.site = site;
        ctx.state.siteId = site.id;

        // Extract content type from URL path
        // /api/products -> products
        // /api/products/123 -> products
        // /api/products/slug/my-product -> products
        const pathParts = urlPath.split('/').filter(Boolean);
        const contentType = pathParts[1]; // ['api', 'products', ...] -> 'products'

        if (contentType && contentTypesWithSite.has(contentType)) {
          // Initialize query object if not exists
          if (!ctx.request.query) {
            ctx.request.query = {};
          }

          // Parse existing filters (could be string or object)
          let existingFilters = ctx.request.query.filters || {};

          if (typeof existingFilters === 'string') {
            try {
              existingFilters = JSON.parse(existingFilters);
            } catch (e) {
              existingFilters = {};
            }
          }

          // Merge site filter with existing filters
          ctx.request.query.filters = {
            ...existingFilters,
            site: {
              id: { $eq: site.id },
            },
          };
        }

        await next();
      } catch (error) {
        strapi.log.error('Site filter middleware error:', error);
        return ctx.internalServerError('Error processing site filter');
      }
    } else {
      // No site header
      if (config.requireSiteId) {
        return ctx.badRequest('X-Site-ID header is required');
      }

      // Store null to indicate no site filter
      ctx.state.site = null;
      ctx.state.siteId = null;

      await next();
    }
  };
};
