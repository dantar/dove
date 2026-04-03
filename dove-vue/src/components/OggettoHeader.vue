<script setup lang="ts">

import type { OggettoObj } from '@/models/browse-item';
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
  <div class="card-image">
    <ImageThumb :uuid="oggetto.id" :image="oggetto.thumbnail"></ImageThumb>
  </div>
  <div class="card-title">
    <span v-if="editable"><input type="text" :placeholder="`Oggetto ${oggetto.id.split('-')[0]}`" v-model="form.nome" :disabled="saving"/></span>
    <OggettoShort v-else :oggetto="oggetto"></OggettoShort>
  </div>
  <div class="notimportant">ID: {{ oggetto.id }}</div>
</template>

<style scoped>
.card-image .identicon {
  padding: 15%;
}
</style>
