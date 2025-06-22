const express = require("express");
const router = express.Router();
const Listing = require("../models/Listing");
const Booking = require("../models/Booking");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = require("../middleware/auth");

// ✅ GET /api/listings (with filters)
router.get("/", async (req, res) => {
  try {
    const { location, price, guests } = req.query;
    const query = {};

    if (location) query.location = new RegExp(location, "i");
    if (price) {
      const priceNum = Number(price);
      if (!isNaN(priceNum)) query.price = { $lte: priceNum };
    }
    if (guests) {
      const guestsNum = Number(guests);
      if (!isNaN(guestsNum) && guestsNum > 0) query.capacity = { $gte: guestsNum };
    }

    const listingsData = await Listing.find(query);
    res.json(listingsData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching listings", error });
  }
});

// ✅ GET /api/listings/price-distribution
router.get("/price-distribution", async (req, res) => {
  try {
    const listings = await Listing.find({}, "price");
    const prices = listings.map((l) => l.price);
    const minPrice = Math.min(...prices) || 0;
    const maxPrice = Math.max(...prices) || 1000;
    const buckets = 10;
    const step = (maxPrice - minPrice) / buckets;
    const histogram = Array(buckets).fill(0);

    prices.forEach((price) => {
      const index = Math.min(Math.floor((price - minPrice) / step), buckets - 1);
      histogram[index]++;
    });

    res.json({
      minPrice,
      maxPrice,
      histogram,
      bucketSize: step,
    });
  } catch (error) {
    console.error("Error fetching price distribution:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET /api/listings/:id
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.json(listing);
  } catch (error) {
    console.error("Error fetching listing:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET /api/listings/:id/availability
router.get("/:id/availability", async (req, res) => {
  try {
    const bookings = await Booking.find({ listingId: req.params.id });
    const bookedDates = [];
    bookings.forEach((booking) => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
        bookedDates.push(new Date(d));
      }
    });
    res.json({ bookedDates });
  } catch (error) {
    console.error("Error fetching availability:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ POST /api/bookings (corrected path)
router.post("/bookings", async (req, res) => {
  try {
    const { listingId, startDate, endDate } = req.body;
    console.log("Received booking request:", req.body); // Debug
    if (!listingId || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const booking = new Booking({ listingId, startDate, endDate, userId: "anonymous" });
    await booking.save();
    res.status(201).json({ message: "Booking created", booking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ GET /api/listings/test
router.get("/test", (req, res) => {
  res.send("Server is working");
});

module.exports = router;