<template>
  <div class="page gallery">
    <h2>📸 Restaurant Gallery</h2>

    <button @click="showForm = true" class="toggle-btn">➕ Add Image</button>

    <div v-if="showForm" class="modal-overlay" @click.self="showForm = false">
      <form @submit.prevent="uploadImage" class="modal-form">
        <h3>📤 Upload New Image</h3>
        <input type="file" @change="handleFileChange" required />
        <input type="text" v-model="altText" placeholder="Image description" required />
        <input type="text" v-model="author" placeholder="Author" required />
        <input type="password" v-model="adminPassword" placeholder="Set a password to delete later" required />
        <div class="modal-buttons">
          <button type="submit">Upload</button>
          <button type="button" @click="showForm = false" class="cancel">Cancel</button>
        </div>
        <p v-if="uploadStatus">{{ uploadStatus }}</p>
      </form>
    </div>

    <div v-if="images.length === 0">
      <p class="empty-message">No images yet. Be the first to upload!</p>
    </div>

    <div v-else class="gallery-grid">
      <div
        v-for="image in images"
        :key="image._id"
        class="gallery-item animate-fade-in"
      >
        <img
          :src="image.src"
          :alt="image.alt"
          @click="openModal(image.src, image.alt)"
          @error="onImageError"
        />
        <p class="caption">
          {{ image.alt }}<br />
          👤 {{ image.author }}
        </p>
        <button class="delete-button" @click="openDeleteModal(image._id)">🗑️ Delete</button>
      </div>
    </div>

    <div v-if="modalOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <img :src="selectedImageSrc" :alt="selectedImageAlt" class="modal-img" />
        <p class="caption">{{ selectedImageAlt }}</p>
        <button class="close-button" @click="closeModal">닫기</button>
      </div>
    </div>

    <!-- 삭제 모달 -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal-form">
        <h3>🔐 Enter password to delete image</h3>
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

const images = ref([])
const modalOpen = ref(false)
const selectedImageSrc = ref('')
const selectedImageAlt = ref('')

const showForm = ref(false)
const selectedFile = ref(null)
const altText = ref('')
const author = ref('')
const adminPassword = ref('')
const uploadStatus = ref('')

const showDeleteModal = ref(false)
const selectedDeleteId = ref(null)
const deletePassword = ref('')
const deleteError = ref('')

const fetchImages = async () => {
  images.value = []
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/gallery`)
    images.value = res.data
  } catch (error) {
    console.error('❌ 이미지 불러오기 실패:', error)
  }
}

const handleFileChange = (e) => {
  selectedFile.value = e.target.files[0]
}

const uploadImage = async () => {
  const formData = new FormData()
  formData.append('image', selectedFile.value)
  formData.append('alt', altText.value)
  formData.append('author', author.value)
  formData.append('password', adminPassword.value)

  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, formData)
    uploadStatus.value = '✅ Upload successful!'
    selectedFile.value = null
    altText.value = ''
    author.value = ''
    adminPassword.value = ''
    showForm.value = false
    fetchImages()
  } catch (error) {
    uploadStatus.value = '❌ Upload failed.'
    console.error(error)
  }
}

const openDeleteModal = (id) => {
  selectedDeleteId.value = id
  deletePassword.value = ''
  deleteError.value = ''
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/gallery/${selectedDeleteId.value}`, {
      headers: { Authorization: deletePassword.value }
    })
    showDeleteModal.value = false
    fetchImages()
  } catch (err) {
    deleteError.value = '❌ Wrong password or failed to delete.'
  }
}

const openModal = (src, alt) => {
  selectedImageSrc.value = src
  selectedImageAlt.value = alt
  modalOpen.value = true
}
const closeModal = () => {
  modalOpen.value = false
}
const onImageError = (e) => {
  e.target.style.display = 'none'
}

onMounted(fetchImages)
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

.modal-form input {
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
.cancel:hover {
  background-color: #475569;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.gallery-item {
  background: #fff;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.gallery-item:hover {
  transform: translateY(-5px) scale(1.03);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.gallery-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.caption {
  margin-top: 10px;
  font-size: 1rem;
  color: #475569;
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

.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 12px;
  max-width: 90%;
  max-height: 90%;
  text-align: center;
}
.modal-img {
  max-width: 100%;
  max-height: 70vh;
  border-radius: 8px;
}
.close-button {
  margin-top: 15px;
  padding: 8px 16px;
  background-color: #64748b;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}
.close-button:hover {
  background-color: #475569;
}
.animate-fade-in {
  animation: fadeIn 1s ease-out both;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>