// server/server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const listingsRouter = require('./routes/listings');
const bookingsRouter = require('./routes/bookings');
const usersRouter = require('./routes/users');

const app = express();

connectDB();

app.use(cors({ origin: ['http://localhost:5173', 'https://stayfinder.vercel.app'], credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/listings', listingsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/users', usersRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));