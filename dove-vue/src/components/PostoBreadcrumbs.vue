<script setup lang="ts">
import type { PostoObj } from '@/models/browse-item';
import { useBrowseData } from '@/stores/browse-data';
import PostoShort from './PostoShort.vue';
import { useBackendConfig } from '@/stores/backend-config';
import { ref } from 'vue';

interface Props {
  posti: PostoObj[],
}
const props = defineProps<Props>()

</script>
<template>
  <div class="breadcrumbs">
    <span><RouterLink to="/browse"><span class="entity entity--posto"></span></RouterLink></span>
    <span v-for="(posto, index) in props.posti">
      <span class="separator">/</span>
      <PostoShort :posto="posto"></PostoShort>
    </span>
  </div>
</template>
<style scoped>
</style>
