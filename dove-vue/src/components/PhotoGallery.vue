<script setup lang="ts">

import type { OggettoObj } from '@/models/browse-item';
import { useBackendConfig } from '@/stores/backend-config';
import { useBrowseData } from '@/stores/browse-data';
import { ref } from 'vue';
import ImageThumb from './ImageThumb.vue';

interface Props {
  id: string,
  images: string[],
}
const props = defineProps<Props>()

const config = useBackendConfig();

const editable = ref(false);

</script>

<template>
  <ul>
    <li v-for="img in props.images">
      <ImageThumb :uuid="`${props.id}`" :image="`${img}`"></ImageThumb>
    </li>
  </ul>
</template>

<style scoped></style>
