const mongoose = require('mongoose');
require('dotenv').config();
const Member = require('./models/Member');
const Notice = require('./models/Notice');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  // Seed notices
  await Notice.deleteMany({ subdivision: 'music' });
  await Notice.insertMany([
    { title: 'Annual Fundraiser Announced', content: 'Join us for our annual charity fundraiser!', subdivision: 'music' },
    { title: 'New Equipment Arrived', content: 'We have new instruments available for practice.', subdivision: 'music' },
    { title: 'Newsletter Released', content: 'Check out the latest club newsletter.', subdivision: 'music' }
  ]);

  // Seed members
  await Member.deleteMany({ subdivision: 'music' });
  await Member.insertMany([
    { name: 'Alice', email: 'alice@example.com', joined: new Date(), subdivision: 'music' },
    { name: 'Bob', email: 'bob@example.com', joined: new Date(), subdivision: 'music' },
    { name: 'Charlie', email: 'charlie@example.com', joined: new Date(), subdivision: 'music' }
  ]);

  console.log('Database seeded!');
  mongoose.disconnect();
}

seed();
