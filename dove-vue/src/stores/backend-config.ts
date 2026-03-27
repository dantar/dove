import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useBackendConfig = defineStore('backendLogic', () => {
  const app = ref((window as any).__APP_CONFIG__.APP_URL);
  const images = ref((window as any).__APP_CONFIG__.IMAGES_URL);
  const backend = ref((window as any).__APP_CONFIG__.BACKEND_URL);
  const token = ref('');
  const bearer = () => {
    return {
      // headers: {
      //     Authorization: "Bearer " + token.value
      // }
    }
  }
  return { app, backend, images, token, bearer }
})
