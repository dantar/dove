import AboutView from '@/components/AboutView.vue'
import BrowseView from '@/components/BrowseView.vue'
import HomeView from '@/components/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomeView },
    { path: '/browse', component: BrowseView },
    { path: '/about', component: AboutView },
  ],
})

export default router
