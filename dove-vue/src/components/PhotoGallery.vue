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
    <span v-for="img in props.images" class="gallery-img"><ImageThumb :uuid="`${props.id}`" :image="`${img}`"></ImageThumb></span>
  </div>
</template>

<style scoped>

.gallery-box {
  display: grid;
  gap: 6px;
  grid-template-columns: repeat(var(--cols), 1fr);
}

.stacking-single { --cols: 1; }
.stacking-double { --cols: 2; }
.stacking-triple { --cols: 3; }

</style>
