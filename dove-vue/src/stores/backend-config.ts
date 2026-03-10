import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useBackendConfig = defineStore('backendLogic', () => {
  const url = ref((window as any).__APP_CONFIG__.BACKEND_URL);
  const token = ref('');
  const bearer = () => {
    return {
      headers: {
          Authorization: "Bearer " + token.value
      }
    }
  }
  return { url, token, bearer }
})
