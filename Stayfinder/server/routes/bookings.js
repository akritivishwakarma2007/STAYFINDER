const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const { authMiddleware, hostMiddleware } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find().populate('hostId', 'name');
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('hostId', 'name');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', authMiddleware, hostMiddleware, async (req, res) => {
  const { title, description, price, images, location, availability } = req.body;
  try {
    const listing = new Listing({
      title,
      description,
      price,
      images,
      location,
      availability,
      hostId: req.user.id,
    });
    await listing.save();
    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add PUT and DELETE routes similarly
router.put('/:id', authMiddleware, hostMiddleware, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.hostId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    Object.assign(listing, req.body);
    await listing.save();
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, hostMiddleware, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.hostId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await listing.remove();
    res.json({ message: 'Listing deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;