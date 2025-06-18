// server/routes/listings.js
const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const Booking = require('../models/Booking');

router.get('/', async (req, res) => {
  try {
    const { location, price } = req.query;
    const query = {};
    if (location) query.location = new RegExp(location, 'i');
    if (price) query.price = { $lte: Number(price) };
    const listings = await Listing.find(query);
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/price-distribution', async (req, res) => {
  try {
    const listings = await Listing.find({}, 'price');
    const prices = listings.map(l => l.price);
    const minPrice = Math.min(...prices) || 0;
    const maxPrice = Math.max(...prices) || 1000;
    const buckets = 10;
    const step = (maxPrice - minPrice) / buckets;
    const histogram = Array(buckets).fill(0);

    prices.forEach(price => {
      const index = Math.min(Math.floor((price - minPrice) / step), buckets - 1);
      histogram[index]++;
    });

    res.json({
      minPrice,
      maxPrice,
      histogram,
      bucketSize: step
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id/availability', async (req, res) => {
  try {
    const bookings = await Booking.find({ listingId: req.params.id });
    const bookedDates = [];
    bookings.forEach(booking => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
        bookedDates.push(new Date(d));
      }
    });
    res.json({ bookedDates });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;