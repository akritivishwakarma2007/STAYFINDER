const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const authenticateToken = require("../middleware/auth");

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { listingId, startDate, endDate } = req.body;
    console.log("Received booking request:", req.body); // Debug
    if (!listingId || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check for overlapping bookings
    const existingBookings = await Booking.find({
      listingId,
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
      ],
    });

    if (existingBookings.length > 0) {
      return res.status(400).json({ message: "Dates are not available" });
    }

    const booking = new Booking({
      listingId,
      userId: req.user.id, // Use authenticated user ID
      startDate,
      endDate,
    });

    await booking.save();
    res.status(201).json({ message: "Booking created", booking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;