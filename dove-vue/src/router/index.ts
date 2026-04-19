import AboutView from '@/components/AboutView.vue'
import CameraAdvanced from '@/components/CameraAdvanced.vue'
import CameraSquare from '@/components/CameraSquare.vue'
import HomeView from '@/components/HomeView.vue'
import LoggedUser from '@/components/LoggedUser.vue'
import OggettoDetails from '@/components/OggettoDetails.vue'
import PostoDetails from '@/components/PostoDetails.vue'
import PrintTemplate from '@/components/PrintTemplate.vue'
import QrRedirect from '@/components/QrRedirect.vue'
import SearchPage from '@/components/SearchPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '', component: HomeView, props: true },
    { path: '/user', component: LoggedUser, props: true },
    { path: '/search', component: SearchPage, props: true },
    { path: '/browse', component: PostoDetails, props: true },
    { path: '/about', component: AboutView },
    { path: '/camera', component: CameraSquare },
    { path: '/advanced', component: CameraAdvanced },
    { path: '/oggetto/:uuid', component: OggettoDetails, props: true },
    { path: '/posto/:uuid', component: PostoDetails, props: true },
    { path: '/qr/:uuid', component: QrRedirect, props: true},
    { path: '/print', component: PrintTemplate },
  ],
})

export default router
