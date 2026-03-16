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
  browse.addPosto(props.uuid || '', text)  
}

</script>
<template>
  <div v-if="browsed">
    <div>
      <PostoBreadcrumbs :posti="browsed.breadcrumbs"></PostoBreadcrumbs>
    </div>
    <div v-if="browsed.posto">
      <div>Posto</div>
      <PostoHeader v-if="browsed.posto" :posto="browsed.posto" :key="browsed.posto.id"></PostoHeader>
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
    <div v-if="browsed.posto">
      <span>Aggiungi un posto</span>
      <QrLauncher @decoded="text => addPosto(text)"></QrLauncher>
    </div>
    <div>Oggetti</div>
    <div v-if="browsed.oggetti">
      <div v-for="oggetto in browsed.oggetti">
        <OggettoShort :oggetto="oggetto"></OggettoShort>
      </div>
    </div>
    <div v-if="browsed.posto">
      <span>Aggiungi un oggetto:</span>
      <QrLauncher @decoded="text => browse.addOggetto(browsed?.posto.id as string, text)"></QrLauncher>
    </div>
  </div>
  <div></div>
</template>
<style scoped></style>
