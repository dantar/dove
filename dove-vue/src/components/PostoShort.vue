<script setup lang="ts">
import type { PostoObj } from '@/models/browse-item';
import ImageThumb from './ImageThumb.vue';
interface Props {
  posto: PostoObj
}
const props = defineProps<Props>()
</script>
<template>
  <RouterLink :to="`/posto/${posto.id}`">
    <span class="title-short posto-box entity entity--posto">
      <ImageThumb :uuid="posto.id" :image="''"></ImageThumb>
      <span class="posto-name">{{ posto.nome || `Posto ${posto.id.split('-')[0]}` }}</span>
    </span>
  </RouterLink>
</template>
<style scoped>
.posto-box {
  /* display: flex; */
}
.posto-name {
  /* flex: 1; */
  margin-right: 1rem;
}
</style>
