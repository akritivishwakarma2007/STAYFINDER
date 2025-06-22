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
      images: ['https://a0.muscache.com/im/pictures/miso/Hosting-1166641853711758251/original/e989d39a-6f8f-41c9-ba17-087f5f05a93c.jpeg?im_w=320'],
      price: 5000,
      location: 'New York',
      host: host._id,
      capacity: 4,
    },


    {
      title: 'Beachfront Villa',
      description: 'A stunning villa by the beach.',
      images: ['https://a0.muscache.com/im/pictures/hosting/Hosting-1404733101754136415/original/b89c04df-6c66-4bc6-8fb1-8fc3fbfe366f.jpeg?im_w=320'],
      price: 2000,
      location: 'Miami',
      host: host._id,
      capacity: 6,
    },
   
     {
      title: 'flat in Pune',
      description: 'Standard Room : A cozy, budget-friendly room with all the essential amenities',
      images: ['https://via.placeholder.com/300'],
      price: 2500,
      location: 'Pune',
      host: host._id,
      capacity: 3,
    },
     {
      title: 'Apartment in Thane',
      description: 'Deluxe Room : A spacious room with upgraded comfort and stylish decor',
      images: ['2wCEAAkGBxISEBUSEhMWFRUVFRUVFRUVFRUVFRUVFRUWFxUVFRUYHSggGBolHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGC0fHR0tLS0tLS0tLS0tLS0tLS0tLSstLSstLS0rLS0tLS0tLS0tLS0tKy0rLS0tLS0tLS8tLf'],
      price: 5500,
      location: 'Thane',
      host: host._id,
      capacity: 4,
    },
     {
      title: 'Flat in Navi mumbai',
      description: 'Superior Room : An elegant room with enhanced views and premium features.',
      images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjvtsoa8lsEbiaiir9EbNdXyOwqtrVtmytT-DsJMPuRAhS_Tp9eppColwY_ELLx81gKfM&usqp=CAU'],
      price: 10000,
      location: 'Navi mumbai',
      host: host._id,
      capacity: 14,
    },
     {
      title: 'Room in Kalyan',
      description: 'Suite : A luxurious stay with separate living and sleeping areas',
      images: ['2wCEAAkGBxISEhIQEBIWEhUVFhUPEBUVFRUQDw8PFRUXFhUVFRUYHSggGBolHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OFw8PFy0dFx0tLS0tLS0tKy0tLSsrKy0tLS0tLS0tLS0rLS0rLS0tKystKy0tLSstMysrLS0tLSstK'],
      price: 9000,
      location: 'Kalyan',
      host: host._id,
      capacity: 10,
    },
     {
      title: 'Flat in mumbai',
      description: 'Family Room : A roomy setup perfect for families or group travelers.',
      images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcwOTfoawr3NGNyZAqk0jfHHFIKm8R4FRFYw&s0'],
      price: 7500,
      location: 'Mumbai',
      host: host._id,
      capacity: 6,
    },
     {
      title: 'Flat in Navi Mumbai',
      description: 'A rustic cabin in the mountains.',
      images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw-4-X3Z8qsSj8BQpRxPz1WGOgEDu9QrJwdQ&s'],
      price: 3050,
      location: 'navi Mumbai',
      host: host._id,
      capacity: 3,
    },
     {
      title: 'Luxirious room in Mumbai',
      description: 'Ocean/City View Room : A scenic room with breathtaking views.',
      images: ['https://cdn-ijnhp.nitrocdn.com/pywIAllcUPgoWDXtkiXtBgvTOSromKIg/assets/images/optimized/rev-5794eaa/www.jaypeehotels.com/blog/wp-content/uploads/2024/09/Blog-6-scaled.jpg'],
      price: 3500,
      location: 'Mumbai',
      host: host._id,
      capacity: 2,
    },
     {
      title: 'Mountain Cabin',
      description: 'Luxury Room : A top-tier room offering premium comfort and design',
      images: ['https://via.placeholder.com/300'],
      price: 8500,
      location: 'Thane',
      host: host._id,
      capacity: 9,
    },
     {
      title: 'Mountain Cabin',
      description: 'A rustic cabin in the mountains.',
      images: ['https://via.placeholder.com/300'],
      price: 6000,
      location: 'Denver',
      host: host._id,
      capacity: 5,
    },
     {
      title: 'Mountain Cabin',
      description: 'A rustic cabin in the mountains.',
      images: ['https://via.placeholder.com/300'],
      price: 9500,
      location: 'Denver',
      host: host._id,
      capacity: 10,
    },
  ];

  await Listing.insertMany(listings);
  console.log('Database seeded');
  mongoose.connection.close();
};

seedData();