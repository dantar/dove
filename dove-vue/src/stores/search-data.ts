import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useBackendConfig } from './backend-config';
import type { SearchOggettoForm } from './schede-by-schema';
import axios from 'axios';
import type { OggettoObj } from '@/models/browse-item';

export interface PageData {
  pageNumber: number;
  pageSize: number;
  sort: {
    sorted: boolean;
    unsorded: boolean;
    empty: boolean;
  }
  offset: number;
}

export interface SearchPage<T> {
  content: T[];
  pageable: PageData;
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  empty: boolean;
}

export const useSearchData = defineStore('searchData', () => {
  const config = useBackendConfig();
  async function doSearch(form: SearchOggettoForm): Promise<SearchPage<OggettoObj>> {
    const response = await axios
    .post<SearchPage<OggettoObj>>(`${config.backend}/search/oggetto`, form);
    return response.data;
  }
  return { doSearch }
})
