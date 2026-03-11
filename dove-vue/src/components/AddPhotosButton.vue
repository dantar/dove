<script setup lang="ts">
import { ref } from 'vue';
import CameraAdvanced from './CameraAdvanced.vue';
import { useBrowseData } from '@/stores/browse-data';

interface Props {
  uuid: string,
  gallery: string[]
}
const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "upload", value: string[]): void
}>()

const showCamera = ref(false);

const uploadPhotos = async (photos: string[]) => {
    const browse = useBrowseData();
    const ids = await browse.uploadGallery(props.uuid, photos);
    props.gallery.push(...ids);
}

</script>
<template>
    <button @click="showCamera = ! showCamera">📷</button>
    <CameraAdvanced v-if="showCamera" @done="uploadPhotos"></CameraAdvanced>
</template>

<style scoped>
</style>