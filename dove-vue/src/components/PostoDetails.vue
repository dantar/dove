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
      <div>Posti</div>
      <div v-for="posto in browsed.posti">
        <span>
          <nav>
            <PostoShort :posto="posto"></PostoShort>
          </nav>
        </span>
      </div>
    </div>
    <div>
      <span>Aggiungi un posto</span>
      <QrLauncher :disabled="addingPosto" @decoded="text => addPosto(text)"></QrLauncher>
    </div>
    <div v-if="browsed.posto">
      <div>Oggetti</div>
      <div v-if="browsed.oggetti">
        <div v-for="oggetto in browsed.oggetti">
          <ImageThumb v-if="oggetto.thumbnail" :uuid="oggetto.id" :image="oggetto.thumbnail"></ImageThumb>
          <OggettoShort :oggetto="oggetto"></OggettoShort>
        </div>
      </div>
      <div v-else>Nessun oggetto presente</div>
      <div>
        <span>Aggiungi un oggetto:</span>
        <QrLauncher :disabled="addingOggetto" @decoded="text => addOggetto(text)"></QrLauncher>
      </div>
    </div>
  </div>
  <div></div>
</template>
<style scoped></style>
