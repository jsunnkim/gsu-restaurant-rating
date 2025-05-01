const mongoose = require('mongoose')
const ImageSchema = new mongoose.Schema({
  src: String,
  alt: String,
  author: String,
  password: String,  // ← 이 필드가 반드시 있어야 해!
  createdAt: { type: Date, default: Date.now }
})
module.exports = mongoose.model('Image', ImageSchema)