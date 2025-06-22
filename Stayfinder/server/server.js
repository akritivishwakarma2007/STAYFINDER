const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const listingsRouter = require("./routes/listings");
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const bookingsRouter = require("./routes/bookings");

dotenv.config();

const app = express();

// Middleware
// app.use(cors());
app.use(cors({
  origin: 'https://assignment2-six-beta.vercel.app',
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/listings", listingsRouter);
app.use("/api/bookings", bookingsRouter);

const PORT = process.env.PORT || 5000;


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });