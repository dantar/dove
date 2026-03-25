<script setup lang="ts">
import { ref } from 'vue';
import CameraAdvanced from './CameraAdvanced.vue';
import { useBrowseData } from '@/stores/browse-data';
import Heroicon from './Heroicon.vue';

interface Props {
  uuid: string,
  gallery: string[]
}
const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "upload", value: string[]): void
}>()

const showCamera = ref(false);
const freeze = ref(false);

const uploadPhotos = async (photos: string[]) => {
  freeze.value = true;
  showCamera.value = false;
  const browse = useBrowseData();
  const ids = await browse.uploadGallery(props.uuid, photos);
  props.gallery.splice(0, props.gallery.length, ...ids);
  freeze.value = false;
  emit('upload', ids);
}

</script>
<template>
  <button type="button" :disabled="freeze" @click="showCamera = ! showCamera"><Heroicon icon="camera"/></button>
  <CameraAdvanced v-if="showCamera" @done="uploadPhotos"></CameraAdvanced>
</template>

<style scoped>
</style>