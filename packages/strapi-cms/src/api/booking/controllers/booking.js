'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::booking.booking', ({ strapi }) => ({
  /**
   * Custom create booking with availability check
   */
  async create(ctx) {
    const { data } = ctx.request.body;

    // Check goddess availability if goddess booking
    if (data.goddess && data.event_date) {
      const isAvailable = await this.checkAvailability(
        data.goddess,
        data.event_date,
        data.event_end_date || data.event_date
      );

      if (!isAvailable) {
        return ctx.badRequest('Selected goddess is not available at this time');
      }
    }

    // Generate booking number
    data.booking_number = `BK-${Date.now()}`;

    // Create booking
    const booking = await super.create(ctx);

    // Send confirmation email via n8n
    if (process.env.N8N_WEBHOOK_URL) {
      await fetch(`${process.env.N8N_WEBHOOK_URL}/booking-confirmation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking: booking.data }),
      });
    }

    return booking;
  },

  /**
   * Check availability
   */
  async checkAvailability(goddessId, startDate, endDate) {
    const conflictingBookings = await strapi.db.query('api::booking.booking').findMany({
      where: {
        goddess: goddessId,
        status: { $in: ['pending', 'confirmed', 'in_progress'] },
        $or: [
          {
            event_date: { $gte: startDate, $lte: endDate },
          },
          {
            event_end_date: { $gte: startDate, $lte: endDate },
          },
          {
            $and: [
              { event_date: { $lte: startDate } },
              { event_end_date: { $gte: endDate } },
            ],
          },
        ],
      },
    });

    return conflictingBookings.length === 0;
  },

  /**
   * Get available slots for a goddess
   * GET /api/bookings/available-slots/:goddessId
   */
  async getAvailableSlots(ctx) {
    const { goddessId } = ctx.params;
    const { date } = ctx.query;

    if (!date) {
      return ctx.badRequest('Date parameter required');
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Get all bookings for this goddess on this day
    const bookings = await strapi.db.query('api::booking.booking').findMany({
      where: {
        goddess: goddessId,
        event_date: { $gte: startOfDay, $lte: endOfDay },
        status: { $in: ['pending', 'confirmed', 'in_progress'] },
      },
      orderBy: { event_date: 'asc' },
    });

    // Generate available slots (9 AM - 11 PM, 1-hour slots)
    const slots = [];
    for (let hour = 9; hour <= 23; hour++) {
      const slotStart = new Date(date);
      slotStart.setHours(hour, 0, 0, 0);

      const slotEnd = new Date(slotStart);
      slotEnd.setHours(hour + 1);

      const isAvailable = !bookings.some(booking => {
        const bookingStart = new Date(booking.event_date);
        const bookingEnd = booking.event_end_date
          ? new Date(booking.event_end_date)
          : new Date(bookingStart.getTime() + booking.duration_hours * 60 * 60 * 1000);

        return (
          (slotStart >= bookingStart && slotStart < bookingEnd) ||
          (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
          (slotStart <= bookingStart && slotEnd >= bookingEnd)
        );
      });

      slots.push({
        start: slotStart.toISOString(),
        end: slotEnd.toISOString(),
        available: isAvailable,
      });
    }

    return { data: slots };
  },
}));
