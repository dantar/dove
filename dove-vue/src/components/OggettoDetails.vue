<script setup lang="ts">
import { useBrowseData } from '@/stores/browse-data';
import { useRoute } from 'vue-router';
import OggettoHeader from './OggettoHeader.vue';
import PhotoGallery from './PhotoGallery.vue';
import { ref } from 'vue';
import type { OggettoObj } from '@/models/browse-item';
import AddPhotosButton from './AddPhotosButton.vue';

const route = useRoute();
const browse = useBrowseData();

const oggetto = ref<OggettoObj>();

async function init () {
    oggetto.value = await browse.fetchOggettoDetails(route.params.uuid as string);
}
init();

</script>

<template>
    <div v-if="oggetto">
        <OggettoHeader :oggetto="oggetto"></OggettoHeader>
        <div>Galleria</div>
        <PhotoGallery :id="oggetto.id" :images="oggetto.immagini"></PhotoGallery>
        <AddPhotosButton :uuid="oggetto.id" :gallery="oggetto.immagini"></AddPhotosButton>
    </div>
    <div v-else="">Loading...</div>
</template>

<style scoped></style>
