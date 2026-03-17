import AboutView from '@/components/AboutView.vue'
import BrowseRoot from '@/components/BrowseRoot.vue'
import CameraAdvanced from '@/components/CameraAdvanced.vue'
import CameraSquare from '@/components/CameraSquare.vue'
import HomeView from '@/components/HomeView.vue'
import OggettoDetails from '@/components/OggettoDetails.vue'
import PostoDetails from '@/components/PostoDetails.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomeView },
    { path: '/browse', component: PostoDetails, props: true },
    { path: '/about', component: AboutView },
    { path: '/camera', component: CameraSquare },
    { path: '/advanced', component: CameraAdvanced },
    { path: '/oggetto/:uuid', component: OggettoDetails, props: true },
    { path: '/posto/:uuid', component: PostoDetails, props: true },
  ],
})

export default router
