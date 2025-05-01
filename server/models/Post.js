const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  name: String,
  address: String,
  rating: Number,
  review: String,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);