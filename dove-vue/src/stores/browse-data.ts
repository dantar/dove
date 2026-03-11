import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { PostoBrowseDto, PostoObj, OggettoObj } from '@/models/browse-item'
import axios from 'axios';
import { useBackendConfig } from './backend-config';

export const useBrowseData = defineStore('browseData', () => {
  const current = ref<PostoBrowseDto>();

  function goToRoot(): void {
    console.log("Fetch root");
    const config = useBackendConfig();
    axios
    .get<PostoBrowseDto>(`${config.url}/browse/root`, config.bearer())
    .then((response) => {
        current.value = response.data;
    });
  }

  function goToPosto(id: string): void {
    console.log(`Fetch ${id}`);
    const config = useBackendConfig();
    axios
    .get<PostoBrowseDto>(`${config.url}/browse/posto/${id}`, config.bearer())
    .then((response) => {
        current.value = response.data;
    });
  }

  async function fetchOggettoDetails(uuid: string): Promise<OggettoObj> {
    const config = useBackendConfig();
    const response = await axios.get<OggettoObj>(`${config.url}/oggetto/${uuid}`, config.bearer());
    return response.data;
  }

  function addPosto(main: string, branch: string): void {
    console.log(`Creating new ${main}/${branch}`);
    const config = useBackendConfig();
    axios
    .post<PostoObj>(`${config.url}/posto/${main}/${branch}`, null, config.bearer())
    .then((response) => {
        if (current.value) {
          current.value.posti.push(response.data);
        }
    });
  }

  function addOggetto(main: string, id: string): void {
    console.log(`Creating oggetto ${main}>${id}`);
    const config = useBackendConfig();
    const oggetto = <OggettoObj>{
      id: id,
      idPosto: main,
      nome: "Nuovo oggetto",
      scheda: {},
    };
    axios
    .post<OggettoObj>(`${config.url}/oggetto`, oggetto, config.bearer())
    .then((response) => {
        if (current.value) {
          current.value.oggetti.push(response.data);
        }
    });
  }

  function updatePosto(posto: PostoObj): void {
    console.log(`Updating Posto ${posto.id}`);
    const config = useBackendConfig();
    axios
    .post<PostoObj>(`${config.url}/posto`, posto, config.bearer())
    .then((response) => {
        if (current.value) {
          current.value.posto = response.data;
        }
    });
  }

  async function updateOggetto(oggetto: OggettoObj): Promise<OggettoObj> {
    console.log(`Updating Oggetto ${oggetto.id}`);
    const config = useBackendConfig();
    const o = await axios
    .post<OggettoObj>(`${config.url}/oggetto`, oggetto, config.bearer());
    // .then((response) => {
    //     if (current.value) {
    //       const index = current.value.oggetti.map(o => o.id).indexOf(oggetto.id);
    //       if (index >= 0) {
    //         current.value.oggetti = current.value.oggetti.splice(index, 1, response.data);
    //       }
    //     }
    // });
    return o.data;
  }

  async function uploadGallery(uuid:string, images:string[]): Promise<string[]> {
    console.log(`Uploading gallery for ${uuid}`);
    const config = useBackendConfig();
    const o = await axios
    .post<string[]>(`${config.url}/gallery/${uuid}`, images, config.bearer());
    return o.data;
  }

  return { current, goToRoot, goToPosto, 
    addPosto, updatePosto, 
    addOggetto, updateOggetto,
    uploadGallery, fetchOggettoDetails
  }
})
