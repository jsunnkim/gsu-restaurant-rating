require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const multer = require('multer')
const { v2: cloudinary } = require('cloudinary')
const { CloudinaryStorage } = require('multer-storage-cloudinary')

const Image = require('./models/Image')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// === MongoDB Connect ===
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err))

// === Cloudinary Config ===
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'gsu_gallery',
    allowed_formats: ['jpg', 'jpeg', 'png']
  }
})

const upload = multer({ storage })

// === API Routes ===

// Test root route
app.get('/', (req, res) => {
  res.send('🚀 GSU Restaurant Rating Backend is running!');
});

// Upload image route
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    const newImage = new Image({
      src: req.file.path,
      alt: req.body.alt
    })
    await newImage.save()
    res.status(201).json(newImage)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error uploading image' })
  }
})

// Get all images route
app.get('/api/gallery', async (req, res) => {
  try {
    const images = await Image.find()
    res.json(images)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error fetching images' })
  }
})

// === Start Server ===
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`))