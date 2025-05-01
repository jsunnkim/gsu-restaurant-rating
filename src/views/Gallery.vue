<template>
  <div class="page gallery">
    <h2>Food Gallery</h2>

    <!-- 데이터 없을 때 -->
    <div v-if="images.length === 0">
      <p class="empty-message"></p>
    </div>

    <!-- 데이터 있을 때 -->
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
        <p class="caption">{{ image.alt }}</p>
      </div>
    </div>

    <!-- 모달 -->
    <div v-if="modalOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <img :src="selectedImageSrc" :alt="selectedImageAlt" class="modal-img" />
        <p class="caption">{{ selectedImageAlt }}</p>
        <button class="close-button" @click="closeModal">닫기</button>
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

// 이미지 불러오기
const fetchImages = async () => {
  images.value = [] // ✅ 초기화!
  try {
    const res = await axios.get('https://gsu-restaurant-rating.onrender.com/api/gallery')
    console.log('✅ 받아온 이미지 수:', res.data.length)
    images.value = res.data
  } catch (error) {
    console.error('❌ 이미지 불러오기 실패:', error)
  }
}

// 모달 열기
const openModal = (src, alt) => {
  selectedImageSrc.value = src
  selectedImageAlt.value = alt
  modalOpen.value = true
}

// 모달 닫기
const closeModal = () => {
  modalOpen.value = false
}

// 깨진 이미지 숨기기
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

.empty-message {
  margin-top: 40px;
  font-size: 1.2rem;
  color: #64748b;
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
  box-shadow: 0 4px 8px rgba(0,0,0,0.12);
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.gallery-item:hover {
  transform: translateY(-5px) scale(1.03);
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
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

.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.75);
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
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}
.close-button:hover {
  background-color: #dc2626;
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