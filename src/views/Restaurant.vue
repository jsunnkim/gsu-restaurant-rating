<template>
  <div class="page restaurant">
    <h2>🍽️ Restaurant Posts</h2>

    <button @click="showForm = !showForm" class="toggle-btn">
      {{ showForm ? 'Cancel' : '➕ Add Post' }}
    </button>

    <!-- 업로드 폼 -->
    <form v-if="showForm" @submit.prevent="submitPost" class="upload-form">
      <input type="file" @change="handleFile" accept="image/*" required />
      <input v-model="name" placeholder="Restaurant Name" required />
      <input v-model="address" placeholder="Address" required />
      <input v-model="rating" type="number" min="0" max="5" step="0.1" placeholder="Rating" required />
      <textarea v-model="review" placeholder="Write your review..." required></textarea>
      <button type="submit">Post</button>
      <p v-if="uploadStatus">{{ uploadStatus }}</p>
    </form>

    <!-- 포스트 리스트 -->
    <div class="post-grid">
      <div v-for="post in posts" :key="post._id" class="post-card">
        <img :src="post.imageUrl" alt="post image" />
        <div class="post-body">
          <h3>{{ post.name }}</h3>
          <p class="address">📍 {{ post.address }}</p>
          <p>⭐ {{ post.rating }}</p>
          <p>{{ post.review }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const posts = ref([])
const name = ref('')
const address = ref('')
const rating = ref('')
const review = ref('')
const selectedFile = ref(null)
const uploadStatus = ref('')
const showForm = ref(false)

// 파일 선택 핸들러
const handleFile = (e) => {
  selectedFile.value = e.target.files[0]
}

// 포스트 전송
const submitPost = async () => {
  const formData = new FormData()
  formData.append('image', selectedFile.value)
  formData.append('name', name.value)
  formData.append('address', address.value)
  formData.append('rating', rating.value)
  formData.append('review', review.value)

  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/post`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    uploadStatus.value = '✅ Post uploaded!'
    name.value = ''
    address.value = ''
    rating.value = ''
    review.value = ''
    selectedFile.value = null
    document.querySelector('input[type="file"]').value = ''
    showForm.value = false
    fetchPosts()
  } catch (error) {
    console.error('❌ Upload failed:', error)
    uploadStatus.value = '❌ Upload failed.'
  }
}

// 포스트 불러오기
const fetchPosts = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/post`)
    posts.value = res.data
  } catch (err) {
    console.error('❌ Error loading posts:', err)
  }
}

onMounted(fetchPosts)
</script>

<style scoped>
.page {
  padding: 60px 20px;
  text-align: center;
}

.toggle-btn {
  margin-bottom: 20px;
  padding: 10px 16px;
  font-weight: bold;
  background-color: #1e90ff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.toggle-btn:hover {
  background-color: #0c74d4;
}

.upload-form {
  max-width: 450px;
  margin: 0 auto 40px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.upload-form input,
.upload-form textarea {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.upload-form button {
  padding: 10px;
  font-weight: bold;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.upload-form button:hover {
  background-color: #059669;
}

.upload-form p {
  margin-top: 8px;
  font-weight: bold;
}

.post-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.post-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  overflow: hidden;
  text-align: left;
}

.post-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.post-body {
  padding: 16px;
}
.post-body h3 {
  margin: 0 0 8px;
}
.address {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 6px;
}
</style>