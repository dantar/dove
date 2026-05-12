<script setup lang="ts">
import { SchedaBySchema } from '@/models/browse-item';
import { type SchedaOggettoCampo, type SearchOggettoBySchemaCampo, type SearchOggettoForm, type RepoSchemiJson, type TipoSchedaOggetto } from '@/stores/schede-by-schema';
import { useSearchData } from '@/stores/search-data';
import { ref } from 'vue';
import ItemsGallery from './ItemsGallery.vue';
import CardFormat from './CardFormat.vue';
import OggettoShort from './OggettoShort.vue';
import { RouterLink } from 'vue-router';
import ImageThumb from './ImageThumb.vue';
import SchedaOggettoView from './SchedaOggettoView.vue';
import type { RepoAccessObj } from '@/models/app-user';
import PostoHeader from './PostoHeader.vue';
import SearchMore from './SearchMore.vue';
import { useBrowseData } from '@/stores/browse-data';
import Heroicon from './Heroicon.vue';
import SlidingDrawer from './SlidingDrawer.vue';

const browse = useBrowseData();
const search = useSearchData();
const repo = ref(browse.currentRepo());

const form = ref(search.emptyForm(browse.repo));

async function doSearch() {
    await search.doSearch(JSON.parse(JSON.stringify(form.value)));
}

function addCriteria(repo: RepoAccessObj, schema: TipoSchedaOggetto, campo: SchedaOggettoCampo, data: SearchOggettoBySchemaCampo) {
    if (form.value.repo != repo.root.id) {
      search.restartForm();
      form.value.repo = repo.root.id;
    }
    form.value.query.push(data);
}

function addFilter(repo: RepoAccessObj, schema: TipoSchedaOggetto, campo: SchedaOggettoCampo, data: SearchOggettoBySchemaCampo) {
    if (form.value.repo != repo.root.id) {
      search.restartForm();
      form.value.repo = repo.root.id;
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

    <SlidingDrawer>
      <template #title>Nuova ricerca</template>
      <template #menu>&nbsp;</template>
      <template #content>
        <CardFormat class="spacedarea" v-for="queryitem in form.query">
          <template #header>
            <div>{{ queryitem.campo }} </div>
          </template>
          <button class="top-right-button" @click="removeCriteria(queryitem)"><Heroicon icon="trash"/></button>
          <div class="spacedarea">
            {{ queryitem.criteria }}
          </div>
        </CardFormat>
        <div class="spacedarea">
            <button type="button" @click="doSearch" :disabled="form.query.length == 0">cerca</button>
        </div>
      </template>
    </SlidingDrawer>

    <div class="spacedarea">
      <div class="spacedarea">
        <PostoHeader :posto="repo.root"></PostoHeader>
      </div>
      <div class="spacedarea">
        <button v-for="schema in repo.schemi" type="button" @click="selectRepoSchema(repo.root.id, schema.id);">{{ schema.nome }}</button>
      </div>
      <div v-for="schema in repo.schemi" class="spacedarea">
        <CardFormat class="spacedarea" v-if="schema.id == selectedSchema">
          <div v-for="campo in schema.campi" class="spacedarea">
            <div>{{ campo.nome }}</div>
            <component :is="SchedaBySchema.handler[campo.tipo]?.searchComponent()" v-bind="{repo, schema, campo}" 
              @addCriteria="(c: SearchOggettoBySchemaCampo) => addCriteria(repo, schema, campo, c)">
              <template #default="{data, empty}">
                <button type="button" @click="addFilter(repo, schema, campo, data)" :disabled="empty">+</button>
              </template>
            </component>
          </div>
        </CardFormat>
      </div>
    </div>

    <SlidingDrawer v-if="search.form && search.form.query.length > 0">
      <template #title>Criterio di ricerca</template>
      <template #menu>&nbsp;</template>
      <template #content>
        {{ search.form }}
      </template>
    </SlidingDrawer>
    <SlidingDrawer v-if="search.form && search.form.query.length > 0">
      <template #title>Risultati di ricerca <template v-if="search.page.totalElements > 0">(x{{ search.page.totalElements }})</template></template>
      <template #menu>&nbsp;</template>
      <template #content>
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
      </template>
    </SlidingDrawer>
</template>
<style scoped>

.spacedarea {
  margin: 5px;
}

.top-right-button {
  position:absolute;
  top: 5px;
  right: 5px;
}

</style>