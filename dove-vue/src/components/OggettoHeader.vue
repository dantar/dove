<script setup lang="ts">

import type { OggettoObj } from '@/models/browse-item';
import { useBackendConfig } from '@/stores/backend-config';
import { useBrowseData } from '@/stores/browse-data';
import { ref } from 'vue';

interface Props {
  oggetto: OggettoObj
}

const config = useBackendConfig();

const props = defineProps<Props>()

const editable = ref(false);

const emitSave = async () => {
  const browse = useBrowseData();
  const updated = browse.updateOggetto(form.value);
  props.oggetto.nome = (await updated).nome;
  props.oggetto.scheda = (await updated).scheda;
  editable.value = false;
}

const cancelEdit = () => {
  editable.value = false;
}

const form = ref({...props.oggetto});

</script>

<template>
  <div>ID: {{ oggetto.id }}</div>
  <div><img :src="`${config.images}/avatar`"></div>
  <div v-if="oggetto.thumbnail">
    <img :src="`${config.images}/${oggetto.id}/${oggetto.thumbnail}`" />
  </div>
  <div>
    Nome: 
    <span v-if="!editable" @click="editable = !editable">{{ oggetto.nome }}</span>
    <span v-if="editable">
      <input type="text" v-model="form.nome" />
    </span>
  </div>
  <div>
    <button @click="editable = !editable">🖉</button>
    <button v-if="editable" @click="emitSave()">✓</button>
    <button v-if="editable" @click="cancelEdit()">✗</button>
  </div>
</template>

<style scoped></style>
