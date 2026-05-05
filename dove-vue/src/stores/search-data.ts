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

const PAGE_SIZE = 5;

function makeEmptySearchForm(): SearchOggettoForm {
  return {
    repo: '',
    query: [],
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  };
}

function makeEmptySearchPage(): SearchPage<OggettoObj> {
  return {
    content: [],
    pageable: {
      pageNumber: 0,
      pageSize: 0,
      sort: {
        sorted: false,
        unsorded: true,
        empty: true,
      },
      offset: 0,
    },
    totalPages: 0,
    totalElements: 0,
    last: true,
    first: true,
    size: 0,
    number: 0,
    numberOfElements: 0,
    empty: true
  };
}

export const useSearchData = defineStore('searchData', () => {
  const config = useBackendConfig();
  const form = ref<SearchOggettoForm>(makeEmptySearchForm());
  const found = ref<OggettoObj[]>([]);
  const page = ref<SearchPage<OggettoObj>>(makeEmptySearchPage());
  async function doSearch(f: SearchOggettoForm): Promise<SearchPage<OggettoObj>> {
    form.value = JSON.parse(JSON.stringify(f));
    form.value.pageIndex = 0;
    form.value.pageSize = PAGE_SIZE;
    const response = await axios
    .post<SearchPage<OggettoObj>>(`${config.backend}/search/oggetto`, form.value);
    page.value = response.data;
    found.value = response.data.content;
    return response.data;
  }
  async function oneMorePage(): Promise<SearchPage<OggettoObj>> {
    form.value.pageIndex++;
    const response = await axios
    .post<SearchPage<OggettoObj>>(`${config.backend}/search/oggetto`, form.value);
    page.value = response.data;
    found.value.splice(found.value.length, 0, ...response.data.content);
    return response.data;
  }
  function restartForm() {
    form.value = makeEmptySearchForm();
  }
  return { form, found, page, doSearch, oneMorePage, restartForm }
})
