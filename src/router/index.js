import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Restaurant from '../views/Restaurant.vue'
import Gallery from '../views/Gallery.vue'
import Upload from '../views/Upload.vue'
import Contact from '../views/Contact.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  { path: '/restaurant', name: 'Restaurant', component: Restaurant },
  { path: '/gallery', name: 'Gallery', component: Gallery },
  { path: '/upload', name: 'Upload', component: Upload },
  { path: '/contact', name: 'Contact', component: Contact }
]

export default createRouter({
  history: createWebHistory(),
  routes
})