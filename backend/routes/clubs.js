import express from 'express';
import mongoose from 'mongoose';
import Club from '../models/Club.js';

const router = express.Router();

// Create a new club
router.post('/', async (req, res) => {
  try {
    const { name, icon, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Club name is required' });

    const slug = name.toLowerCase().replace(/\s+/g, '-');

    // Check if club with slug already exists
    const existing = await Club.findOne({ slug });
    if (existing) return res.status(400).json({ error: 'Club with this name already exists' });

    const { userId } = req.body; // ✅ Accept creator ID from frontend (or use auth middleware)
if (!mongoose.Types.ObjectId.isValid(userId)) {
  return res.status(400).json({ error: 'Invalid user ID' });
}

const newClub = new Club({
  name,
  slug,
  icon,
  description: description || '',
  members: [userId], // ✅ Add creator as first member
});


    await newClub.save();
    res.status(201).json(newClub);
  } catch (err) {
    console.error('Failed to create club:', err);
    res.status(500).json({ error: 'Failed to create club' });
  }
});

// Get all clubs
router.get('/', async (req, res) => {
  try {
    const clubs = await Club.find().select('name slug icon description members');
    res.json(clubs);
  } catch (err) {
    console.error('Failed to fetch clubs:', err);
    res.status(500).json({ error: 'Failed to fetch clubs' });
  }
});

// Join a club
router.post('/:clubId/join', async (req, res) => {
  try {
    const { clubId } = req.params;
    const { userId } = req.body; // In real app, get from auth middleware/session

    if (!mongoose.Types.ObjectId.isValid(clubId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid IDs provided' });
    }

    const club = await Club.findById(clubId);
    if (!club) return res.status(404).json({ error: 'Club not found' });

    if (club.members.includes(userId)) {
      return res.status(400).json({ error: 'User already a member' });
    }

    club.members.push(userId);
    await club.save();

    res.json({ message: 'Joined club successfully', club });
  } catch (err) {
    console.error('Failed to join club:', err);
    res.status(500).json({ error: 'Failed to join club' });
  }
});

// Leave a club (optional)
router.post('/:clubId/leave', async (req, res) => {
  try {
    const { clubId } = req.params;
    const { userId } = req.body; // In real app, get from auth middleware/session

    if (!mongoose.Types.ObjectId.isValid(clubId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid IDs provided' });
    }

    const club = await Club.findById(clubId);
    if (!club) return res.status(404).json({ error: 'Club not found' });

    if (!club.members.includes(userId)) {
      return res.status(400).json({ error: 'User is not a member' });
    }

    club.members = club.members.filter((id) => id.toString() !== userId);
    await club.save();

    res.json({ message: 'Left club successfully', club });
  } catch (err) {
    console.error('Failed to leave club:', err);
    res.status(500).json({ error: 'Failed to leave club' });
  }
});

// GET /api/user/:userId/clubs - get clubs the user has joined
router.get('/user/:userId/clubs', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Find clubs where userId is in members array
    const clubs = await Club.find({ members: userId }).select('name slug icon description members');
    res.json(clubs);
  } catch (err) {
    console.error('Failed to fetch user clubs:', err);
    res.status(500).json({ error: 'Failed to fetch user clubs' });
  }
});


export default router;
