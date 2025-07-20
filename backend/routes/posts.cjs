const express = require('express');
const router = express.Router();
const Post = require('../models/Post.cjs');

// GET /api/posts - return all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

module.exports = router;
