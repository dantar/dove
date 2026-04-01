<script setup lang="ts">
import { useBrowseData } from '@/stores/browse-data';
import QrLauncher from './QrLauncher.vue';
import { ref, watch } from 'vue';
import OggettoHeader from './OggettoHeader.vue';
import PostoBreadcrumbs from './PostoBreadcrumbs.vue';
import type { PostoBrowseDto } from '@/models/browse-item';
import ItemsGallery from './ItemsGallery.vue';
import SchedaOggettoView from './SchedaOggettoView.vue';
import PostoHeader from './PostoHeader.vue';
import Heroicon from './Heroicon.vue';

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
    <div v-if="browsed.breadcrumbs" class="pagesection">
      <PostoBreadcrumbs :posti="browsed.breadcrumbs"></PostoBreadcrumbs>
      <PostoHeader v-if="browsed.posto" :posto="browsed.posto"></PostoHeader>
    </div>
    <div>
      <button @click="browse.visiblePosti = !browse.visiblePosti" v-if="browsed.posti">Posti: {{ browsed.posti.length }}</button>
      <button @click="browse.visibleOggetti = !browse.visibleOggetti" v-if="browsed.oggetti">Oggetti: {{ browsed.oggetti.length }}</button>
    </div>
    <div class="pagesection pagesection-with-buttons" v-if="browse.visiblePosti && browsed.posti">
      <ItemsGallery :items="browsed.posti">
        <template #item="{ item }">
          <PostoHeader :posto="item"></PostoHeader>
        </template>
        <template #empty><span class="notimportant">Nessun posto qui.</span></template>
      </ItemsGallery>
      <div class="overbuttons overbuttons--up">
        <span>
          <QrLauncher :disabled="addingPosto" @decoded="text => addPosto(text)">
            <Heroicon icon="qr-code-add"></Heroicon>
          </QrLauncher>
        </span>
      </div>
    </div>
    <div v-if="browse.visibleOggetti && browsed.posto" class="pagesection">
      <ItemsGallery :items="browsed.oggetti">
        <template #item="{ item }">
          <RouterLink :to="`/oggetto/${item.id}`">
            <OggettoHeader :form="item" :editable="false" :saving="false" :oggetto="item"></OggettoHeader>
          </RouterLink>
          <SchedaOggettoView v-if="item.scheda"
              :scheda="item.scheda"
              :form="item.scheda"
              :editable="false"
              :saving="false"
              ></SchedaOggettoView>
        </template>
        <template #empty>
          <div class="notimportant">Nessun oggetto in questo posto</div>
          <div>
            <QrLauncher :disabled="addingOggetto" @decoded="text => addOggetto(text)">
              <Heroicon icon="qr-code-add"></Heroicon>
              Aggiungi un oggetto!
            </QrLauncher>
          </div>
        </template>
      </ItemsGallery>
      <div class="overbuttons overbuttons--up">
        <span>
          <QrLauncher :disabled="addingOggetto" @decoded="text => addOggetto(text)">
            <Heroicon icon="qr-code-add"></Heroicon>
          </QrLauncher>
        </span>
      </div>
    </div>
  </div>
  <div></div>
</template>
<style scoped>
.moreposto {
  font-size: 0.9rem;
}
</style>
