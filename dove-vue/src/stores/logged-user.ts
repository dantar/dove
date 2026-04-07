import { ref } from 'vue'
import { defineStore } from 'pinia'
import { AppUserDto } from '@/models/app-user'
import { useBackendConfig } from './backend-config'
import axios from 'axios'
import { useTipiSchedeOggetto } from './schede-by-schema'

export const useLoggedUser = defineStore('loggedUser', () => {
  const schede = useTipiSchedeOggetto();
  const backend = useBackendConfig();
  const user = ref(new AppUserDto());
  const loading = ref(true);
  axios
  .get(`${backend.backend}/user`)
  .then(response => {
    user.value.username = response.data.username;
    user.value.authorities = response.data.authorities.map((a: any) => a.authority);
    schede.init()
    .then(() => {});
    loading.value = false;
  })
  .catch(() => loading.value = false)
  ;
  async function logout() {
    loading.value = true;
    axios
    .post(`${backend.backend}/logout`, null)
    .then(response => {
      user.value.username = '';
      user.value.authorities = [];
      //user.value = new AppUserDto();
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
    })
  }
  return { user, loading, logout }
})
