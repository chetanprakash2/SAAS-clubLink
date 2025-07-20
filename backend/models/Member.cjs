const mongoose = require('mongoose');
const MemberSchema = new mongoose.Schema({
  name: String,
  email: String,
  joined: Date,
  subdivision: String,
});
module.exports = mongoose.model('Member', MemberSchema);
