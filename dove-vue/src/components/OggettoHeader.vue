<script setup lang="ts">

import type { OggettoObj } from '@/models/browse-item';
import { useBackendConfig } from '@/stores/backend-config';
import { useBrowseData } from '@/stores/browse-data';
import { ref } from 'vue';
import ImageThumb from './ImageThumb.vue';
import OggettoShort from './OggettoShort.vue';

interface Props {
  oggetto: OggettoObj
}
const props = defineProps<Props>()

const editable = ref(false);
const saving = ref(false);

const saveData = async () => {
  saving.value = true;
  const browse = useBrowseData();
  const updated = await browse.updateOggetto(form.value);
  props.oggetto.nome = updated.nome;
  props.oggetto.scheda = updated.scheda;
  saving.value = false;
  editable.value = false;
}

const form = ref({...props.oggetto});

</script>

<template>
  <div>ID: {{ oggetto.id }}</div>
  <div v-if="oggetto.thumbnail">
    <ImageThumb :uuid="oggetto.id" :image="oggetto.thumbnail"></ImageThumb>
  </div>
  <div>
    <form @submit.prevent="saveData()">
      Nome: 
      <span v-if="!editable">
        <OggettoShort :oggetto="oggetto"></OggettoShort>
      </span>
      <span v-if="editable">
        <input type="text" v-model="form.nome" :disabled="saving"/>
      </span>
      <button @click="editable = !editable" type="button" :disabled="saving">🖉</button>
      <button v-if="editable" type="submit" :disabled="saving">✓</button>
    </form>
  </div>
</template>

<style scoped></style>
