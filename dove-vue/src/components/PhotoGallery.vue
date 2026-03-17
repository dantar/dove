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

const mode = ref('double');
</script>

<template>
  <div>
    <button type="button" @click="mode = 'single'">x1</button>
    <button type="button" @click="mode = 'double'">x2</button>
    <button type="button" @click="mode = 'triple'">x3</button>
  </div>
  <div class="gallery-box" :class="`stacking-${mode}`" >
    <ImageThumb v-for="img in props.images" :uuid="`${props.id}`" :image="`${img}`"></ImageThumb>
  </div>
</template>

<style scoped>
.gallery-box {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}

.stacking-single img {
  max-width: 100%;
}
.stacking-double img {
  max-width: 50%;
  border: 2px solid white;
}
.stacking-triple img {
  max-width: 33%;
}
</style>
