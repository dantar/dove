import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/main.scss'
import axios from 'axios'

async function loadConfig() {
  const res = await fetch('/config.json');
  (window as any).__APP_CONFIG__ = await res.json();
}

axios.defaults.withCredentials = true // credentials cookies

await loadConfig()
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')