<script setup lang="ts">
import { useBrowseData } from '@/stores/browse-data';
import PostoShort from './PostoShort.vue';
import PostoHeader from './PostoHeader.vue';
import QrLauncher from './QrLauncher.vue';
import OggettoShort from './OggettoShort.vue';
import { ref, watch } from 'vue';
import OggettoHeader from './OggettoHeader.vue';
import PostoBreadcrumbs from './PostoBreadcrumbs.vue';
import type { OggettoObj, PostoBrowseDto, PostoObj } from '@/models/browse-item';
import ImageThumb from './ImageThumb.vue';
import ItemsGallery from './ItemsGallery.vue';

interface Props {
  uuid?: string,
}
const props = defineProps<Props>();

const browse = useBrowseData();

const browsed = ref<PostoBrowseDto>();
async function loadPosto(uuid?: string) {
  if (uuid) {
    browsed.value = await browse.browsePostoDetails(uuid);
  } else {
    browsed.value = await browse.browseRootDetails();
  }
}
loadPosto(props.uuid)

watch(() => props.uuid, loadPosto);

async function addPosto(text: string) {
  console.log("addPosto", text);
  addingPosto.value = true;
  const b = browsed.value as PostoBrowseDto;
  if (b.posto) {
    b.posti.push(await browse.addPosto(b.posto.id, text));
  } else {
    b.posti.push(await browse.addRoot(text));
  }
  addingPosto.value = false;
  console.log("done addPosto");
}

async function addOggetto(text: string) {
  addingOggetto.value = true;
  const b = browsed.value as PostoBrowseDto;
  const o = await browse.addOggetto(b.posto.id, text);
  b.oggetti.push(o);
  addingOggetto.value = false;
}

const addingPosto = ref(false);
const addingOggetto = ref(false);

</script>
<template>
  <div v-if="browsed">
    <div v-if="browsed.breadcrumbs">
      <PostoBreadcrumbs :posti="browsed.posto ? browsed.breadcrumbs.concat(browsed.posto) : browsed.breadcrumbs"></PostoBreadcrumbs>
    </div>
    <div v-if="browsed.posti">
      <span>Posti</span>
      <span v-for="posto in browsed.posti" class="more-posto"><PostoShort :posto="posto"></PostoShort></span>
    </div>
    <div>
      <span>Aggiungi un posto</span>
      <QrLauncher :disabled="addingPosto" @decoded="text => addPosto(text)"></QrLauncher>
    </div>
    <div v-if="browsed.posto">
      <div>Oggetti</div>

      <ItemsGallery :items="browsed.oggetti">
        <template #item="{ item }">
          <RouterLink :to="`/oggetto/${item.id}`">
            <ImageThumb v-if="item.thumbnail" :uuid="item.id" :image="item.thumbnail"></ImageThumb>
          </RouterLink>
          <OggettoShort :oggetto="item"></OggettoShort>
        </template>
        <template #empty><span>Nessun oggetto in questo posto</span></template>
      </ItemsGallery>

      <div>
        <span>Aggiungi un oggetto:</span>
        <QrLauncher :disabled="addingOggetto" @decoded="text => addOggetto(text)"></QrLauncher>
      </div>
    </div>
  </div>
  <div></div>
</template>
<style scoped>
.more-posto {
  color: lightgreen;
  border: 1px solid lightgreen;
  padding: 2px;
  margin: 1px;
}
</style>
