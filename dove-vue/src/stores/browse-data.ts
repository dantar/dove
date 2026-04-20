import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { PostoBrowseDto, PostoObj, OggettoObj, OggettoBrowseDto, SchedaOggetto, AnyBrowseDto, AnyObj } from '@/models/browse-item'
import axios from 'axios';
import { useBackendConfig } from './backend-config';

export const useBrowseData = defineStore('browseData', () => {
  const current = ref<PostoBrowseDto>();
  const cacheAnyBrowse: {[uuid:string]: AnyBrowseDto} = {};

  const visiblePosti = ref(false);
  const visibleOggetti = ref(false);

  function goToRoot(): void {
    const config = useBackendConfig();
    axios
    .get<PostoBrowseDto>(`${config.backend}/browse/root`)
    .then((response) => {
        current.value = response.data;
    });
  }

  function goToPosto(id: string): void {
    const config = useBackendConfig();
    axios
    .get<PostoBrowseDto>(`${config.backend}/browse/posto/${id}`)
    .then((response) => {
        current.value = response.data;
    });
  }

  async function fetchOggettoDetails(uuid: string): Promise<OggettoObj> {
    const config = useBackendConfig();
    const response = await axios.get<OggettoObj>(`${config.backend}/oggetto/${uuid}`);
    return response.data;
  }

  async function fetchPostoDetails(uuid: string): Promise<PostoObj> {
    const config = useBackendConfig();
    const response = await axios.get<PostoObj>(`${config.backend}/posto/${uuid}`);
    return response.data;
  }

  async function browseRootDetails(): Promise<PostoBrowseDto> {
    const config = useBackendConfig();
    const response = await axios.get<PostoBrowseDto>(`${config.backend}/browse/root`);
    return response.data;
  }

  async function browsePostoDetails(uuid: string): Promise<PostoBrowseDto> {
    const config = useBackendConfig();
    const response = await axios.get<PostoBrowseDto>(`${config.backend}/browse/posto/${uuid}`);
    return response.data;
  }

  async function browseOggettoDetails(uuid: string): Promise<OggettoBrowseDto> {
    const config = useBackendConfig();
    const response = await axios.get<OggettoBrowseDto>(`${config.backend}/browse/oggetto/${uuid}`);
    return response.data;
  }

  async function getAnyObj(uuid: string): Promise<AnyObj> {
    const config = useBackendConfig();
    const response = await axios.get<AnyObj>(`${config.backend}/any/${uuid}`);
    return response.data;
  }

  function storeInCache(dto: AnyBrowseDto) {
    cacheAnyBrowse[dto.oggetto? dto.oggetto.id : dto.posto.id] = dto;
  }

  async function addPosto(main: string, branch: string): Promise<PostoObj> {
    const config = useBackendConfig();
    const response = await axios
    .post<PostoObj>(`${config.backend}/posto/${main}/${branch}`, null);
    return response.data;
  }

  async function addRoot(branch: string): Promise<PostoObj> {
    const config = useBackendConfig();
    const response = await axios
    .post<PostoObj>(`${config.backend}/posto/${branch}`, null);
    return response.data;
  }

  async function addOggetto(main: string, id: string): Promise<OggettoObj> {
    const config = useBackendConfig();
    const oggetto = <OggettoObj>{
      id: id,
      idPosto: main,
      nome: "",
      scheda: {},
    };
    const o = await axios
    .post<OggettoObj>(`${config.backend}/oggetto`, oggetto);
    return o.data;
  }

  async function addCodes(main: string, codes: string[]): Promise<OggettoObj[]> {
    const config = useBackendConfig();
    const o = await axios
    .post<OggettoObj[]>(`${config.backend}/posto/${main}/codes`, codes);
    return o.data;
  }

  async function updatePosto(posto: PostoObj): Promise<PostoObj> {
    const config = useBackendConfig();
    const o = await axios
    .post<PostoObj>(`${config.backend}/posto`, posto)
    return o.data;
  }

  async function updateOggetto(oggetto: OggettoObj): Promise<OggettoObj> {
    const config = useBackendConfig();
    const o = await axios
    .post<OggettoObj>(`${config.backend}/oggetto`, oggetto);
    return o.data;
  }

  async function uploadGallery(uuid:string, images:string[]): Promise<string[]> {
    const config = useBackendConfig();
    const o = await axios
    .post<string[]>(`${config.backend}/gallery/${uuid}`, images);
    return o.data;
  }

  async function deletePicture(uuid:string, image:string): Promise<Boolean> {
    const config = useBackendConfig();
    const o = await axios
    .delete<Boolean>(`${config.backend}/picture/${uuid}/${image}`);
    return o.data;

  }

  return { current, goToRoot, goToPosto, 
    addRoot, addPosto, updatePosto, 
    addOggetto, updateOggetto, addCodes,
    uploadGallery, fetchOggettoDetails, fetchPostoDetails,
    browseOggettoDetails, browsePostoDetails, browseRootDetails,
    getAnyObj, deletePicture,
    visibleOggetti, visiblePosti
  }
})
