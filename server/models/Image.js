const mongoose = require('mongoose')

const ImageSchema = new mongoose.Schema({
  src: String,
  alt: String
})

module.exports = mongoose.model('Image', ImageSchema)