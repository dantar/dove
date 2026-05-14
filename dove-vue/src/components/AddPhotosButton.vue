<script setup lang="ts">
import { ref } from 'vue';
import CameraAdvanced from './CameraAdvanced.vue';
import { useBrowseData } from '@/stores/browse-data';
import Heroicon from './Heroicon.vue';

interface Props {
  uuid: string,
  gallery: string[],
  freeze?: boolean
}
const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "upload", value: string[]): void
}>()

const showCamera = ref(false);
const frozen = ref(props.freeze || false);

const uploadPhotos = async (photos: string[]) => {
  frozen.value = true;
  showCamera.value = false;
  const browse = useBrowseData();
  const ids = await browse.uploadGallery(props.uuid, photos);
  props.gallery.splice(0, props.gallery.length, ...ids);
  frozen.value = false;
  emit('upload', ids);
}

</script>
<template>
  <button type="button" :disabled="frozen" @click="showCamera = ! showCamera"><Heroicon icon="camera"/> Aggiungi foto</button>
  <CameraAdvanced v-if="showCamera" @done="uploadPhotos"></CameraAdvanced>
</template>

<style scoped>
</style>