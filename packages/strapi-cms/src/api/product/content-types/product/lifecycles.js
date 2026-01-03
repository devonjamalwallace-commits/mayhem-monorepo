'use strict';

/**
 * Product lifecycle hooks
 * Auto-generates SKU, validates pricing, etc.
 */

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Validate compare_at_price is higher than price if set
    if (data.compare_at_price && data.price) {
      if (parseFloat(data.compare_at_price) <= parseFloat(data.price)) {
        throw new Error('Compare at price must be higher than price');
      }
    }

    // Set default short_description from description if not provided
    if (data.description && !data.short_description) {
      const plainText = data.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      data.short_description = plainText.substring(0, 157) + (plainText.length > 157 ? '...' : '');
    }
  },

  async beforeUpdate(event) {
    const { data } = event.params;

    // Validate compare_at_price is higher than price if set
    if (data.compare_at_price !== undefined && data.price !== undefined) {
      if (data.compare_at_price && parseFloat(data.compare_at_price) <= parseFloat(data.price)) {
        throw new Error('Compare at price must be higher than price');
      }
    }
  },

  async afterUpdate(event) {
    const { result } = event;

    // If inventory hits 0 and track_inventory is true, could trigger notifications
    if (result.track_inventory && result.inventory_quantity === 0) {
      strapi.log.info(`Product ${result.id} (${result.name}) is now out of stock`);
      // TODO: Emit event for notification system
    }
  },
};
