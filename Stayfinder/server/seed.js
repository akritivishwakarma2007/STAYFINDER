// server/seed.js
const mongoose = require('mongoose');
const Listing = require('./models/Listing');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
require('dotenv').config();

const seedData = async () => {
  await connectDB();

  await Listing.deleteMany({});
  await User.deleteMany({});

  const host = new User({
    name: 'Host User',
    email: 'host@example.com',
    password: await bcrypt.hash('password', 10),
    role: 'host',
  });
  await host.save();

  const listings = [
    {
      title: 'Cozy Apartment in Downtown',
      description: 'A cozy apartment in the heart of the city.',
      images: ['https://via.placeholder.com/300'],
      price: 100,
      location: 'New York',
      host: host._id,
    },
    {
      title: 'Beachfront Villa',
      description: 'A stunning villa by the beach.',
      images: ['https://via.placeholder.com/300'],
      price: 200,
      location: 'Miami',
      host: host._id,
    },
    {
      title: 'Mountain Cabin',
      description: 'A rustic cabin in the mountains.',
      images: ['https://via.placeholder.com/300'],
      price: 150,
      location: 'Denver',
      host: host._id,
    },
  ];

  await Listing.insertMany(listings);
  console.log('Database seeded');
  mongoose.connection.close();
};

seedData();