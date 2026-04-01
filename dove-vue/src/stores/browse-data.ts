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
    console.log("Fetch root");
    const config = useBackendConfig();
    axios
    .get<PostoBrowseDto>(`${config.backend}/browse/root`, config.bearer())
    .then((response) => {
        current.value = response.data;
    });
  }

  function goToPosto(id: string): void {
    console.log(`Fetch ${id}`);
    const config = useBackendConfig();
    axios
    .get<PostoBrowseDto>(`${config.backend}/browse/posto/${id}`, config.bearer())
    .then((response) => {
        current.value = response.data;
    });
  }

  async function fetchOggettoDetails(uuid: string): Promise<OggettoObj> {
    const config = useBackendConfig();
    const response = await axios.get<OggettoObj>(`${config.backend}/oggetto/${uuid}`, config.bearer());
    return response.data;
  }

  async function fetchPostoDetails(uuid: string): Promise<PostoObj> {
    const config = useBackendConfig();
    const response = await axios.get<PostoObj>(`${config.backend}/posto/${uuid}`, config.bearer());
    return response.data;
  }

  async function browseRootDetails(): Promise<PostoBrowseDto> {
    const config = useBackendConfig();
    const response = await axios.get<PostoBrowseDto>(`${config.backend}/browse/root`, config.bearer());
    return response.data;
  }

  async function browsePostoDetails(uuid: string): Promise<PostoBrowseDto> {
    const config = useBackendConfig();
    const response = await axios.get<PostoBrowseDto>(`${config.backend}/browse/posto/${uuid}`, config.bearer());
    return response.data;
  }

  async function browseOggettoDetails(uuid: string): Promise<OggettoBrowseDto> {
    const config = useBackendConfig();
    const response = await axios.get<OggettoBrowseDto>(`${config.backend}/browse/oggetto/${uuid}`, config.bearer());
    return response.data;
  }

  async function getAnyObj(uuid: string): Promise<AnyObj> {
    const config = useBackendConfig();
    const response = await axios.get<AnyObj>(`${config.backend}/any/${uuid}`, config.bearer());
    return response.data;
  }

  function storeInCache(dto: AnyBrowseDto) {
    cacheAnyBrowse[dto.oggetto? dto.oggetto.id : dto.posto.id] = dto;
  }

  async function addPosto(main: string, branch: string): Promise<PostoObj> {
    const config = useBackendConfig();
    const response = await axios
    .post<PostoObj>(`${config.backend}/posto/${main}/${branch}`, null, config.bearer());
    return response.data;
  }

  async function addRoot(branch: string): Promise<PostoObj> {
    const config = useBackendConfig();
    const response = await axios
    .post<PostoObj>(`${config.backend}/posto/${branch}`, null, config.bearer());
    return response.data;
  }

  async function addOggetto(main: string, id: string): Promise<OggettoObj> {
    const config = useBackendConfig();
    const oggetto = <OggettoObj>{
      id: id,
      idPosto: main,
      nome: "Nuovo oggetto",
      scheda: {},
    };
    const o = await axios
    .post<OggettoObj>(`${config.backend}/oggetto`, oggetto, config.bearer());
    return o.data;
  }

  async function updatePosto(posto: PostoObj): Promise<PostoObj> {
    const config = useBackendConfig();
    const o = await axios
    .post<PostoObj>(`${config.backend}/posto`, posto, config.bearer())
    return o.data;
  }

  async function updateOggetto(oggetto: OggettoObj): Promise<OggettoObj> {
    const config = useBackendConfig();
    const o = await axios
    .post<OggettoObj>(`${config.backend}/oggetto`, oggetto, config.bearer());
    return o.data;
  }

  async function uploadGallery(uuid:string, images:string[]): Promise<string[]> {
    const config = useBackendConfig();
    const o = await axios
    .post<string[]>(`${config.backend}/gallery/${uuid}`, images, config.bearer());
    return o.data;
  }

  async function deletePicture(uuid:string, image:string): Promise<Boolean> {
    const config = useBackendConfig();
    const o = await axios
    .delete<Boolean>(`${config.backend}/picture/${uuid}/${image}`, config.bearer());
    return o.data;

  }

  return { current, goToRoot, goToPosto, 
    addRoot, addPosto, updatePosto, 
    addOggetto, updateOggetto,
    uploadGallery, fetchOggettoDetails, fetchPostoDetails,
    browseOggettoDetails, browsePostoDetails, browseRootDetails,
    getAnyObj, deletePicture,
    visibleOggetti, visiblePosti
  }
})
