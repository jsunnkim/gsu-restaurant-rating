<template>
    <div class="page upload">
      <h2>📤 Upload New Restaurant Photo</h2>
  
      <form @submit.prevent="uploadImage" class="upload-form">
        <input type="file" @change="handleFileChange" required />
        <input type="text" v-model="altText" placeholder="Image description" required />
        <button type="submit">Upload</button>
      </form>
  
      <p v-if="uploadStatus">{{ uploadStatus }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  
  const selectedFile = ref(null)
  const altText = ref('')
  const uploadStatus = ref('')
  
  const handleFileChange = (e) => {
    selectedFile.value = e.target.files[0]
  }
  
  const uploadImage = async () => {
    const formData = new FormData()
    formData.append('image', selectedFile.value)
    formData.append('alt', altText.value)
  
    try {
      await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      uploadStatus.value = 'Upload successful!'
    } catch (error) {
      uploadStatus.value = 'Upload failed.'
      console.error(error)
    }
  }
  </script>
  
  <style scoped>
  .page {
    padding: 30px;
    text-align: center;
  }
  .upload-form {
    margin-top: 20px;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: column;
  }
  input, textarea {
    margin-bottom: 15px;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ccc;
    width: 100%;
  }
  button {
    background-color: #1e90ff;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
  }
  button:hover {
    background-color: #0077cc;
  }
  </style>