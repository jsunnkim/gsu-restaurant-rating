const mongoose = require('mongoose');
const ImageSchema = new mongoose.Schema({
  src: String,
  alt: String,
  author: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Image', ImageSchema);