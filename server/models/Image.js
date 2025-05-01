const mongoose = require('mongoose')

const ImageSchema = new mongoose.Schema({
  src: String,
  alt: String,
  author: String,
  password: String, // ✅ 사용자 입력 비밀번호 저장
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Image', ImageSchema)