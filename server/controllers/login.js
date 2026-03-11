// controllers/login.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function login(req, res) {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // 2. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    // 3. Compare passwords using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Password is Invalid' });
    }

    // 4. Sign a JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 5. Login successful – redirect user to `/:username` and include token.
    //    For simplicity we send the token as a query parameter; the
    //    authorization middleware is updated to look there as well.
    //    A real app might use a cookie or front-end routing instead.
    return res
      .status(200)
      .json({ message: 'Login successful.', token, username: user.username, success: true });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

module.exports = { login };
