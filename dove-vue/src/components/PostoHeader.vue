<script setup lang="ts">

import type { PostoObj } from '@/models/browse-item';
import { useBrowseData } from '@/stores/browse-data';
import { ref } from 'vue';

interface Props {
  posto: PostoObj
}

const props = defineProps<Props>()

const editable = ref(false);

const emitSave = () => {
  const browse = useBrowseData();
  browse.updatePosto(form.value);
  editable.value = false;
}

const cancelEdit = () => {
  editable.value = false;
}

const form = ref({...props.posto});

</script>

<template>
  <div>ID: {{ posto.id }}</div>
  <div>
    Nome: 
    <span v-if="!editable" @click="editable = !editable">{{ posto.nome }}</span>
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
