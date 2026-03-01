import { ref } from 'vue'
import { defineStore } from 'pinia'
import { PostoBrowseDto } from '@/models/browse-item'
import axios from 'axios';
import { useBackendConfig } from './backend-config';

export const useBrowseData = defineStore('browseData', () => {
  const current = ref<PostoBrowseDto|null>(null);
  function goToRoot(): void {
    console.log("Fetch root");
    const config = useBackendConfig();
    axios
    .get(`${config.url}/browse/root`, config.bearer())
    .then((response) => {
        current.value = response.data as PostoBrowseDto;
    });
  }
  return { current, goToRoot }
})
