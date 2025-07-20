import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Member'], default: 'Member' },
  joined: { type: Date, default: Date.now },
  subdivision: { type: String, required: true }
});

export default mongoose.model('Member', memberSchema);
