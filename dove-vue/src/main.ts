import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

async function loadConfig() {
  const res = await fetch('/config.json');
  (window as any).__APP_CONFIG__ = await res.json();
}

await loadConfig()
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')