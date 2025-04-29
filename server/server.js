require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// === Mongoose Models ===
const Image = require('./models/Image');

const RestaurantSchema = new mongoose.Schema({
  name: String,
  address: String,
  rating: Number,
  review: String
});
const Restaurant = mongoose.model('Restaurant', RestaurantSchema);

const app = express();
const PORT = process.env.PORT || 5000;

// === Middleware ===
app.use(cors());
app.use(express.json());

// === MongoDB Connection ===
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
}
connectDB();

// === Cloudinary Setup ===
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'gsu_gallery',
    allowed_formats: ['jpg', 'jpeg', 'png']
  }
});
const upload = multer({ storage });

// === Routes ===

// Health Check
app.get('/', (req, res) => {
  res.send('🚀 GSU Restaurant Rating Backend is running!');
});

// Upload Image
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    const newImage = new Image({
      src: req.file.path,
      alt: req.body.alt
    });
    await newImage.save();
    res.status(201).json(newImage);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// Fetch Gallery
app.get('/api/gallery', async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: 'Error fetching gallery' });
  }
});

// Delete Image
app.delete('/api/gallery/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });

    const publicId = image.src.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`gsu_gallery/${publicId}`);
    await image.deleteOne();
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Failed to delete image' });
  }
});

// Submit Restaurant
app.post('/api/restaurant', async (req, res) => {
  try {
    const { name, address, rating, review } = req.body;
    const newRestaurant = new Restaurant({ name, address, rating, review });
    await newRestaurant.save();
    res.status(201).json(newRestaurant);
  } catch (error) {
    console.error('Restaurant error:', error);
    res.status(500).json({ message: 'Failed to add restaurant' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});