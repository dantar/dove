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
  <RouterLink to="/browse">/</RouterLink>
  <span v-for="posto in props.posti">
    <PostoShort :posto="posto"></PostoShort>
  </span>
</template>
<style scoped></style>
