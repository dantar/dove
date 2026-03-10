<script setup lang="ts">
import { useBrowseData } from '@/stores/browse-data';
import PostoShort from './PostoShort.vue';
import PostoHeader from './PostoHeader.vue';
import type { PostoObj } from '@/models/browse-item';
import QrLauncher from './QrLauncher.vue';
import OggettoShort from './OggettoShort.vue';
import { ref } from 'vue';
import OggettoHeader from './OggettoHeader.vue';

const browse = useBrowseData();

if (!browse.current) {
  browse.goToRoot();
}

const oggetti = ref<string[]>([]);

</script>
<template>
  <div v-if="browse.current">
    <div>
      <div>Breadcrumbs</div>
      <button @click="browse.goToRoot()">/</button>
      <PostoShort @click="browse.goToPosto(posto.id)" v-for="posto in browse.current?.breadcrumbs" :posto="posto"></PostoShort>
    </div>
    <div v-if="browse.current?.posto">
      <div>Posto</div>
      <PostoHeader v-if="browse.current?.posto" :posto="browse.current?.posto" :key="browse.current?.posto.id"></PostoHeader>
    </div>
    <div v-if="browse.current?.posti">
      <div>Posti</div>
      <div v-for="posto in browse.current?.posti">
        <PostoShort @click="browse.goToPosto(posto.id)" :posto="posto"></PostoShort>        
      </div>
    </div>
    <div v-if="browse.current?.posto">
      <QrLauncher @decoded="text => browse.addPosto(browse.current?.posto.id as string, text)"></QrLauncher>
    </div>
    <div v-if="browse.current?.oggetti">
      <div v-for="oggetto in browse.current?.oggetti">
        <div v-if="!oggetti.includes(oggetto.id)">
          <OggettoShort :oggetto="oggetto"></OggettoShort>
          <button @click="() => oggetti.push(oggetto.id)">▽</button>
        </div>
        <div v-if="oggetti.includes(oggetto.id)">
          <button @click="() => oggetti.splice(oggetti.indexOf(oggetto.id), 1)">△</button>
          <OggettoHeader :key="oggetto.id" :oggetto="oggetto"></OggettoHeader>
        </div>
      </div>
    </div>
    <div>
      <QrLauncher @decoded="text => browse.addOggetto(browse.current?.posto.id as string, text)"></QrLauncher>
    </div>
  </div>
  <div></div>
</template>
<style scoped></style>
