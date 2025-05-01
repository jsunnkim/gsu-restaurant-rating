require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// === Mongoose Models ===
const Image = require('./models/Image');
const Post = require('./models/Post');

const RestaurantSchema = new mongoose.Schema({
  name: String,
  address: String,
  rating: Number,
  review: String
});
const Restaurant = mongoose.model('Restaurant', RestaurantSchema);

const app = express();
const PORT = process.env.PORT || 5000;

// === CORS 설정 ===
const corsOptions = {
  origin: [
    'https://gsu-restaurant-rating.vercel.app',  // ✅ Vercel 도메인
    'http://localhost:5173',                     // ✅ Vue 개발 서버
    'http://localhost:5177'                      // ✅ 혹시 다른 포트도 대비
  ],
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
};
app.use(cors(corsOptions));

// === 기본 미들웨어 ===
app.use(express.json());

// === MongoDB 연결 ===
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

// === Cloudinary 설정 ===
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

// === 기본 라우트 ===
app.get('/', (req, res) => {
  res.send('🚀 GSU Restaurant Rating Backend is running!');
});

// === 이미지 업로드 ===
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

// === 갤러리 이미지 목록 ===
app.get('/api/gallery', async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: 'Error fetching gallery' });
  }
});

// === 갤러리 이미지 삭제 ===
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

// === 텍스트 레스토랑 등록 ===
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

// === 레스토랑 포스트 업로드 (사진 + 리뷰) ===
app.post('/api/post', upload.single('image'), async (req, res) => {
  try {
    const { name, address, rating, review } = req.body;

    if (!req.file || !name || !address || !review) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const post = new Post({
      name,
      address,
      rating: parseFloat(rating),
      review,
      imageUrl: req.file.path
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error('❌ Error uploading post:', err);
    res.status(500).json({ message: 'Post upload failed' });
  }
});

// === 레스토랑 포스트 리스트 ===
app.get('/api/post', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error('❌ Error loading posts:', err);
    res.status(500).json({ message: 'Error loading posts' });
  }
});

// === 서버 실행 ===
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});