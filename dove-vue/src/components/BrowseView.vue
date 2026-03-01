<script setup lang="ts">
import { useBrowseData } from '@/stores/browse-data';
import PostoShort from './PostoShort.vue';

const browse = useBrowseData();

if (!browse.current) {
  browse.goToRoot();
}

</script>
<template>
  <div v-if="browse.current">
    <div>Breadcrumbs</div>
    <PostoShort v-for="posto in browse.current?.breadcrumbs" :posto="posto"></PostoShort>
    <div>Posto</div>
    <PostoShort :posto="browse.current?.posto"></PostoShort>
    <div>Posti</div>
    <PostoShort v-for="posto in browse.current?.posti" :posto="posto"></PostoShort>
    <div>Aggiungi un posto</div>
    <div></div>
  </div>
  <div></div>
</template>
<style scoped></style>
