<template>
    <div class="page restaurant">
      <h2>🍽️ Add a Restaurant</h2>
  
      <form @submit.prevent="submitRestaurant" class="restaurant-form">
        <input v-model="name" type="text" placeholder="Restaurant Name" required />
        <input v-model="address" type="text" placeholder="Address" required />
        <input v-model="rating" type="number" step="0.1" min="0" max="5" placeholder="Rating (0-5)" required />
        <textarea v-model="review" placeholder="Write your review..." required></textarea>
  
        <button type="submit">Submit</button>
      </form>
  
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  
  const name = ref('')
  const address = ref('')
  const rating = ref('')
  const review = ref('')
  const successMessage = ref('')
  
  const submitRestaurant = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/restaurant`, {
        name: name.value,
        address: address.value,
        rating: rating.value,
        review: review.value
      })
      successMessage.value = '✅ Restaurant added successfully!'
      name.value = ''
      address.value = ''
      rating.value = ''
      review.value = ''
    } catch (error) {
      console.error('Error adding restaurant:', error)
      successMessage.value = '❌ Failed to add restaurant.'
    }
  }
  </script>
  
  <style scoped>
  .page {
    padding: 60px 20px;
    text-align: center;
  }
  
  .restaurant-form {
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    max-width: 400px;
    margin: 0 auto;
  }
  
  .restaurant-form input,
  .restaurant-form textarea {
    padding: 10px;
    font-size: 1rem;
    border-radius: 8px;
    border: 1px solid #ccc;
  }
  
  .restaurant-form textarea {
    min-height: 100px;
  }
  
  .restaurant-form button {
    padding: 10px;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
  }
  
  .restaurant-form button:hover {
    background-color: #2563eb;
  }
  
  .success-message {
    margin-top: 20px;
    font-size: 1.1rem;
    color: #10b981;
  }
  </style>