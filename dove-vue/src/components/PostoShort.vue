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
    <span class="title-short entity entity--posto">
      <ImageThumb :uuid="posto.id" :image="''"></ImageThumb>
      {{ posto.nome || posto.id }}
    </span>
  </RouterLink>
</template>
<style scoped></style>
