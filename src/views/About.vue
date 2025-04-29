<template>
    <div class="about-page">
      <section class="hero animate-fade-in">
        <div class="overlay">
          <h2>About Us</h2>
          <p class="about-text">
            This platform helps GSU students and visitors discover amazing local restaurants near campus.
            Built with Vue.js, Node.js, MongoDB, and Cloudinary integration, our mission is to connect the GSU community through food experiences.
          </p>
        </div>
      </section>
    </div>
  </template>
  
  <script setup>
  import backgroundImage from '../assets/welcome.png'
  </script>
  
  <style scoped>
  .about-page {
    min-height: 100vh;
  }
  
  .hero {
    background: url(../assets/welcome.png) no-repeat center center;
    background-size: cover;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 80px 20px;
    position: relative;
  }
  
  /* Darken background */
  .hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
  }
  
  /* Content over the background */
  .overlay {
    position: relative;
    z-index: 1;
    color: white;
  }
  
  /* Animate fade-in */
  .animate-fade-in {
    animation: fadeIn 1.5s ease-out both;
  }
  
  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateY(40px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .overlay h2 {
    font-size: 3rem;
    margin-bottom: 20px;
  }
  
  .about-text {
    font-size: 1.4rem;
    line-height: 1.7;
    max-width: 700px;
    margin: 0 auto;
  }
  </style>