<template>
  <div class="page restaurant">
    <h2>Restaurant</h2>

    <button @click="showForm = true" class="toggle-btn">Add Post</button>

    <!-- 작성 모달 -->
    <div v-if="showForm" class="modal-overlay" @click.self="showForm = false">
      <form @submit.prevent="submitPost" class="modal-form">
        <h3>📝 Write a Restaurant Review</h3>
        <input type="file" @change="handleFile" accept="image/*" required />
        <input v-model="name" placeholder="Restaurant Name" required />
        <input v-model="address" placeholder="Address" required />
        <input v-model="rating" type="number" min="0" max="5" step="0.1" placeholder="Rating" required />
        <textarea v-model="review" placeholder="Write your review..." required></textarea>
        <input v-model="author" placeholder="Author" required />
        <input type="password" v-model="password" placeholder="Set a password to delete later" required />

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
        <img :src="post.imageUrl" alt="post image" @click="openDetail(post)" />
        <div class="post-body">
          <h3>{{ post.name }}</h3>
          <p class="address">📍 {{ post.address }}</p>
          <p>⭐ {{ post.rating }}</p>
          <p>{{ post.review }}</p>
          <p>👤 {{ post.author }}</p>
          <button class="delete-button" @click="openDeleteModal(post._id)">🗑️ Delete</button>
        </div>
      </div>
    </div>

    <!-- 상세 보기 모달 -->
    <div v-if="selectedPost" class="modal-overlay" @click.self="selectedPost = null">
      <div class="modal-form">
        <h3>{{ selectedPost.name }}</h3>
        <img :src="selectedPost.imageUrl" alt="image" class="modal-img" />
        <p>📍 {{ selectedPost.address }}</p>
        <p>⭐ {{ selectedPost.rating }}</p>
        <p>{{ selectedPost.review }}</p>
        <p>👤 {{ selectedPost.author }}</p>
        <button class="close-button" @click="selectedPost = null">Close</button>
      </div>
    </div>

    <!-- 삭제 비밀번호 모달 -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal-form">
        <h3>🔐 Enter password to delete post</h3>
        <input type="password" v-model="deletePassword" placeholder="Enter password" />
        <div class="modal-buttons">
          <button @click="confirmDelete">Confirm</button>
          <button @click="showDeleteModal = false" class="cancel">Cancel</button>
        </div>
        <p v-if="deleteError" style="color:red">{{ deleteError }}</p>
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
const password = ref('')
const selectedFile = ref(null)
const uploadStatus = ref('')
const showForm = ref(false)
const selectedPost = ref(null)

const showDeleteModal = ref(false)
const selectedDeleteId = ref(null)
const deletePassword = ref('')
const deleteError = ref('')

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
  formData.append('password', password.value)

  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/post`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: password.value
      }
    })
    uploadStatus.value = '✅ Post uploaded!'
    name.value = ''
    address.value = ''
    rating.value = ''
    review.value = ''
    author.value = ''
    password.value = ''
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

const openDetail = (post) => {
  selectedPost.value = post
}

const openDeleteModal = (id) => {
  selectedDeleteId.value = id
  deletePassword.value = ''
  deleteError.value = ''
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/post/${selectedDeleteId.value}`, {
      headers: { Authorization: deletePassword.value }
    })
    showDeleteModal.value = false
    fetchPosts()
  } catch (err) {
    deleteError.value = '❌ Wrong password or failed to delete.'
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  text-align: left;
}

.post-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  cursor: pointer;
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

.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.6);
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
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  text-align: left;
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

.delete-button {
  margin-top: 8px;
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}
.delete-button:hover {
  background-color: #dc2626;
}

.modal-img {
  width: 100%;
  max-height: 240px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 12px;
}

.close-button {
  margin-top: 12px;
  background-color: #64748b;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}
.close-button:hover {
  background-color: #475569;
}
</style>