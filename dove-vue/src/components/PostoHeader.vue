<script setup lang="ts">

import type { PostoObj } from '@/models/browse-item';
import { useBrowseData } from '@/stores/browse-data';
import { ref, watch } from 'vue';
import PostoShort from './PostoShort.vue';
import Heroicon from './Heroicon.vue';

interface Props {
  posto: PostoObj
}

const props = defineProps<Props>()

const editable = ref(false);
const saving = ref(false);

const saveData = async () => {
  saving.value = true;
  const browse = useBrowseData();
  const updated = await browse.updatePosto(form.value);
  props.posto.nome = updated.nome;
  saving.value = false;
  editable.value = false;
}

watch(() => props.posto, (newposto) => {
  form.value = {...newposto};
});

const form = ref({...props.posto});

</script>

<template>
  <div>
    <form @submit.prevent="saveData()">
      <RouterLink v-if="!editable" :to="`/posto/${posto.id}`">
        <PostoShort :posto="posto"></PostoShort>
      </RouterLink>
      <span v-if="editable">
        <input 
          :placeholder="`Posto ${posto.id.split('-')[0]}`"
          :disabled="saving"
          type="text" 
          v-model="form.nome" />
      </span>
      <button type="button"
        @click="editable = !editable"
        :disabled="saving"
        ><Heroicon icon="pencil" /></button>
      <button type="submit"
        v-if="editable" 
        :disabled="saving" 
        ><Heroicon icon="check"/></button>
    </form>
  </div>
  <div class="notimportant">ID: {{ posto.id }}</div>
</template>

<style scoped></style>
