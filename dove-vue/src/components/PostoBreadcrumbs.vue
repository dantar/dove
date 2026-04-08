<script setup lang="ts">
import type { PostoObj } from '@/models/browse-item';
import PostoShort from './PostoShort.vue';

interface Props {
  posti: PostoObj[],
}
const props = defineProps<Props>()

</script>
<template>
  <div class="breadcrumbs">
    <span v-for="(posto, index) in props.posti">
      <span v-if="index > 0" class="separator"><slot>/</slot></span>
      <PostoShort :posto="posto"></PostoShort>
    </span>
  </div>
</template>
<style scoped>
</style>
