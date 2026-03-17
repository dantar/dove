<script setup lang="ts">

import type { OggettoObj } from '@/models/browse-item';
import { useBackendConfig } from '@/stores/backend-config';
import { useBrowseData } from '@/stores/browse-data';
import { ref } from 'vue';
import ImageThumb from './ImageThumb.vue';
import OggettoShort from './OggettoShort.vue';

interface Props {
  oggetto: OggettoObj
  editable: boolean,
  saving: boolean,
  form: OggettoObj,
}
const props = defineProps<Props>();

</script>

<template>
  <div>ID: {{ oggetto.id }}</div>
  <div v-if="oggetto.thumbnail">
    <ImageThumb :uuid="oggetto.id" :image="oggetto.thumbnail"></ImageThumb>
  </div>
  <div>
      <span v-if="editable"><input type="text" v-model="form.nome" :disabled="saving"/></span>
      <OggettoShort v-else :oggetto="oggetto"></OggettoShort>
  </div>
</template>

<style scoped></style>
