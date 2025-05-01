<template>
    <div class="home-page">
      <section class="hero animate-fade-in">
        <div class="overlay">
          <p class="subtitle">Discover, Rate, and Share the Best Restaurants around Georgia State University!</p>
          
          <p class="statement">
            Whether you're a GSU student, faculty member, or visitor, we help you find the tastiest spots around campus.
            Share your dining experiences, explore new flavors, and join a community that loves good food as much as you do.
            Your next favorite meal is just around the corner!
          </p>
  
          <div class="buttons">
            <RouterLink to="/About" class="btn">About Us</RouterLink>
            <RouterLink to="/Restaurant" class="btn">Restaurant</RouterLink>
            <RouterLink to="/Gallery" class="btn">Gallery</RouterLink>
            <RouterLink to="/contact" class="btn secondary">Contact Us</RouterLink>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script setup>
  import { RouterLink } from 'vue-router'
  import backgroundImage from '../assets/campus.png'
  </script>
  
  <style scoped>
  .home-page {
    min-height: 100vh;
  }
  
  .hero {
    background: url(../assets/campus.png) no-repeat center center;
    background-size: cover;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 80px 20px;
    position: relative;
  }
  
  /* Darken background slightly */
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
  
  /* Fade-in animation */
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
  
  .overlay h1 {
    font-size: 3.2rem;
    margin-bottom: 25px;
  }
  
  .subtitle {
    font-size: 1.5rem;
    margin-bottom: 30px;
  }
  
  .statement {
    max-width: 700px;
    margin: 0 auto 40px;
    font-size: 1.2rem;
    line-height: 1.8;
  }
  
  .buttons {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 16px;
  }
  
  /* Buttons hover effect */
  .btn {
    background-color: #1e90ff;
    color: white;
    padding: 14px 28px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: bold;
    font-size: 1rem;
    transition: transform 0.3s, background-color 0.3s;
  }
  
  .btn:hover {
    background-color: #0d6efd;
    transform: translateY(-5px) scale(1.05);
  }
  
  .secondary {
    background-color: #64748b;
  }
  
  .secondary:hover {
    background-color: #475569;
    transform: translateY(-5px) scale(1.05);
  }
  </style>