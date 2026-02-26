import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { AppUserDto } from '@/models/app-user'

export const useLoggedUser = defineStore('loggedUser', () => {
  const user = ref(new AppUserDto());
  return { user }
})
