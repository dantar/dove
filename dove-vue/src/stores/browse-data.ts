import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { PostoBrowseDto, PostoObj, OggettoObj, OggettoBrowseDto, SchedaOggetto } from '@/models/browse-item'
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

  async function browseRootDetails(): Promise<PostoBrowseDto> {
    const config = useBackendConfig();
    const response = await axios.get<PostoBrowseDto>(`${config.url}/browse/root`, config.bearer());
    return response.data;
  }

  async function browsePostoDetails(uuid: string): Promise<PostoBrowseDto> {
    const config = useBackendConfig();
    const response = await axios.get<PostoBrowseDto>(`${config.url}/browse/posto/${uuid}`, config.bearer());
    return response.data;
  }

  async function browseOggettoDetails(uuid: string): Promise<OggettoBrowseDto> {
    const config = useBackendConfig();
    const response = await axios.get<OggettoBrowseDto>(`${config.url}/browse/oggetto/${uuid}`, config.bearer());
    return response.data;
  }

  async function doAddPosto(main: string, branch: string): Promise<PostoObj> {
    const config = useBackendConfig();
    const response = await axios
    .post<PostoObj>(`${config.url}/posto/${main}/${branch}`, null, config.bearer());
    return response.data;
  }

  function addPosto(main: string, branch: string): void {
    console.log(`Creating new ${main}/${branch}`);
    doAddPosto(main, branch)
    .then((data) => {
        if (current.value) {
          current.value.posti.push(data);
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

  async function updatePosto(posto: PostoObj): Promise<PostoObj> {
    console.log(`Updating Posto ${posto.id}`);
    const config = useBackendConfig();
    const o = await axios
    .post<PostoObj>(`${config.url}/posto`, posto, config.bearer())
    return o.data;
  }

  async function updateOggetto(oggetto: OggettoObj): Promise<OggettoObj> {
    console.log(`Updating Oggetto ${oggetto.id}`);
    const config = useBackendConfig();
    const o = await axios
    .post<OggettoObj>(`${config.url}/oggetto`, oggetto, config.bearer());
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
    addPosto, updatePosto, doAddPosto,  
    addOggetto, updateOggetto,
    uploadGallery, fetchOggettoDetails,
    browseOggettoDetails, browsePostoDetails, browseRootDetails
  }
})
