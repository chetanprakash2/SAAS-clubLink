import express from 'express';
import Member from '../models/Member.js';
import Notice from '../models/Notice.js';

const router = express.Router();

// Get members by subdivision
router.get('/:subdivision/members', async (req, res) => {
  try {
    const members = await Member.find({ subdivision: req.params.subdivision });
    res.json(members);
  } catch {
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// Get notices by subdivision
router.get('/:subdivision/notices', async (req, res) => {
  try {
    const notices = await Notice.find({ subdivision: req.params.subdivision });
    res.json(notices);
  } catch {
    res.status(500).json({ error: 'Failed to fetch notices' });
  }
});

export default router;
