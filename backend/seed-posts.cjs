const mongoose = require('mongoose');
require('dotenv').config();
const Post = require('./models/Post.cjs');

async function seedPosts() {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  await Post.deleteMany({});
  await Post.insertMany([
    {
      title: 'Welcome to the Club!',
      description: 'This is our first post. Stay tuned for updates!',
      imageUrl: 'https://images.unsplash.com/photo-1'
    },
    {
      title: 'Event Announcement',
      description: 'Join us for the annual fundraiser event.',
      imageUrl: 'https://images.unsplash.com/photo-2'
    },
    {
      title: 'New Equipment',
      description: 'We have new equipment available for club members.',
      imageUrl: 'https://images.unsplash.com/photo-3'
    }
  ]);

  console.log('Posts seeded!');
  mongoose.disconnect();
}

seedPosts();
