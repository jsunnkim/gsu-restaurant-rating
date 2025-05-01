<template>
  <div class="page restaurant">
    <h2>Restaurant Posts</h2>

    <button @click="showForm = true" class="toggle-btn">➕ Add Post</button>

    <!-- 모달 작성 폼 -->
    <div v-if="showForm" class="modal-overlay" @click.self="showForm = false">
      <form @submit.prevent="submitPost" class="modal-form">
        <h3>📝 Write a Restaurant Review</h3>
        <input type="file" @change="handleFile" accept="image/*" required />
        <input v-model="name" placeholder="Restaurant Name" required />
        <input v-model="address" placeholder="Address" required />
        <input v-model="rating" type="number" min="0" max="5" step="0.1" placeholder="Rating" required />
        <textarea v-model="review" placeholder="Write your review..." required></textarea>
        <input v-model="author" placeholder="Author" required />

        <div class="modal-buttons">
          <button type="submit">Post</button>
          <button type="button" @click="showForm = false" class="cancel">Cancel</button>
        </div>
        <p v-if="uploadStatus">{{ uploadStatus }}</p>
      </form>
    </div>

    <!-- 포스트 리스트 -->
    <div class="post-grid">
      <div v-for="post in posts" :key="post._id" class="post-card">
        <img :src="post.imageUrl" alt="post image" />
        <div class="post-body">
          <h3>{{ post.name }}</h3>
          <p class="address">📍 {{ post.address }}</p>
          <p>⭐ {{ post.rating }}</p>
          <p>{{ post.review }}</p>
          <p>👤 {{ post.author }}</p>
          <button @click="deletePost(post._id)">Delete</button>
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
const author = ref('')
const selectedFile = ref(null)
const uploadStatus = ref('')
const showForm = ref(false)

const handleFile = (e) => {
  selectedFile.value = e.target.files[0]
}

const submitPost = async () => {
  const formData = new FormData()
  formData.append('image', selectedFile.value)
  formData.append('name', name.value)
  formData.append('address', address.value)
  formData.append('rating', rating.value)
  formData.append('review', review.value)
  formData.append('author', author.value)

  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/post`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    uploadStatus.value = '✅ Post uploaded!'
    name.value = ''
    address.value = ''
    rating.value = ''
    review.value = ''
    author.value = ''
    selectedFile.value = null
    document.querySelector('input[type="file"]').value = ''
    showForm.value = false
    fetchPosts()
  } catch (error) {
    console.error('❌ Upload failed:', error)
    uploadStatus.value = '❌ Upload failed.'
  }
}

const fetchPosts = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/post`)
    posts.value = res.data
  } catch (err) {
    console.error('❌ Error loading posts:', err)
  }
}

const deletePost = async (id) => {
  const password = prompt("Enter admin password:")
  if (!password) return

  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/post/${id}`, {
      headers: { Authorization: password }
    })
    fetchPosts()
  } catch (err) {
    alert('❌ Delete failed')
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

/* 모달 관련 스타일 */
.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-form {
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}

.modal-form input,
.modal-form textarea {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.modal-buttons button {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.modal-buttons button[type="submit"] {
  background-color: #10b981;
  color: white;
}

.cancel {
  background-color: #64748b;
  color: white;
}
</style>