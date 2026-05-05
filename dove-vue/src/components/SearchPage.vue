<script setup lang="ts">
import { SchedaBySchema, type OggettoObj } from '@/models/browse-item';
import { type SchedaOggettoCampo, type SearchOggettoBySchemaCampo, type SearchOggettoForm, type RepoSchemiJson, type TipoSchedaOggetto } from '@/stores/schede-by-schema';
import { useSearchData, type SearchPage } from '@/stores/search-data';
import { onMounted, onUnmounted, ref } from 'vue';
import ItemsGallery from './ItemsGallery.vue';
import CardFormat from './CardFormat.vue';
import OggettoShort from './OggettoShort.vue';
import { RouterLink } from 'vue-router';
import ImageThumb from './ImageThumb.vue';
import SchedaOggettoView from './SchedaOggettoView.vue';
import { useLoggedUser } from '@/stores/logged-user';
import type { RepoAccessObj } from '@/models/app-user';
import PostoHeader from './PostoHeader.vue';
import SearchMore from './SearchMore.vue';

const user = useLoggedUser();

const search = useSearchData();
// const page = ref<SearchPage<OggettoObj>>(search.page);
// const form = ref(search.current);
// const found = ref(search.found);

async function doSearch() {
    await search.doSearch(search.form);
}

function addCriteria(repo: RepoAccessObj, schema: TipoSchedaOggetto, campo: SchedaOggettoCampo, data: SearchOggettoBySchemaCampo) {
    if (search.form.repo != repo.root.id) {
        search.form.repo = repo.root.id;
        search.restartForm();
    }
    search.form.query.push(data);
}

function addFilter(repo: RepoAccessObj, schema: TipoSchedaOggetto, campo: SchedaOggettoCampo, data: SearchOggettoBySchemaCampo) {
    if (search.form.repo != repo.root.id) {
      search.restartForm();
      search.form.repo = repo.root.id;
    }
    search.form.query.push({
      campo: campo.id,
      schema: schema.id,
      tipo: 'schema',
      criteria: data,
    });  
}

function removeCriteria(data: SearchOggettoBySchemaCampo) {
    search.form.query.splice(search.form.query.indexOf(data), 1);
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
          <CardFormat v-for="queryitem in search.form.query">
            <template #header>
              <span>{{ queryitem.campo }} <button type="button" @click="removeCriteria(queryitem)">X</button></span>
            </template>
            {{ queryitem.criteria }}
          </CardFormat>
        </div>
        <div>
            <button type="button" @click="doSearch" :disabled="search.form.query.length == 0">cerca</button>
        </div>
    </div>
    <div v-for="repo in user.user.repos">
        <PostoHeader :posto="repo.root"></PostoHeader>
        <div>
          <button v-for="schema in repo.schemi" type="button" @click="selectRepoSchema(repo.root.id, schema.id);">{{ schema.nome }}</button>
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
    <div v-if="search.page">
      <h1>Oggetti trovati: {{ search.page.totalElements }}</h1>
      <ItemsGallery v-if="search.found" :items="search.found">
        <template #item="{ item }">
          <RouterLink :to="`/oggetto/${item.id}`">
            <CardFormat>
              <template #header>
                <div class="oggetto-header">
                  <OggettoShort :oggetto="item"></OggettoShort>
                </div>
              </template>
              <template #image>
                <ImageThumb :uuid="item.id" :image="item.thumbnail"></ImageThumb>
              </template>
              <template #default>
                <SchedaOggettoView v-if="item.scheda"
                    :scheda="item.scheda"
                    :form="item.scheda"
                    :editable="false"
                    :saving="false"
                    :repo="item.repo"
                    ></SchedaOggettoView>
              </template>
            </CardFormat>
          </RouterLink>
        </template>
        <template #end>
          <SearchMore v-if="!search.page.last"></SearchMore>
        </template>
        <template #empty>
          <div class="notimportant">Nessun risultato trovato</div>
        </template>
      </ItemsGallery>
    </div>
</template>
<style scoped></style>