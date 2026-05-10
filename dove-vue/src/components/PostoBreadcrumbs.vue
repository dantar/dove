<script setup lang="ts">
import type { PostoObj } from '@/models/browse-item';
import PostoShort from './PostoShort.vue';
import CardFormat from './CardFormat.vue';

interface Props {
  posti: PostoObj[],
}
const props = defineProps<Props>()

</script>
<template>
  <div class="breadcrumbs">
    <template v-if="props.posti.length > 0" v-for="(posto, index) in props.posti" >
      <span v-if="index > 0" class="separator"><slot>/</slot></span>
      <span class="breadcrumb">
        <PostoShort :posto="posto"></PostoShort>
      </span>
    </template>
    <slot v-else name="empty">Nessun posto</slot>
  </div>
</template>
<style scoped>
.breadcrumbs {
  /* display: flex; */
  /* flex-direction: row; */
  /* flex-wrap: wrap; */
}
.breadcrumb {
  /* border: 1px solid gray; */
  /* padding: 2px; */
  /* border-radius: 4px; */
  /* text-align: center; */
  display: inline-flex; /* layout interno */
  align-items: center;
  gap: 6px;

  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 12px;

  flex-shrink: 0;       /* 🔴 fondamentale: NON si restringe */
  white-space: nowrap;  /* 🔴 evita che il testo vada a capo */
}
</style>
