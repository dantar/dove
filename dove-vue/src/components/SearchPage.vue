<script setup lang="ts">
import { SchedaBySchema, type OggettoObj } from '@/models/browse-item';
import { useBackendConfig } from '@/stores/backend-config';
import { type SchedaOggettoCampo, useTipiSchedeOggetto, type SearchOggettoBySchemaCampo, type SearchOggettoForm, type RepoSchemiJson, type TipoSchedaOggetto } from '@/stores/schede-by-schema';
import { useSearchData, type SearchPage } from '@/stores/search-data';
import axios from 'axios';
import { ref } from 'vue';
import ItemsGallery from './ItemsGallery.vue';
import CardFormat from './CardFormat.vue';
import OggettoShort from './OggettoShort.vue';
import { RouterLink } from 'vue-router';
import ImageThumb from './ImageThumb.vue';
import SchedaOggettoView from './SchedaOggettoView.vue';

const schemi = useTipiSchedeOggetto();

const found = ref<SearchPage<OggettoObj>>();

const search = useSearchData();

const form = ref<SearchOggettoForm>({
    repo: '',
    query: [],
    pageIndex: 0,
    pageSize: 10
});

async function doSearch() {
    found.value = await search.doSearch(form.value);
}

function addCriteria(repo: RepoSchemiJson, schema: TipoSchedaOggetto, campo: SchedaOggettoCampo, data: SearchOggettoBySchemaCampo) {
    if (form.value.repo != repo.id) {
        form.value.repo = repo.id;
        form.value.query = [];
    }
    form.value.query.push(data);
}

function addFilter(repo: RepoSchemiJson, schema: TipoSchedaOggetto, campo: SchedaOggettoCampo, data: SearchOggettoBySchemaCampo) {
    if (form.value.repo != repo.id) {
        form.value.repo = repo.id;
        form.value.query = [];
    }
    form.value.query.push({
      campo: campo.id,
      schema: schema.id,
      tipo: 'schema',
      criteria: data,
    });  
}

function removeCriteria(data: SearchOggettoBySchemaCampo) {
    form.value.query.splice(form.value.query.indexOf(data), 1);
}

const selectedRepo = ref('');
const selectedSchema = ref('');

function selectRepoSchema(repo: string, schema: string) {
  selectedRepo.value = repo;
  selectedSchema.value = schema;
}

</script>
<template>
    <div>
        <div>
          <CardFormat v-for="queryitem in form.query">
            <template #header>
              <span>{{ queryitem.campo }} <button type="button" @click="removeCriteria(queryitem)">X</button></span>
            </template>
            {{ queryitem.criteria }}
          </CardFormat>
        </div>
        <div>
            <button type="button" @click="doSearch" :disabled="form.query.length == 0">cerca</button>
        </div>
    </div>
    <div v-for="repo in schemi.tipiByRepo">
        {{ repo.id }}
        <div>
          <button v-for="schema in repo.schemi" type="button" @click="selectRepoSchema(repo.id, schema.id);">{{ schema.nome }}</button>
        </div>
        <div v-for="schema in repo.schemi">
          <div v-if="schema.id == selectedSchema" v-for="campo in schema.campi">
            <div>{{ campo.nome }}</div>
            <component :is="SchedaBySchema.handler[campo.tipo]?.searchComponent()" v-bind="{repo, schema, campo}" 
              @addCriteria="(c: SearchOggettoBySchemaCampo) => addCriteria(repo, schema, campo, c)">
              <template #default="{data, empty}">
                <button type="button" @click="addFilter(repo, schema, campo, data)" :disabled="empty">+</button>
              </template>
            </component>
          </div>
        </div>
    </div>
    <div v-if="found">
      <h1>Oggetti trovati: {{ found.totalElements }}</h1>
      <div>{{ found.totalElements }}</div>
      <ItemsGallery :items="found.content">
        <template #item="{ item }">
          <CardFormat>
            <template #header>
              <div class="oggetto-header">
                <OggettoShort :oggetto="item"></OggettoShort>
              </div>
            </template>
            <template #default>
              <RouterLink :to="`/oggetto/${item.id}`">
                <div class="card-image">
                  <ImageThumb :uuid="item.id" :image="item.thumbnail"></ImageThumb>
                </div>
                <SchedaOggettoView v-if="item.scheda"
                    :scheda="item.scheda"
                    :form="item.scheda"
                    :editable="false"
                    :saving="false"
                    :repo="item.repo"
                    ></SchedaOggettoView>
              </RouterLink>
            </template>
          </CardFormat>
        </template>
        <template #empty>
          <div class="notimportant">Nessun risultato trovato</div>
        </template>
      </ItemsGallery>
    </div>
</template>
<style scoped></style>