import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useBackendConfig = defineStore('backendLogic', () => {
  const url = ref(import.meta.env.VITE_BACKEND_LOGIC_URL || "http://localhost:8080");
  const token = ref('');
  const bearer = () => {
    console.log("token", token.value);
    return {
      headers: {
          Authorization: "Bearer " + token.value
      }
    }
  }
  return { url, token, bearer }
})
