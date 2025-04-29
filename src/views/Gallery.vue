<template>
    <div class="page gallery">
      <h2>📸 Restaurant Gallery</h2>
  
      <div class="gallery-grid">
        <div 
          v-for="(image, index) in images" 
          :key="index" 
          class="gallery-item animate-fade-in">
          <img :src="image.src" :alt="image.alt" />
          <p class="caption">{{ image.alt }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  const images = ref([])
  
  const fetchImages = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/gallery')
      images.value = res.data
    } catch (error) {
      console.error('Error fetching gallery images:', error)
    }
  }
  
  onMounted(fetchImages)
  </script>
  
  <style scoped>
  .page {
    padding: 60px 20px;
    text-align: center;
  }
  
  /* Gallery grid layout */
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
    margin-top: 30px;
  }
  
  /* Each image card */
  .gallery-item {
    background: #ffffff;
    padding: 12px;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
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
  
  /* Image caption */
  .caption {
    margin-top: 10px;
    font-size: 1rem;
    color: #475569;
  }
  
  /* Fade-in animation */
  .animate-fade-in {
    animation: fadeIn 1.2s ease-out both;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>