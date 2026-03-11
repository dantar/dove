import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useBackendConfig = defineStore('backendLogic', () => {
  const images = ref((window as any).__APP_CONFIG__.IMAGES_URL);
  const url = ref((window as any).__APP_CONFIG__.BACKEND_URL);
  const token = ref('');
  const bearer = () => {
    return {
      headers: {
          Authorization: "Bearer " + token.value
      }
    }
  }
  return { url, images, token, bearer }
})
