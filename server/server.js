require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const multer = require('multer')
const { v2: cloudinary } = require('cloudinary')
const { CloudinaryStorage } = require('multer-storage-cloudinary')

const Image = require('./models/Image')
const Post = require('./models/Post')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://gsu-restaurant-rating.vercel.app'
  ],
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => { console.error('❌ MongoDB error:', err); process.exit(1) })

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'gsu_gallery',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
  }
})
const upload = multer({ storage })

// 기본 라우트
app.get('/', (req, res) => {
  res.send('🚀 GSU Restaurant Rating Backend Running')
})

// 이미지 업로드
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    const newImage = new Image({
      src: req.file.path,
      alt: req.body.alt,
      author: req.body.author,
      password: req.body.password || req.headers.authorization
    })
    await newImage.save()
    res.status(201).json(newImage)
  } catch (error) {
    console.error('❌ Upload failed:', error)
    res.status(500).json({ message: 'Upload failed' })
  }
})

// 이미지 목록 조회
app.get('/api/gallery', async (req, res) => {
  const images = await Image.find().sort({ createdAt: -1 })
  res.json(images)
})

// 이미지 삭제
app.delete('/api/gallery/:id', async (req, res) => {
  const image = await Image.findById(req.params.id)
  if (!image) return res.status(404).json({ message: 'Not found' })

  const inputPassword = (req.headers.authorization || '').trim()
  const adminPassword = (process.env.ADMIN_PASSWORD || '').trim()

  if (inputPassword !== image.password && inputPassword !== adminPassword) {
    return res.status(403).json({ message: 'Wrong password' })
  }

  const publicId = image.src.split('/').pop().split('.')[0]
  await cloudinary.uploader.destroy(`gsu_gallery/${publicId}`)
  await image.deleteOne()
  res.json({ message: 'Image deleted' })
})

// 포스트 업로드
app.post('/api/post', upload.single('image'), async (req, res) => {
  try {
    const { name, address, rating, review, author } = req.body
    const password = req.body.password || req.headers.authorization

    const post = new Post({
      name,
      address,
      rating: parseFloat(rating),
      review,
      imageUrl: req.file.path,
      author,
      password
    })

    await post.save()
    res.status(201).json(post)
  } catch (error) {
    console.error('❌ Post upload failed:', error)
    res.status(500).json({ message: 'Post upload failed' })
  }
})

// 포스트 조회
app.get('/api/post', async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 })
  res.json(posts)
})

// 포스트 삭제
app.delete('/api/post/:id', async (req, res) => {
  const post = await Post.findById(req.params.id)
  if (!post) return res.status(404).json({ message: 'Not found' })

  const inputPassword = (req.headers.authorization || '').trim()
  const adminPassword = (process.env.ADMIN_PASSWORD || '').trim()

  if (inputPassword !== post.password && inputPassword !== adminPassword) {
    return res.status(403).json({ message: 'Wrong password' })
  }

  const publicId = post.imageUrl.split('/').pop().split('.')[0]
  await cloudinary.uploader.destroy(`gsu_gallery/${publicId}`)
  await post.deleteOne()
  res.json({ message: 'Post deleted' })
})

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`)
})