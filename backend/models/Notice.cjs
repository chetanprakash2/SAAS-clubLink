const mongoose = require('mongoose');
const NoticeSchema = new mongoose.Schema({
  title: String,
  content: String,
  subdivision: String,
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Notice', NoticeSchema);
