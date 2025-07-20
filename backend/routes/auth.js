import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Token from '../models/Token.js';
import crypto from 'crypto';
import { sendMail } from '../utils/mailer.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const emailLower = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: emailLower });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: emailLower, password: hashedPassword, verified: false });

    // Create verification token
    const verifyToken = crypto.randomBytes(32).toString('hex');
    await Token.create({ userId: user._id, token: verifyToken });

    // Send verification email
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${verifyToken}&id=${user._id}`;
    await sendMail({
      to: user.email,
      subject: 'Verify your email',
      html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`
    });

    res.json({ message: 'Registration successful. Please check your email to verify your account.' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Normalize input
    const emailLower = email.trim().toLowerCase();

    // Optional: Log for debugging
    // console.log("📨 Login attempt for:", emailLower);

    // Case-insensitive search
    const user = await User.findOne({
      email: { $regex: new RegExp(`^${emailLower}$`, 'i') }
    });

    if (!user) {
      // console.log("❌ No user found");
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    if (!user.verified) {
      return res.status(403).json({ error: 'Please verify your email before logging in.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      // console.log("❌ Password mismatch");
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Success
    res.json({
  user: {
    id: user._id, // 👈 Add this
    name: user.name,
    email: user.email,
    avatar: user.avatar || ''
  },
  token
});


  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Email verification
router.get('/verify-email', async (req, res) => {
  try {
    const { token, id } = req.query;
    const dbToken = await Token.findOne({ userId: id, token });
    if (!dbToken) return res.status(400).json({ error: 'Invalid or expired token' });

    await User.findByIdAndUpdate(id, { verified: true });
    await Token.deleteOne({ _id: dbToken._id });

    res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch {
    res.status(500).json({ error: 'Email verification failed' });
  }
});
// POST /verify-email (used by frontend)
router.post('/verify-email', async (req, res) => {
  try {
    const { token, id } = req.body;

    if (!token || !id) {
      return res.status(400).json({ error: 'Invalid request — token or ID missing.' });
    }

    const dbToken = await Token.findOne({ userId: id, token });
    if (!dbToken) {
      return res.status(400).json({ error: 'Invalid or expired verification token.' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.verified) {
      return res.json({ message: 'Email already verified.' });
    }

    user.verified = true;
    await user.save();
    await Token.deleteOne({ _id: dbToken._id });

    return res.json({ message: 'Email verified successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Verification failed.' });
  }
});


// Password reset request
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const emailLower = email.trim().toLowerCase();
    const user = await User.findOne({ email: emailLower });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    await Token.create({ userId: user._id, token: resetToken });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&id=${user._id}`;
    await sendMail({
      to: user.email,
      subject: 'Password Reset',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`
    });

    res.json({ message: 'Password reset email sent.' });
  } catch {
    res.status(500).json({ error: 'Failed to send password reset email' });
  }
});

// Password reset
router.post('/reset-password', async (req, res) => {
  try {
    const { token, id, password } = req.body;
    const dbToken = await Token.findOne({ userId: id, token });
    if (!dbToken) return res.status(400).json({ error: 'Invalid or expired token' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(id, { password: hashedPassword });
    await Token.deleteOne({ _id: dbToken._id });

    res.json({ message: 'Password reset successful. You can now log in.' });
  } catch {
    res.status(500).json({ error: 'Password reset failed' });
  }
});

// Auth middleware
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ name: user.name, email: user.email, avatar: user.avatar });
  } catch {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;
