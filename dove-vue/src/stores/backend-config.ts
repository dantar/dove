import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios';

export const useBackendConfig = defineStore('backendLogic', () => {
  const url = ref(import.meta.env.VITE_BACKEND_LOGIC_URL || "http://localhost:8080");
  const token = ref('');
  return { url, token }
})
