<script setup lang="ts">
import type { PostoObj } from '@/models/browse-item';
interface Props {
  posto: PostoObj
}
const props = defineProps<Props>()
</script>
<template>
  <RouterLink :to="`/posto/${posto.id}`">
    <span class="posto-short entity entity--posto">{{ posto?.nome || posto?.id }}</span>
  </RouterLink>
</template>
<style scoped></style>
