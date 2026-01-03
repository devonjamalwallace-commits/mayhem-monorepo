module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/bookings/available-slots/:goddessId',
      handler: 'booking.getAvailableSlots',
      config: {
        auth: false,
      },
    },
  ],
};
