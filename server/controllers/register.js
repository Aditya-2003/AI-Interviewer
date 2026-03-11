// controllers/register.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 10;

async function register(req, res) {
  try {
    const { username, email, password} = req.body;

    // 1. Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required.'});
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }

    // 2. Check if user already exists or username is taken
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email is already registered.' });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ error: 'Username is already taken.' });
    } 

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // 4. Save the user to MongoDB
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // 5. Sign a JWT (use Mongo's _id as the userId)
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 6. Return success (never return the hashed password or apiKey)
    return res.status(201).json({
      message: 'User registered successfully.',
      token,
      username: newUser.username,
      success: true,
    });
  } catch (err) {
    // Mongoose duplicate key error (race condition fallback)
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Email is already registered.' });
    }
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

module.exports = { register };