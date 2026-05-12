import { ref } from 'vue'
import { defineStore } from 'pinia'
import { AppUserDto } from '@/models/app-user'
import { useBackendConfig } from './backend-config'
import axios from 'axios'
import { useBrowseData } from './browse-data'

export const useLoggedUser = defineStore('loggedUser', () => {
  const backend = useBackendConfig();
  const user = ref(new AppUserDto());
  const loading = ref(true);
  axios
  .get(`${backend.backend}/user`)
  .then(response => {
    digestResponseData(response.data);
    loading.value = false;
  })
  .catch(() => loading.value = false)
  ;
  async function logout() {
    loading.value = true;
    axios
    .post(`${backend.backend}/logout`, null)
    .then(response => {
      user.value = new AppUserDto();
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
    })
  }
  function digestResponseData(data: any) {
    user.value = AppUserDto.digestResponseData(data);
    const browse = useBrowseData();
    const first = user.value.repos[0];
    if (first) {
      browse.switchToRepo(first);
    }
  }
  return { user, loading, logout, digestResponseData }
})
