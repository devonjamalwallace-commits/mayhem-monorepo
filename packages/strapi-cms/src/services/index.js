'use strict';

/**
 * Central services export
 * All integrations accessible via strapi.service('api::integration.*')
 */

module.exports = {
  workos: require('./workos'),
  n8n: require('./n8n'),
  gemini: require('./gemini'),
  notion: require('./notion'),
  github: require('./github'),
};
