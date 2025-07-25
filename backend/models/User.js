import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: 'https://placehold.co/40x40.png' },
  verified: { type: Boolean, default: false }
});

export default mongoose.model('User', userSchema);
