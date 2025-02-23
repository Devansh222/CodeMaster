// index.js

// 1) Bcrypt fallback to avoid randomBytes error
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
bcrypt.setRandomFallback(crypto.randomBytes);

// 2) Basic imports
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 3) Load .env config
dotenv.config();

// 4) Connect to MongoDB
const connectDB = require('./config/db');
connectDB();

// 5) Create Express app
const app = express();

// 6) Configure CORS to allow your frontend
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// 7) Parse JSON bodies
app.use(express.json());

// 8) Mount routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/questions', require('./routes/question'));
app.use('/api/users', require('./routes/user'));
app.use('/api/admin', require('./routes/admin'));


// 9) Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
