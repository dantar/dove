<script setup lang="ts">
import { useBrowseData } from '@/stores/browse-data';
import QrLauncher from './QrLauncher.vue';
import { ref, watch } from 'vue';
import PostoBreadcrumbs from './PostoBreadcrumbs.vue';
import type { PostoBrowseDto } from '@/models/browse-item';
import ItemsGallery from './ItemsGallery.vue';
import SchedaOggettoView from './SchedaOggettoView.vue';
import PostoHeader from './PostoHeader.vue';
import Heroicon from './Heroicon.vue';
import CardFormat from './CardFormat.vue';
import ImageThumb from './ImageThumb.vue';
import OggettoShort from './OggettoShort.vue';

interface Props {
  uuid: string,
}
const props = defineProps<Props>();

const browse = useBrowseData();

const browsed = ref<PostoBrowseDto>();
async function loadPosto(uuid: string) {
  browsed.value = await browse.browsePostoDetails(uuid);
}
loadPosto(props.uuid)
watch(() => props.uuid, loadPosto);

async function addPosto(text: string) {
  addingPosto.value = true;
  const b = browsed.value as PostoBrowseDto;
  if (b.posto) {
    b.posti.push(await browse.addPosto(b.posto.id, text));
  } else {
    b.posti.push(await browse.addRoot(text));
  }
  addingPosto.value = false;
}

async function addOggetto(codes: string[]) {
  addingOggetto.value = true;
  const b = browsed.value as PostoBrowseDto;
  const os = await browse.addCodes(b.posto.id, codes);
  b.oggetti.push(...os);
  addingOggetto.value = false;
}

const addingPosto = ref(false);
const addingOggetto = ref(false);

</script>
<template>
  <div v-if="browsed">
    <div class="pagesection pagesection-with-buttons">
      <div class="overbuttons overbuttons--up">
        <span>
          <QrLauncher :disabled="addingPosto" mode="one" @decoded-one="text => addPosto(text)">
            <Heroicon icon="qr-code-add"></Heroicon>
          </QrLauncher>
        </span>
      </div>
      <PostoBreadcrumbs v-if="browsed.breadcrumbs && browsed.breadcrumbs.length > 0" :posti="browsed.breadcrumbs"></PostoBreadcrumbs>
      <div class="page-header">
        <PostoHeader v-if="browsed.posto" :posto="browsed.posto"></PostoHeader>
      </div>
      <div v-if="browsed.posti" class="more-posti">
        <PostoBreadcrumbs :posti="browsed.posti">&nbsp;</PostoBreadcrumbs>
      </div>
    </div>
    <div v-if="browsed.posto" class="pagesection">
      <ItemsGallery :items="browsed.oggetti">
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
                    :repo="browsed.repo"
                    ></SchedaOggettoView>
              </template>
            </CardFormat>
          </RouterLink>

        </template>
        <template #empty>
          <div class="notimportant">Nessun oggetto in questo posto</div>
          <div>
            <QrLauncher mode="many" :disabled="addingOggetto" @decoded-many="codes => addOggetto(codes)">
              <Heroicon icon="qr-code-add"></Heroicon>
              Aggiungi un oggetto!
            </QrLauncher>
          </div>
        </template>
      </ItemsGallery>
      <div class="overbuttons overbuttons--up">
        <span>
          <QrLauncher :disabled="addingOggetto" mode="many" @decoded-many="codes => addOggetto(codes)">
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
.oggetto-header {
  text-align: center;
  font-size: 1.1em;
}
.card-image .identicon {
  padding: 15%;
  width: 100px;
}
.page-header {
  padding-left: 10px;
  font-size: 1.2em;
  background-color: #ddd;
}
.more-posti {
  padding-left: 20px;
}
</style>
