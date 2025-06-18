// server/routes/bookings.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { listingId, startDate, endDate } = req.body;
    const existingBookings = await Booking.find({
      listingId,
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
      ],
    });

    if (existingBookings.length > 0) {
      return res.status(400).json({ message: 'Dates are not available' });
    }

    const booking = new Booking({
      listingId,
      userId: req.user.id,
      startDate,
      endDate,
    });

    await booking.save();
    res.status(201).json({ message: 'Booking created' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;