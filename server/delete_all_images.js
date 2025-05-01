require('dotenv').config();
const mongoose = require('mongoose');

const Image = mongoose.model('Image', new mongoose.Schema({
  src: String,
  alt: String
}));

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const result = await Image.deleteMany({});
    console.log(`🧹 Deleted ${result.deletedCount} images`);
    mongoose.disconnect();
  })
  .catch(err => console.error(err));