const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Listing = require('../models/Listing');

const seedData = async () => {
  try {
    await connectDB();
    console.log('Connected to DB');

    await User.deleteMany({});
    console.log('Users cleared');

    await Listing.deleteMany({});
    console.log('Listings cleared');

    const host = new User({
      name: 'Sample Host',
      email: 'host@example.com',
      password: 'password123',
      role: 'host',
    });
    await host.save();
    console.log('Host saved');

    const listings = [
      {
        title: 'Cozy Beachfront Cottage',
        description: 'A charming cottage by the sea.',
        price: 150,
        images: ['https://via.placeholder.com/300'],
        location: 'Miami, FL',
        availability: [
          { startDate: new Date('2025-07-01'), endDate: new Date('2025-12-31') },
        ],
        hostId: host._id,
      },
    ];

    await Listing.insertMany(listings);
    console.log('Seeding done...');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
