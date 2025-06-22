const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Listing = require("./models/Listing");
const Booking = require("./models/Booking");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log("Connected to MongoDB for seeding");

    // Clear existing data
    await Listing.deleteMany({});
    await Booking.deleteMany({});
    await User.deleteMany({});

    // Seed Users
    const hashedPassword = await bcrypt.hash("password123", 10);
    const users = await User.insertMany([
      {
        name: "John Doe",
        email: "john@example.com",
        password: hashedPassword,
        role: "user",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: hashedPassword,
        role: "user",
      },
    ]);

    // Seed Listings with INR prices
    const host = users[0]; // Use John Doe as the host
    const listings = await Listing.insertMany([
      {
        title: "Cozy Apartment in Downtown",
        description: "A charming 2-bedroom apartment in the bustling heart of New York City, perfect for families or small groups. Features modern decor, a fully equipped kitchen, and stunning city views.",
        images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKuWP2F_zUovHcf-3HdM62C-lNev5rh4oEwQ&s"],
        price: 5000, // ₹5,000
        location: "Dadar",
        host: host._id,
        capacity: 4,
        
      },
      {
        title: "Luxury Penthouse in Manhattan",
        description: "An exquisite penthouse with panoramic skyline views, featuring a private rooftop terrace, marble bathrooms, and a home theater system.",
        images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAEN4Pn-VBSbBYnnBtmOMFUbvfGpPnl6VXcQ&s"],
        price: 10000, // ₹10,000
        location: "Kalyan",
        host: host._id,
        capacity: 6,
       
      },
      {
        title: "Seaside Cottage Retreat",
        description: "A quaint cottage just steps from the beach, ideal for a romantic getaway with a cozy fireplace and ocean breeze.",
        images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThozoKMxuDiLZsF82CnOQBIjFl3AHAQjO79A&s"],
        price: 3000, // ₹3,000
        location: "Navi Mumbai",
        host: host._id,
        capacity: 2,
        
      },
      {
        title: "Beachfront Villa",
        description: "A luxurious villa with direct beach access, complete with a private pool, outdoor dining area, and tropical gardens.",
        images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEUo9ew1Mjkb4Y91Cbukb9quIthaWMpIYxXw&s"],
        price: 8000, // ₹8,000
        location: "Mumbai",
        host: host._id,
        capacity: 8,
        
      },
      {
        title: "Mountain Cabin Escape",
        description: "A rustic yet comfortable cabin nestled in the Rockies, perfect for skiing or hiking, with a wood-burning stove and scenic trails nearby.",
        images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTev9dCbS4TxBIK625PIckabU7dlVHAOeBQvw&s"],
        price: 4000, // ₹4,000
        location: "Mulund",
        host: host._id,
        capacity: 4,
       
      },
      {
        title: "Urban Loft Studio",
        description: "A trendy loft in the arts district, featuring exposed brick walls, a loft bed, and a vibrant neighborhood vibe.",
        images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUF9AQNmi-kHWvpQjvX1FnLUOOlMZDq2l0oQ&s"],
        price: 2000, // ₹2,000
        location: "Dadar",
        host: host._id,
        capacity: 2,
        
      },
      {
        title: "Lakefront Chalet",
        description: "A serene chalet by the lake, offering kayaks, a private dock, and stunning sunset views for a peaceful retreat.",
        images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVx4noe_61xEkDOpPCoPqlPz_davwrMKQnAg&s"],
        price: 6000, // ₹6,000
        location: "Navi Mumbai",
        host: host._id,
        capacity: 5,
        
      },
      {
        title: "Desert Oasis Bungalow",
        description: "A stylish bungalow in the desert, with a private courtyard, stargazing deck, and proximity to national parks.",
        images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwAqJDL6hHM7sacTJmji6xpKutGkG0x3bXNg&s"],
        price: 3500, // ₹3,500
        location: "Mumbai",
        host: host._id,
        capacity: 3,
        
      },
    ]);

    // Seed Bookings
    await Booking.insertMany([
      {
        listingId: listings[0]._id.toString(),
        userId: users[0]._id.toString(),
        startDate: new Date("2025-06-25"),
        endDate: new Date("2025-06-27"),
      },
      {
        listingId: listings[3]._id.toString(), // Beachfront Villa
        userId: users[1]._id.toString(), // Jane Smith
        startDate: new Date("2025-07-01"),
        endDate: new Date("2025-07-03"),
      },
    ]);

    console.log("Database seeded successfully");
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Seeding error:", error);
    mongoose.connection.close();
  });