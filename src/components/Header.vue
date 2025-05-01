<template>
  <header class="site-header">
    <h1>GSU Restaurant Ratings</h1>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About Us</RouterLink>
      <RouterLink to="/restaurant">Restaurant</RouterLink>
      <RouterLink to="/gallery">Gallery</RouterLink>
      <RouterLink to="/contact">Contact Us</RouterLink>
    </nav>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.site-header {
  background-color: #ffffff; /* WHITE background */
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* subtle shadow for separation */
  position: sticky;
  top: 0;
  z-index: 999;
}

.site-header h1 {
  color: #1e3a8a; /* GSU blue color */
  margin-bottom: 10px;
  font-size: 2rem;
}

nav {
  margin-top: 10px;
}

nav a {
  color: #1e3a8a; /* Same blue for links */
  margin: 0 12px;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1rem;
  transition: color 0.3s;
}

nav a:hover {
  color: #0d6efd; /* Slightly lighter blue on hover */
}

nav a.router-link-exact-active {
  border-bottom: 2px solid #0d6efd;
  padding-bottom: 2px;
}
</style>