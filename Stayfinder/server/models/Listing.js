const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  location: String,
  images: [String],
  capacity: Number,
});

module.exports = mongoose.model("Listing", listingSchema);