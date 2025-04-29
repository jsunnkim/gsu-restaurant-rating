<template>
    <div class="page contact">
      <h2>✉️ Contact Us</h2>
      <p>If you have any questions, suggestions, or feedback, feel free to reach out to us!</p>
  
      <form @submit.prevent="submitForm" class="contact-form">
        <input type="text" v-model="name" placeholder="Your Name" required />
        <input type="email" v-model="email" placeholder="Your Email" required />
        <textarea v-model="message" placeholder="Your Message" required></textarea>
        <button type="submit">Send Message</button>
      </form>
  
      <p v-if="formStatus">{{ formStatus }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const name = ref('')
  const email = ref('')
  const message = ref('')
  const formStatus = ref('')
  
  const submitForm = () => {
    if (name.value && email.value && message.value) {
      formStatus.value = "Thank you! Your message has been received.";
      name.value = ''
      email.value = ''
      message.value = ''
    } else {
      formStatus.value = "Please fill out all fields."
    }
  }
  </script>
  
  <style scoped>
  .page {
    padding: 30px;
    text-align: center;
  }
  .contact-form {
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
  textarea {
    resize: vertical;
    min-height: 100px;
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