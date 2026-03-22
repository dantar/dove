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
    <span><RouterLink to="/browse"><span class="entity entity--home"></span></RouterLink></span>
    <span v-for="(posto, index) in props.posti">
      <span class="separator">/</span>
      <PostoShort :posto="posto"></PostoShort>
    </span>
  </div>
</template>
<style scoped>
</style>
