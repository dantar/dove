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
  <div>Breadcrumbs</div>
  <div>
    <span class="breadcrumb"><RouterLink to="/browse">/</RouterLink></span>
    <span class="breadcrumb" v-for="posto in props.posti">
      <PostoShort :posto="posto"></PostoShort>
    </span>
  </div>
</template>
<style scoped>
.breadcrumb {
  color: green;
  border: 1px solid green;
  padding: 2px;
  margin: 1px;
}
</style>
