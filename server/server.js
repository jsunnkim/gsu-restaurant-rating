require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const Image = require('./models/Image');
const Post = require('./models/Post');

const app = express();
const PORT = process.env.PORT || 5000;

// === CORS 설정 ===
const corsOptions = {
  origin: [
    'https://gsu-restaurant-rating.vercel.app',
    'http://localhost:5173',
    'http://localhost:5177',
    'http://localhost:5175'
  ],
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// === MongoDB 연결 ===
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => { console.error('❌ MongoDB error:', err); process.exit(1); });

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
      alt: req.body.alt,
      author: req.body.author
    });
    await newImage.save();
    res.status(201).json(newImage);
  } catch (error) {
    res.status(500).json({ message: 'Upload failed' });
  }
});

// === 갤러리 불러오기 ===
app.get('/api/gallery', async (req, res) => {
  const images = await Image.find().sort({ createdAt: -1 });
  res.json(images);
});

// === 갤러리 삭제 ===
app.delete('/api/gallery/:id', async (req, res) => {
  if (req.headers.authorization !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const image = await Image.findById(req.params.id);
  if (!image) return res.status(404).json({ message: 'Not found' });
  const publicId = image.src.split('/').pop().split('.')[0];
  await cloudinary.uploader.destroy(`gsu_gallery/${publicId}`);
  await image.deleteOne();
  res.json({ message: 'Image deleted' });
});

// === 리뷰 업로드 ===
app.post('/api/post', upload.single('image'), async (req, res) => {
  const { name, address, rating, review, author } = req.body;
  const post = new Post({
    name,
    address,
    rating: parseFloat(rating),
    review,
    imageUrl: req.file.path,
    author
  });
  await post.save();
  res.status(201).json(post);
});

// === 리뷰 리스트 ===
app.get('/api/post', async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

// === 리뷰 삭제 ===
app.delete('/api/post/:id', async (req, res) => {
  if (req.headers.authorization !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Not found' });
  const publicId = post.imageUrl.split('/').pop().split('.')[0];
  await cloudinary.uploader.destroy(`gsu_gallery/${publicId}`);
  await post.deleteOne();
  res.json({ message: 'Post deleted' });
});

// === 서버 시작 ===
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});