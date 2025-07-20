const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  verified: { type: Boolean, default: false },
  joinedClubs: [String],
});
module.exports = mongoose.model('User', UserSchema);
